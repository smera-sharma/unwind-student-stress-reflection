import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wind, Menu, X, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF9F6]/80 border-b border-[#E5E7EB]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8.5 h-8.5 rounded-2xl bg-[#6B8E7A] flex items-center justify-center text-white shadow-soft transition-transform duration-300 group-hover:scale-[1.05]">
            <Wind size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#2F3A3F]">
            Unwind
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors">
            Home
          </Link>
          <a href="#features" className="text-sm font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors">
            About
          </a>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <span className="inline-flex items-center gap-1.5 text-xs bg-white border border-[#E5E7EB] text-[#2F3A3F] px-3.5 py-1.5 rounded-2xl font-medium transition-colors hover:bg-slate-50">
                  <User size={12} className="text-[#6B8E7A]" />
                  {user?.fullName || user?.email}
                </span>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-1.5 !px-4 !py-2">
                <LogOut size={12} />
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="!px-4 !py-2">
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
          className="md:hidden p-1.5 rounded-2xl hover:bg-slate-100/50 text-[#2F3A3F] transition-colors focus:outline-none"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-[#FAF9F6] border-b border-[#E5E7EB]/50 px-6 py-6 shadow-soft flex flex-col gap-5">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors"
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors"
          >
            About
          </a>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-[#6B7280] hover:text-[#6B8E7A] transition-colors"
            >
              Dashboard
            </Link>
          )}

          <hr className="border-[#E5E7EB]/50" />

          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-sm font-semibold text-[#2F3A3F] px-2 flex items-center gap-2">
                  <User size={14} className="text-[#6B8E7A]" />
                  {user?.fullName || user?.email}
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full justify-center gap-2">
                  <LogOut size={14} />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center">
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
