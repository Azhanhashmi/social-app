const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");

/**
 * Protect routes — requires a valid JWT in the Authorization header.
 * Attaches the full user document to req.user on success.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return errorResponse(res, "Token has expired. Please log in again.", 401);
      }
      return errorResponse(res, "Invalid token.", 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, "User belonging to this token no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Authentication failed.", 401);
  }
};

/**
 * Optional auth — attaches user to req.user if a valid token is present,
 * but does NOT block the request if no token is provided.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // Ignore token errors for optional auth
  }
  next();
};

module.exports = { protect, optionalAuth };
