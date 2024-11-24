import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { mainNavItems } from "@/config/navigation";

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-violet-950/95 to-slate-900/95 backdrop-blur-lg ${
        isSidebarOpen ? "w-64" : "w-20"
      } border-r border-white/5 transition-all duration-300`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-violet-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-semibold text-white">
              AlphaBrain
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

      {/* Navigation Items */}
      <div className="mt-8 px-3 space-y-2">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-violet-500/20 text-violet-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-8 px-3 w-full">
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
