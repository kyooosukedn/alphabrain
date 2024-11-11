import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Bell
} from 'lucide-react';
import Dashboard from './Dashboard';

const Navigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { icon: BookOpen, label: 'Study Sessions', path: '/sessions' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-violet-950/95 to-slate-900/95 backdrop-blur-lg transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } border-r border-white/5`}
      >
        {/* Logo Area */}
        <div className="flex items-center h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-violet-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            {isSidebarOpen && (
              <span className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text">
                StudyBuddy
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-white/70" />
            ) : (
              <Menu className="w-5 h-5 text-white/70" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="mt-8 px-3 space-y-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  {isActive && (
                    <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </div>
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 right-0 h-16 bg-white/5 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 transition-all duration-300"
           style={{ width: `calc(100% - ${isSidebarOpen ? '16rem' : '5rem'})` }}>
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-96 h-10 rounded-lg bg-white/5 border border-white/10 px-4 text-white/70 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm border border-white/20 px-1.5 rounded">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-white/70" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-500" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-violet-400 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            {isSidebarOpen && (
              <span className="text-sm font-medium text-white/70">John Doe</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? '16rem' : '5rem',
          marginTop: '4rem',
          padding: '2rem',
        }}
      >
        <Dashboard />
      </div>
    </div>
  );
};

export default Navigation;