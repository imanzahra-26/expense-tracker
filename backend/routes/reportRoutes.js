// ============================================
// REPORT ROUTES — Aggregated Data for Dashboard
// ============================================

// SECTION 1: Imports
const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// SECTION 2: Protect ALL routes
router.use(authMiddleware);

// ============================================
// SUMMARY — GET /reports/summary
// Returns: totalIncome, totalExpense, balance
// ============================================
router.get('/summary', async (req, res) => {
  try {
    // Get total income
    const [incomeRows] = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM incomes WHERE user_id = ?',
      [req.user.id]
    );

    // Get total expenses
    const [expenseRows] = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ?',
      [req.user.id]
    );

    const totalIncome  = Number(incomeRows[0].total);    // Convert DECIMAL string → number
    const totalExpense = Number(expenseRows[0].total);
    const balance      = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance
    });
  } catch (err) {
    console.error('Summary error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// CATEGORY BREAKDOWN — GET /reports/categories
// Returns: array of { category, total } for expenses
// ============================================
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ?
       GROUP BY category
       ORDER BY total DESC`,
      [req.user.id]
    );

    // Convert DECIMAL strings to numbers
    const formatted = rows.map(r => ({
      category: r.category,
      total: Number(r.total)
    }));

    res.json({ categories: formatted });
  } catch (err) {
    console.error('Categories error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// MONTHLY TREND — GET /reports/monthly
// Returns: last 6 months, income vs expense per month
// ============================================
router.get('/monthly', async (req, res) => {
  try {
    // Combine income and expense totals grouped by month
    const [incomeRows] = await db.query(
      `SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
       FROM incomes
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY month
       ORDER BY month ASC`,
      [req.user.id]
    );

    const [expenseRows] = await db.query(
      `SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY month
       ORDER BY month ASC`,
      [req.user.id]
    );

    // Merge into a single object keyed by month
    const monthMap = {};

    incomeRows.forEach(r => {
      monthMap[r.month] = monthMap[r.month] || { month: r.month, income: 0, expense: 0 };
      monthMap[r.month].income = Number(r.total);
    });

    expenseRows.forEach(r => {
      monthMap[r.month] = monthMap[r.month] || { month: r.month, income: 0, expense: 0 };
      monthMap[r.month].expense = Number(r.total);
    });

    // Convert object → sorted array
    const months = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));

    res.json({ months });
  } catch (err) {
    console.error('Monthly error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// RECENT TRANSACTIONS — GET /reports/recent
// Returns: last 5 combined (income + expense) transactions
// ============================================
router.get('/recent', async (req, res) => {
  try {
    // UNION puts income + expense rows in one list
    const [rows] = await db.query(
      `(SELECT id, 'income' AS type, title, amount, source AS category, date
        FROM incomes WHERE user_id = ?)
       UNION ALL
       (SELECT id, 'expense' AS type, title, amount, category, date
        FROM expenses WHERE user_id = ?)
       ORDER BY date DESC, id DESC
       LIMIT 5`,
      [req.user.id, req.user.id]
    );

    // Convert DECIMAL to number
    const formatted = rows.map(r => ({
      ...r,
      amount: Number(r.amount)
    }));

    res.json({ recent: formatted });
  } catch (err) {
    console.error('Recent error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// SECTION 3: Export
module.exports = router;