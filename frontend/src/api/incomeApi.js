// ============================================
// INCOME API — CRUD operations for incomes
// ============================================

// Import pre-configured axios instance (auto-adds JWT)
import api from './axios';

// CREATE — add new income
export const createIncome = async (income) => {
  // income = { title, amount, source, date }
  const res = await api.post('/incomes', income);   // POST to backend
  return res.data;                                   // Return parsed response
};

// READ ALL — get all incomes for current user
export const getIncomes = async () => {
  const res = await api.get('/incomes');             // GET
  return res.data.incomes;                           // Return array only
};

// UPDATE — change an existing income
export const updateIncome = async (id, income) => {
  const res = await api.put(`/incomes/${id}`, income); // PUT with id
  return res.data;
};

// DELETE — remove income by id
export const deleteIncome = async (id) => {
  const res = await api.delete(`/incomes/${id}`);    // DELETE
  return res.data;
};