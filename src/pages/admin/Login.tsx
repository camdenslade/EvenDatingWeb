//********************************************************************
//
// AdminLogin Page
//
// Login page for admin dashboard. Requires Cognito email/password
// authentication. Redirects to dashboard on successful login.
//
//*******************************************************************

import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import GlobalBackground from '../../components/GlobalBackground';
import './Login.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if already logged in and is admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting login...');
      await login(email, password);
      console.log('Login successful, waiting for auth state...');
      // Don't navigate immediately - let the useEffect handle it after auth state updates
    } catch (err: unknown) {
      console.error('Login error:', err);
      let errorMessage = 'Invalid email or password';
      
      if (err instanceof Error) {
        // Use generic message for all auth failures to prevent account enumeration
        // Only show specific messages for non-security-related errors
        if (err.message.includes('auth/too-many-requests') || err.message.includes('too-many-requests')) {
          errorMessage = 'Too many failed attempts. Please try again later';
        } else if (err.message.includes('auth/network-request-failed') || err.message.includes('network-request-failed')) {
          errorMessage = 'Network error. Please check your connection';
        } else if (err.message.includes('Login failed: token missing')) {
          errorMessage = 'Login failed. Please try again';
        } else {
          // Generic message for all authentication failures
          errorMessage = 'Invalid email or password';
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Show loading if checking auth state
  if (authLoading) {
    return (
      <div className="admin-login">
        <GlobalBackground mode="dark" />
        <div className="admin-login-container">
          <div className="admin-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <GlobalBackground mode="dark" />
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>Admin Dashboard</h1>
          <p>Sign in to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="admin-login-error">{error}</div>}
          
          <div className="admin-login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          
          <div className="admin-login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="admin-login-button"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

