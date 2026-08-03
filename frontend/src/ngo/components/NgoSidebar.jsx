import React, { useState } from 'react';
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

/**
 * NgoSidebar component
 * Master sidebar container for NGO Portal.
 */
const NgoSidebar = ({ isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  // NGO Navigation Items
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
      badge: 'Verified',
    },
    {
      label: 'Nearby Food',
      icon: ShoppingBag,
      route: '/ngo/browse-food',
      badge: 15,
    },
    {
      label: 'Accepted Donations',
      icon: PackageCheck,
      route: '/ngo/accepted-donations',
      badge: 8,
    },
    {
      label: 'Google Maps',
      icon: Map,
      route: '/ngo/maps',
    },
    {
      label: 'Notifications',
      icon: Bell,
      route: '/ngo/notifications',
      badge: 3,
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
              className="relative group w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-xs cursor-pointer"
            >
              <Building2 className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -bottom-1 -right-1 bg-white border border-[#E7EAF0] rounded-full p-0.5 shadow-xs text-emerald-600">
                <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-[#E7EAF0] flex items-center justify-between min-h-[73px] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 transition-transform hover:scale-105">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-base font-extrabold text-[#0F172A] tracking-tight leading-tight truncate">
                  FoodBridge <span className="text-emerald-600 font-black">AI</span>
                </span>
                <span className="text-[11px] text-[#64748B] font-medium truncate">
                  NGO Portal Dashboard
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCollapsed(true)}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#f7f8fb] border border-transparent hover:border-[#E7EAF0] transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
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
