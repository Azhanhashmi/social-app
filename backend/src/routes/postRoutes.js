const express = require("express");
const router = express.Router();

const {
  createPost,
  getFeed,
  getSinglePost,
  deletePost,
  toggleLike,
  getPostLikes,
  addComment,
  getPostComments,
  deleteComment,
} = require("../controllers/postController");

const { protect } = require("../middleware/auth");
const { commentValidation } = require("../middleware/validators");
const upload = require("../middleware/upload");

// ── Feed & single post ──────────────────────────────────────────────────────
// GET /api/posts?page=1&limit=10
router.get("/", getFeed);

// GET /api/posts/:id
router.get("/:id", getSinglePost);

// POST /api/posts  (multipart/form-data with optional image)
router.post("/", protect, upload.single("image"), createPost);

// DELETE /api/posts/:id
router.delete("/:id", protect, deletePost);

// ── Likes ───────────────────────────────────────────────────────────────────
// POST /api/posts/:id/like
router.post("/:id/like", protect, toggleLike);

// GET /api/posts/:id/likes
router.get("/:id/likes", getPostLikes);

// ── Comments ────────────────────────────────────────────────────────────────
// POST /api/posts/:id/comment
router.post("/:id/comment", protect, commentValidation, addComment);

// GET /api/posts/:id/comments
router.get("/:id/comments", getPostComments);

// DELETE /api/posts/:id/comments/:commentId
router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;
