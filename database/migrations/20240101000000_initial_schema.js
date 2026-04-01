/**
 * KNEX MIGRATION - INITIAL SCHEMA
 *
 * This migration file is compatible with Knex.js
 *
 * Usage:
 * 1. Install Knex CLI: npm install --save-dev knex
 * 2. Initialize Knex: npx knex init
 * 3. Update knexfile.js with database credentials
 * 4. Move this file to migrations folder
 * 5. Run: npx knex migrate:latest
 *
 * Rollback:
 * npx knex migrate:rollback
 *
 * File should be named: TIMESTAMP_initial_schema.js
 * Example: 20240101000000_initial_schema.js
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table
      .string('password', 255)
      .notNullable()
      .comment('Hashed password using bcrypt');
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .onUpdate(() => knex.raw('CURRENT_TIMESTAMP'));

    table.index('email', 'idx_email');
    table.index('created_at', 'idx_created_at');
  });

  // Create pamphlets table
  await knex.schema.createTable('pamphlets', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table
      .text('content', 'longtext')
      .nullable()
      .comment('Rich editor content (HTML/markup)');
    table
      .string('image_url', 500)
      .nullable()
      .comment('Main featured image URL');
    table
      .string('category', 50)
      .notNullable()
      .defaultTo('OTHER')
      .comment(
        'TECHNOLOGY, BUSINESS, EDUCATION, HEALTH, ENTERTAINMENT, SPORTS, OTHER',
      );
    table
      .string('location', 255)
      .notNullable()
      .comment('Geographic location or region');
    table.integer('user_id').notNullable().unsigned();
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .onUpdate(() => knex.raw('CURRENT_TIMESTAMP'));

    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.index('category', 'idx_category');
    table.index('location', 'idx_location');
    table.index('user_id', 'idx_user_id');
    table.index('created_at', 'idx_created_at');
  });

  // Create pamphlet_images table
  await knex.schema.createTable('pamphlet_images', (table) => {
    table.increments('id').primary();
    table.integer('pamphlet_id').notNullable().unsigned();
    table.string('image_url', 500).notNullable();
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    table
      .foreign('pamphlet_id')
      .references('pamphlets.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.index('pamphlet_id', 'idx_pamphlet_id');
  });

  // Create pamphlet_contacts table
  await knex.schema.createTable('pamphlet_contacts', (table) => {
    table.increments('id').primary();
    table
      .integer('pamphlet_id')
      .notNullable()
      .unsigned()
      .unique()
      .comment('One contact record per pamphlet');
    table.string('phone', 20).nullable().comment('Phone number');
    table.string('whatsapp', 20).nullable().comment('WhatsApp number');
    table.string('email', 255).nullable().comment('Contact email address');
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .onUpdate(() => knex.raw('CURRENT_TIMESTAMP'));

    table
      .foreign('pamphlet_id')
      .references('pamphlets.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.index('pamphlet_id', 'idx_pamphlet_id');
  });

  // Create pamphlet_locations table
  await knex.schema.createTable('pamphlet_locations', (table) => {
    table.increments('id').primary();
    table
      .integer('pamphlet_id')
      .notNullable()
      .unsigned()
      .unique()
      .comment('One location record per pamphlet');
    table.string('address', 500).notNullable();
    table
      .decimal('latitude', 10, 8)
      .nullable()
      .comment('GPS latitude coordinate');
    table
      .decimal('longitude', 11, 8)
      .nullable()
      .comment('GPS longitude coordinate');
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .onUpdate(() => knex.raw('CURRENT_TIMESTAMP'));

    table
      .foreign('pamphlet_id')
      .references('pamphlets.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.index('pamphlet_id', 'idx_pamphlet_id');
  });

  // Create feed table
  await knex.schema.createTable('feed', (table) => {
    table.increments('id').primary();
    table
      .enum('content_type', ['pamphlet', 'reel', 'update'])
      .notNullable()
      .comment('Type of content');
    table
      .integer('content_id')
      .notNullable()
      .unsigned()
      .comment('Reference to content (flexible)');
    table.integer('user_id').notNullable().unsigned();
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.index(['content_type', 'content_id'], 'idx_content_type_id');
    table.index('user_id', 'idx_user_id');
    table.index('created_at', 'idx_created_at');
  });

  // Add full-text index using raw query
  await knex.raw(
    'ALTER TABLE pamphlets ADD FULLTEXT INDEX idx_search (title, description)',
  );

  // Add spatial index using raw query
  await knex.raw(
    'ALTER TABLE pamphlet_locations ADD SPATIAL INDEX idx_location_geo (POINT(latitude, longitude))',
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Drop tables in reverse order
  await knex.schema.dropTableIfExists('feed');
  await knex.schema.dropTableIfExists('pamphlet_locations');
  await knex.schema.dropTableIfExists('pamphlet_contacts');
  await knex.schema.dropTableIfExists('pamphlet_images');
  await knex.schema.dropTableIfExists('pamphlets');
  await knex.schema.dropTableIfExists('users');
};
