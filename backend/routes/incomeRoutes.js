// ============================================
// INCOME ROUTES — CRUD
// ============================================

// SECTION 1: Imports
const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// SECTION 2: Protect ALL routes with JWT
router.use(authMiddleware);

// ============================================
// CREATE — POST /incomes
// ============================================
router.post('/', async (req, res) => {
  try {
    const { title, amount, source, date } = req.body;

    // Validation
    if (!title || !amount || !source || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Insert (user_id from JWT — NOT from body)
    const [result] = await db.query(
      'INSERT INTO incomes (user_id, title, amount, source, date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, amount, source, date]
    );

    const [rows] = await db.query('SELECT * FROM incomes WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Income added',
      income: rows[0]
    });
  } catch (err) {
    console.error('Create income error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// READ ALL — GET /incomes
// ============================================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC, id DESC',
      [req.user.id]
    );

    res.json({
      count: rows.length,
      incomes: rows
    });
  } catch (err) {
    console.error('Get incomes error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// READ ONE — GET /incomes/:id
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM incomes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ income: rows[0] });
  } catch (err) {
    console.error('Get income error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// UPDATE — PUT /incomes/:id
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, source, date } = req.body;

    if (!title || !amount || !source || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const [result] = await db.query(
      'UPDATE incomes SET title = ?, amount = ?, source = ?, date = ? WHERE id = ? AND user_id = ?',
      [title, amount, source, date, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    const [rows] = await db.query('SELECT * FROM incomes WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Income updated',
      income: rows[0]
    });
  } catch (err) {
    console.error('Update income error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// DELETE — DELETE /incomes/:id
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM incomes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ message: 'Income deleted' });
  } catch (err) {
    console.error('Delete income error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// SECTION 3: Export
module.exports = router;