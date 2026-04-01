# Pamphlet Marketing Platform - Backend API

A complete, production-ready backend API for managing pamphlets using Node.js, Express, and MySQL.

## 📋 Features

- **User Authentication**: Register and login with JWT tokens
- **Pamphlet Management**: Create, read, update, and delete pamphlets
- **Role-based Access**: Protected routes for create, update, and delete operations
- **MySQL Database**: Persistent data storage with proper relationships
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Easy setup with dotenv

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server
- Git

## 🚀 Installation & Setup

### 1. Clone or Extract the Project

```bash
cd pamphlet-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pamphlet_db
PORT=5000
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Create Database

Using MySQL CLI:

```bash
mysql -u root -p
CREATE DATABASE pamphlet_db;
USE pamphlet_db;
```

### 5. Run Database Schema

Execute the SQL schema to create tables:

```bash
mysql -u root -p pamphlet_db < config/schema.sql
```

Or run manually from MySQL client using the queries in `config/schema.sql`.

### 6. Start the Server

**Development (with auto-reload)**:

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Base URL

```
http://localhost:5000
```

### Authentication Routes

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (201):

```json
{
  "success": true,
  "message": "User registered successfully."
}
```

#### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Pamphlet Routes

#### Get All Pamphlets

```
GET /api/pamphlets
```

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Spring Sale",
      "description": "50% off on all items",
      "image_url": "https://example.com/image.jpg",
      "category": "Sales",
      "location": "Downtown",
      "user_id": 1,
      "author_name": "John Doe",
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Pamphlet by ID

```
GET /api/pamphlets/:id
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Spring Sale",
    "description": "50% off on all items",
    "image_url": "https://example.com/image.jpg",
    "category": "Sales",
    "location": "Downtown",
    "user_id": 1,
    "author_name": "John Doe",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Create Pamphlet (Protected)

```
POST /api/pamphlets
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "title": "Summer Special",
  "description": "Exclusive summer deals",
  "image_url": "https://example.com/summer.jpg",
  "category": "Promotions",
  "location": "Mall"
}
```

**Response** (201):

```json
{
  "success": true,
  "message": "Pamphlet created successfully.",
  "data": {
    "id": 2,
    "title": "Summer Special",
    "description": "Exclusive summer deals",
    "image_url": "https://example.com/summer.jpg",
    "category": "Promotions",
    "location": "Mall",
    "user_id": 1
  }
}
```

#### Update Pamphlet (Protected)

```
PUT /api/pamphlets/:id
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Pamphlet updated successfully."
}
```

#### Delete Pamphlet (Protected)

```
DELETE /api/pamphlets/:id
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200):

```json
{
  "success": true,
  "message": "Pamphlet deleted successfully."
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained from the login endpoint. Include it in all requests to protected routes.

## 📁 Project Structure

```
pamphlet-backend/
├── config/
│   ├── db.js              # Database connection pool
│   └── schema.sql         # Database schema
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── pamphletController.js # Pamphlet CRUD logic
├── routes/
│   ├── authRoutes.js      # Auth routes
│   └── pamphletRoutes.js  # Pamphlet routes
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── server/
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
└── README.md            # Documentation
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Pamphlets Table

```sql
CREATE TABLE pamphlets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🐛 Troubleshooting

### Database Connection Failed

- Ensure MySQL is running
- Check credentials in `.env` file
- Verify database `pamphlet_db` exists
- Check MySQL user has proper permissions

### Port Already in Use

- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or kill the process using the port

### JWT Errors

- Ensure `JWT_SECRET` is set in `.env`
- Token might be expired (default 7 days)
- Check token format: `Bearer <token>`

### Module Not Found

- Run `npm install` to install all dependencies
- Ensure Node.js version is compatible (v14+)

## 📝 Best Practices Followed

✅ Promise-based MySQL pool for better concurrency
✅ Async/await for clean asynchronous code
✅ Proper error handling with try/catch
✅ JWT for stateless authentication
✅ Password hashing with bcryptjs
✅ CORS for cross-origin access
✅ Environment variables for configuration
✅ Modular structure for scalability
✅ Input validation on critical routes
✅ Foreign key relationships

## 🔒 Security Considerations

1. **Change JWT_SECRET** before production deployment
2. **Use HTTPS** in production
3. **Validate all inputs** on routes
4. **Rate limiting** (consider adding middleware)
5. **CORS configuration** (restrict origins in production)
6. **SQL Injection prevention** (using parameterized queries)
7. **Password requirements** (consider enforcing strong passwords)

## 🚀 Production Deployment

Before deploying to production:

1. Update environment variables (secure credentials)
2. Set `NODE_ENV=production`
3. Configure MySQL with proper backups
4. Enable HTTPS
5. Add rate limiting middleware
6. Add comprehensive logging
7. Use a process manager (PM2, Forever, etc.)
8. Configure proper CORS origins
9. Add request validation
10. Monitor and manage errors

## 📄 License

ISC

## 👨‍💻 Support

For issues or questions, refer to the API documentation or check the error messages in the response.

---

**Happy coding! 🎉**
