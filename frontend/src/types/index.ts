export interface User {
  id: string;
  username?: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Progress {
  id: string;
  metric: string;
  value: number;
  timestamp: Date;
  userId: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  userId?: string;
  username?: string;
  message?: string;
  success?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Redux store types
export interface RootState {
  auth: AuthState;
  sessions: SessionsState;
  progress: ProgressState;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface SessionsState {
  sessions: import('./session').Session[];
  currentSession: import('./session').Session | null;
  loading: boolean;
  error: string | null;
}

export interface ProgressState {
  metrics: Progress[];
  loading: boolean;
  error: string | null;
}