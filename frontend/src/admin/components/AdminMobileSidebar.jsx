import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminMobileSidebar component for mobile screens (< 768px)
 */
export default function AdminMobileSidebar({ navItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Close drawer automatically when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const userEmail = user?.email || 'admin@gmail.com';
  const userName = user?.name || user?.organizationName || 'System Administrator';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Fixed Top Bar for Mobile Screens */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#E7EAF0] px-4 flex items-center justify-between z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl text-[#334155] hover:bg-[#f7f8fb] transition-colors focus:outline-hidden cursor-pointer"
          >
            <Menu className="w-6 h-6 text-emerald-600" />
          </button>

          <img src="/apple-touch-icon.png" alt="SavorSurplus" className="w-8 h-8 object-contain rounded-lg shadow-xs shrink-0" />
          <div>
            <h1 className="text-sm font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Savor<span className="text-emerald-600 font-black">Surplus</span>
            </h1>
            <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200/80 inline-block">
              Admin Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/notifications"
            className="p-2 rounded-xl text-[#64748B] hover:bg-[#f7f8fb] relative transition-colors"
          >
            <Bell className="w-5 h-5 text-[#334155]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </Link>
        </div>
      </header>

      {/* Backdrop Blur Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Slide-over Drawer Panel */}
      <aside
        className={`
          md:hidden fixed top-0 bottom-0 left-0 w-[280px] bg-white border-r border-[#E7EAF0] z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E7EAF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/apple-touch-icon.png" alt="SavorSurplus" className="w-9 h-9 object-contain rounded-xl shadow-xs shrink-0" />
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                Savor<span className="text-emerald-600 font-black">Surplus</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 inline-block">
                Admin Control
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#f7f8fb] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            ADMIN MANAGEMENT
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/80'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile & Sign Out Section */}
        <div className="p-4 border-t border-[#E7EAF0] space-y-3">
          <Link
            to="/admin/profile"
            onClick={() => setIsOpen(false)}
            className="p-3 bg-slate-50 hover:bg-emerald-50/70 rounded-2xl border border-[#E7EAF0] hover:border-emerald-200 flex items-center gap-3 transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs transition-colors">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0F172A] group-hover:text-emerald-700 truncate transition-colors">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E7EAF0] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[#64748B] text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
