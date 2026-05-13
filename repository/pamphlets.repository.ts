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
      eq(pamphlets.location_id, pamphletsLocations.id),
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
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .where(conditions.length ? and(...conditions) : undefined);

  const total = totalResult[0]?.count || 0;

  return { data, total };
};

// 1. Main pamphlet
export const findPamphletByurl_key = async (url_key: string) => {
  const result = await db
    .select({
      id: pamphlets.id,
      title: pamphlets.title,
      category: pamphlets.category,
      user_id: pamphlets.user_id,
      url_key: pamphlets.url_key,
      created_at: pamphlets.created_at,
      author_name: users.name,
      location_id: pamphlets.location_id,
      short_description: pamphlets.short_description,
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
    .innerJoin(users, eq(pamphlets.user_id, users.id))
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .leftJoin(pamphletContacts, eq(pamphlets.id, pamphletContacts.pamphlet_id))
    .where(eq(pamphlets.url_key, url_key));

  return result[0] || null;
};

// 3. Contact
export const findPamphletContact = async (pamphlet_id: number) => {
  const result = await db
    .select({
      phone: pamphletContacts.phone,
      email: pamphletContacts.email,
    })
    .from(pamphletContacts)
    .where(eq(pamphletContacts.pamphlet_id, pamphlet_id));

  return result[0] || null;
};

// 4. Location
export const findPamphletLocation = async (pamphlet_id: number) => {
  const result = await db
    .select({
      city: pamphletsLocations.city,
      latitude: pamphletsLocations.latitude,
      longitude: pamphletsLocations.longitude,
    })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .where(eq(pamphlets.id, pamphlet_id));

  return result[0] || null;
};

export const insertLocation = async (location?: {
  city: string;
  latitude: number;
  longitude: number;
}) => {
  let location_id: number | null = null;

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

    location_id = locationResult[0]?.id || null;

    console.log(location, 'Insert Location', locationResult);
  }

  return location_id;
};

export const createPamphletResource = async (data: {
  title: string;
  short_description: string;
  thumbnail_image?: string | null;
  category: string;
  location?: {
    city: string;
    latitude: number;
    longitude: number;
  };
  content?: string;
  user_id: number;
  url_key: string;
}) => {
  // Insert pamphlet with location_id
  const location_id = await insertLocation(data.location);

  await db.insert(pamphlets).values({
    title: data.title,
    short_description: data.short_description,
    thumbnail_image: data.thumbnail_image || null,
    category: data.category,
    location_id: location_id,
    user_id: data.user_id,
    url_key: data.url_key,
    content: data.content,
  });
};

export const updatePamphletById = async (
  id: number,
  data: {
    title?: string;
    short_description?: string;
    thumbnail_image?: string | null;
    category?: string;
    location?: {
      city: string;
      latitude: number;
      longitude: number;
    };
  },
) => {
  const location_id = await insertLocation(data.location);

  return await db
    .update(pamphlets)
    .set({
      title: data.title,
      short_description: data.short_description,
      thumbnail_image: data.thumbnail_image,
      category: data.category,
      location_id: location_id,
    })
    .where(eq(pamphlets.id, id));
};

export const findPamphletById = async (id: number) => {
  const result = await db
    .select({
      id: pamphlets.id,
      user_id: pamphlets.user_id,
    })
    .from(pamphlets)
    .where(eq(pamphlets.id, id));

  return result[0];
};

export const deletePamphletById = async (id: number) => {
  return await db.delete(pamphlets).where(eq(pamphlets.id, id));
};
