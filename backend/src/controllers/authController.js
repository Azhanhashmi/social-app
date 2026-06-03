const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return errorResponse(res, `${field} is already taken.`, 409);
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      },
      "Account created successfully.",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    const token = generateToken(user._id);

    return successResponse(res, {
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    }, "Login successful.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe };
