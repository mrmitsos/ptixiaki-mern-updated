import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };

/* 

import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Middleware to protect routes by verifying JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT token from cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the token (excluding the password field)
      req.user = await User.findById(decoded.userId).select("-password");

      // Proceed to the next middleware/route handler
      next();
    } catch (error) {
      // If token verification fails
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    // If no token is found in the cookies
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware to check if the authenticated user is an admin
const admin = (req, res, next) => {
  //console.log("User from protect middleware:", req.user);
  //console.log("Token:", token);
  // Check if user exists and has admin privileges
  if (req.user && req.user.isAdmin) {
    next(); // User is admin, proceed
  } else {
    res.status(401); // Unauthorized access
    throw new Error("Not authorized as admin");
  }
};

// Export middleware functions
export { admin, protect };

*/
