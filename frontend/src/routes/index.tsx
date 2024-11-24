import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '../components/layout/navigation/Navigation';
import Dashboard from '../components/Dashboard';
import ProgressPage from '../components/progress/ProgressPage';
import Schedule from '../components/Schedule';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute requireAuth={false}>
            <Signup />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigation />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}