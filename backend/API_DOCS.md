# Mini Social App — API Documentation

Base URL: `http://localhost:5000/api`

---

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@gmail.com",
    "password": "password123"
  }'
```

**Response 201:**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64abc123...",
      "username": "john_doe",
      "email": "john@gmail.com",
      "profileImage": "",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com",
    "password": "password123"
  }'
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64abc123...",
      "username": "john_doe",
      "email": "john@gmail.com",
      "profileImage": "",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

---

### 3. Get Current User
**GET** `/api/auth/me` 🔒

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Post Endpoints

### 4. Create Post — Text Only
**POST** `/api/posts` 🔒

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <token>" \
  -F "text=Hello world! This is my first post."
```

---

### 5. Create Post — Image Only
**POST** `/api/posts` 🔒

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/photo.jpg"
```

---

### 6. Create Post — Text + Image
**POST** `/api/posts` 🔒

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <token>" \
  -F "text=Check out this photo!" \
  -F "image=@/path/to/photo.jpg"
```

**Response 201:**
```json
{
  "success": true,
  "message": "Post created successfully.",
  "data": {
    "post": {
      "_id": "64def456...",
      "author": {
        "_id": "64abc123...",
        "username": "john_doe",
        "profileImage": ""
      },
      "text": "Check out this photo!",
      "image": "https://res.cloudinary.com/your-cloud/image/upload/...",
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-15T10:05:00.000Z"
    }
  }
}
```

---

### 7. Get Feed (Paginated)
**GET** `/api/posts?page=1&limit=10`

```bash
curl "http://localhost:5000/api/posts?page=1&limit=10"
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "64def456...",
        "text": "Hello world!",
        "image": "",
        "author": { "_id": "...", "username": "john_doe", "profileImage": "" },
        "likesCount": 5,
        "commentsCount": 2,
        "createdAt": "2024-01-15T10:05:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 8. Get Single Post
**GET** `/api/posts/:id`

```bash
curl http://localhost:5000/api/posts/64def456abc
```

---

### 9. Delete Post
**DELETE** `/api/posts/:id` 🔒

```bash
curl -X DELETE http://localhost:5000/api/posts/64def456abc \
  -H "Authorization: Bearer <token>"
```

---

## Like Endpoints

### 10. Toggle Like (Like / Unlike)
**POST** `/api/posts/:id/like` 🔒

```bash
curl -X POST http://localhost:5000/api/posts/64def456abc/like \
  -H "Authorization: Bearer <token>"
```

**Response 200:**
```json
{
  "success": true,
  "message": "Post liked.",
  "data": {
    "liked": true,
    "likesCount": 6
  }
}
```

---

### 11. Get Users Who Liked
**GET** `/api/posts/:id/likes`

```bash
curl http://localhost:5000/api/posts/64def456abc/likes
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "likesCount": 6,
    "users": [
      { "_id": "...", "username": "jane_doe", "profileImage": "" }
    ]
  }
}
```

---

## Comment Endpoints

### 12. Add Comment
**POST** `/api/posts/:id/comment` 🔒

```bash
curl -X POST http://localhost:5000/api/posts/64def456abc/comment \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great post!"}'
```

**Response 201:**
```json
{
  "success": true,
  "message": "Comment added.",
  "data": {
    "comment": {
      "_id": "64ghi789...",
      "user": "64abc123...",
      "username": "john_doe",
      "text": "Great post!",
      "createdAt": "2024-01-15T10:10:00.000Z"
    },
    "commentsCount": 3
  }
}
```

---

### 13. Get All Comments
**GET** `/api/posts/:id/comments`

```bash
curl http://localhost:5000/api/posts/64def456abc/comments
```

---

### 14. Delete Comment
**DELETE** `/api/posts/:id/comments/:commentId` 🔒

```bash
curl -X DELETE http://localhost:5000/api/posts/64def456abc/comments/64ghi789xyz \
  -H "Authorization: Bearer <token>"
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Descriptive error message here."
}
```

---

## HTTP Status Codes

| Code | Meaning                  |
|------|--------------------------|
| 200  | OK                       |
| 201  | Created                  |
| 400  | Bad Request              |
| 401  | Unauthorized             |
| 403  | Forbidden                |
| 404  | Not Found                |
| 409  | Conflict (duplicate)     |
| 429  | Too Many Requests        |
| 500  | Internal Server Error    |

---

## 🔒 Protected Routes Summary

| Method | Endpoint                             | Auth Required |
|--------|--------------------------------------|---------------|
| POST   | /api/auth/signup                     | ❌            |
| POST   | /api/auth/login                      | ❌            |
| GET    | /api/auth/me                         | ✅            |
| GET    | /api/posts                           | ❌            |
| GET    | /api/posts/:id                       | ❌            |
| POST   | /api/posts                           | ✅            |
| DELETE | /api/posts/:id                       | ✅            |
| POST   | /api/posts/:id/like                  | ✅            |
| GET    | /api/posts/:id/likes                 | ❌            |
| POST   | /api/posts/:id/comment               | ✅            |
| GET    | /api/posts/:id/comments              | ❌            |
| DELETE | /api/posts/:id/comments/:commentId   | ✅            |
