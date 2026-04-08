import { and, eq, getTableColumns, inArray, like, sql } from 'drizzle-orm';
import db from '../db/index.js';
import {
  pamphletContacts,
  pamphlets,
  pamphletsLocations,
  users,
} from '../db/schema.js';

type Filters = {
  categories?: string[];
  location?: string;
  limit: number;
  offset: number;
};

export const findPamphletsWithFilters = async ({
  categories,
  location,
  limit,
  offset,
}: Filters) => {
  const conditions = [];

  //  Category filter
  if (categories?.length) {
    conditions.push(inArray(pamphlets.category, categories));
  }

  //  Location filter (JOIN table)
  if (location) {
    conditions.push(like(pamphletsLocations.city, `%${location}%`));
  }

  // Query with JOIN
  const data = await db
    .select({
      ...getTableColumns(pamphlets),
      location: {
        city: pamphletsLocations.city,
        latitude: pamphletsLocations.latitude,
        longitude: pamphletsLocations.longitude,
      },
    })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.locationId, pamphletsLocations.id),
    )
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(limit)
    .offset(offset);

  //   Count query
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.locationId, pamphletsLocations.id),
    )
    .where(conditions.length ? and(...conditions) : undefined);

  const total = totalResult[0]?.count || 0;

  return { data, total };
};

// 1. Main pamphlet
export const findPamphletByUrlKey = async (urlKey: string) => {
  const result = await db
    .select({
      id: pamphlets.id,
      title: pamphlets.title,
      category: pamphlets.category,
      user_id: pamphlets.userId,
      url_key: pamphlets.urlKey,
      created_at: pamphlets.createdAt,
      author_name: users.name,
      locationId: pamphlets.locationId,
      // Location
      location: {
        city: pamphletsLocations.city,
        latitude: pamphletsLocations.latitude,
        longitude: pamphletsLocations.longitude,
      },

      // Contact
      contact: {
        phone: pamphletContacts.phone,
        email: pamphletContacts.email,
      },
    })
    .from(pamphlets)
    .innerJoin(users, eq(pamphlets.userId, users.id))
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.locationId, pamphletsLocations.id),
    )
    .leftJoin(pamphletContacts, eq(pamphlets.id, pamphletContacts.pamphletId))
    .where(eq(pamphlets.urlKey, urlKey));

  return result[0] || null;
};

// 3. Contact
export const findPamphletContact = async (pamphletId: number) => {
  const result = await db
    .select({
      phone: pamphletContacts.phone,
      email: pamphletContacts.email,
    })
    .from(pamphletContacts)
    .where(eq(pamphletContacts.pamphletId, pamphletId));

  return result[0] || null;
};

// 4. Location
export const findPamphletLocation = async (pamphletId: number) => {
  const result = await db
    .select({
      city: pamphletsLocations.city,
      latitude: pamphletsLocations.latitude,
      longitude: pamphletsLocations.longitude,
    })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.locationId, pamphletsLocations.id),
    )
    .where(eq(pamphlets.id, pamphletId));

  return result[0] || null;
};

export const insertLocation = async (location?: {
  city: string;
  latitude: number;
  longitude: number;
}) => {
  let locationId: number | null = null;

  if (location) {
    // Insert location first
    const locationResult = await db
      .insert(pamphletsLocations)
      .values({
        city: location?.city,
        latitude: location?.latitude,
        longitude: location?.longitude,
      })
      .$returningId();

    locationId = locationResult[0]?.id || null;
  }
  return locationId;
};

export const createPamphletResource = async (data: {
  title: string;
  shortDescription: string;
  thumbnailImage?: string | null;
  category: string;
  location?: {
    city: string;
    latitude: number;
    longitude: number;
  };
  content?: string;
  userId: number;
  urlKey: string;
}) => {
  // Insert pamphlet with locationId
  const locationId = await insertLocation(data.location);

  await db.insert(pamphlets).values({
    title: data.title,
    shortDescription: data.shortDescription,
    thumbnailImage: data.thumbnailImage || null,
    category: data.category,
    locationId: locationId,
    userId: data.userId,
    urlKey: data.urlKey,
    content: data.content,
  });
};

export const updatePamphletById = async (
  id: number,
  data: {
    title?: string;
    shortDescription?: string;
    thumbnailImage?: string | null;
    category?: string;
    location?: {
      city: string;
      latitude: number;
      longitude: number;
    };
  },
) => {
  const locationId = await insertLocation(data.location);

  return await db
    .update(pamphlets)
    .set({
      title: data.title,
      shortDescription: data.shortDescription,
      thumbnailImage: data.thumbnailImage,
      category: data.category,
      locationId: locationId,
    })
    .where(eq(pamphlets.id, id));
};

export const findPamphletById = async (id: number) => {
  const result = await db
    .select({
      id: pamphlets.id,
      userId: pamphlets.userId,
    })
    .from(pamphlets)
    .where(eq(pamphlets.id, id));

  return result[0];
};

export const deletePamphletById = async (id: number) => {
  return await db.delete(pamphlets).where(eq(pamphlets.id, id));
};
