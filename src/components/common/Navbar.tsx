// src/components/common/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Menu,
  X,
  UserCheck,
  ChevronRight,
  Lock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, switchRole, userName, userAvatar } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const publicNavLinks = [
    { name: 'Home Overview', path: '/' },
    { name: 'AI Ethics & Audit', path: '/about' },
    { name: 'Appeals & Support', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-blue-900/30 backdrop-blur-xl">
      {/* Top Government Official Protocol Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-1.5 px-4 sm:px-8 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Official Higher Education AI Allocation Protocol • Department of Educational Equity</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit FERPA Encrypted
          </span>
          <span>•</span>
          <span>IEEE Ethics Standard v3.4</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Government + AI Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-700 p-0.5 shadow-md group-hover:bg-blue-600 transition-colors">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit']">
                Alloc<span className="text-blue-400">AI</span>
              </span>
              <span className="block text-[9px] tracking-widest text-slate-400 uppercase font-semibold">
                Scholarship System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {publicNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-4 w-px bg-slate-800 mx-2" />

            {/* Portal Navigation based on active role */}
            <Link
              to={role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>{role === 'student' ? 'Student Portal' : 'Admin Control Board'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Persona Switcher & Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={switchRole}
              title="Click to toggle user view role (Student / Board Admin)"
              className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center space-x-1.5 transition-all ${
                role === 'admin'
                  ? 'bg-purple-950/80 border-purple-500/50 text-purple-200'
                  : 'bg-blue-950/80 border-blue-500/50 text-blue-200'
              }`}
            >
              {role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  <span>Admin Board</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3 text-blue-400" />
                  <span>Student View</span>
                </>
              )}
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/30"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-white leading-tight">{userName}</div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">{role}</div>
              </div>
            </div>
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={switchRole}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-900/50 text-blue-300 border border-blue-500/30"
            >
              {role === 'admin' ? 'Admin' : 'Student'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Navigation</div>
          {[...publicNavLinks, { name: role === 'student' ? 'Student Portal' : 'Admin Board', path: role === 'student' ? '/student/dashboard' : '/admin/dashboard' }].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive(link.path) ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
