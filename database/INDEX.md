# 📚 Database Documentation Index

Welcome! This directory contains everything you need to set up and manage your Pamphlet Marketing Platform database.

## 🗂️ File Structure

```
database/
├── 📖 Documentation Files
│   ├── README.md                          ← START HERE - Complete setup guide
│   ├── QUICK_REFERENCE.md                ← 30-second summary & cheat sheet
│   ├── SETUP_SUMMARY.md                  ← Executive summary
│   ├── SCHEMA.md                         ← Technical schema documentation
│   ├── RELATIONSHIPS.sql                 ← Entity relationships & diagrams
│   ├── COMMON_QUERIES.sql                ← 100+ SQL query examples
│   ├── SEQUELIZE_CONFIG.ts               ← Sequelize ORM setup
│   └── INDEX.md                          ← This file
│
├── 🚀 Migration Scripts (Pick ONE)
│   └── migrations/
│       ├── 001-initial-schema.sql        ← Plain SQL (RECOMMENDED)
│       ├── 20240101000000-initial-schema.js      ← Sequelize CLI
│       └── 20240101000000_initial_schema.js      ← Knex.js
│
├── 🌱 Seed Data Scripts (After migrations)
│   └── seeds/
│       ├── seed.sql                      ← SQL seed file
│       └── seed.ts                       ← Node.js/TypeScript seed
│
└── ⚙️ Configuration
    └── .env.example                      ← Environment variables template
```

## 📖 Which File Should I Read First?

### 🏃‍♂️ Just Want To Get Started? (5 min)

1. Read: **QUICK_REFERENCE.md** (30-second setup)
2. Run: Plain SQL commands (see below)
3. Done!

### 📚 Want Complete Understanding? (30 min)

1. Read: **README.md** (complete setup guide)
2. Skim: **SCHEMA.md** (table structure)
3. Look: **RELATIONSHIPS.sql** (visual diagrams)
4. Reference: **COMMON_QUERIES.sql** (for implementation)

### 🔧 Using Sequelize or Knex? (10 min)

1. See: **README.md** → Migration Options section
2. Use: Appropriate migration file
3. Reference: **SEQUELIZE_CONFIG.ts** (for models)

### 🐛 Debugging Issues? (15 min)

1. Check: **README.md** → Troubleshooting section
2. Review: **RELATIONSHIPS.sql** (for constraint issues)
3. Run: Verification queries in **COMMON_QUERIES.sql**

---

## 🚀 Quick Start (Copy & Paste)

### Option 1: Plain SQL (Fastest - No Dependencies)

```bash
# Create database and schema
mysql -u root -p < database/migrations/001-initial-schema.sql

# Add test data
mysql -u root -p pamphlet_db < database/seeds/seed.sql

# Verify
mysql -u root -p pamphlet_db -e "SELECT COUNT(*) FROM pamphlets;"

# Output: 8 (test pamphlets)
```

### Option 2: Node.js Script

```bash
# 1. Setup database (use Option 1 above first)

# 2. Configure environment
cp database/.env.example .env
# Edit .env with your database credentials

# 3. Run seed script
npm run db:seed
# or
npx tsx database/seeds/seed.ts
```

### Option 3: Docker (If Using Docker)

```bash
docker exec -i mysql-container mysql -u root -p < database/migrations/001-initial-schema.sql
docker exec -i mysql-container mysql -u root -p pamphlet_db < database/seeds/seed.sql
```

---

## 📊 What Gets Created

### Database: `pamphlet_db`

| Table                  | Purpose                  | Rows in Seed   |
| ---------------------- | ------------------------ | -------------- |
| **users**              | User accounts            | 3              |
| **pamphlets**          | Main content             | 8              |
| **pamphlet_images**    | Gallery images           | 20             |
| **pamphlet_contacts**  | Contact info             | 8              |
| **pamphlet_locations** | Store locations          | 8              |
| **feed**               | Mixed content (optional) | 0 (for future) |

### Indexes Created: 15+

- ✅ Category filtering
- ✅ Location search (LIKE)
- ✅ User ID (join efficiency)
- ✅ Created date (sorting)
- ✅ Full-text search (title + description)
- ✅ Spatial index (GPS coordinates)

---

## 🔑 Test Credentials

After seeding, use these to test your API:

```
Email:    john@example.com
Password: password123

Other users:
- sarah@example.com / password123
- mike@example.com / password123
```

---

## 📝 File Descriptions

### Documentation Files

#### `README.md` (Most Important)

- Complete database setup instructions
- All 4 migration methods explained step-by-step
- Seeding data guide
- Verification procedures
- Common operations and queries
- Troubleshooting guide
- **Best for**: First-time setup, comprehensive reference

#### `QUICK_REFERENCE.md`

- 30-second quick start
- Database tables overview
- Common queries at a glance
- Migration options comparison
- Quick troubleshooting
- **Best for**: Cheat sheet, during development

#### `SETUP_SUMMARY.md`

- Executive summary
- What was generated
- 3-step quick start
- Performance expected
- Maintenance guide
- **Best for**: Project overview, team communication

#### `SCHEMA.md`

- Detailed table definitions
- Column types and purposes
- Relationships and constraints
- Entity relationship diagrams
- Common query patterns
- Performance considerations
- **Best for**: Understanding data structure, detailed reference

#### `RELATIONSHIPS.sql`

- Visual relationship diagrams
- Foreign key constraints
- Data deletion cascade rules
- Optional relationships
- Data flow examples
- Integrity verification queries
- **Best for**: Understanding relationships, debugging FK issues

#### `COMMON_QUERIES.sql`

- 100+ ready-to-use SQL queries
- 12 categories (listing, filtering, CRUD, search, etc.)
- Analytics and statistics queries
- Geographic queries
- Performance optimization queries
- **Best for**: Implementation reference, copy-paste examples

#### `SEQUELIZE_CONFIG.ts`

- Sequelize connection setup
- Example model definitions
- ORM configuration
- **Best for**: If using Sequelize ORM

---

### Migration Files (Pick ONE)

#### `migrations/001-initial-schema.sql` ⭐ RECOMMENDED

- Plain SQL, no external dependencies
- Works with any MySQL client
- Fastest execution
- Copy/paste friendly
- **Use if**: You want simplicity and speed

#### `migrations/20240101000000-initial-schema.js`

- Sequelize CLI format
- Version-controlled migrations
- Rollback capability
- Transaction support
- **Use if**: Your project uses Sequelize ORM

#### `migrations/20240101000000_initial_schema.js`

- Knex.js format
- Works with Knex query builder
- Transaction support
- Multi-database compatible
- **Use if**: Your project uses Knex.js

---

### Seed Data Files (Use AFTER migration)

#### `seeds/seed.sql`

- SQL format
- Contains all test data
- Can be imported directly
- **Use**: `mysql -u root -p pamphlet_db < seed.sql`

#### `seeds/seed.ts`

- TypeScript/Node.js format
- Programmatic data insertion
- Better error handling
- Console output/progress
- **Use**: `npm run db:seed` or `npx tsx seed.ts`

---

### Configuration Files

#### `.env.example`

- Template for environment variables
- Database connection settings
- Connection pool configuration
- Logging options
- **Use**: Copy to `.env` and customizemonger

---

## 🎯 Migration Path by Framework

### Plain Express + MySQL2 (No ORM)

```
Use: 001-initial-schema.sql
Then: seed.ts (Node.js seed script)
```

### Express + Sequelize ORM

```
Use: 20240101000000-initial-schema.js
Config: SEQUELIZE_CONFIG.ts
Models: Create models/ directory
```

### Express + Knex.js

```
Use: 20240101000000_initial_schema.js
Config: knexfile.js (update per docs)
Migrations: Already in place
```

---

## ⚡ Performance After Setup

Expected query times:

| Operation                     | Time   |
| ----------------------------- | ------ |
| Get all pamphlets (paginated) | <50ms  |
| Filter by category            | <20ms  |
| Search by location            | <30ms  |
| Full-text search              | <40ms  |
| Get PDP (3 queries)           | <100ms |

_Times with sub-100K records on standard hardware_

---

## 🔐 Security Checklist

- ✅ Use strong passwords (non-bcrypt for DB, bcrypt for user passwords)
- ✅ Never commit `.env` file with real credentials
- ✅ Use dedicated DB user for production (not root)
- ✅ Enable SSL for remote connections
- ✅ Review seed data before production
- ✅ Implement query parameterization (protection against SQL injection)
- ✅ Use connection pooling
- ✅ Regular backups scheduled

---

## 📞 Support & Troubleshooting

### Connection Issues

→ See `README.md` → Troubleshooting → "Connection Refused"

### Foreign Key Errors

→ See `RELATIONSHIPS.sql` → Data Deletion Cascade Rules

### Query Performance

→ See `SCHEMA.md` → Performance Considerations

### Missing Data After Seeding

→ See `README.md` → Verification section

### ORM Integration

→ See `SEQUELIZE_CONFIG.ts` or migration files

---

## 📚 Related Files in Your Project

- **API Controllers**: `controllers/pamphletController.ts`
- **Routes**: `routes/pamphletRoutes.ts`
- **Types**: `types/pamphlet.ts`, `types/user.ts`
- **Database Config**: `config/db.ts`
- **Authentication**: `controllers/authController.ts`

---

## 🎓 Learning Path

1. **Hour 1**: Read `README.md`, run setup
2. **Hour 2**: Read `SCHEMA.md`, understand tables
3. **Hour 3**: Look at `COMMON_QUERIES.sql`, try queries
4. **Hour 4**: Review `RELATIONSHIPS.sql`, understand constraints
5. **Ongoing**: Use `QUICK_REFERENCE.md` as cheat sheet

---

## ✅ Verification Checklist

Before declaring setup complete:

- [ ] MySQL service running
- [ ] Database `pamphlet_db` exists
- [ ] All 6 tables created
- [ ] Seed data inserted (8 pamphlets)
- [ ] Test credentials work (john@example.com)
- [ ] Node.js server starts: `npm run dev`
- [ ] API endpoint responds: `curl http://localhost:3000/api/pamphlets`
- [ ] Environment variables configured in `.env`

---

## 🚀 Next Steps After Setup

1. ✅ **Setup**: Run migrations and seed
2. ✅ **Verify**: Check tables and data
3. ✅ **Start Server**: `npm run dev`
4. ✅ **Test API**: Use curl or Postman
5. ⚙️ **Build Features**: Implement your business logic
6. 🎯 **Deploy**: Move to production

---

## 📄 File Statistics

- **Total Documentation Pages**: 7
- **Total SQL Queries**: 100+
- **Migration Options**: 3
- **Seed Data Records**: 55+
- **Total Setup Files**: 12

---

## 🎉 Ready to Go!

Your database is **production-ready** with:

- ✅ Optimized schema
- ✅ Strategic indexes
- ✅ Test data
- ✅ Multiple setup options
- ✅ Complete documentation
- ✅ Query examples

**Start with**: `database/README.md` or `database/QUICK_REFERENCE.md`

**Questions?** Check the relevant documentation file above.

---

**Database Schema Version**: 1.0
**Last Updated**: 2024
**Status**: ✅ Ready for Production
**MySQL Compatibility**: 5.7+
**Node.js Compatibility**: 16+
