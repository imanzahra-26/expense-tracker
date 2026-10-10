// ============================================
// APP — Routes
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Incomes from './pages/Incomes';             // NEW
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-container">{children}</div>
    </>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>
      } />
      <Route path="/incomes" element={
        <ProtectedRoute><Layout><Incomes /></Layout></ProtectedRoute>
      } />

      {/* Default + catch-all */}
      <Route path="/"  element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      <Route path="*"  element={<Navigate to="/" />} />
    </Routes>
  );
}