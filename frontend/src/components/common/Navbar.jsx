import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wind, Menu, X, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF9F6]/80 dark:bg-slate-950/80 border-b border-[#E5E7EB]/50 dark:border-slate-800/60 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8.5 h-8.5 rounded-2xl bg-[#6B8E7A] flex items-center justify-center text-white shadow-soft transition-transform duration-300 group-hover:scale-[1.05]">
            <Wind size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#2F3A3F] dark:text-slate-100">
            Unwind
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <a href="#features" className="text-sm font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] dark:hover:text-emerald-400 transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] dark:hover:text-emerald-400 transition-colors">
            About
          </a>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-sm font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] dark:hover:text-emerald-400 transition-colors">
                Dashboard
              </Link>
              <Link to="/insights" className="text-sm font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] dark:hover:text-emerald-400 transition-colors">
                Insights
              </Link>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1.5 text-xs bg-white border border-[#E5E7EB] text-[#2F3A3F] px-3.5 py-1.5 rounded-2xl font-bold transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-soft"
                type="button"
              >
                <User size={12} className="text-[#6B8E7A]" />
                {user?.displayName || user?.fullName || user?.email}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-premium py-2.5 z-50 text-left animate-fade-in select-none">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-300 hover:bg-[#FAF9F6] dark:hover:bg-slate-800 font-bold transition-colors"
                  >
                    🏠 Dashboard
                  </Link>
                  <Link 
                    to="/insights" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-300 hover:bg-[#FAF9F6] dark:hover:bg-slate-800 font-bold transition-colors"
                  >
                    📊 Insights
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-[#2F3A3F] dark:text-slate-300 hover:bg-[#FAF9F6] dark:hover:bg-slate-800 font-bold transition-colors"
                  >
                    👤 Profile & Settings
                  </Link>
                  <hr className="border-[#E5E7EB] dark:border-slate-800 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-xs text-[#DC6B6B] hover:bg-[#FAF9F6] dark:hover:bg-slate-800 font-bold transition-colors"
                    type="button"
                  >
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="!px-4 !py-2 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="!px-4 !py-2">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-900 text-[#2F3A3F] dark:text-slate-200 transition-colors focus:outline-none"
          type="button"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-[#FAF9F6] dark:bg-slate-950 border-b border-[#E5E7EB]/50 dark:border-slate-800/60 px-6 py-6 shadow-soft flex flex-col gap-5 select-none transition-colors duration-300">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] transition-colors"
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] transition-colors"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] transition-colors"
          >
            About
          </a>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/insights"
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] transition-colors"
              >
                Insights
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#6B8E7A] transition-colors"
              >
                Profile & Settings
              </Link>
            </>
          )}

          <hr className="border-[#E5E7EB]/50 dark:border-slate-800/60" />

          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-sm font-bold text-[#2F3A3F] dark:text-slate-200 px-2 flex items-center gap-2">
                  <User size={14} className="text-[#6B8E7A]" />
                  {user?.displayName || user?.fullName || user?.email}
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full justify-center gap-2 dark:border-slate-800 dark:text-slate-300">
                  <LogOut size={14} />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center dark:border-slate-800 dark:text-slate-300">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
