/**
 * SEQUELIZE MIGRATION - INITIAL SCHEMA
 *
 * This migration file is compatible with Sequelize CLI
 *
 * Usage:
 * 1. Install Sequelize: npm install --save-dev sequelize sequelize-cli
 * 2. Initialize Sequelize: npx sequelize-cli init
 * 3. Move this file to migrations folder
 * 4. Update config/config.js with database credentials
 * 5. Run: npx sequelize-cli db:migrate
 *
 * Rollback:
 * npx sequelize-cli db:migrate:undo:all
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create users table
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Hashed password using bcrypt',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      // Add indexes to users table
      await queryInterface.addIndex('users', ['email'], {
        name: 'idx_email',
        transaction,
      });
      await queryInterface.addIndex('users', ['created_at'], {
        name: 'idx_created_at',
        transaction,
      });

      // Create pamphlets table
      await queryInterface.createTable(
        'pamphlets',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          content: {
            type: Sequelize.LONGTEXT,
            allowNull: true,
            comment: 'Rich editor content (HTML/markup)',
          },
          image_url: {
            type: Sequelize.STRING(500),
            allowNull: true,
            comment: 'Main featured image URL',
          },
          category: {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'OTHER',
            comment:
              'TECHNOLOGY, BUSINESS, EDUCATION, HEALTH, ENTERTAINMENT, SPORTS, OTHER',
          },
          location: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Geographic location or region',
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      // Add indexes to pamphlets table
      await queryInterface.addIndex('pamphlets', ['category'], {
        name: 'idx_category',
        transaction,
      });
      await queryInterface.addIndex('pamphlets', ['location'], {
        name: 'idx_location',
        transaction,
      });
      await queryInterface.addIndex('pamphlets', ['user_id'], {
        name: 'idx_user_id',
        transaction,
      });
      await queryInterface.addIndex('pamphlets', ['created_at'], {
        name: 'idx_created_at',
        transaction,
      });
      // Note: Full-text index needs raw query - added separately below

      // Create pamphlet_images table
      await queryInterface.createTable(
        'pamphlet_images',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          pamphlet_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'pamphlets', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          image_url: {
            type: Sequelize.STRING(500),
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('pamphlet_images', ['pamphlet_id'], {
        name: 'idx_pamphlet_id',
        transaction,
      });

      // Create pamphlet_contacts table
      await queryInterface.createTable(
        'pamphlet_contacts',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          pamphlet_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'pamphlets', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          phone: {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'Phone number',
          },
          whatsapp: {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'WhatsApp number',
          },
          email: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Contact email address',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('pamphlet_contacts', ['pamphlet_id'], {
        name: 'idx_pamphlet_id',
        transaction,
      });

      // Create pamphlet_locations table
      await queryInterface.createTable(
        'pamphlet_locations',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          pamphlet_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'pamphlets', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          address: {
            type: Sequelize.STRING(500),
            allowNull: false,
          },
          latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: true,
            comment: 'GPS latitude coordinate',
          },
          longitude: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: true,
            comment: 'GPS longitude coordinate',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('pamphlet_locations', ['pamphlet_id'], {
        name: 'idx_pamphlet_id',
        transaction,
      });

      // Create feed table
      await queryInterface.createTable(
        'feed',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          content_type: {
            type: Sequelize.ENUM('pamphlet', 'reel', 'update'),
            allowNull: false,
            comment: 'Type of content',
          },
          content_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: 'Reference to content (flexible)',
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('feed', ['content_type', 'content_id'], {
        name: 'idx_content_type_id',
        transaction,
      });
      await queryInterface.addIndex('feed', ['user_id'], {
        name: 'idx_user_id',
        transaction,
      });
      await queryInterface.addIndex('feed', ['created_at'], {
        name: 'idx_created_at',
        transaction,
      });

      // Add full-text index to pamphlets (requires raw query)
      await queryInterface.sequelize.query(
        'ALTER TABLE pamphlets ADD FULLTEXT INDEX idx_search (title, description)',
        { transaction },
      );

      // Add spatial index to pamphlet_locations (requires raw query)
      // Note: Spatial index formatting needs SPATIAL keyword
      await queryInterface.sequelize.query(
        'ALTER TABLE pamphlet_locations ADD SPATIAL INDEX idx_location_geo (POINT(latitude, longitude))',
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables in reverse order
      await queryInterface.dropTable('feed', { transaction });
      await queryInterface.dropTable('pamphlet_locations', { transaction });
      await queryInterface.dropTable('pamphlet_contacts', { transaction });
      await queryInterface.dropTable('pamphlet_images', { transaction });
      await queryInterface.dropTable('pamphlets', { transaction });
      await queryInterface.dropTable('users', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
