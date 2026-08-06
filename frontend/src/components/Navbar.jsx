import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenDonateModal, onOpenAuthModal }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoggedIn = Boolean(token && user);
  const userRole = user?.user_role || user?.role || 'donor';

  const getDashboardRoute = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'ngo') return '/ngo';
    if (userRole === 'volunteer') return '/volunteer';
    return '/donor';
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#E7EAF0] shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/apple-touch-icon.png" alt="FoodBridge AI" className="w-10 h-10 object-contain rounded-xl shadow-xs transition-transform group-hover:scale-105" />
            <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              FoodBridge <span className="text-green-600 font-black">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#334155] hover:text-green-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Side CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <Link
                  to={getDashboardRoute()}
                  className="text-sm font-semibold bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl shadow-green-btn transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="text-sm font-semibold text-[#334155] hover:text-[#0F172A] px-3 py-2 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenDonateModal('register')}
                  className="text-sm font-semibold bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl shadow-green-btn transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#334155] hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E7EAF0] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#334155] hover:text-green-600 py-2 border-b border-slate-100"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2.5">
            {isLoggedIn ? (
              <>
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-semibold bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl shadow-green-btn transition-all flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('login');
                  }}
                  className="w-full text-center font-semibold text-[#334155] bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDonateModal('register');
                  }}
                  className="w-full text-center font-semibold bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl shadow-green-btn transition-all flex items-center justify-center gap-2"
                >
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
