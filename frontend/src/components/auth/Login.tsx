import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Loader, Coffee, LampDesk, Brain, Bug } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';

interface LoginResponse {
  token: string;
  message: string;
}

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const navigate = useNavigate();

  // Check if the backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axiosInstance.get("/api/health");
        console.log("Backend health check:", response.data);
      } catch (err) {
        console.error("Backend health check failed:", err);
        setError("Backend server is not available. Please try again later.");
      }
    };
    
    checkBackend();
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post<LoginResponse>('/api/auth/login', formData);
      console.log("Login successful:", response.data);
      
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError("Login failed: Invalid response from server");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Login failed. Please check your credentials.");
      } else if (err && typeof err === 'object' && 'request' in err) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug function to check users
  const debugCheckUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/auth/debug/users");
      console.log("Users debug info:", response.data);
      setDebugInfo(response.data);
      setError(null);
    } catch (err) {
      console.error("Debug check failed:", err);
      const axiosError = err as AxiosError;
      setError(`Debug failed: ${axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

  // For development, provide default login option
  const handleDevLogin = () => {
    setFormData({ username: "user", password: "password" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-900/20 to-indigo-900/20">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your AlphaBrain account
          </p>
        </div>
        
            {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Login successful. Redirecting to dashboard...</AlertDescription>
              </Alert>
            )}
            
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                type="text"
                required
                  value={formData.username}
                  onChange={handleChange}
                className="mt-1"
                placeholder="Enter your username"
                />
              </div>
            <div>
                <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                name="password"
                  type="password"
                required
                  value={formData.password}
                  onChange={handleChange}
                className="mt-1"
                placeholder="Enter your password"
                />
            </div>
              </div>
              
          <div>
              <Button
                type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                  </>
                ) : (
                "Sign in"
                )}
              </Button>
              </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </p>
            </div>
            
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 text-center border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Development Options</p>
              <Button 
                type="button" 
                variant="outline" 
                className="text-xs px-2 py-1 h-auto"
                onClick={handleDevLogin}
              >
                <Coffee className="mr-2 h-4 w-4" />
                Use Test Account
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}