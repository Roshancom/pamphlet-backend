import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';

export const findAllUsers = async () => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
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
      createdAt: users.createdAt,
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
