import { and, count, desc, eq, inArray, like } from 'drizzle-orm';
import db from '../db/index.js';
import {
  pamphletContacts,
  pamphletImages,
  pamphletLocations,
  pamphlets,
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

  // Category filter
  if (categories?.length) {
    if (categories.length > 1) {
      conditions.push(inArray(pamphlets.category, categories));
    } else {
      conditions.push(eq(pamphlets.category, categories[0]));
    }
  }

  // Location filter
  if (location) {
    conditions.push(like(pamphlets.location, `%${location}%`));
  }

  const whereCondition = conditions.length ? and(...conditions) : undefined;

  // Total count
  const totalResult = await db
    .select({ total: count() })
    .from(pamphlets)
    .where(whereCondition);

  const total = totalResult[0]?.total || 0;

  // Data query
  const data = await db
    .select({
      id: pamphlets.id,
      title: pamphlets.title,
      short_description: pamphlets.shortDescription,
      thumbnail_image: pamphlets.thumbnailImage,
      category: pamphlets.category,
      location: pamphlets.location,
      user_id: pamphlets.userId,
      created_at: pamphlets.createdAt,
      url_key: pamphlets.urlKey,
      author_name: users.name,
    })
    .from(pamphlets)
    .innerJoin(users, eq(pamphlets.userId, users.id))
    .where(whereCondition)
    .orderBy(desc(pamphlets.createdAt))
    .limit(limit)
    .offset(offset);

  return { data, total };
};

// 1. Main pamphlet
export const findPamphletByUrlKey = async (urlKey: string) => {
  const result = await db
    .select({
      id: pamphlets.id,
      title: pamphlets.title,
      content: pamphlets.content,
      category: pamphlets.category,
      location: pamphlets.location,
      user_id: pamphlets.userId,
      url_key: pamphlets.urlKey,
      created_at: pamphlets.createdAt,
      author_name: users.name,
    })
    .from(pamphlets)
    .innerJoin(users, eq(pamphlets.userId, users.id))
    .where(eq(pamphlets.urlKey, urlKey));

  return result[0];
};

// 2. Images
export const findPamphletImages = async (pamphletId: number) => {
  return await db
    .select({ image_url: pamphletImages.imageUrl })
    .from(pamphletImages)
    .where(eq(pamphletImages.pamphletId, pamphletId));
};

// 3. Contact
export const findPamphletContact = async (pamphletId: number) => {
  const result = await db
    .select({
      phone: pamphletContacts.phone,
      whatsapp: pamphletContacts.whatsapp,
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
      address: pamphletLocations.address,
      latitude: pamphletLocations.latitude,
      longitude: pamphletLocations.longitude,
    })
    .from(pamphletLocations)
    .where(eq(pamphletLocations.pamphletId, pamphletId));

  return result[0] || null;
};

export const createPamphletResource = async (data: {
  title: string;
  shortDescription: string;
  thumbnailImage?: string | null;
  category: string;
  location: string;
  userId: number;
  urlKey: string;
}) => {
  const result = await db
    .insert(pamphlets)
    .values({
      title: data.title,
      shortDescription: data.shortDescription,
      thumbnailImage: data.thumbnailImage || null,
      category: data.category,
      location: data.location,
      userId: data.userId,
      urlKey: data.urlKey,
    })
    .$returningId();

  return result[0]?.id;
};

export const updatePamphletById = async (
  id: number,
  data: {
    title?: string;
    shortDescription?: string;
    thumbnailImage?: string | null;
    category?: string;
    location?: string;
  },
) => {
  return await db
    .update(pamphlets)
    .set({
      title: data.title,
      shortDescription: data.shortDescription,
      thumbnailImage: data.thumbnailImage,
      category: data.category,
      location: data.location,
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
