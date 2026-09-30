import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Zap, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'manager':
        return { label: 'Manager', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'approver':
        return { label: 'Approver', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'employee':
      default:
        return { label: 'Employee', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <nav className="relative z-50 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent hidden sm:block">
              Smart Automation
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/tasks" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/tasks' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              My Tasks
            </Link>
            <Link 
              to="/approvals" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/approvals' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Approvals
            </Link>
            {user && ['admin', 'manager'].includes(user.role) && (
              <Link 
                to="/reports" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${location.pathname === '/reports' ? 'bg-slate-800 text-white' : 'text-purple-400/80 hover:text-purple-300 hover:bg-slate-800/50'}`}
              >
                Reports
              </Link>
            )}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="h-6 w-px bg-slate-700/50 mx-1"></div>

          <Link 
            to="/settings"
            className="hidden lg:flex flex-col text-right hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
            <span className="text-[11px] text-slate-400">{user?.department || 'Workspace Member'}</span>
          </Link>

          <span className={`hidden sm:inline-flex px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${roleBadge.color}`}>
            {roleBadge.label}
          </span>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
