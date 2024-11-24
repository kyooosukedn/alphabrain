export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  userId: string;
}

export interface Progress {
  id: string;
  metric: string;
  value: number;
  timestamp: Date;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
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
  sessions: Session[];
  currentSession: Session | null;
  loading: boolean;
  error: string | null;
}

export interface ProgressState {
  metrics: Progress[];
  loading: boolean;
  error: string | null;
}