import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

// Temporarily bypass authentication
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAuth = true 
}) => {
  // For development, always render children
  return <>{children}</>;

  // TODO: Uncomment this when implementing authentication
  /*
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
  */
};

export default ProtectedRoute;