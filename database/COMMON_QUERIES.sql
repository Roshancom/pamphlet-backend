/**
 * COMMON QUERIES REFERENCE
 * 
 * This file contains commonly used SQL queries for the Pamphlet API
 * Use these as reference for implementing features
 */

-- ===========================================================================
-- 1. LISTING PAMPHLETS (GET /api/pamphlets)
-- ===========================================================================

-- Get all pamphlets with pagination and author info
SELECT 
  p.id, 
  p.title, 
  p.description, 
  p.image_url, 
  p.category, 
  p.location, 
  p.user_id, 
  p.created_at, 
  u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;

-- Count total pamphlets
SELECT COUNT(*) AS total FROM pamphlets;

-- Filter by category
SELECT p.*, u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.category = 'TECHNOLOGY'
ORDER BY p.created_at DESC;

-- Filter by multiple categories
SELECT p.*, u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.category IN ('TECHNOLOGY', 'BUSINESS')
ORDER BY p.created_at DESC;

-- Filter by location (partial match)
SELECT p.*, u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.location LIKE '%San Francisco%'
ORDER BY p.created_at DESC;

-- Combined filters (category AND location)
SELECT COUNT(*) AS total
FROM pamphlets p
WHERE p.category = 'TECHNOLOGY' AND p.location LIKE '%California%';

-- ===========================================================================
-- 2. SINGLE PAMPHLET DETAILS (GET /api/pamphlets/:id)
-- ===========================================================================

-- Get pamphlet with author
SELECT 
  p.id, p.title, p.description, p.content,
  p.category, p.location, p.user_id, p.created_at,
  u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.id = 1;

-- Get pamphlet images
SELECT image_url 
FROM pamphlet_images 
WHERE pamphlet_id = 1
ORDER BY created_at ASC;

-- Get pamphlet contact info
SELECT phone, whatsapp, email 
FROM pamphlet_contacts 
WHERE pamphlet_id = 1;

-- Get pamphlet location
SELECT address, latitude, longitude 
FROM pamphlet_locations 
WHERE pamphlet_id = 1;

-- Complete PDP (Product Details Page) response
SELECT 
  p.id, p.title, p.description, p.content,
  p.category, p.location, p.user_id, p.created_at,
  u.name AS author_name,
  (SELECT COUNT(*) FROM pamphlet_images WHERE pamphlet_id = p.id) AS image_count
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.id = 1;

-- ===========================================================================
-- 3. CREATE OPERATIONS
-- ===========================================================================

-- Create new pamphlet
INSERT INTO pamphlets (title, description, image_url, category, location, user_id)
VALUES (
  'New Pamphlet Title',
  'Description of the pamphlet',
  'https://example.com/image.jpg',
  'TECHNOLOGY',
  'San Francisco, CA',
  1
);

-- Get the ID of inserted pamphlet
-- Use LAST_INSERT_ID() in application code

-- Add image to pamphlet
INSERT INTO pamphlet_images (pamphlet_id, image_url)
VALUES (1, 'https://example.com/image1.jpg');

-- Add contact info to pamphlet
INSERT INTO pamphlet_contacts (pamphlet_id, phone, whatsapp, email)
VALUES (1, '+1-555-0000', '+1-555-0000', 'contact@example.com');

-- Add location to pamphlet
INSERT INTO pamphlet_locations (pamphlet_id, address, latitude, longitude)
VALUES (1, '123 Main St, San Francisco, CA', 37.7749, -122.4194);

-- ===========================================================================
-- 4. UPDATE OPERATIONS
-- ===========================================================================

-- Update pamphlet details
UPDATE pamphlets
SET 
  title = 'Updated Title',
  description = 'Updated description',
  category = 'BUSINESS',
  location = 'New York, NY',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Update pamphlet's featured image
UPDATE pamphlets
SET image_url = 'https://example.com/new-image.jpg'
WHERE id = 1;

-- Update pamphlet contact info
UPDATE pamphlet_contacts
SET 
  phone = '+1-555-1111',
  whatsapp = '+1-555-1111',
  email = 'newemail@example.com',
  updated_at = CURRENT_TIMESTAMP
WHERE pamphlet_id = 1;

-- Update pamphlet location
UPDATE pamphlet_locations
SET 
  address = 'New Address, City',
  latitude = 40.7128,
  longitude = -74.0060,
  updated_at = CURRENT_TIMESTAMP
WHERE pamphlet_id = 1;

-- ===========================================================================
-- 5. DELETE OPERATIONS
-- ===========================================================================

-- Delete pamphlet (cascades delete related images, contacts, locations)
DELETE FROM pamphlets WHERE id = 1;

-- Delete specific image from pamphlet
DELETE FROM pamphlet_images WHERE id = 1;

-- Delete all images from a pamphlet
DELETE FROM pamphlet_images WHERE pamphlet_id = 1;

-- Delete contact info from pamphlet
DELETE FROM pamphlet_contacts WHERE pamphlet_id = 1;

-- Delete location from pamphlet
DELETE FROM pamphlet_locations WHERE pamphlet_id = 1;

-- ===========================================================================
-- 6. SEARCH OPERATIONS (Full-Text Search)
-- ===========================================================================

-- Full-text search on title and description
SELECT p.id, p.title, p.description, u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE MATCH(p.title, p.description) AGAINST('technology' IN BOOLEAN MODE)
ORDER BY p.created_at DESC;

-- Search with wildcard (alternative if full-text not available)
SELECT p.id, p.title, p.description, u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.title LIKE '%technology%' OR p.description LIKE '%technology%'
ORDER BY p.created_at DESC;

-- ===========================================================================
-- 7. USER-SPECIFIC OPERATIONS
-- ===========================================================================

-- Get all pamphlets by a user
SELECT p.id, p.title, p.created_at
FROM pamphlets p
WHERE p.user_id = 1
ORDER BY p.created_at DESC;

-- Count pamphlets by user
SELECT u.id, u.name, COUNT(p.id) AS pamphlet_count
FROM users u
LEFT JOIN pamphlets p ON u.id = p.user_id
GROUP BY u.id, u.name;

-- Get user with pamphlet count
SELECT u.id, u.name, u.email, COUNT(p.id) AS pamphlet_count
FROM users u
LEFT JOIN pamphlets p ON u.id = p.user_id
WHERE u.id = 1
GROUP BY u.id;

-- ===========================================================================
-- 8. STATISTICS & ANALYTICS
-- ===========================================================================

-- Total counts
SELECT 
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM pamphlets) AS total_pamphlets,
  (SELECT COUNT(*) FROM pamphlet_images) AS total_images,
  (SELECT COUNT(*) FROM pamphlet_contacts) AS total_contacts,
  (SELECT COUNT(*) FROM pamphlet_locations) AS total_locations;

-- Pamphlets by category
SELECT 
  category,
  COUNT(*) AS count,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM pamphlets), 2) AS percentage
FROM pamphlets
GROUP BY category
ORDER BY count DESC;

-- Pamphlets by location
SELECT 
  location,
  COUNT(*) AS count
FROM pamphlets
GROUP BY location
ORDER BY count DESC;

-- Top users by pamphlet count
SELECT 
  u.id,
  u.name,
  COUNT(p.id) AS pamphlet_count
FROM users u
LEFT JOIN pamphlets p ON u.id = p.user_id
GROUP BY u.id, u.name
ORDER BY pamphlet_count DESC;

-- Recently updated pamphlets
SELECT 
  p.id, 
  p.title, 
  p.updated_at,
  u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
ORDER BY p.updated_at DESC
LIMIT 10;

-- ===========================================================================
-- 9. FEED OPERATIONS (Future Feature)
-- ===========================================================================

-- Get user's feed
SELECT 
  f.id, 
  f.content_type, 
  f.content_id, 
  f.created_at,
  CASE 
    WHEN f.content_type = 'pamphlet' THEN p.title
    WHEN f.content_type = 'reel' THEN 'Reel'
    WHEN f.content_type = 'update' THEN 'Update'
  END AS content_title
FROM feed f
LEFT JOIN pamphlets p ON f.content_type = 'pamphlet' AND f.content_id = p.id
WHERE f.user_id = 1
ORDER BY f.created_at DESC;

-- Add pamphlet to feed
INSERT INTO feed (content_type, content_id, user_id)
VALUES ('pamphlet', 1, 1);

-- ===========================================================================
-- 10. GEOGRAPHIC QUERIES (for Location-based Features)
-- ===========================================================================

-- Find pamphlets near a location (requires spatial index)
-- Using point distance (simplified - 1 degree ≈ 111 km)
SELECT 
  p.id, 
  p.title,
  pl.address,
  pl.latitude,
  pl.longitude,
  -- Calculate approximate distance (in degrees)
  SQRT(
    POW(pl.latitude - 37.7749, 2) + 
    POW(pl.longitude - (-122.4194), 2)
  ) AS distance
FROM pamphlets p
JOIN pamphlet_locations pl ON p.id = pl.pamphlet_id
WHERE 
  pl.latitude BETWEEN 37.7 AND 37.85 AND
  pl.longitude BETWEEN -122.55 AND -122.35
ORDER BY distance ASC
LIMIT 10;

-- ===========================================================================
-- 11. PERFORMANCE QUERIES
-- ===========================================================================

-- Check index usage
EXPLAIN SELECT * FROM pamphlets WHERE category = 'TECHNOLOGY';

-- Analyze query performance
EXPLAIN EXTENDED SELECT 
  p.*, u.name 
FROM pamphlets p 
JOIN users u ON p.user_id = u.id 
WHERE p.category = 'TECHNOLOGY' 
LIMIT 10;

-- View all indexes
SHOW INDEX FROM pamphlets;

-- ===========================================================================
-- 12. INTEGRITY CHECKS
-- ===========================================================================

-- Find pamphlets without contact info
SELECT p.id, p.title
FROM pamphlets p
LEFT JOIN pamphlet_contacts c ON p.id = c.pamphlet_id
WHERE c.id IS NULL;

-- Find pamphlets without location
SELECT p.id, p.title
FROM pamphlets p
LEFT JOIN pamphlet_locations l ON p.id = l.pamphlet_id
WHERE l.id IS NULL;

-- Find orphaned images (pamphlet deleted but images remain)
SELECT pi.id, pi.image_url
FROM pamphlet_images pi
LEFT JOIN pamphlets p ON pi.pamphlet_id = p.id
WHERE p.id IS NULL;
-- Should return nothing with ON DELETE CASCADE

-- ===========================================================================
-- END OF COMMON QUERIES
-- ===========================================================================
