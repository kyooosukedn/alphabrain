import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// Import development configuration
const isDev = import.meta.env.DEV;
const bypassAuthInDev = false; // Set to true to bypass auth checks in development

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAuth = true 
}) => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Function to check if token is valid and not expired
    const validateToken = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsTokenValid(false);
        return;
      }
      
      try {
        // Check if token is expired
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        
        if (Date.now() >= expirationTime) {
          console.log('Token expired, redirecting to login');
          localStorage.removeItem('token');
          setIsTokenValid(false);
          return;
        }
        
        setIsTokenValid(true);
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        setIsTokenValid(false);
      }
    };
    
    validateToken();
    
    // Set up a timer to check token validity periodically
    const interval = setInterval(validateToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [navigate]);

  // Wait until token validation is complete
  if (isTokenValid === null) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }

  // For development, optionally bypass authentication
  if (isDev && bypassAuthInDev) {
    console.log('DEV MODE: Bypassing authentication check');
    return <>{children}</>;
  }

  if (requireAuth && !isTokenValid) {
    console.log('Not authenticated or token invalid, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isTokenValid) {
    console.log('Already authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;