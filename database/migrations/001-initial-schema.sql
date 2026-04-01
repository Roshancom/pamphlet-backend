/**
 * PLAIN SQL MIGRATION - INITIAL SCHEMA
 * 
 * Usage:
 * Option 1: MySQL CLI
 *   mysql -u root -p pamphlet_db < initial-schema.sql
 * 
 * Option 2: Node.js with mysql2
 *   const fs = require('fs');
 *   const pool = require('your-pool-config');
 *   const sql = fs.readFileSync('initial-schema.sql', 'utf-8');
 *   const queries = sql.split(';').filter(q => q.trim());
 *   for (const query of queries) {
 *     await pool.query(query);
 *   }
 * 
 * Option 3: MySQL Workbench
 *   Open this file and execute all queries
 */

-- =============================================================================
-- DATABASE CREATION & SELECTION
-- =============================================================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pamphlet_db;
USE pamphlet_db;

-- =============================================================================
-- TABLE: users
-- Description: Stores user account information for registration and login
-- =============================================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'Hashed password using bcrypt',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email) COMMENT 'Fast email lookups for login',
  INDEX idx_created_at (created_at) COMMENT 'Sort by registration date'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User account information';

-- =============================================================================
-- TABLE: pamphlets
-- Description: Main table for pamphlet content with category and location
-- Relationships: Belongs to users (user_id)
-- =============================================================================

CREATE TABLE pamphlets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content LONGTEXT COMMENT 'Rich editor content (HTML/markup)',
  image_url VARCHAR(500) COMMENT 'Main featured image URL',
  category VARCHAR(50) NOT NULL DEFAULT 'OTHER' COMMENT 'TECHNOLOGY, BUSINESS, EDUCATION, HEALTH, ENTERTAINMENT, SPORTS, OTHER',
  location VARCHAR(255) NOT NULL COMMENT 'Geographic location or region',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_pamphlets_user FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_category (category) COMMENT 'Filter by category',
  INDEX idx_location (location) COMMENT 'Filter by location',
  INDEX idx_user_id (user_id) COMMENT 'Find user pamphlets',
  INDEX idx_created_at (created_at) COMMENT 'Sort by creation date',
  FULLTEXT INDEX idx_search (title, description) COMMENT 'Full-text search'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Main pamphlet table with content and metadata';

-- =============================================================================
-- TABLE: pamphlet_images
-- Description: Gallery images for each pamphlet (One-to-Many relationship)
-- Relationships: Belongs to pamphlets (pamphlet_id)
-- =============================================================================

CREATE TABLE pamphlet_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pamphlet_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_images_pamphlet FOREIGN KEY (pamphlet_id) 
    REFERENCES pamphlets(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_pamphlet_id (pamphlet_id) COMMENT 'Retrieve images for a pamphlet'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Gallery images associated with pamphlets';

-- =============================================================================
-- TABLE: pamphlet_contacts
-- Description: Contact information for each pamphlet (One-to-One relationship)
-- Relationships: Belongs to pamphlets (pamphlet_id)
-- =============================================================================

CREATE TABLE pamphlet_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pamphlet_id INT NOT NULL UNIQUE COMMENT 'One contact record per pamphlet',
  phone VARCHAR(20) COMMENT 'Phone number',
  whatsapp VARCHAR(20) COMMENT 'WhatsApp number',
  email VARCHAR(255) COMMENT 'Contact email address',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_contacts_pamphlet FOREIGN KEY (pamphlet_id) 
    REFERENCES pamphlets(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_pamphlet_id (pamphlet_id) COMMENT 'Retrieve contact for a pamphlet'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Contact information for pamphlets';

-- =============================================================================
-- TABLE: pamphlet_locations
-- Description: Physical store location for each pamphlet with GPS coordinates
-- Relationships: Belongs to pamphlets (pamphlet_id)
-- =============================================================================

CREATE TABLE pamphlet_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pamphlet_id INT NOT NULL UNIQUE COMMENT 'One location record per pamphlet',
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) COMMENT 'GPS latitude coordinate',
  longitude DECIMAL(11, 8) COMMENT 'GPS longitude coordinate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_locations_pamphlet FOREIGN KEY (pamphlet_id) 
    REFERENCES pamphlets(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_pamphlet_id (pamphlet_id) COMMENT 'Retrieve location for a pamphlet',
  SPATIAL INDEX idx_location_geo (POINT(latitude, longitude)) COMMENT 'Geographic queries'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Physical store locations with GPS coordinates';

-- =============================================================================
-- TABLE: feed (OPTIONAL - For future expansion)
-- Description: Mixed content feed supporting future reels and updates
-- Relationships: Belongs to users (user_id)
-- =============================================================================

CREATE TABLE feed (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_type ENUM('pamphlet', 'reel', 'update') NOT NULL COMMENT 'Type of content',
  content_id INT NOT NULL COMMENT 'Reference to content (flexible)',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_feed_user FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_content_type_id (content_type, content_id) COMMENT 'Filter by content type',
  INDEX idx_user_id (user_id) COMMENT 'User feed',
  INDEX idx_created_at (created_at) COMMENT 'Sort by date'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Mixed content feed for future expansion (reels, updates)';

-- =============================================================================
-- END OF MIGRATION SCRIPT
-- =============================================================================
-- 
-- Verify installation:
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE pamphlets;
-- DESCRIBE pamphlet_images;
-- DESCRIBE pamphlet_contacts;
-- DESCRIBE pamphlet_locations;
-- DESCRIBE feed;
