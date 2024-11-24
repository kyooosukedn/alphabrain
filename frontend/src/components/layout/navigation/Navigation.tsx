import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Routes, Route, Navigate, Outlet } from "react-router-dom";
import {
  BookOpen,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  X,
  Sparkles,
  Target,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Dashboard from "../../Dashboard";
import ProgressPage from "./../../progress/ProgressPage";
import Schedule from "./../../Schedule";
import Login from "./../../auth/Login";
import Signup from "./../../auth/Signup";
import ProtectedRoute from "./../../ProtectedRoute";
import { Sidebar } from "./Sidebar";

// Define types
interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { icon: BookOpen, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        element={
          <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="pl-64 min-h-screen">
              <Outlet />
            </main>
          </div>
        }
      >
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default Navigation;