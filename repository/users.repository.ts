import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { pamphlets, users } from '../db/schema.js';

export const findAllUsers = async () => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      created_at: users.created_at,
    })
    .from(users)
    .execute(); // returns array of users
};

export const findUserById = async (id: number) => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.id, id));
};

export const updateUserById = async (
  id: number,
  data: { name?: string; email?: string },
) => {
  return await db
    .update(users)
    .set({
      ...data,
    })
    .where(eq(users.id, id));
};

export const deleteUserById = async (id: number) => {
  return await db.delete(users).where(eq(users.id, id));
};

export const findPamphletsByuser_id = async (user_id: number) => {
  return await db
    .select({
      id: pamphlets.id,
      title: pamphlets.title,
      short_description: pamphlets.short_description,
      thumbnail_image: pamphlets.thumbnail_image,
      category: pamphlets.category,
      location: pamphlets.location,
      user_id: pamphlets.user_id,
      created_at: pamphlets.created_at,
      url_key: pamphlets.url_key,
      author_name: users.name,
    })
    .from(pamphlets)
    .where(eq(pamphlets.user_id, user_id))
    .leftJoin(users, eq(pamphlets.user_id, users.id));
};
