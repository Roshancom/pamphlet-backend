import { asc } from 'drizzle-orm';
import db from '../db/index.js';
import { categories } from '../db/schema.js';

export const finsCategoriesList = async () => {
  return await db.select().from(categories).orderBy(asc(categories.name));
};
