import { useState } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Loader, Info } from "lucide-react";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";

interface ErrorResponse {
  message: string | string[];
  statusCode?: number;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength(null);
      return;
    }
    
    if (password.length < 6) {
      setPasswordStrength('weak');
      return;
    }
    
    // Medium: at least 8 chars with a number
    const hasMediumStrength = password.length >= 8 && /\d/.test(password);
    
    // Strong: at least 8 chars with number, lowercase, uppercase, and special char
    const hasStrongStrength = 
      password.length >= 8 && 
      /\d/.test(password) && 
      /[a-z]/.test(password) && 
      /[A-Z]/.test(password) && 
      /[^a-zA-Z0-9]/.test(password);
    
    if (hasStrongStrength) {
      setPasswordStrength('strong');
    } else if (hasMediumStrength) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate the form
    if (!formData.username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with:", formData);
      
      // Make the request to register
      const response = await axiosInstance.post<RegisterResponse>("/api/auth/register", formData);
      
      console.log("Registration successful:", response.data);
      
      // If registration is successful, attempt to automatically log the user in
      try {
        const loginResponse = await axiosInstance.post("/api/auth/login", {
          username: formData.username,
          password: formData.password
        });
        
        if (loginResponse.data.token) {
          localStorage.setItem("token", loginResponse.data.token);
          console.log("Auto-login successful");
        }
      } catch (loginErr) {
        console.error("Auto-login failed after registration", loginErr);
        // Continue with success even if auto-login fails
      }
      
      setSuccess(true);
      setFormData({ username: "", email: "", password: "" });
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard after successful registration
      }, 1500); // Redirect with a delay for the success message to show
    } catch (err) {
      console.error("Registration error:", err);
      
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = "Signup failed";
      
      if (axiosError.response) {
        const errData = axiosError.response.data;
        
        // Handle different error formats
        if (errData.message) {
          if (Array.isArray(errData.message)) {
            errorMessage = errData.message.join(", ");
          } else {
            errorMessage = errData.message;
          }
        } else if (typeof errData === 'string') {
          errorMessage = errData;
        }
        
        // If the error is a network error, provide a more specific message
        if (axiosError.code === 'ECONNABORTED') {
          errorMessage = "Connection timed out. Please try again.";
        } else if (axiosError.response.status === 0) {
          errorMessage = "Unable to connect to the server. Please check your internet connection.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert
              variant="default"
              className="mb-4 border-green-500 bg-green-50 text-green-800 dark:border-green-300 dark:bg-green-900 dark:text-green-300"
            >
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertDescription>Signup successful! Redirecting to dashboard...</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
              
              {passwordStrength && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`} 
                      style={{ 
                        width: passwordStrength === 'weak' ? '33%' : 
                              passwordStrength === 'medium' ? '66%' : '100%' 
                      }}
                    />
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    {passwordStrength === 'weak' && "Weak - Add more characters"}
                    {passwordStrength === 'medium' && "Medium - Add special characters and uppercase letters"}
                    {passwordStrength === 'strong' && "Strong password"}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              variant={loading ? "outline" : "default"}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}