// ============================================
// DASHBOARD — Stats + charts
// ============================================

// Import hooks for state + side effects
import { useEffect, useState } from 'react';

// Import navigation + auth
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import API helpers
import { getSummary, getCategories, getMonthly, getRecent } from '../api/reportApi';

// Import components
import StatCard from '../components/StatCard';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import RecentTransactions from '../components/RecentTransactions';

export default function Dashboard() {

  // Get user + logout from auth context
  const { user, logout } = useAuth();

  // Navigation
  const navigate = useNavigate();

  // -------- STATE --------
  // Summary data: { totalIncome, totalExpense, balance }
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  // Category breakdown array
  const [categories, setCategories] = useState([]);

  // Monthly trend array
  const [monthly, setMonthly] = useState([]);

  // Recent transactions array
  const [recent, setRecent] = useState([]);

  // Loading flag so we can show a spinner while fetching
  const [loading, setLoading] = useState(true);

  // -------- EFFECT: fetch dashboard data on mount --------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c, m, r] = await Promise.all([
          getSummary(),
          getCategories(),
          getMonthly(),
          getRecent(),
        ]);
        setSummary(s);
        setCategories(c);
        setMonthly(m);
        setRecent(r);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -------- RENDER --------
  return (
    <div className="page">
      {/* Greeting */}
      <div className="page-header">
        <h1>Hi, {user?.name} 👋</h1>
        <p className="subtitle">Here's your financial overview</p>
      </div>

      {loading ? (
        <p className="loading">Loading your dashboard...</p>
      ) : (
        <>
          {/* Stats row */}
          <section className="stats-row">
            <StatCard label="Total Income"  value={summary.totalIncome}  color="green"  icon="💰" />
            <StatCard label="Total Expense" value={summary.totalExpense} color="red"    icon="💸" />
            <StatCard label="Balance"       value={summary.balance}      color="indigo" icon="📊" />
          </section>

          {/* Charts row — 2 columns on wide screens */}
          <section className="charts-row two-cols">
            <CategoryChart data={categories} />
            <MonthlyChart data={monthly} />
          </section>

          {/* Recent transactions */}
          <section className="charts-row">
            <RecentTransactions data={recent} />
          </section>
        </>
      )}
    </div>
  );
}