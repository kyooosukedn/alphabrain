import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import type { AuthState, LoginCredentials, RegisterCredentials, User, AuthResponse } from '../../types';
import axios from 'axios';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<User, LoginCredentials>(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      // Handle response format from our backend API
      if (response.data && response.data.access_token) {
        const authResponse = response.data as AuthResponse;
        // Store the JWT token
        localStorage.setItem('token', authResponse.access_token);
        
        // Extract user data from token or from response
        const userData: User = {
          id: authResponse.userId || 'unknown',
          username: authResponse.username || credentials.username,
          email: credentials.username, // Use username as email if not provided
        };
        
        return userData;
      } else {
        return rejectWithValue('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Extract the error message from the response
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Login failed');
      }
      return rejectWithValue('Network error or server unavailable');
    }
  }
);

export const register = createAsyncThunk<User, RegisterCredentials>(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      
      // Handle response format from our backend API
      if (response.data && response.data.access_token) {
        const authResponse = response.data as AuthResponse;
        // Store the JWT token
        localStorage.setItem('token', authResponse.access_token);
        
        // Extract user data from token or from response
        const userData: User = {
          id: authResponse.userId || 'unknown',
          username: authResponse.username || credentials.username,
          email: credentials.email,
        };
        
        return userData;
      } else {
        return rejectWithValue('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Extract the error message from the response
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Registration failed');
      }
      return rejectWithValue('Network error or server unavailable');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      try {
        authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
