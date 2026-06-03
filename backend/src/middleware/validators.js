const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/response");

/**
 * Run after validation chains — if errors exist, respond with 400.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return errorResponse(res, messages[0], 400);
  }
  next();
};

// ── Auth Validators ──────────────────────────────────────────────────────────

const signupValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3–30 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  validate,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  validate,
];

// ── Post Validators ──────────────────────────────────────────────────────────

const commentValidation = [
  body("text")
    .trim()
    .notEmpty().withMessage("Comment text is required")
    .isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),

  validate,
];

module.exports = {
  signupValidation,
  loginValidation,
  commentValidation,
};
