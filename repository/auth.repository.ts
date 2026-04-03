import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';

export const findUserByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email));
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  return await db.insert(users).values({ name, email, password });
};
