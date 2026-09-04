import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, LayoutDashboard, Compass, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Modern 404 Error Page Component
 * Styled after FoodBridge AI design system (Pure White & Emerald Green theme)
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const userRole = user?.user_role || user?.role;
  const dashboardRoute = userRole === 'admin' ? '/admin'
    : userRole === 'ngo' ? '/ngo'
    : userRole === 'volunteer' ? '/volunteer'
    : userRole === 'donor' ? '/donor'
    : '/';

  return (
    <div className="min-h-screen bg-[#F7F8FB] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      {/* Background Accent Wash */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Lockup */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-2">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img src="/apple-touch-icon.png" alt="SavorSurplus" className="w-10 h-10 object-contain rounded-xl shadow-xs transition-transform group-hover:scale-105" />
          <div>
            <span className="text-xl font-extrabold text-[#0F172A] tracking-tight leading-tight block">
              Savor<span className="text-emerald-600 font-black">Surplus</span>
            </span>
            <span className="text-xs text-[#64748B] font-medium block">
              Smart Surplus Food Redistribution
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => navigate(dashboardRoute)}
            className="px-4 py-2 rounded-xl bg-white border border-[#E7EAF0] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Go to My Dashboard</span>
          </button>
        )}
      </div>

      {/* Main 404 Card Container */}
      <main className="my-auto py-12 max-w-lg w-full text-center space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E7EAF0] shadow-soft-card space-y-6 relative overflow-hidden"
        >
          {/* 404 Visual Icon Badge */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <Compass className="w-10 h-10 stroke-[1.8]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-6 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Error 404 • Page Not Found</span>
            </div>
          </div>

          {/* Heading and Path Info */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto font-medium leading-relaxed">
              The requested address <code className="px-2 py-0.5 rounded-lg bg-slate-100 text-[#0F172A] font-mono text-xs font-bold">{location.pathname}</code> does not exist or has been moved.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl border border-[#E7EAF0] hover:bg-slate-50 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#64748B]" />
              <span>Go Back</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate(dashboardRoute)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center py-4 text-xs font-medium text-[#64748B]">
        SavorSurplus Redistribution Platform • All rights reserved
      </footer>
    </div>
  );
}
