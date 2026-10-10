// ============================================
// EXPENSE TRACKER — BACKEND SERVER
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const authRoutes    = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes  = require('./routes/incomeRoutes');
const reportRoutes  = require('./routes/reportRoutes');   // NEW

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: '🚀 Expense Tracker API is running' });
});

app.use('/auth',     authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/incomes',  incomeRoutes);
app.use('/reports',  reportRoutes);                       // NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});