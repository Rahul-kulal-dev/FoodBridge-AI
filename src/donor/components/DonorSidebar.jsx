import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BadgeCheck,
  PlusCircle,
  Package,
  Brain,
  Bell,
  MessageSquare,
  User,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';
import MobileSidebar from './MobileSidebar';

/**
 * DonorSidebar component
 * Master sidebar container for desktop, tablet (collapsible), and mobile (drawer).
 * Pure White background (#ffffff) with Emerald Green accents matching the landing page.
 */
const DonorSidebar = () => {
  // Collapsed state for tablet view
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse sidebar on tablet screen resize (768px - 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation Items defined strictly according to requirements
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/donor',
    },
    {
      label: 'Verification',
      icon: BadgeCheck,
      route: '/donor/verification',
      badge: 'Verified',
    },
    {
      label: 'Create Donation',
      icon: PlusCircle,
      route: '/donor/create-donation',
    },
    {
      label: 'My Donations',
      icon: Package,
      route: '/donor/donations',
      badge: 4,
    },
    {
      label: 'AI Predictions',
      icon: Brain,
      route: '/donor/ai-predictions',
    },
    {
      label: 'Notifications',
      icon: Bell,
      route: '/donor/notifications',
      badge: 2,
    },
    {
      label: 'Feedback',
      icon: MessageSquare,
      route: '/donor/feedback',
    },
    {
      label: 'Profile',
      icon: User,
      route: '/donor/profile',
    },
  ];

  return (
    <>
      {/* Mobile Drawer Navigation (< 768px) */}
      <MobileSidebar navItems={navItems} />

      {/* Desktop & Tablet Sidebar (>= 768px) */}
      <aside
        className={`
          hidden md:flex fixed top-0 left-0 bottom-0 z-30 flex-col bg-white border-r border-[#E7EAF0] transition-all duration-300 ease-in-out select-none shadow-xs
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Sidebar Header Section */}
        <div className="p-4 border-b border-[#E7EAF0] flex items-center justify-between min-h-[73px]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Landing Page Brand Logo Lockup */}
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 transition-transform hover:scale-105">
              <Leaf className="w-5 h-5 fill-emerald-500/20 stroke-[2.2]" />
            </div>

            {/* Title & Subtitle */}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-base font-extrabold text-[#0F172A] tracking-tight leading-tight truncate">
                  FoodBridge <span className="text-emerald-600 font-black">AI</span>
                </span>
                <span className="text-[11px] text-[#64748B] font-medium truncate">
                  Donor Portal Dashboard
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button (Tablet/Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#f7f8fb] border border-transparent hover:border-[#E7EAF0] transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Menu Navigation
            </span>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
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

export default DonorSidebar;
