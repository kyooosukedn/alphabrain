import axios from "axios";

// Development mode configuration
const isDev = import.meta.env.DEV;
const devMode = {
  // Set to true to bypass authentication in development
  bypassAuth: true,
  // Set to false to prevent using a mock token
  useMockToken: false,
  // Mock token for development testing
  mockToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
};

// For development testing only - set mock token if enabled
if (isDev && devMode.useMockToken && !localStorage.getItem('token')) {
  localStorage.setItem('token', devMode.mockToken);
  console.log('DEV MODE: Set mock token for testing');
}

// Get base URL from environment with fallback
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

// Log the API URL for debugging
console.log("API URL configured as:", API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Increase timeout for debugging
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // Important for CORS with credentials
});

// Add a request interceptor to include the authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't modify URLs anymore as we're using explicit paths
    // This was causing issues with auth endpoints
    
    // Log requests in development mode
    if (isDev) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log responses in development mode
    if (isDev) {
      console.log('API Response:', response);
    }
    return response;
  },
  (error) => {
    if (isDev) {
      console.error('API Error:', error.response || error);
    }

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Health check function to test backend connectivity
export const checkBackendHealth = async (): Promise<{isHealthy: boolean, message: string}> => {
  // Endpoints to try, in order of preference
  const healthEndpoints = [
    '/api/health',
    '/api/health/simple',
    '/api/health/system-health',
    '/api/auth/login'  // Even try the login endpoint as fallback
  ];
  
  // Try each endpoint with shorter timeout
  const healthInstance = axios.create({
    baseURL: API_URL,
    timeout: 3000  // Shorter timeout for health checks
  });
  
  // First, check if we can make a test request to any API endpoint
  try {
    // Make a HEAD request to sessions API (will return 401 if auth required, but means API is up)
    const testResponse = await healthInstance.head('/api/sessions');
    console.log('API is accessible via HEAD request to /api/sessions:', testResponse.status);
    return { 
      isHealthy: true, 
      message: "Backend API is accessible" 
    };
  } catch (headError: any) {
    // If we get a 401 (Unauthorized) or 403 (Forbidden), the API is still running
    if (headError.response && (headError.response.status === 401 || headError.response.status === 403)) {
      console.log('API is accessible (requires auth):', headError.response.status);
      return { 
        isHealthy: true, 
        message: "Backend API is accessible (authentication required)" 
      };
    }
    
    // Continue to try health endpoints
    console.log('HEAD request failed, trying dedicated health endpoints');
  }
  
  // Try each health endpoint
  for (const endpoint of healthEndpoints) {
    try {
      const response = await healthInstance.get(endpoint);
      console.log(`Health check succeeded on ${endpoint}:`, response.data);
      return { 
        isHealthy: true, 
        message: `Connected to backend server using ${endpoint}` 
      };
    } catch (error: any) {
      // Even a 401 Unauthorized on any endpoint means the server is running
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log(`API is accessible at ${endpoint} (requires auth):`, error.response.status);
        return { 
          isHealthy: true, 
          message: "Backend API is accessible (authentication required)" 
        };
      }
      console.warn(`Health check failed on ${endpoint}:`, error);
      // Continue to next endpoint
    }
  }
  
  // All endpoints failed
  return { 
    isHealthy: false, 
    message: "Could not connect to backend server on any health endpoint" 
  };
};

export default axiosInstance;