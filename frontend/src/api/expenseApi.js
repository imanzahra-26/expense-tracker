// ============================================
// EXPENSE API — CRUD operations for expenses
// ============================================

import api from './axios';

// CREATE — add new expense
export const createExpense = async (expense) => {
  // expense = { title, amount, category, date }
  const res = await api.post('/expenses', expense);
  return res.data;
};

// READ ALL — get all expenses for current user
export const getExpenses = async () => {
  const res = await api.get('/expenses');
  return res.data.expenses;
};

// UPDATE — change an existing expense
export const updateExpense = async (id, expense) => {
  const res = await api.put(`/expenses/${id}`, expense);
  return res.data;
};

// DELETE — remove an expense by id
export const deleteExpense = async (id) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};