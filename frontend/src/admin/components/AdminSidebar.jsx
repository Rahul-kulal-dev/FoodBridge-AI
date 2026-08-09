import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Package,
  MessageSquare,
  User,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Pending Verifications',
      path: '/admin/verifications',
      icon: ShieldCheck,
      badge: 'Review',
    },
    {
      name: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
    },
    {
      name: 'Manage Users',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Monitor Donations',
      path: '/admin/donations',
      icon: Package,
    },
    {
      name: 'Feedback Logs',
      path: '/admin/feedback',
      icon: MessageSquare,
    },
    {
      name: 'Admin Profile',
      path: '/admin/profile',
      icon: User,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-[#E7EAF0] transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header matching Landing/Donor */}
      <div className="p-4 sm:p-5 border-b border-[#E7EAF0] flex items-center min-h-[73px] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="shrink-0 transition-transform hover:scale-105 cursor-pointer"
          >
            <img src="/apple-touch-icon.png" alt="FoodBridge AI" className="w-10 h-10 object-contain rounded-xl shadow-xs" />
          </button>
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-lg font-extrabold text-[#0F172A] tracking-tight block truncate">
                FoodBridge <span className="text-emerald-600 font-black">AI</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 inline-block">
                Admin Control
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-2 block">
            ADMIN MANAGEMENT
          </span>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/80'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-[#E7EAF0] space-y-3">
        {!isCollapsed && (() => {
          const userEmail = user?.email || 'admin@gmail.com';
          const userName = user?.name || user?.organizationName || 'System Administrator';
          const initial = userName.charAt(0).toUpperCase();

          return (
            <Link
              to="/admin/profile"
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
          );
        })()}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E7EAF0] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[#64748B] text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
