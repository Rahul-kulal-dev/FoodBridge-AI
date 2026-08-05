import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Restricts access to portal routes unless user is logged in with valid token/user in AuthContext.
 * Optionally checks user role authorization.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect based on portal type
  if (!token || !user) {
    if (allowedRoles && allowedRoles.includes('admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If role enforcement is enabled, verify user role matches
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = user.user_role || user.role || 'donor';
    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      if (allowedRoles.includes('admin')) {
        return <Navigate to="/admin/login" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
