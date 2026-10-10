// ============================================
// LOGIN PAGE — Existing user sign in
// ============================================

// Import useState for form state
import { useState } from 'react';

// Import navigation helpers from react-router
import { Link, useNavigate } from 'react-router-dom';

// Import auth hook for login() function
import { useAuth } from '../context/AuthContext';

// Login component (default export)
export default function Login() {

  // Get login + loading from auth context
  const { login, loading } = useAuth();

  // Navigation function to redirect after login
  const navigate = useNavigate();

  // Form state — only email + password for login
  const [form, setForm] = useState({ email: '', password: '' });

  // Error message state
  const [error, setError] = useState('');

  // Keystroke handler for both inputs
  const handleChange = (e) => {
    // Update the changed field only
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    // Stop page reload
    e.preventDefault();

    // Clear old error
    setError('');

    // Try login
    const result = await login(form.email, form.password);

    // On success → dashboard
    if (result.success) {
      navigate('/dashboard');
    } else {
      // On fail → show error
      setError(result.message);
    }
  };

  // Render
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back 💜</h1>
        <p className="subtitle">Log in to your account</p>

        {/* Error box (only if error exists) */}
        {error && <div className="error-box">{error}</div>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <label>
            Email
            <input
              type="email"                       // Browser validates email format
              name="email"                       // Maps to form.email
              value={form.email}                 // Controlled
              onChange={handleChange}            // Updates state
              placeholder="you@example.com"      // Placeholder
              required                           // Required
            />
          </label>

          {/* PASSWORD */}
          <label>
            Password
            <input
              type="password"                    // Hidden characters
              name="password"                    // Maps to form.password
              value={form.password}              // Controlled
              onChange={handleChange}            // Updates state
              placeholder="Your password"        // Placeholder
              required                           // Required
            />
          </label>

          {/* Submit button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Link to register page */}
        <p className="switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}