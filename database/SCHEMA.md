# Pamphlet Marketing Platform - Database Schema

## Overview

This document describes the complete MySQL database schema for the Pamphlet Marketing Platform. The schema supports CRUD operations for pamphlets, images, contact information, locations, and user management.

## Database: `pamphlet_db`

### Tables

---

## 1. **users**

Stores user account information.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);
```

**Columns:**

- `id` - Unique user identifier (Primary Key, Auto-increment)
- `name` - User's full name
- `email` - User's email (Unique, used for login)
- `password` - Hashed password (bcrypt)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Indexes:**

- `idx_email` - For fast login lookups
- `idx_created_at` - For sorting users by registration date

---

## 2. **pamphlets**

Main table storing pamphlet content and metadata.

```sql
CREATE TABLE pamphlets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content LONGTEXT,
  image_url VARCHAR(500),
  category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
  location VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_category (category),
  INDEX idx_location (location),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_search (title, description)
);
```

**Columns:**

- `id` - Unique pamphlet identifier (Primary Key)
- `title` - Pamphlet title
- `description` - Short description
- `content` - Rich editor content (HTML/markup)
- `image_url` - Main/featured image URL
- `category` - Category/type (TECHNOLOGY, BUSINESS, EDUCATION, HEALTH, ENTERTAINMENT, SPORTS, OTHER)
- `location` - Geographic location/region
- `user_id` - Creator's user ID (Foreign Key)
- `created_at` - Creation timestamp
- `updated_at` - Last modification timestamp

**Relationships:**

- Belongs to `users` table (user_id → users.id)
- ON DELETE CASCADE - Deletes all related pamphlets when user is deleted

**Indexes:**

- `idx_category` - For filtering by category
- `idx_location` - For LIKE queries on location
- `idx_user_id` - For fetching user's pamphlets
- `idx_created_at` - For sorting by date
- `idx_search` - Full-text index for search functionality

---

## 3. **pamphlet_images**

Gallery images associated with each pamphlet (One-to-Many).

```sql
CREATE TABLE pamphlet_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pamphlet_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (pamphlet_id) REFERENCES pamphlets(id) ON DELETE CASCADE,

  INDEX idx_pamphlet_id (pamphlet_id)
);
```

**Columns:**

- `id` - Unique image record identifier
- `pamphlet_id` - Reference to pamphlet (Foreign Key)
- `image_url` - URL to the image file
- `created_at` - Upload timestamp

**Relationships:**

- Belongs to `pamphlets` table (pamphlet_id → pamphlets.id)
- ON DELETE CASCADE - Remove images when pamphlet is deleted

**Indexes:**

- `idx_pamphlet_id` - For retrieving all images of a pamphlet

---

## 4. **pamphlet_contacts**

Contact information for each pamphlet (One-to-One per pamphlet).

```sql
CREATE TABLE pamphlet_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pamphlet_id INT NOT NULL UNIQUE,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pamphlet_id) REFERENCES pamphlets(id) ON DELETE CASCADE,

  INDEX idx_pamphlet_id (pamphlet_id)
);
```

**Columns:**

- `id` - Unique contact record identifier
- `pamphlet_id` - Reference to pamphlet (Foreign Key, UNIQUE for one-to-one relationship)
- `phone` - Phone number
- `whatsapp` - WhatsApp number
- `email` - Contact email
- `created_at` - Record creation timestamp
- `updated_at` - Last modification timestamp

**Relationships:**

- Belongs to `pamphlets` table (pamphlet_id → pamphlets.id, UNIQUE)
- ON DELETE CASCADE - Remove contact when pamphlet is deleted

**Indexes:**

- `idx_pamphlet_id` - For retrieving contact of a specific pamphlet

---

## 5. **pamphlet_locations**

Store/physical location information for each pamphlet (One-to-One per pamphlet).

```sql
CREATE TABLE pamphlet_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pamphlet_id INT NOT NULL UNIQUE,
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pamphlet_id) REFERENCES pamphlets(id) ON DELETE CASCADE,

  INDEX idx_pamphlet_id (pamphlet_id),
  SPATIAL INDEX idx_location_geo (POINT(latitude, longitude))
);
```

**Columns:**

- `id` - Unique location record identifier
- `pamphlet_id` - Reference to pamphlet (Foreign Key, UNIQUE for one-to-one relationship)
- `address` - Physical address
- `latitude` - Latitude coordinate (DECIMAL 10,8 for GPS precision)
- `longitude` - Longitude coordinate (DECIMAL 11,8 for GPS precision)
- `created_at` - Record creation timestamp
- `updated_at` - Last modification timestamp

**Relationships:**

- Belongs to `pamphlets` table (pamphlet_id → pamphlets.id, UNIQUE)
- ON DELETE CASCADE - Remove location when pamphlet is deleted

**Indexes:**

- `idx_pamphlet_id` - For retrieving location of a specific pamphlet
- `idx_location_geo` - SPATIAL index for geographic queries (future: find nearby locations)

---

## 6. **feed** (Optional - For future expansion)

Mixed content feed for users (supports different content types: pamphlets, reels, etc.).

```sql
CREATE TABLE feed (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_type ENUM('pamphlet', 'reel', 'update') NOT NULL,
  content_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_content_type_id (content_type, content_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

**Columns:**

- `id` - Unique feed entry identifier
- `content_type` - Type of content (pamphlet, reel, update)
- `content_id` - Reference to the actual content (flexible reference)
- `user_id` - User who created/posted content
- `created_at` - Post timestamp

**Relationships:**

- Belongs to `users` table (user_id → users.id)
- Flexible reference to various content types

**Indexes:**

- `idx_content_type_id` - For retrieving specific content type
- `idx_user_id` - For user's feed
- `idx_created_at` - For chronological sorting

---

## Entity Relationship Diagram

```
users
  ├── 1 ←→ M pamphlets (user_id)
  ├── 1 ←→ M feed (user_id)

pamphlets
  ├── 1 ←→ M pamphlet_images (pamphlet_id)
  ├── 1 ←→ 1 pamphlet_contacts (pamphlet_id)
  ├── 1 ←→ 1 pamphlet_locations (pamphlet_id)
```

---

## Common Query Patterns

### 1. Get All Pamphlets with Author (Pagination & Filtering)

```sql
SELECT
  p.id, p.title, p.description, p.image_url,
  p.category, p.location, p.user_id, p.created_at,
  u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.category = ? AND p.location LIKE ?
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?
```

### 2. Get Pamphlet Details (PDP - Product Details Page)

```sql
SELECT
  p.id, p.title, p.description, p.content,
  p.category, p.location, p.user_id, p.created_at,
  u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE p.id = ?;

-- Then fetch images, contact, and location separately
SELECT image_url FROM pamphlet_images WHERE pamphlet_id = ?;
SELECT phone, whatsapp, email FROM pamphlet_contacts WHERE pamphlet_id = ?;
SELECT address, latitude, longitude FROM pamphlet_locations WHERE pamphlet_id = ?;
```

### 3. Search Full-Text

```sql
SELECT p.id, p.title, p.description, u.name AS author_name
FROM pamphlets p
JOIN users u ON p.user_id = u.id
WHERE MATCH(p.title, p.description) AGAINST(? IN BOOLEAN MODE)
ORDER BY p.created_at DESC;
```

### 4. Get User's Pamphlets

```sql
SELECT p.id, p.title, p.description, p.created_at
FROM pamphlets p
WHERE p.user_id = ?
ORDER BY p.created_at DESC;
```

### 5. Get Feed for User

```sql
SELECT
  f.id, f.content_type, f.content_id, f.created_at,
  CASE
    WHEN f.content_type = 'pamphlet' THEN p.title
    WHEN f.content_type = 'reel' THEN r.title
  END AS content_title
FROM feed f
LEFT JOIN pamphlets p ON f.content_type = 'pamphlet' AND f.content_id = p.id
LEFT JOIN reels r ON f.content_type = 'reel' AND f.content_id = r.id
WHERE f.user_id = ?
ORDER BY f.created_at DESC;
```

---

## Constraints & Validations

| Table              | Column      | Constraint               | Notes                        |
| ------------------ | ----------- | ------------------------ | ---------------------------- |
| users              | email       | UNIQUE                   | Prevent duplicate accounts   |
| users              | password    | NOT NULL                 | Required for authentication  |
| pamphlets          | title       | NOT NULL                 | Every pamphlet needs a title |
| pamphlets          | description | NOT NULL                 | Required metadata            |
| pamphlets          | category    | NOT NULL DEFAULT 'OTHER' | Default category             |
| pamphlets          | user_id     | NOT NULL                 | Pamphlet must have author    |
| pamphlet_contacts  | pamphlet_id | UNIQUE                   | One contact per pamphlet     |
| pamphlet_locations | pamphlet_id | UNIQUE                   | One location per pamphlet    |

---

## Performance Considerations

### Indexes Summary

| Table              | Index                | Type        | Purpose            |
| ------------------ | -------------------- | ----------- | ------------------ |
| users              | email                | Regular     | Fast login lookups |
| pamphlets          | category             | Regular     | Filter by category |
| pamphlets          | location             | Regular     | LIKE searches      |
| pamphlets          | user_id              | Foreign Key | Join with users    |
| pamphlets          | created_at           | Regular     | Sort by date       |
| pamphlets          | (title, description) | Fulltext    | Text search        |
| pamphlet_images    | pamphlet_id          | Foreign Key | Retrieve images    |
| pamphlet_contacts  | pamphlet_id          | Foreign Key | Retrieve contact   |
| pamphlet_locations | pamphlet_id          | Foreign Key | Retrieve location  |

### Query Optimization Tips

1. **Use pagination** to limit result sets (LIMIT/OFFSET)
2. **Leverage fulltext index** for search queries
3. **Pre-join with users** in API responses to avoid N+1 queries
4. **Cache frequently accessed data** (categories, featured content)
5. **Use spatial index** for location-based queries (future enhancement)

---

## Migration Strategy

### Initial Setup (Run in order):

1. Create `users` table
2. Create `pamphlets` table (depends on users)
3. Create `pamphlet_images` table (depends on pamphlets)
4. Create `pamphlet_contacts` table (depends on pamphlets)
5. Create `pamphlet_locations` table (depends on pamphlets)
6. Create `feed` table (depends on users, optional)

### Teardown (Run in reverse order):

1. Drop `feed` table
2. Drop `pamphlet_locations` table
3. Drop `pamphlet_contacts` table
4. Drop `pamphlet_images` table
5. Drop `pamphlets` table
6. Drop `users` table

---

## Database Connection

**Environment Variables:**

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pamphlet_db
```

**MySQL Connection String:**

```
mysql://root:password@localhost:3306/pamphlet_db
```

---

## Notes

- All timestamps use UTC/server time
- Foreign keys use ON DELETE CASCADE for data consistency
- Supports future expansion (feed table, reels, advanced filtering)
- Spatial data types support geographic queries
- Full-text search available on pamphlet title and description
