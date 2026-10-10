// ============================================
// AUTH MIDDLEWARE — JWT Verification
// ============================================

// SECTION 1: Imports
const jwt = require('jsonwebtoken');          // Token verification library
require('dotenv').config();                   // Load JWT_SECRET

// SECTION 2: Middleware function
// Runs BEFORE the actual route handler on protected routes.
const authMiddleware = (req, res, next) => {
  // Step 1: Get the Authorization header
  const authHeader = req.headers.authorization;  // Format: "Bearer <token>"

  // Step 2: Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Step 3: Extract the token part (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  // Step 4: Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Throws if invalid
    req.user = decoded;   // Attach user info (id, email) to request
    next();               // Continue to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// SECTION 5: Export
module.exports = authMiddleware;