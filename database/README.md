# Database Setup Guide

This guide explains how to set up the Pamphlet Marketing Platform database from scratch.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Database Schema](#database-schema)
3. [Migration Options](#migration-options)
4. [Seeding Data](#seeding-data)
5. [Verification](#verification)
6. [Common Operations](#common-operations)

---

## 🚀 Quick Start

### Prerequisites

- MySQL Server 5.7 or higher (8.0+ recommended)
- Node.js 16+ (for seeding via Node.js)
- npm or yarn package manager

### Option 1: Using Plain SQL (Fastest)

```bash
# 1. Create and populate database
mysql -u root -p < database/migrations/001-initial-schema.sql

# 2. Add seed data
mysql -u root -p pamphlet_db < database/seeds/seed.sql

# 3. Verify
mysql -u root -p -e "USE pamphlet_db; SHOW TABLES;"
```

### Option 2: Using Node.js Seed Script

```bash
# 1. Create database schema (run SQL file first)
mysql -u root -p < database/migrations/001-initial-schema.sql

# 2. Run seed script
npm run db:seed

# Or with tsx
npx tsx database/seeds/seed.ts
```

### Option 3: Using Sequelize CLI (for Sequelize-based projects)

```bash
# 1. Install Sequelize dependencies
npm install sequelize sequelize-cli

# 2. Initialize Sequelize
npx sequelize-cli init

# 3. Update config/config.json with your database credentials

# 4. Run migrations
npx sequelize-cli db:migrate

# 5. Run seeders (if available)
npx sequelize-cli db:seed:all
```

### Option 4: Using Knex.js (for Knex-based projects)

```bash
# 1. Install Knex
npm install knex

# 2. Initialize Knex
npx knex init

# 3. Create migrations
npx knex migrate:make initial_schema

# 4. Run migrations
npx knex migrate:latest

# 5. Run seeds
npx knex seed:run
```

---

## 📁 Database Schema

### All Files Located in: `database/`

```
database/
├── SCHEMA.md                    # Comprehensive schema documentation
├── migrations/
│   ├── 001-initial-schema.sql   # Plain SQL migration
│   ├── 20240101000000-initial-schema.js  # Sequelize migration
│   └── 20240101000000_initial_schema.js  # Knex migration
└── seeds/
    ├── seed.sql                 # SQL seed file
    └── seed.ts                  # Node.js TypeScript seed file
```

### Schema Overview

**Tables:**

1. **users** - User accounts (id, name, email, password)
2. **pamphlets** - Main content (title, description, content, category, location)
3. **pamphlet_images** - Gallery images
4. **pamphlet_contacts** - Contact information (phone, whatsapp, email)
5. **pamphlet_locations** - Store locations (address, lat/long)
6. **feed** - Mixed content feed (optional, for future expansion)

**Total Indexes:** 15+

- Category, location, user_id indexes for fast filtering
- Full-text search on title and description
- Spatial index for geographic queries

See `database/SCHEMA.md` for complete details.

---

## 🔄 Migration Options

### 1. Plain SQL (Recommended for Quick Setup)

**File:** `database/migrations/001-initial-schema.sql`

```bash
# Direct execution
mysql -u root -p pamphlet_db < database/migrations/001-initial-schema.sql

# Or from MySQL CLI
mysql> SOURCE database/migrations/001-initial-schema.sql;
```

**Advantages:**

- No dependencies required
- Works with any MySQL client
- Fast execution
- Easy to review

### 2. Sequelize CLI

**File:** `database/migrations/20240101000000-initial-schema.js`

```bash
# Installation
npm install --save-dev sequelize sequelize-cli

# Configure
npx sequelize-cli init
# Edit config/config.json with database credentials

# Run
npx sequelize-cli db:migrate

# Undo
npx sequelize-cli db:migrate:undo:all
```

**Advantages:**

- Integrated with Sequelize ORM
- Version controlled migrations
- Rollback capability
- Transaction support

### 3. Knex.js

**File:** `database/migrations/20240101000000_initial_schema.js`

```bash
# Installation
npm install --save-dev knex

# Configure
npx knex init
# Edit knexfile.js with database credentials

# Run
npx knex migrate:latest

# Undo
npx knex migrate:rollback
```

**Advantages:**

- Query builder integration
- Multi-database support
- Transaction support
- Flexible migration system

---

## 🌱 Seeding Data

### Seed Data Includes:

- **3 Test Users** with pre-hashed passwords
- **8 Sample Pamphlets** across all categories
- **20 Gallery Images**
- **8 Contact Information Records**
- **8 Location Records** with GPS coordinates

### Test Credentials

```
Email: john@example.com
Password: password123
```

### Option 1: SQL Seed File

```bash
mysql -u root -p pamphlet_db < database/seeds/seed.sql
```

### Option 2: Node.js Script

```bash
# Prerequisites: Create database schema first (above methods)

# Run seed
npm run db:seed

# Or directly with tsx
npx tsx database/seeds/seed.ts
```

**Note:** Add the script to `package.json`:

```json
{
  "scripts": {
    "db:seed": "tsx database/seeds/seed.ts"
  }
}
```

### Seed Data Statistics After Insertion:

```
✅ Inserted 3 users
✅ Inserted 8 pamphlets
✅ Inserted 20 images
✅ Inserted 8 contacts
✅ Inserted 8 locations
```

---

## ✅ Verification

### Check Database Creation

```sql
-- Connect to database
mysql -u root -p pamphlet_db

-- List all tables
SHOW TABLES;

-- Verify table structure
DESCRIBE users;
DESCRIBE pamphlets;
DESCRIBE pamphlet_images;
DESCRIBE pamphlet_contacts;
DESCRIBE pamphlet_locations;
DESCRIBE feed;
```

### Check Seed Data

```sql
-- User count
SELECT COUNT(*) as total_users FROM users;

-- Pamphlet count
SELECT COUNT(*) as total_pamphlets FROM pamphlets;

-- Verify relationships
SELECT
  p.id, p.title, u.name as author,
  (SELECT COUNT(*) FROM pamphlet_images WHERE pamphlet_id = p.id) as image_count,
  c.email,
  l.address
FROM pamphlets p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN pamphlet_contacts c ON p.id = c.pamphlet_id
LEFT JOIN pamphlet_locations l ON p.id = l.pamphlet_id
ORDER BY p.id;
```

### Test API Endpoints

```bash
# Get all pamphlets
curl http://localhost:3000/api/pamphlets

# Get single pamphlet with details
curl http://localhost:3000/api/pamphlets/1

# Filter by category
curl "http://localhost:3000/api/pamphlets?category=TECHNOLOGY"

# Filter by location
curl "http://localhost:3000/api/pamphlets?location=San+Francisco"

# Pagination
curl "http://localhost:3000/api/pamphlets?page=1&limit=5"
```

---

## 🛠️ Common Operations

### Reset Database

```bash
# Option 1: Using SQL
mysql -u root -p pamphlet_db < database/migrations/001-initial-schema.sql --force

# Option 2: Complete reset
mysql -u root -p -e "DROP DATABASE IF EXISTS pamphlet_db; SOURCE database/migrations/001-initial-schema.sql;"

# Option 3: Using ecosystem script
npm run db:reset  # Add this script to package.json
```

### Add a New User

```sql
INSERT INTO users (name, email, password)
VALUES ('New User', 'user@example.com', '$2a$10$...');
```

### Add a New Pamphlet

```sql
INSERT INTO pamphlets (title, description, category, location, user_id)
VALUES ('New Pamphlet', 'Description', 'TECHNOLOGY', 'San Francisco, CA', 1);
```

### Add Images to a Pamphlet

```sql
INSERT INTO pamphlet_images (pamphlet_id, image_url)
VALUES (1, 'https://example.com/image.jpg');
```

### Query with Full Join (PDP Response)

```sql
SELECT
  p.id, p.title, p.description, p.content,
  p.category, p.location, p.user_id, p.created_at,
  u.name as author_name,
  -- For images, contacts, and locations use separate queries
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.id = ?;

-- Images
SELECT image_url FROM pamphlet_images WHERE pamphlet_id = ?;

-- Contact
SELECT phone, whatsapp, email FROM pamphlet_contacts WHERE pamphlet_id = ?;

-- Location
SELECT address, latitude, longitude FROM pamphlet_locations WHERE pamphlet_id = ?;
```

### Export Data

```bash
# Export schema without data
mysqldump -u root -p --no-data pamphlet_db > schema.sql

# Export all data
mysqldump -u root -p pamphlet_db > backup.sql

# Export specific table
mysqldump -u root -p pamphlet_db pamphlets > pamphlets.sql
```

### Backup Database

```bash
# Full backup with timestamp
mysqldump -u root -p pamphlet_db > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Restore from backup
mysql -u root -p pamphlet_db < backup_20240115_143025.sql
```

---

## 🔐 Security Considerations

### Password Security

- All passwords in seed data are hashed with bcrypt
- Use similar hashing in your authentication logic
- Never store plain-text passwords

### Database User Permissions

```sql
-- Create dedicated database user (recommended for production)
CREATE USER 'pamphlet_user'@'localhost' IDENTIFIED BY 'strong_password';

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON pamphlet_db.* TO 'pamphlet_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

### Environment Variables

Update your `.env` file:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pamphlet_db
DB_POOL_SIZE=10
```

---

## 📊 Performance Tips

1. **Indexes:** All commonly queried columns are indexed
2. **Full-Text Search:** Use MySQL full-text index on title/description
3. **Pagination:** Always use LIMIT/OFFSET
4. **Connection Pooling:** Use connection pools (configured in config/db.ts)
5. **Caching:** Consider caching categories and featured content

---

## 🐛 Troubleshooting

### Connection Refused

```bash
# Check MySQL service
sudo service mysql status
sudo service mysql start  # Linux/Mac
# On Windows, use Services or MySQL Workbench

# Test connection
mysql -u root -p
```

### Foreign Key Constraint Error

```sql
-- Check if foreign keys are enabled
SELECT @@FOREIGN_KEY_CHECKS;

-- Temporarily disable (for seeding)
SET FOREIGN_KEY_CHECKS = 0;

-- Re-enable after operations
SET FOREIGN_KEY_CHECKS = 1;
```

### Table Already Exists

```sql
-- Drop and recreate
DROP TABLE IF EXISTS pamphlets CASCADE;
-- Re-run migration
```

### Seed Script Fails

```bash
# Check Node.js version
node --version  # Should be 16+

# Verify database connection in config/db.ts
# Test connection with sample query
npm run dev  # Start server and test endpoint
```

---

## 📚 Additional Resources

- **Schema Details:** See `database/SCHEMA.md`
- **API Documentation:** See root `README.md`
- **Environment Setup:** See `.env.example`
- **TypeScript Types:** See `types/` directory

---

## 🎯 Next Steps

1. ✅ Create database schema
2. ✅ Seed test data
3. ✅ Verify tables and data
4. ✅ Update environment variables
5. ⚙️ Start development server
6. 🧪 Test API endpoints

```bash
# Run development server
npm run dev

# Test API
curl http://localhost:3000/api/pamphlets
```

---

## 📞 Support

For issues or questions about the database setup, refer to:

- `database/SCHEMA.md` - Technical schema documentation
- Individual migration file comments
- TypeScript type definitions in `types/`
