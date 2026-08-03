import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenDonateModal, onOpenAuthModal }) {
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
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 fill-emerald-500/20 stroke-[2.2]" />
            </div>
            <span className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              FoodBridge <span className="text-emerald-600 font-black">AI</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#334155] hover:text-emerald-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Side CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="text-sm font-semibold text-[#334155] hover:text-[#0F172A] px-3 py-2 transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onOpenDonateModal('register')}
              className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-emerald-btn transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
              className="block text-base font-medium text-[#334155] hover:text-emerald-600 py-2 border-b border-slate-100"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2.5">
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
              className="w-full text-center font-semibold bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl shadow-emerald-btn transition-all flex items-center justify-center gap-2"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
