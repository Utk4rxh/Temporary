// src/components/common/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Award,
  FileText,
  Cpu,
  CheckCircle2,
  Settings,
  LogOut,
  Sliders,
  Scale,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Switch role or navigate home
    switchRole();
    navigate('/');
  };

  const studentItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Apply Scholarship', path: '/student/apply', icon: Award },
    { name: 'Documents', path: '/student/documents', icon: FileText },
    { name: 'AI Score', path: '/student/explainability/app-001', icon: Cpu },
    { name: 'Results', path: '/student/result/app-001', icon: CheckCircle2 },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const adminItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Budget Simulator', path: '/admin/budget-simulator', icon: Sliders },
    { name: 'Fairness & Bias Audit', path: '/admin/fairness-dashboard', icon: Scale },
    { name: 'Board Settings', path: '/admin/settings', icon: Settings },
  ];

  const items = role === 'student' ? studentItems : adminItems;

  return (
    <aside className="w-64 glass-panel border-r border-blue-900/30 hidden md:flex flex-col justify-between min-h-[calc(100vh-5rem)] p-4">
      <div className="space-y-6">
        <div className="px-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
            {role === 'student' ? 'Student Workspace' : 'Board Governance'}
          </span>
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section in Sidebar: Logout */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="px-3">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>FERPA Encrypted Session</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Role / Logout</span>
        </button>
      </div>
    </aside>
  );
};
