import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Checking auth state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Checking token...");
    if (token) {
      console.log("Token found: User is logged in.");
      setIsCheckingAuth(false); // Stop checking once authenticated
    } else {
      console.log("No token found: Redirecting to /login...");
      navigate("/login", { replace: true }); // Redirect if not authenticated
    }
  }, [navigate]);

  if (isCheckingAuth) {
    console.log("Loading authentication check...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p> {/* Loading screen during auth check */}
      </div>
    );
  }

  return <>hello{children}</>; // Render the protected route once auth is verified
};

export default ProtectedRoute;