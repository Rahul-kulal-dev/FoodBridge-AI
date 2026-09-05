import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Navigation,
  Camera,
  ShieldCheck,
  Truck,
  Bell,
  History,
  User,
  Bike,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';
import VolunteerMobileSidebar from './VolunteerMobileSidebar';

/**
 * VolunteerSidebar component
 */
const VolunteerSidebar = ({ isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/volunteer',
    },
    {
      label: 'Assigned Pickups',
      icon: Package,
      route: '/volunteer/assignments',
    },
    {
      label: 'Navigation',
      icon: Navigation,
      route: '/volunteer/navigation',
    },
    {
      label: 'Doc Verification',
      icon: ShieldCheck,
      route: '/volunteer/doc-verification',
    },
    {
      label: 'Pickup Verification',
      icon: Camera,
      route: '/volunteer/verification',
    },
    {
      label: 'Delivery Status',
      icon: Truck,
      route: '/volunteer/delivery-status',
    },
    {
      label: 'Notifications',
      icon: Bell,
      route: '/volunteer/notifications',
    },
    {
      label: 'Delivery History',
      icon: History,
      route: '/volunteer/history',
    },
    {
      label: 'Profile',
      icon: User,
      route: '/volunteer/profile',
    },
  ];

  return (
    <>
      {/* Mobile Drawer Navigation (< 768px) */}
      <VolunteerMobileSidebar navItems={navItems} />

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
              className="shrink-0 transition-transform hover:scale-105 cursor-pointer"
            >
              <img src="/apple-touch-icon.png" alt="SavorSurplus" className="w-10 h-10 object-contain rounded-xl shadow-xs" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-[#E7EAF0] flex items-center min-h-[73px] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsCollapsed(true)}
                title="Collapse Sidebar"
                className="shrink-0 transition-transform hover:scale-105 cursor-pointer"
              >
                <img src="/apple-touch-icon.png" alt="SavorSurplus" className="w-10 h-10 object-contain rounded-xl shadow-xs" />
              </button>

              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-base font-extrabold text-[#0F172A] tracking-tight leading-tight truncate">
                  Savor<span className="text-emerald-600 font-black">Surplus</span>
                </span>
                <span className="text-[11px] text-[#64748B] font-medium truncate">
                  Volunteer Dispatch Portal
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Courier Navigation
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

export default VolunteerSidebar;
