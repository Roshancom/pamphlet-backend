// drizzle/schema.ts
import {
  decimal,
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
  location: varchar('location', { length: 255 }),
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
  whatsapp: varchar('whatsapp', { length: 20 }),
});

export const pamphletLocations = mysqlTable('pamphlet_locations', {
  id: serial('id').primaryKey(),
  pamphletId: int('pamphlet_id'),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
});
