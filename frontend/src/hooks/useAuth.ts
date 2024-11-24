import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { login, logout, register } from '../store/slices/authSlice';
import type { LoginCredentials, RegisterCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await dispatch(login(credentials)).unwrap();
        navigate('/dashboard');
      } catch (error) {
        // Error is handled by the slice
        console.error('Login failed:', error);
      }
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        await dispatch(register(credentials)).unwrap();
        navigate('/dashboard');
      } catch (error) {
        // Error is handled by the slice
        console.error('Registration failed:', error);
      }
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};