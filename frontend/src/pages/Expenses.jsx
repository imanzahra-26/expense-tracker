// ============================================
// EXPENSES PAGE — Add, list, edit, delete expenses
// ============================================

// Hooks
import { useEffect, useState } from 'react';

// API helpers
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../api/expenseApi';

// Constants
const CATEGORIES = [
  'Food',
  'Bills',
  'Travel',
  'Entertainment',
  'Shopping',
  'Health',
  'Other',
];

// Initial empty form state
const EMPTY_FORM = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10), // Today in YYYY-MM-DD
};

export default function Expenses() {

  // -------- STATE --------
  const [expenses, setExpenses] = useState([]);       // All expenses
  const [form, setForm] = useState(EMPTY_FORM);        // Current form values
  const [editingId, setEditingId] = useState(null);    // null = adding, id = editing
  const [error, setError] = useState('');              // Error message
  const [loading, setLoading] = useState(true);        // Fetching?

  // -------- LOAD EXPENSES ON MOUNT --------
  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Load expenses error:', err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // -------- FORM CHANGE --------
  const handleChange = (e) => {
    // Update only the field that changed
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------- SUBMIT (create OR update) --------
  const handleSubmit = async (e) => {
    e.preventDefault();                // Stop page reload
    setError('');                      // Clear previous errors

    try {
      if (editingId) {
        // UPDATE existing
        await updateExpense(editingId, form);
        setEditingId(null);            // Exit edit mode
      } else {
        // CREATE new
        await createExpense(form);
      }

      setForm(EMPTY_FORM);             // Reset form
      await loadExpenses();            // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  // -------- START EDITING --------
  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10), // Trim ISO string to YYYY-MM-DD
    });
    // Scroll to top so user sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------- CANCEL EDIT --------
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // -------- DELETE --------
  const handleDelete = async (id) => {
    // Confirm before deleting
    if (!window.confirm('Delete this expense?')) return;

    try {
      await deleteExpense(id);
      await loadExpenses();            // Refresh
    } catch (err) {
      setError('Delete failed');
    }
  };

  // -------- RENDER --------
  return (
    <div className="page">

      {/* Page header */}
      <div className="page-header">
        <h1>Expenses 💸</h1>
        <p className="subtitle">Track where your money goes</p>
      </div>

      {/* Form card */}
      <div className="form-card">

        {/* Form title (changes with mode) */}
        <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>

        {/* Error box */}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Groceries"
              required
            />
          </label>

          {/* AMOUNT */}
          <label>
            Amount (Rs.)
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </label>

          {/* CATEGORY dropdown */}
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {/* DATE */}
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit">
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List card */}
      <div className="list-card">
        <h2>All Expenses ({expenses.length})</h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="empty">No expenses yet. Add your first one! 💪</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th className="right">Amount</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td><span className="pill">{exp.category}</span></td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="right">Rs. {Number(exp.amount).toFixed(2)}</td>
                  <td className="right">
                    <button className="btn-edit" onClick={() => handleEdit(exp)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(exp.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}