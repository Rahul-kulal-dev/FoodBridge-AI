import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BadgeCheck,
  ShoppingBag,
  PackageCheck,
  Map,
  Bell,
  MessageSquare,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';
import NgoMobileSidebar from './NgoMobileSidebar';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * NgoSidebar component
 * Master sidebar container for NGO Portal with dynamic database counts.
 */
const NgoSidebar = ({ isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ nearbyDonations: 0, activeDonations: 0 });

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) return;
        const res = await fetch(getApiUrl('/api/ngo/stats'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn('Error fetching sidebar stats:', err);
      }
    };
    fetchStats();
  }, [token]);

  const isVerified = user?.verificationStatus === 'approved';

  // NGO Navigation Items with dynamic data
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/ngo',
    },
    {
      label: 'Verification',
      icon: BadgeCheck,
      route: '/ngo/verification',
      badge: isVerified ? 'Verified' : 'Pending',
    },
    {
      label: 'Nearby Food',
      icon: ShoppingBag,
      route: '/ngo/browse-food',
      badge: stats.nearbyDonations > 0 ? stats.nearbyDonations : undefined,
    },
    {
      label: 'Accepted Donations',
      icon: PackageCheck,
      route: '/ngo/accepted-donations',
      badge: stats.activeDonations > 0 ? stats.activeDonations : undefined,
    },
    {
      label: 'Live Map',
      icon: Map,
      route: '/ngo/maps',
    },
    {
      label: 'Notifications',
      icon: Bell,
      route: '/ngo/notifications',
    },
    {
      label: 'Feedback',
      icon: MessageSquare,
      route: '/ngo/feedback',
    },
    {
      label: 'Profile',
      icon: User,
      route: '/ngo/profile',
    },
  ];

  return (
    <>
      {/* Mobile Drawer Navigation (< 768px) */}
      <NgoMobileSidebar navItems={navItems} />

      {/* Desktop & Tablet Sidebar (>= 768px) */}
      <aside
        className={`
          hidden md:flex fixed top-0 left-0 bottom-0 z-30 flex-col bg-white border-r border-[#E7EAF0] transition-all duration-300 ease-in-out select-none shadow-xs overflow-x-hidden
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Sidebar Header Section */}
        {isCollapsed ? (
          <div className="p-3 border-b border-[#E7EAF0] flex flex-col items-center justify-center min-h-[73px] shrink-0">
            <button
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar"
              className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 hover:bg-emerald-50 transition-all shadow-xs cursor-pointer"
            >
              <img src="/imgs/ngo.png" alt="NGO" className="w-full h-full object-contain" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-[#E7EAF0] flex items-center min-h-[73px] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsCollapsed(true)}
                title="Collapse Sidebar"
                className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 hover:bg-emerald-50 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <img src="/imgs/ngo.png" alt="NGO" className="w-full h-full object-contain" />
              </button>

              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-base font-extrabold text-[#0F172A] tracking-tight leading-tight truncate">
                  FoodBridge <span className="text-emerald-600 font-black">AI</span>
                </span>
                <span className="text-[11px] text-[#64748B] font-medium truncate">
                  NGO Portal Dashboard
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              NGO Navigation
            </span>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-1 scrollbar-thin ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => (
            <SidebarItem
              key={item.route}
              icon={item.icon}
              label={item.label}
              route={item.route}
              badge={item.badge}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Bottom User Profile Section */}
        <SidebarProfile isCollapsed={isCollapsed} />
      </aside>
    </>
  );
};

export default NgoSidebar;
