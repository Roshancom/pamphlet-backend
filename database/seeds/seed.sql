/**
 * SEED DATA - TEST DATA FOR DEVELOPMENT
 * 
 * This script populates the database with sample data for testing.
 * 
 * Usage:
 * 1. Plain SQL:
 *    mysql -u root -p pamphlet_db < seed.sql
 * 
 * 2. Node.js script:
 *    node database/seeds/seed.js
 * 
 * NOTE: Passwords are hashed with bcrypt (hash shown below)
 * Password: "password123" = "$2a$10$N0wf7tE1DgR.0Hf1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1"
 */

-- =============================================================================
-- CLEAR EXISTING DATA (OPTIONAL - Uncomment to reset database)
-- =============================================================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE feed;
-- TRUNCATE TABLE pamphlet_locations;
-- TRUNCATE TABLE pamphlet_contacts;
-- TRUNCATE TABLE pamphlet_images;
-- TRUNCATE TABLE pamphlets;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- INSERT TEST USERS
-- =============================================================================
-- Passwords are hashed with bcrypt
-- Plain password: "password123"
-- Hashed: $2a$10$MmM2YWU5OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u

INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES
(1, 'John Developer', 'john@example.com', '$2a$10$MmM2YWU5OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u', NOW(), NOW()),
(2, 'Sarah Tech', 'sarah@example.com', '$2a$10$MmM2YWU1OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u', NOW(), NOW()),
(3, 'Mike Business', 'mike@example.com', '$2a$10$MmM2YWU2OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u', NOW(), NOW());

-- =============================================================================
-- INSERT TEST PAMPHLETS
-- =============================================================================

INSERT INTO pamphlets (id, title, description, content, image_url, category, location, user_id, created_at, updated_at) VALUES
(1, 'Latest Technology Trends 2024', 
 'Explore the hottest tech trends dominating the market this year. From AI to blockchain, we cover it all.',
 '<h1>Technology Trends 2024</h1><p>This comprehensive guide covers the latest innovations...</p><h2>AI Revolution</h2><p>Artificial Intelligence continues to transform industries...</p>',
 'https://via.placeholder.com/800x600?text=Tech+Trends',
 'TECHNOLOGY', 'San Francisco, CA', 1, NOW(), NOW()),

(2, 'Business Growth Strategies',
 'Proven strategies to scale your business from startup to enterprise.',
 '<h1>Business Scaling</h1><p>Learn the fundamentals of sustainable business growth...</p>',
 'https://via.placeholder.com/800x600?text=Business',
 'BUSINESS', 'New York, NY', 2, NOW(), NOW()),

(3, 'Online Education Platform Guide',
 'Complete guide to leveraging online education for professional development.',
 '<h1>E-Learning Guide</h1><p>Online education has revolutionized learning...</p>',
 'https://via.placeholder.com/800x600?text=Education',
 'EDUCATION', 'Chicago, IL', 1, NOW(), NOW()),

(4, 'Healthcare Innovation Summit',
 'Discover breakthrough innovations in modern healthcare and medical technology.',
 '<h1>Healthcare Tech</h1><p>Medical innovation is accelerating at unprecedented rates...</p>',
 'https://via.placeholder.com/800x600?text=Healthcare',
 'HEALTH', 'Boston, MA', 3, NOW(), NOW()),

(5, 'Entertainment Industry Report',
 'Latest trends in entertainment, streaming, and digital content creation.',
 '<h1>Entertainment 2024</h1><p>The entertainment landscape continues to evolve...</p>',
 'https://via.placeholder.com/800x600?text=Entertainment',
 'ENTERTAINMENT', 'Los Angeles, CA', 2, NOW(), NOW()),

(6, 'Sports Technology Review',
 'How technology is revolutionizing sports performance and fan experience.',
 '<h1>Sports Tech</h1><p>From wearables to AI coaching, sports technology is advancing...</p>',
 'https://via.placeholder.com/800x600?text=Sports',
 'SPORTS', 'Miami, FL', 1, NOW(), NOW()),

(7, 'Digital Marketing Essentials',
 'Master modern digital marketing techniques and strategies.',
 '<h1>Digital Marketing</h1><p>Effective digital marketing requires knowledge of multiple channels...</p>',
 'https://via.placeholder.com/800x600?text=Marketing',
 'BUSINESS', 'San Francisco, CA', 3, NOW(), NOW()),

(8, 'Cloud Computing Strategies',
 'Enterprise cloud adoption strategies for 2024.',
 '<h1>Cloud Computing</h1><p>Cloud infrastructure has become essential for modern businesses...</p>',
 'https://via.placeholder.com/800x600?text=Cloud',
 'TECHNOLOGY', 'Seattle, WA', 2, NOW(), NOW());

-- =============================================================================
-- INSERT PAMPHLET IMAGES (Gallery Images)
-- =============================================================================

INSERT INTO pamphlet_images (pamphlet_id, image_url, created_at) VALUES
-- Images for Technology Trends (id: 1)
(1, 'https://via.placeholder.com/600x400?text=AI+Innovation', NOW()),
(1, 'https://via.placeholder.com/600x400?text=Blockchain', NOW()),
(1, 'https://via.placeholder.com/600x400?text=IoT+Devices', NOW()),

-- Images for Business Growth (id: 2)
(2, 'https://via.placeholder.com/600x400?text=Startup+Setup', NOW()),
(2, 'https://via.placeholder.com/600x400?text=Team+Building', NOW()),
(2, 'https://via.placeholder.com/600x400?text=Growth+Chart', NOW()),

-- Images for Education (id: 3)
(3, 'https://via.placeholder.com/600x400?text=Online+Class', NOW()),
(3, 'https://via.placeholder.com/600x400?text=E-Learning', NOW()),

-- Images for Healthcare (id: 4)
(4, 'https://via.placeholder.com/600x400?text=Medical+Lab', NOW()),
(4, 'https://via.placeholder.com/600x400?text=Hospital', NOW()),
(4, 'https://via.placeholder.com/600x400?text=Research', NOW()),

-- Images for Entertainment (id: 5)
(5, 'https://via.placeholder.com/600x400?text=Streaming', NOW()),
(5, 'https://via.placeholder.com/600x400?text=Content+Creation', NOW()),

-- Images for Sports (id: 6)
(6, 'https://via.placeholder.com/600x400?text=Sport+Stadium', NOW()),
(6, 'https://via.placeholder.com/600x400?text=Wearables', NOW()),
(6, 'https://via.placeholder.com/600x400?text=Training', NOW()),

-- Images for Digital Marketing (id: 7)
(7, 'https://via.placeholder.com/600x400?text=Social+Media', NOW()),
(7, 'https://via.placeholder.com/600x400?text=Analytics', NOW()),

-- Images for Cloud Computing (id: 8)
(8, 'https://via.placeholder.com/600x400?text=Cloud+Server', NOW()),
(8, 'https://via.placeholder.com/600x400?text=Data+Center', NOW()),
(8, 'https://via.placeholder.com/600x400?text=Security', NOW());

-- =============================================================================
-- INSERT PAMPHLET CONTACTS
-- =============================================================================

INSERT INTO pamphlet_contacts (pamphlet_id, phone, whatsapp, email, created_at, updated_at) VALUES
(1, '+1-415-555-0101', '+1-415-555-0101', 'contact@techtrends.com', NOW(), NOW()),
(2, '+1-212-555-0102', '+1-212-555-0102', 'hello@bizgrowth.com', NOW(), NOW()),
(3, '+1-312-555-0103', '+1-312-555-0103', 'education@elearning.com', NOW(), NOW()),
(4, '+1-617-555-0104', '+1-617-555-0104', 'support@healthtech.com', NOW(), NOW()),
(5, '+1-323-555-0105', '+1-323-555-0105', 'info@entertainment.com', NOW(), NOW()),
(6, '+1-305-555-0106', '+1-305-555-0106', 'sports@innovation.com', NOW(), NOW()),
(7, '+1-415-555-0107', '+1-415-555-0107', 'marketing@digital.com', NOW(), NOW()),
(8, '+1-206-555-0108', '+1-206-555-0108', 'cloud@provider.com', NOW(), NOW());

-- =============================================================================
-- INSERT PAMPHLET LOCATIONS
-- =============================================================================

INSERT INTO pamphlet_locations (pamphlet_id, address, latitude, longitude, created_at, updated_at) VALUES
(1, '123 Tech Street, San Francisco, CA 94105', 37.7749, -122.4194, NOW(), NOW()),
(2, '456 Business Ave, New York, NY 10001', 40.7128, -74.0060, NOW(), NOW()),
(3, '789 Education Blvd, Chicago, IL 60601', 41.8781, -87.6298, NOW(), NOW()),
(4, '321 Medical Plaza, Boston, MA 02101', 42.3601, -71.0589, NOW(), NOW()),
(5, '654 Hollywood Ln, Los Angeles, CA 90001', 34.0522, -118.2437, NOW(), NOW()),
(6, '987 Sports Way, Miami, FL 33101', 25.7617, -80.1918, NOW(), NOW()),
(7, '111 Marketing Square, San Francisco, CA 94102', 37.7749, -122.4194, NOW(), NOW()),
(8, '222 Cloud Drive, Seattle, WA 98101', 47.6062, -122.3321, NOW(), NOW());

-- =============================================================================
-- INSERT FEED DATA (Optional - For mixed content)
-- =============================================================================

INSERT INTO feed (content_type, content_id, user_id, created_at) VALUES
('pamphlet', 1, 1, NOW()),
('pamphlet', 2, 2, NOW()),
('pamphlet', 3, 1, NOW() - INTERVAL 1 DAY),
('pamphlet', 4, 3, NOW() - INTERVAL 2 DAY),
('pamphlet', 5, 2, NOW() - INTERVAL 3 DAY),
('pamphlet', 6, 1, NOW() - INTERVAL 4 DAY),
('pamphlet', 7, 3, NOW() - INTERVAL 5 DAY),
('pamphlet', 8, 2, NOW() - INTERVAL 6 DAY);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Run these queries to verify the seed data:

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_pamphlets FROM pamphlets;
-- SELECT COUNT(*) as total_images FROM pamphlet_images;
-- SELECT COUNT(*) as total_contacts FROM pamphlet_contacts;
-- SELECT COUNT(*) as total_locations FROM pamphlet_locations;
-- SELECT COUNT(*) as total_feed FROM feed;

-- SELECT 
--   p.id, p.title, p.category, p.location, u.name as author,
--   (SELECT COUNT(*) FROM pamphlet_images WHERE pamphlet_id = p.id) as image_count
-- FROM pamphlets p
-- JOIN users u ON p.user_id = u.id
-- ORDER BY p.created_at DESC;

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================
