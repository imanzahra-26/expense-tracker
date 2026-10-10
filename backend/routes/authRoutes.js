// ============================================
// AUTH ROUTES — Register / Login / Me
// ============================================

// SECTION 1: Imports
const express = require('express');           // Router
const bcrypt = require('bcrypt');             // Password hashing
const jwt = require('jsonwebtoken');          // Token creation
const db = require('../config/db');           // MySQL pool
const authMiddleware = require('../middleware/auth'); // Protect routes

const router = express.Router();              // Create router instance

// ============================================
// ROUTE 1: REGISTER — POST /auth/register
// ============================================
router.post('/register', async (req, res) => {
  try {
    // Step 1: Get data from request body
    const { name, email, password } = req.body;

    // Step 2: Validate — all fields required
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 3: Check password length (basic security)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Step 4: Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Step 5: Hash the password (10 = salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 6: Insert user into DB
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Step 7: Create JWT for immediate login
    const token = jwt.sign(
      { id: result.insertId, email },             // payload
      process.env.JWT_SECRET,                     // secret
      { expiresIn: process.env.JWT_EXPIRES_IN }   // 7d
    );

    // Step 8: Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, name, email }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// ROUTE 2: LOGIN — POST /auth/login
// ============================================
router.post('/login', async (req, res) => {
  try {
    // Step 1: Get credentials
    const { email, password } = req.body;

    // Step 2: Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Step 3: Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Step 4: Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 5: Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Step 6: Send response
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// ROUTE 3: ME — GET /auth/me (PROTECTED)
// ============================================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (err) {
    console.error('Me error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// SECTION 4: Export router
module.exports = router;