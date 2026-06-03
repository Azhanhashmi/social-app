const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { signupValidation, loginValidation } = require("../middleware/validators");

// POST /api/auth/signup
router.post("/signup", signupValidation, signup);

// POST /api/auth/login
router.post("/login", loginValidation, login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

module.exports = router;
