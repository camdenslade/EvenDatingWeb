//********************************************************************
//
// AdminAuthContext
//
// Context for managing admin authentication state using backend-issued tokens.
// Cognito is used for authentication. Tokens are stored in localStorage.
//
//*******************************************************************

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApiBaseUrl, joinApiUrl } from '../utils/apiUrl';

interface AdminSession {
  email: string;
}

interface AdminAuthContextType {
  user: AdminSession | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'admin_token';
const EMAIL_KEY = 'admin_email';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

async function checkIsAdmin(token: string): Promise<boolean> {
  const apiBaseUrl = getApiBaseUrl();
  const url = joinApiUrl(apiBaseUrl, '/admin/admins');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.ok && response.status !== 403;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const email = localStorage.getItem(EMAIL_KEY);

    if (!token || !email) {
      setLoading(false);
      return;
    }

    checkIsAdmin(token)
      .then((allowed) => {
        setIsAdmin(allowed);
        setUser(allowed ? { email } : null);
      })
      .catch(() => {
        setIsAdmin(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const url = joinApiUrl(apiBaseUrl, '/admin/login');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const token = data.token;

    if (!token) {
      throw new Error('Login failed: token missing');
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EMAIL_KEY, email);
    setUser({ email });
    setIsAdmin(true);
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}

