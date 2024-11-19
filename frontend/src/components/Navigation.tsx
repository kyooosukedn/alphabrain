import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
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
import Dashboard from "./Dashboard";
import ProgressPage from "./progress/ProgressPage";
import Schedule from "./Schedule";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProtectedRoute from "./ProtectedRoute";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="*"
        element={
          <motion.div className="flex min-h-screen">
            {/* Sidebar */}
            <div
              className={`fixed left-0 top-0 h-full bg-gradient-to-b from-violet-950/95 to-slate-900/95 backdrop-blur-lg ${
                isSidebarOpen ? "w-64" : "w-20"
              } border-r border-white/5 transition-all duration-300`}
            >
              <div className="flex items-center h-16 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-violet-400 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {isSidebarOpen && (
                    <span className="text-lg font-semibold text-white">
                      StudyBuddy
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="ml-auto p-2 hover:bg-white/5 rounded-lg"
                >
                  {isSidebarOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              <div className="mt-8 px-3 space-y-2">
                {mainNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                      location.pathname === item.path
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-white/70 hover:bg-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  {isSidebarOpen && <span>Logout</span>}
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div
              className={`flex-1 transition-all duration-300 ${
                isSidebarOpen ? "ml-64" : "ml-20"
              }`}
            >
              <Routes>
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
              </Routes>
            </div>
          </motion.div>
        }
      />
    </Routes>
  );
};

export default Navigation;