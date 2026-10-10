// ============================================
// NAVBAR — Top navigation with links + logout
// ============================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {

  // Get current URL to highlight active link
  const location = useLocation();

  // For logout redirect
  const navigate = useNavigate();

  // User + logout from context
  const { user, logout } = useAuth();

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper: is this route active?
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">

      {/* Brand */}
      <Link to="/dashboard" className="brand">
        💜 ExpenseTracker
      </Link>

      {/* Links */}
      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/expenses" className={isActive('/expenses') ? 'active' : ''}>
          Expenses
        </Link>
        <Link to="/incomes" className={isActive('/incomes') ? 'active' : ''}>
          Incomes
        </Link>
      </div>

      {/* Right side: user name + logout */}
      <div className="nav-right">
        <span className="nav-user">{user?.name}</span>
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
      </div>
    </nav>
  );
}