// ============================================
// REGISTER PAGE — New user signup form
// ============================================

// Import useState hook to store form data + error messages
import { useState } from 'react';

// Import Link (for navigation) and useNavigate (to redirect after success)
import { Link, useNavigate } from 'react-router-dom';

// Import our custom useAuth hook to access register() function
import { useAuth } from '../context/AuthContext';

// Define the Register component (default export)
export default function Register() {

  // Destructure register function + loading state from auth context
  const { register, loading } = useAuth();

  // useNavigate gives us a function to programmatically change routes
  const navigate = useNavigate();

  // State: form inputs (name, email, password) — starts empty
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // State: error message string — shows red box if API fails
  const [error, setError] = useState('');

  // Handler: runs on every keystroke in any input
  const handleChange = (e) => {
    // Update only the changed field (e.target.name) with new value
    // Spread (...form) keeps other fields unchanged
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler: runs when form is submitted
  const handleSubmit = async (e) => {
    // Prevent default browser form reload behavior
    e.preventDefault();

    // Clear previous errors before trying again
    setError('');

    // Call register() from context with the 3 form values
    const result = await register(form.name, form.email, form.password);

    // If register succeeded → redirect to dashboard
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Otherwise → show error message from backend
      setError(result.message);
    }
  };

  // Render the form
  return (
    // Outer wrapper — full-screen centered container
    <div className="auth-page">

      {/* Card container — white box with shadow */}
      <div className="auth-card">

        {/* Main heading */}
        <h1>Create Account 💜</h1>

        {/* Subtitle text */}
        <p className="subtitle">Start tracking your money today</p>

        {/* Conditional: show error box only if error exists */}
        {error && <div className="error-box">{error}</div>}

        {/* Form — on submit, calls handleSubmit */}
        <form onSubmit={handleSubmit}>

          {/* NAME field */}
          <label>
            Name
            <input
              type="text"                            // Text input
              name="name"                            // Matches form.name key
              value={form.name}                      // Controlled input
              onChange={handleChange}                // Update state on typing
              placeholder="Iman Zahra"               // Hint text
              required                               // HTML5 validation
            />
          </label>

          {/* EMAIL field */}
          <label>
            Email
            <input
              type="email"                           // Email input (browser validates format)
              name="email"                           // Matches form.email key
              value={form.email}                     // Controlled input
              onChange={handleChange}                // Update state on typing
              placeholder="you@example.com"          // Hint text
              required                               // Required
            />
          </label>

          {/* PASSWORD field */}
          <label>
            Password
            <input
              type="password"                        // Hides characters
              name="password"                        // Matches form.password key
              value={form.password}                  // Controlled input
              onChange={handleChange}                // Update state on typing
              placeholder="At least 6 characters"    // Hint text
              minLength={6}                          // HTML5 min length
              required                               // Required
            />
          </label>

          {/* Submit button — disabled while loading */}
          <button type="submit" disabled={loading}>
            {/* Change text based on loading state */}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {/* Bottom link to switch to login page */}
        <p className="switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}