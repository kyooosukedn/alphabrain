import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import type { ApiResponse, LoginCredentials, RegisterCredentials, User, Session, Progress } from '../types';

// Create axios instance with default config
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Axios interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    queryClient.clear();
  },
};

// Sessions API
export const sessionsApi = {
  getSessions: async (): Promise<ApiResponse<Session[]>> => {
    const response = await api.get<ApiResponse<Session[]>>('/sessions');
    return response.data;
  },

  createSession: async (session: Omit<Session, 'id'>): Promise<ApiResponse<Session>> => {
    const response = await api.post<ApiResponse<Session>>('/sessions', session);
    return response.data;
  },

  updateSession: async (id: string, session: Partial<Session>): Promise<ApiResponse<Session>> => {
    const response = await api.put<ApiResponse<Session>>(`/sessions/${id}`, session);
    return response.data;
  },

  deleteSession: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/sessions/${id}`);
    return response.data;
  },
};

// Progress API
export const progressApi = {
  getProgress: async (): Promise<ApiResponse<Progress[]>> => {
    const response = await api.get<ApiResponse<Progress[]>>('/progress');
    return response.data;
  },

  addProgress: async (progress: Omit<Progress, 'id'>): Promise<ApiResponse<Progress>> => {
    const response = await api.post<ApiResponse<Progress>>('/progress', progress);
    return response.data;
  },
};

// Export default api instance
export default api;