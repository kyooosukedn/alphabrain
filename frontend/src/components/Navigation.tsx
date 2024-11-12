import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
  BookOpen, BarChart3, Calendar, Settings, Menu, X, 
  Sparkles, Target, User, Bell, ChevronRight
} from 'lucide-react';
import Dashboard from './Dashboard';
import ProgressPage from './progress/ProgressPage';
import Schedule from './Schedule';

// Define types
interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: () => void;
}

interface TabItem {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const mainNavItems: NavItem[] = [
  { icon: BookOpen, label: 'Dashboard', path: '/' },
  { icon: BarChart3, label: 'Progress', path: '/progress' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const NavButton: React.FC<NavButtonProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive, 
  isSidebarOpen,
  onClick 
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-violet-500/20 text-violet-300'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      <motion.div 
        className="relative"
        whileHover={{ rotate: isActive ? 0 : 10 }}
        animate={{ scale: isActive ? 1.1 : 1 }}
      >
        <Icon className="w-5 h-5" />
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-violet-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
      </motion.div>
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {isActive && isSidebarOpen && (
        <motion.div
          layoutId="activeTrail"
          className="ml-auto w-2 h-2 rounded-full bg-violet-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </motion.button>
  );
};

const BreadcrumbTrail: React.FC<{ path: string }> = ({ path }) => {
  const pathParts = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-2 text-sm text-white/50">
      <motion.span
        whileHover={{ color: 'rgba(255,255,255,0.9)' }}
        className="cursor-pointer"
      >
        Home
      </motion.span>
      {pathParts.map((part) => (
        <React.Fragment key={part}>
          <ChevronRight className="w-3 h-3" />
          <motion.span
            whileHover={{ color: 'rgba(255,255,255,0.9)' }}
            className="cursor-pointer capitalize"
          >
            {part}
          </motion.span>
        </React.Fragment>
      ))}
    </div>
  );
};

const NotificationBell: React.FC<{ count?: number }> = ({ count = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ rotate: isHovered ? [0, -15, 15, -10, 10, 0] : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Bell className="w-5 h-5 text-white/70" />
      </motion.div>
      
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"
        >
          <span className="text-xs text-white">{count}</span>
        </motion.div>
      )}
    </motion.button>
  );
};

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-violet-500 text-white'
              : 'text-white/70 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};

const Navigation: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'progress', label: 'Progress' },
    { id: 'schedule', label: 'Schedule' }
  ];

  return (
    <motion.div 
      className="flex min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
          {mainNavItems.map((item) => (
            <NavButton
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
              isSidebarOpen={isSidebarOpen}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div 
        className="fixed top-0 right-0 h-16 bg-white/5 backdrop-blur-xl border-b border-white/5"
        style={{ width: `calc(100% - ${isSidebarOpen ? '16rem' : '5rem'})` }}
      >
        <div className="flex items-center justify-between h-full px-6">
          <BreadcrumbTrail path={location.pathname} />
          
          <div className="flex items-center gap-6">
            <NotificationBell count={3} />
            {/* Profile Button */}
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
        <div className="mb-6">
          <TabBar 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/progress" element={<ProgressPage />} /> 
            <Route path="/schedule" element={<Schedule />}></Route>
        </Routes>
      </div>
    </motion.div>
  );
};

export default Navigation;