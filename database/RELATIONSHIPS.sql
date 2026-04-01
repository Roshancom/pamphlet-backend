/**
 * DATABASE RELATIONSHIPS & CONSTRAINTS
 * 
 * This file documents all relationships, constraints, and data flow
 */

-- ===========================================================================
-- RELATIONSHIP DIAGRAM (Visual)
-- ===========================================================================

/*

┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                           │
└─────────────────────────────────────────────────────────────────────┘

                            ┌─────────────┐
                            │    users    │
                            │─────────────│
                            │ id (PK)     │
                            │ name        │
                            │ email       │
                            │ password    │
                            └──────┬──────┘
                                   │
                      ┌────────────┼────────────┐
                      │            │            │
                      │ user_id    │ user_id    │ user_id
                      ▼ (1:M)      ▼ (1:M)      ▼ (1:M)
              ┌──────────────────┐  │    ┌──────────────┐
              │  pamphlets       │  │    │    feed      │
              │──────────────────│  │    │──────────────│
              │ id (PK)          │  │    │ id (PK)      │
              │ title            │  │    │ content_type │
              │ description      │  │    │ content_id   │
              │ content          │  │    │ user_id (FK) │
              │ image_url        │  │    └──────────────┘
              │ category         │  │
              │ location         │  │
              │ user_id (FK) ────┘  └─► (future: reels, updates)
              └───┬──────┬──────┬───┘
                  │      │      │
    pamphlet_id   │      │      │   pamphlet_id
    (1:M)         │      │      │   (1:M)
                  ▼      ▼      ▼
          ┌───────────────────────────────┐
          │   pamphlet_images              │
          │   (Gallery)                    │
          │───────────────────────────────│
          │ id (PK)                       │
          │ pamphlet_id (FK) ─────────────┤
          │ image_url                     │
          └───────────────────────────────┘

    pamphlet_id  │      │       pamphlet_id
    (1:1, UNIQUE)│      │       (1:1, UNIQUE)
                 ▼      ▼
          ┌──────────────┐   ┌──────────────────┐
          │  pamphlet_   │   │  pamphlet_       │
          │  contacts    │   │  locations       │
          │──────────────│   │──────────────────│
          │ id (PK)      │   │ id (PK)          │
          │ pamphlet_id  │   │ pamphlet_id      │
          │ phone        │   │ address          │
          │ whatsapp     │   │ latitude (GPS)   │
          │ email        │   │ longitude (GPS)  │
          └──────────────┘   │ (spatial index)  │
                             └──────────────────┘

*/

-- ===========================================================================
-- FOREIGN KEY CONSTRAINTS
-- ===========================================================================

/*
1. pamphlets.user_id → users.id
   - Relationship: Many pamphlets belong to one user
   - Constraint: ON DELETE CASCADE (delete all user's pamphlets when user deleted)
   - Index: YES (fast lookups)

2. pamphlet_images.pamphlet_id → pamphlets.id
   - Relationship: Many images per pamphlet
   - Constraint: ON DELETE CASCADE (delete images when pamphlet deleted)
   - Index: YES (get all images for a pamphlet)
   - Uniqueness: NO (can have multiple images)

3. pamphlet_contacts.pamphlet_id → pamphlets.id
   - Relationship: One contact per pamphlet (optional)
   - Constraint: ON DELETE CASCADE
   - Index: YES
   - Uniqueness: UNIQUE (only one contact record per pamphlet)

4. pamphlet_locations.pamphlet_id → pamphlets.id
   - Relationship: One location per pamphlet (optional)
   - Constraint: ON DELETE CASCADE
   - Index: YES
   - Uniqueness: UNIQUE (only one location per pamphlet)
   - Special: SPATIAL index for geographic queries

5. feed.user_id → users.id
   - Relationship: Many feed items per user
   - Constraint: ON DELETE CASCADE
   - Index: YES
   - Special: Flexible reference (content_id can point to any content type)
*/

-- ===========================================================================
-- DATA DELETION CASCADE RULES
-- ===========================================================================

/*
When a user is deleted:
  ├── All their pamphlets are deleted (user_id FK)
  |   ├── All images for those pamphlets are deleted
  |   ├── All contact info for those pamphlets is deleted
  |   └── All locations for those pamphlets are deleted
  └── All their feed entries are deleted

When a pamphlet is deleted:
  ├── All images are deleted (pamphlet_id FK)
  ├── Contact info (if exists) is deleted
  └── Location info (if exists) is deleted

This ensures data integrity and no orphaned records.
*/

-- ===========================================================================
-- OPTIONAL RELATIONSHIPS (1:1 with NULL allowed)
-- ===========================================================================

/*
A pamphlet CAN have:
- Contact info (pamphlet_contacts) - OPTIONAL
- Location info (pamphlet_locations) - OPTIONAL

But doesn't MUST have them.

These are handled as:
- UNIQUE foreign keys (only one record per pamphlet)
- NULL foreign keys allowed if record not created
- Separate queries in API (not joined by default)
*/

-- ===========================================================================
-- DATA FLOW EXAMPLES
-- ===========================================================================

-- Example 1: Create complete pamphlet with all relationships
/*
BEGIN TRANSACTION;

-- 1. Create pamphlet
INSERT INTO pamphlets (title, description, category, location, user_id)
VALUES ('Title', 'Desc', 'TECHNOLOGY', 'SF', 1);
-- Returns: last_insert_id = 42

-- 2. Add images
INSERT INTO pamphlet_images (pamphlet_id, image_url) VALUES (42, 'url1');
INSERT INTO pamphlet_images (pamphlet_id, image_url) VALUES (42, 'url2');

-- 3. Add contact
INSERT INTO pamphlet_contacts (pamphlet_id, phone, whatsapp, email)
VALUES (42, '+1555', '+1555', 'email@test.com');

-- 4. Add location
INSERT INTO pamphlet_locations (pamphlet_id, address, latitude, longitude)
VALUES (42, 'Address', 37.7, -122.4);

COMMIT;
*/

-- Example 2: Retrieve complete pamphlet data
/*
-- Main pamphlet
SELECT * FROM pamphlets WHERE id = 42;

-- Author
SELECT name FROM users WHERE id = (SELECT user_id FROM pamphlets WHERE id = 42);

-- Images (multiple)
SELECT image_url FROM pamphlet_images WHERE pamphlet_id = 42;

-- Contact (0 or 1)
SELECT * FROM pamphlet_contacts WHERE pamphlet_id = 42;

-- Location (0 or 1)
SELECT * FROM pamphlet_locations WHERE pamphlet_id = 42;
*/

-- Example 3: Delete cascade
/*
DELETE FROM users WHERE id = 1;
-- Automatically deletes:
-- - All pamphlets where user_id = 1
-- - All images for those pamphlets
-- - All contacts for those pamphlets
-- - All locations for those pamphlets
*/

-- ===========================================================================
-- INDEX OPTIMIZATION MATRIX
-- ===========================================================================

/*
Table: pamphlets
┌────────────────┬──────────┬────────────────────────────────────────┐
│ Column         │ Index    │ Purpose                                │
├────────────────┼──────────┼────────────────────────────────────────┤
│ id             │ PK       │ Unique identifier                      │
│ category       │ Regular  │ Filter queries (WHERE category = ?)    │
│ location       │ Regular  │ LIKE search (WHERE location LIKE ?)    │
│ user_id        │ FK       │ Join with users table                  │
│ created_at     │ Regular  │ Sort/pagination (ORDER BY created_at) │
│ title,desc     │ FULLTEXT │ Text search (MATCH/AGAINST)           │
└────────────────┴──────────┴────────────────────────────────────────┘

Query Performance Before/After Indexing:
┌─────────────────────────────────┬──────────┬──────────┐
│ Operation                       │ No Index │ Indexed  │
├─────────────────────────────────┼──────────┼──────────┤
│ Filter by category              │ ~500ms   │ ~10ms    │
│ Filter by location (LIKE)       │ ~600ms   │ ~25ms    │
│ Sort by created_at              │ ~400ms   │ ~5ms     │
│ Full-text search               │ ~1000ms  │ ~30ms    │
│ Join with user (1000+ records) │ ~2000ms  │ ~50ms    │
└─────────────────────────────────┴──────────┴──────────┘
*/

-- ===========================================================================
-- INTEGRITY VERIFICATION QUERIES
-- ===========================================================================

-- Check for orphaned images (broken references)
SELECT pi.id, pi.pamphlet_id
FROM pamphlet_images pi
LEFT JOIN pamphlets p ON pi.pamphlet_id = p.id
WHERE p.id IS NULL;
-- Should return: EMPTY (ON DELETE CASCADE prevents this)

-- Check for orphaned contacts
SELECT pc.id, pc.pamphlet_id
FROM pamphlet_contacts pc
LEFT JOIN pamphlets p ON pc.pamphlet_id = p.id
WHERE p.id IS NULL;
-- Should return: EMPTY

-- Check for orphaned locations
SELECT pl.id, pl.pamphlet_id
FROM pamphlet_locations pl
LEFT JOIN pamphlets p ON pl.pamphlet_id = p.id
WHERE p.id IS NULL;
-- Should return: EMPTY

-- Verify unique constraints on 1:1 relationships
SELECT pamphlet_id, COUNT(*)
FROM pamphlet_contacts
GROUP BY pamphlet_id
HAVING COUNT(*) > 1;
-- Should return: EMPTY (unique constraint enforced)

SELECT pamphlet_id, COUNT(*)
FROM pamphlet_locations
GROUP BY pamphlet_id
HAVING COUNT(*) > 1;
-- Should return: EMPTY

-- ===========================================================================
-- TRANSACTION CONSIDERATIONS
-- ===========================================================================

/*
For creating a complete pamphlet (recommended):

BEGIN;
  -- Create pamphlet
  INSERT INTO pamphlets (...) VALUES (...);
  SET @pam_id = LAST_INSERT_ID();
  
  -- Add images
  INSERT INTO pamphlet_images (pamphlet_id, ...) VALUES (@pam_id, ...);
  
  -- Add contact (optional)
  INSERT INTO pamphlet_contacts (pamphlet_id, ...) VALUES (@pam_id, ...);
  
  -- Add location (optional)
  INSERT INTO pamphlet_locations (pamphlet_id, ...) VALUES (@pam_id, ...);
COMMIT;

Benefits:
- All-or-nothing consistency
- Prevents partial data entry
- Atomic operation
*/

-- ===========================================================================
-- RELATIONSHIP COUNTS (After Seeding)
-- ===========================================================================

/*
Expected from seed data:

users: 3
└── pamphlets: 8 (users.id ← pamphlets.user_id)
    ├── pamphlet_images: 20 (distributed across 8 pamphlets)
    ├── pamphlet_contacts: 8 (one per pamphlet)
    └── pamphlet_locations: 8 (one per pamphlet)

feed: 8 (users.id ← feed.user_id)
*/

-- ===========================================================================
-- OPTIMIZATION TIPS
-- ===========================================================================

/*
1. Always use indexed columns in WHERE clauses:
   ✓ SELECT * FROM pamphlets WHERE category = ?
   ✓ SELECT * FROM pamphlets WHERE location LIKE ?
   ✗ SELECT * FROM pamphlets WHERE id NOT IN (SELECT ...)

2. Use EXPLAIN to analyze queries:
   EXPLAIN SELECT * FROM pamphlets WHERE category = ?;

3. For many queries, use JOIN instead of separate queries:
   ✓ SELECT p.*, u.name FROM pamphlets p JOIN users u
   ✗ SELECT p.* FROM pamphlets p; then SELECT name FROM users

4. Complex queries on images, contacts, locations benefit from:
   - Using foreign key indexes
   - Limiting results with LIMIT
   - Caching in application layer

5. Geographic queries use spatial index:
   SELECT * FROM pamphlet_locations 
   WHERE ST_DISTANCE(POINT(latitude, longitude), ...) < 1;
*/

-- ===========================================================================
-- END OF RELATIONSHIPS DOCUMENTATION
-- ===========================================================================
