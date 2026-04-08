// drizzle/schema.ts
import {
  double,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 100 }),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = mysqlTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  slug: varchar('slug', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pamphlets = mysqlTable('pamphlets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  shortDescription: text('short_description'),
  content: text('content'),
  thumbnailImage: varchar('thumbnail_image', { length: 255 }),
  category: varchar('category', { length: 100 }),
  locationId: int('location_id').references(() => pamphletsLocations.id, {
    onDelete: 'set null',
  }),
  userId: int('user_id'),
  urlKey: varchar('url_key', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pamphletImages = mysqlTable('pamphlet_images', {
  id: serial('id').primaryKey(),
  pamphletId: int('pamphlet_id'),
  imageUrl: text('image_url'),
});

export const pamphletContacts = mysqlTable('pamphlet_contacts', {
  id: serial('id').primaryKey(),
  pamphletId: int('pamphlet_id'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
});

export const pamphletsLocations = mysqlTable('pamphlets_location', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 255 }),
  latitude: double('latitude'),
  longitude: double('longitude'),
});
