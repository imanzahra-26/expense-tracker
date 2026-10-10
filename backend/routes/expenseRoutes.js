// ============================================
// EXPENSE ROUTES — CRUD
// ============================================

// SECTION 1: Imports
const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// SECTION 2: Apply auth to ALL routes in this file
// Any request without a valid JWT is rejected here.
router.use(authMiddleware);

// ============================================
// CREATE — POST /expenses
// ============================================
router.post('/', async (req, res) => {
  try {
    // Step 1: Get data from body
    const { title, amount, category, date } = req.body;

    // Step 2: Validate all fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 3: Validate amount is a positive number
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Step 4: Insert (user_id comes from the JWT, NOT from the body — security!)
    const [result] = await db.query(
      'INSERT INTO expenses (user_id, title, amount, category, date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, amount, category, date]
    );

    // Step 5: Fetch the newly created expense and return it
    const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Expense added',
      expense: rows[0]
    });
  } catch (err) {
    console.error('Create expense error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// READ ALL — GET /expenses
// ============================================
router.get('/', async (req, res) => {
  try {
    // Only fetch THIS user's expenses, newest first
    const [rows] = await db.query(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, id DESC',
      [req.user.id]
    );

    res.json({
      count: rows.length,
      expenses: rows
    });
  } catch (err) {
    console.error('Get expenses error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// READ ONE — GET /expenses/:id
// ============================================
router.get('/:id', async (req, res) => {
  try {
    // WHERE clause has BOTH id AND user_id — protects against ID guessing
    const [rows] = await db.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ expense: rows[0] });
  } catch (err) {
    console.error('Get expense error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// UPDATE — PUT /expenses/:id
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validate
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Update only if row belongs to this user
    const [result] = await db.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?',
      [title, amount, category, date, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Fetch the updated row
    const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Expense updated',
      expense: rows[0]
    });
  } catch (err) {
    console.error('Update expense error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// DELETE — DELETE /expenses/:id
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Delete expense error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// SECTION 3: Export
module.exports = router;