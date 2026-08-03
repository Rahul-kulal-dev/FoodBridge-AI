import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Restricts access to portal routes unless user is logged in with valid token/user in localStorage.
 * Optionally checks user role authorization.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  // If not authenticated, redirect to landing page
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // If role enforcement is enabled, verify user role matches
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = user.user_role || user.role || 'donor';
    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
