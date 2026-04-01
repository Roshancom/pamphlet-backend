/**
 * SEED DATA - Node.js Script
 *
 * This script populates the database with sample data for testing.
 *
 * Usage (from project root):
 * 1. Using ES modules with tsx/ts-node:
 *    npx tsx database/seeds/seed.ts
 *
 * 2. Using Node.js with compiled JavaScript:
 *    node dist/database/seeds/seed.js
 *
 * 3. Add to package.json scripts:
 *    "db:seed": "tsx database/seeds/seed.ts"
 *    Then run: npm run db:seed
 */

import pool from '../../config/db.js';

interface SeedUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface SeedPamphlet {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  location: string;
  user_id: number;
}

interface SeedImage {
  pamphlet_id: number;
  image_url: string;
}

interface SeedContact {
  pamphlet_id: number;
  phone: string;
  whatsapp: string;
  email: string;
}

interface SeedLocation {
  pamphlet_id: number;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Test Users
 * Password: "password123"
 * Hashed with bcrypt: $2a$10$MmM2YWU5OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u
 */
const testUsers: SeedUser[] = [
  {
    id: 1,
    name: 'John Developer',
    email: 'john@example.com',
    password: '$2a$10$MmM2YWU5OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u',
  },
  {
    id: 2,
    name: 'Sarah Tech',
    email: 'sarah@example.com',
    password: '$2a$10$MmM2YWU1OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u',
  },
  {
    id: 3,
    name: 'Mike Business',
    email: 'mike@example.com',
    password: '$2a$10$MmM2YWU2OTk0NWM5ZTk5ZZQQIi7g0GZ1CXVGrHpxfZFmM5Z9GDT5u',
  },
];

/**
 * Test Pamphlets
 */
const testPamphlets: SeedPamphlet[] = [
  {
    id: 1,
    title: 'Latest Technology Trends 2024',
    description:
      'Explore the hottest tech trends dominating the market this year. From AI to blockchain, we cover it all.',
    content:
      '<h1>Technology Trends 2024</h1><p>This comprehensive guide covers the latest innovations...</p><h2>AI Revolution</h2><p>Artificial Intelligence continues to transform industries...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Tech+Trends',
    category: 'TECHNOLOGY',
    location: 'San Francisco, CA',
    user_id: 1,
  },
  {
    id: 2,
    title: 'Business Growth Strategies',
    description:
      'Proven strategies to scale your business from startup to enterprise.',
    content:
      '<h1>Business Scaling</h1><p>Learn the fundamentals of sustainable business growth...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Business',
    category: 'BUSINESS',
    location: 'New York, NY',
    user_id: 2,
  },
  {
    id: 3,
    title: 'Online Education Platform Guide',
    description:
      'Complete guide to leveraging online education for professional development.',
    content:
      '<h1>E-Learning Guide</h1><p>Online education has revolutionized learning...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Education',
    category: 'EDUCATION',
    location: 'Chicago, IL',
    user_id: 1,
  },
  {
    id: 4,
    title: 'Healthcare Innovation Summit',
    description:
      'Discover breakthrough innovations in modern healthcare and medical technology.',
    content:
      '<h1>Healthcare Tech</h1><p>Medical innovation is accelerating at unprecedented rates...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Healthcare',
    category: 'HEALTH',
    location: 'Boston, MA',
    user_id: 3,
  },
  {
    id: 5,
    title: 'Entertainment Industry Report',
    description:
      'Latest trends in entertainment, streaming, and digital content creation.',
    content:
      '<h1>Entertainment 2024</h1><p>The entertainment landscape continues to evolve...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Entertainment',
    category: 'ENTERTAINMENT',
    location: 'Los Angeles, CA',
    user_id: 2,
  },
  {
    id: 6,
    title: 'Sports Technology Review',
    description:
      'How technology is revolutionizing sports performance and fan experience.',
    content:
      '<h1>Sports Tech</h1><p>From wearables to AI coaching, sports technology is advancing...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Sports',
    category: 'SPORTS',
    location: 'Miami, FL',
    user_id: 1,
  },
  {
    id: 7,
    title: 'Digital Marketing Essentials',
    description: 'Master modern digital marketing techniques and strategies.',
    content:
      '<h1>Digital Marketing</h1><p>Effective digital marketing requires knowledge of multiple channels...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Marketing',
    category: 'BUSINESS',
    location: 'San Francisco, CA',
    user_id: 3,
  },
  {
    id: 8,
    title: 'Cloud Computing Strategies',
    description: 'Enterprise cloud adoption strategies for 2024.',
    content:
      '<h1>Cloud Computing</h1><p>Cloud infrastructure has become essential for modern businesses...</p>',
    image_url: 'https://via.placeholder.com/800x600?text=Cloud',
    category: 'TECHNOLOGY',
    location: 'Seattle, WA',
    user_id: 2,
  },
];

/**
 * Pamphlet Images
 */
const testImages: SeedImage[] = [
  // Images for Technology Trends (id: 1)
  {
    pamphlet_id: 1,
    image_url: 'https://via.placeholder.com/600x400?text=AI+Innovation',
  },
  {
    pamphlet_id: 1,
    image_url: 'https://via.placeholder.com/600x400?text=Blockchain',
  },
  {
    pamphlet_id: 1,
    image_url: 'https://via.placeholder.com/600x400?text=IoT+Devices',
  },
  // Images for Business Growth (id: 2)
  {
    pamphlet_id: 2,
    image_url: 'https://via.placeholder.com/600x400?text=Startup+Setup',
  },
  {
    pamphlet_id: 2,
    image_url: 'https://via.placeholder.com/600x400?text=Team+Building',
  },
  {
    pamphlet_id: 2,
    image_url: 'https://via.placeholder.com/600x400?text=Growth+Chart',
  },
  // Images for Education (id: 3)
  {
    pamphlet_id: 3,
    image_url: 'https://via.placeholder.com/600x400?text=Online+Class',
  },
  {
    pamphlet_id: 3,
    image_url: 'https://via.placeholder.com/600x400?text=E-Learning',
  },
  // Images for Healthcare (id: 4)
  {
    pamphlet_id: 4,
    image_url: 'https://via.placeholder.com/600x400?text=Medical+Lab',
  },
  {
    pamphlet_id: 4,
    image_url: 'https://via.placeholder.com/600x400?text=Hospital',
  },
  {
    pamphlet_id: 4,
    image_url: 'https://via.placeholder.com/600x400?text=Research',
  },
  // Images for Entertainment (id: 5)
  {
    pamphlet_id: 5,
    image_url: 'https://via.placeholder.com/600x400?text=Streaming',
  },
  {
    pamphlet_id: 5,
    image_url: 'https://via.placeholder.com/600x400?text=Content+Creation',
  },
  // Images for Sports (id: 6)
  {
    pamphlet_id: 6,
    image_url: 'https://via.placeholder.com/600x400?text=Sport+Stadium',
  },
  {
    pamphlet_id: 6,
    image_url: 'https://via.placeholder.com/600x400?text=Wearables',
  },
  {
    pamphlet_id: 6,
    image_url: 'https://via.placeholder.com/600x400?text=Training',
  },
  // Images for Digital Marketing (id: 7)
  {
    pamphlet_id: 7,
    image_url: 'https://via.placeholder.com/600x400?text=Social+Media',
  },
  {
    pamphlet_id: 7,
    image_url: 'https://via.placeholder.com/600x400?text=Analytics',
  },
  // Images for Cloud Computing (id: 8)
  {
    pamphlet_id: 8,
    image_url: 'https://via.placeholder.com/600x400?text=Cloud+Server',
  },
  {
    pamphlet_id: 8,
    image_url: 'https://via.placeholder.com/600x400?text=Data+Center',
  },
  {
    pamphlet_id: 8,
    image_url: 'https://via.placeholder.com/600x400?text=Security',
  },
];

/**
 * Pamphlet Contacts
 */
const testContacts: SeedContact[] = [
  {
    pamphlet_id: 1,
    phone: '+1-415-555-0101',
    whatsapp: '+1-415-555-0101',
    email: 'contact@techtrends.com',
  },
  {
    pamphlet_id: 2,
    phone: '+1-212-555-0102',
    whatsapp: '+1-212-555-0102',
    email: 'hello@bizgrowth.com',
  },
  {
    pamphlet_id: 3,
    phone: '+1-312-555-0103',
    whatsapp: '+1-312-555-0103',
    email: 'education@elearning.com',
  },
  {
    pamphlet_id: 4,
    phone: '+1-617-555-0104',
    whatsapp: '+1-617-555-0104',
    email: 'support@healthtech.com',
  },
  {
    pamphlet_id: 5,
    phone: '+1-323-555-0105',
    whatsapp: '+1-323-555-0105',
    email: 'info@entertainment.com',
  },
  {
    pamphlet_id: 6,
    phone: '+1-305-555-0106',
    whatsapp: '+1-305-555-0106',
    email: 'sports@innovation.com',
  },
  {
    pamphlet_id: 7,
    phone: '+1-415-555-0107',
    whatsapp: '+1-415-555-0107',
    email: 'marketing@digital.com',
  },
  {
    pamphlet_id: 8,
    phone: '+1-206-555-0108',
    whatsapp: '+1-206-555-0108',
    email: 'cloud@provider.com',
  },
];

/**
 * Pamphlet Locations
 */
const testLocations: SeedLocation[] = [
  {
    pamphlet_id: 1,
    address: '123 Tech Street, San Francisco, CA 94105',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    pamphlet_id: 2,
    address: '456 Business Ave, New York, NY 10001',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    pamphlet_id: 3,
    address: '789 Education Blvd, Chicago, IL 60601',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    pamphlet_id: 4,
    address: '321 Medical Plaza, Boston, MA 02101',
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    pamphlet_id: 5,
    address: '654 Hollywood Ln, Los Angeles, CA 90001',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    pamphlet_id: 6,
    address: '987 Sports Way, Miami, FL 33101',
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    pamphlet_id: 7,
    address: '111 Marketing Square, San Francisco, CA 94102',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    pamphlet_id: 8,
    address: '222 Cloud Drive, Seattle, WA 98101',
    latitude: 47.6062,
    longitude: -122.3321,
  },
];

/**
 * Main seed function
 */
async function seed(): Promise<void> {
  let connection;

  try {
    console.log('🌱 Starting database seeding...\n');

    connection = await pool.getConnection();

    // Disable foreign key checks temporarily
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await connection.query('TRUNCATE TABLE feed');
    await connection.query('TRUNCATE TABLE pamphlet_locations');
    await connection.query('TRUNCATE TABLE pamphlet_contacts');
    await connection.query('TRUNCATE TABLE pamphlet_images');
    await connection.query('TRUNCATE TABLE pamphlets');
    await connection.query('TRUNCATE TABLE users');
    console.log('✅ Cleared existing data\n');

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert users
    console.log('👤 Inserting test users...');
    for (const user of testUsers) {
      await connection.query(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [user.id, user.name, user.email, user.password],
      );
    }
    console.log(`✅ Inserted ${testUsers.length} users\n`);

    // Insert pamphlets
    console.log('📄 Inserting test pamphlets...');
    for (const pamphlet of testPamphlets) {
      await connection.query(
        'INSERT INTO pamphlets (id, title, description, content, image_url, category, location, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          pamphlet.id,
          pamphlet.title,
          pamphlet.description,
          pamphlet.content,
          pamphlet.image_url,
          pamphlet.category,
          pamphlet.location,
          pamphlet.user_id,
        ],
      );
    }
    console.log(`✅ Inserted ${testPamphlets.length} pamphlets\n`);

    // Insert images
    console.log('🖼️  Inserting pamphlet images...');
    for (const image of testImages) {
      await connection.query(
        'INSERT INTO pamphlet_images (pamphlet_id, image_url) VALUES (?, ?)',
        [image.pamphlet_id, image.image_url],
      );
    }
    console.log(`✅ Inserted ${testImages.length} images\n`);

    // Insert contacts
    console.log('📞 Inserting pamphlet contacts...');
    for (const contact of testContacts) {
      await connection.query(
        'INSERT INTO pamphlet_contacts (pamphlet_id, phone, whatsapp, email) VALUES (?, ?, ?, ?)',
        [contact.pamphlet_id, contact.phone, contact.whatsapp, contact.email],
      );
    }
    console.log(`✅ Inserted ${testContacts.length} contacts\n`);

    // Insert locations
    console.log('📍 Inserting pamphlet locations...');
    for (const location of testLocations) {
      await connection.query(
        'INSERT INTO pamphlet_locations (pamphlet_id, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [
          location.pamphlet_id,
          location.address,
          location.latitude,
          location.longitude,
        ],
      );
    }
    console.log(`✅ Inserted ${testLocations.length} locations\n`);

    // Verify seed data
    console.log('📊 Verifying seed data...');
    const [userCount] = await connection.query(
      'SELECT COUNT(*) as total FROM users',
    );
    const [pamphletCount] = await connection.query(
      'SELECT COUNT(*) as total FROM pamphlets',
    );
    const [imageCount] = await connection.query(
      'SELECT COUNT(*) as total FROM pamphlet_images',
    );
    const [contactCount] = await connection.query(
      'SELECT COUNT(*) as total FROM pamphlet_contacts',
    );
    const [locationCount] = await connection.query(
      'SELECT COUNT(*) as total FROM pamphlet_locations',
    );

    console.log(`\n📈 Seed Statistics:`);
    console.log(`   Users: ${(userCount as any)[0].total}`);
    console.log(`   Pamphlets: ${(pamphletCount as any)[0].total}`);
    console.log(`   Images: ${(imageCount as any)[0].total}`);
    console.log(`   Contacts: ${(contactCount as any)[0].total}`);
    console.log(`   Locations: ${(locationCount as any)[0].total}`);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('🔑 Test Credentials:');
    console.log(`   Email: john@example.com`);
    console.log(`   Password: password123\n`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
    process.exit(0);
  }
}

// Run seeding
seed();
