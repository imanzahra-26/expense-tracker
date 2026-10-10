// ============================================
// REPORT API — Fetch dashboard data from backend
// ============================================

// Import our pre-configured axios instance (adds JWT automatically)
import api from './axios';

// Get summary: total income, total expense, balance
export const getSummary = async () => {
  // GET /reports/summary — returns { totalIncome, totalExpense, balance }
  const res = await api.get('/reports/summary');
  // Return only the data part
  return res.data;
};

// Get category breakdown for the pie chart
export const getCategories = async () => {
  // GET /reports/categories — returns { categories: [{category, total}, ...] }
  const res = await api.get('/reports/categories');
  // Return the array directly
  return res.data.categories;
};

// Get monthly trend for the line chart
export const getMonthly = async () => {
  // GET /reports/monthly — returns { months: [{month, income, expense}, ...] }
  const res = await api.get('/reports/monthly');
  // Return the array
  return res.data.months;
};

// Get recent transactions (income + expense mixed)
export const getRecent = async () => {
  // GET /reports/recent — returns { recent: [...] }
  const res = await api.get('/reports/recent');
  // Return the array
  return res.data.recent;
};