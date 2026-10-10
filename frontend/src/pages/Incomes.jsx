// ============================================
// INCOMES PAGE — Add, list, edit, delete incomes
// ============================================

// Hooks
import { useEffect, useState } from 'react';

// API helpers for incomes
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from '../api/incomeApi';

// Source options (like categories for expenses)
const SOURCES = [
  'Job',          // Regular salary
  'Freelance',    // Side gigs
  'Business',     // Business income
  'Investment',   // Stocks, dividends
  'Gift',         // Money received as gift
  'Other',        // Catch-all
];

// Initial empty form state
const EMPTY_FORM = {
  title: '',
  amount: '',
  source: 'Job',                                    // Default source
  date: new Date().toISOString().slice(0, 10),      // Today (YYYY-MM-DD)
};

export default function Incomes() {

  // -------- STATE --------
  const [incomes, setIncomes]     = useState([]);       // All incomes
  const [form, setForm]           = useState(EMPTY_FORM);// Form values
  const [editingId, setEditingId] = useState(null);     // null = adding
  const [error, setError]         = useState('');       // Error text
  const [loading, setLoading]     = useState(true);     // Fetching flag

  // -------- LOAD INCOMES ON MOUNT --------
  const loadIncomes = async () => {
    try {
      const data = await getIncomes();                  // Fetch from backend
      setIncomes(data);                                 // Store in state
    } catch (err) {
      console.error('Load incomes error:', err);
      setError('Failed to load incomes');
    } finally {
      setLoading(false);                                // Stop spinner
    }
  };

  useEffect(() => {
    loadIncomes();                                      // Run once
  }, []);

  // -------- FORM CHANGE --------
  const handleChange = (e) => {
    // Update only the field that changed
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------- SUBMIT (create OR update) --------
  const handleSubmit = async (e) => {
    e.preventDefault();                                 // Stop reload
    setError('');                                       // Clear old error

    try {
      if (editingId) {
        await updateIncome(editingId, form);            // Update mode
        setEditingId(null);                             // Exit edit mode
      } else {
        await createIncome(form);                       // Create mode
      }
      setForm(EMPTY_FORM);                              // Reset form
      await loadIncomes();                              // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  // -------- START EDITING --------
  const handleEdit = (income) => {
    setEditingId(income.id);                            // Enter edit mode
    setForm({
      title: income.title,
      amount: income.amount,
      source: income.source,
      date: income.date.slice(0, 10),                   // Trim ISO string
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });    // Scroll up
  };

  // -------- CANCEL EDIT --------
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // -------- DELETE --------
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income?')) return; // Confirm
    try {
      await deleteIncome(id);                           // API call
      await loadIncomes();                              // Refresh
    } catch (err) {
      setError('Delete failed');
    }
  };

  // -------- RENDER --------
  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">
        <h1>Incomes 💰</h1>
        <p className="subtitle">Track where your money comes from</p>
      </div>

      {/* Form card */}
      <div className="form-card">
        <h2>{editingId ? 'Edit Income' : 'Add New Income'}</h2>

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
              placeholder="e.g. Monthly Salary"
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

          {/* SOURCE dropdown */}
          <label>
            Source
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
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
              {editingId ? 'Update Income' : 'Add Income'}
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
        <h2>All Incomes ({incomes.length})</h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : incomes.length === 0 ? (
          <p className="empty">No incomes yet. Add your first one! 💪</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Source</th>
                <th>Date</th>
                <th className="right">Amount</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc) => (
                <tr key={inc.id}>
                  <td>{inc.title}</td>
                  <td><span className="pill pill-green">{inc.source}</span></td>
                  <td>{new Date(inc.date).toLocaleDateString()}</td>
                  <td className="right">Rs. {Number(inc.amount).toFixed(2)}</td>
                  <td className="right">
                    <button className="btn-edit" onClick={() => handleEdit(inc)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(inc.id)}>
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
