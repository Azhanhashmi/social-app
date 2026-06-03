# 🚀 Mini Social App — Backend

Production-ready REST API built with Node.js, Express, MongoDB, and Cloudinary.

---

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Runtime       | Node.js 18+                       |
| Framework     | Express.js                        |
| Database      | MongoDB Atlas (Mongoose ODM)      |
| Auth          | JWT + bcryptjs                    |
| File Upload   | Multer (memory) + Cloudinary      |
| Validation    | express-validator                 |
| Security      | Helmet + express-rate-limit       |
| Logging       | Morgan                            |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js  # signup, login, getMe
│   │   └── postController.js  # CRUD, likes, comments
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + optionalAuth
│   │   ├── upload.js          # Multer memory storage
│   │   ├── validators.js      # express-validator chains
│   │   └── errorHandler.js    # Centralized error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Post.js            # Post + comment subdoc schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── services/
│   │   └── cloudinaryService.js  # upload/delete helpers
│   ├── utils/
│   │   ├── jwt.js             # generateToken / verifyToken
│   │   └── response.js        # Standardized response helpers
│   ├── app.js                 # Express app config
│   └── server.js              # Entry point + graceful shutdown
├── .env                       # Environment variables (not committed)
├── .env.example               # Template for .env
├── .gitignore
├── package.json
├── API_DOCS.md                # Full API reference with curl examples
└── README.md
```

---

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Required environment variables

| Variable                 | Description                               |
|--------------------------|-------------------------------------------|
| `MONGO_URI`              | MongoDB Atlas connection string           |
| `JWT_SECRET`             | Secret key (min 32 chars for production)  |
| `JWT_EXPIRES_IN`         | Token TTL e.g. `7d`                       |
| `CLOUDINARY_CLOUD_NAME`  | From Cloudinary dashboard                 |
| `CLOUDINARY_API_KEY`     | From Cloudinary dashboard                 |
| `CLOUDINARY_API_SECRET`  | From Cloudinary dashboard                 |

### 4. Start the server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

---

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP (or `0.0.0.0/0` for dev)
4. Copy the connection string to `MONGO_URI` in `.env`

---

## Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** and copy your Cloud Name, API Key, and API Secret
3. Paste them into `.env`

Uploaded images are stored under `mini-social/posts/` in your Cloudinary media library.

---

## API Overview

See [API_DOCS.md](./API_DOCS.md) for the full reference with curl examples.

| Feature             | Endpoint                      |
|---------------------|-------------------------------|
| Sign Up             | POST /api/auth/signup         |
| Login               | POST /api/auth/login          |
| Create Post         | POST /api/posts               |
| Public Feed         | GET /api/posts?page=1&limit=10|
| Single Post         | GET /api/posts/:id            |
| Delete Post         | DELETE /api/posts/:id         |
| Like / Unlike       | POST /api/posts/:id/like      |
| Who Liked           | GET /api/posts/:id/likes      |
| Add Comment         | POST /api/posts/:id/comment   |
| All Comments        | GET /api/posts/:id/comments   |
| Delete Comment      | DELETE /api/posts/:id/comments/:commentId |

---

## Security Features

- **Helmet** — sets secure HTTP headers
- **CORS** — configurable allowed origins
- **Rate Limiting** — 100 req/15min globally; 20 req/15min on auth routes
- **JWT** — signed tokens with expiry
- **bcryptjs** — passwords hashed with salt rounds 12
- **Input Validation** — express-validator on all inputs
- **File Validation** — type + size checks on uploads (5MB max)
- **Mongoose Sanitization** — schema-level constraints

---

## Health Check

```bash
curl http://localhost:5000/health
```

```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```
