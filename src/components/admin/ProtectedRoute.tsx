//********************************************************************
//
// ProtectedRoute Component
//
// Route wrapper that requires admin authentication. Redirects to
// login if user is not authenticated or not an admin.
//
//*******************************************************************

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAdminAuth();

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

