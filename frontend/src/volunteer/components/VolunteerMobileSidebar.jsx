import React, { useState, useEffect } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';
import { useLocation } from 'react-router-dom';

/**
 * VolunteerMobileSidebar component for screens < 768px
 */
const VolunteerMobileSidebar = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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

          <img src="/apple-touch-icon.png" alt="FoodBridge AI" className="w-8 h-8 object-contain rounded-lg shadow-xs shrink-0" />
          <div>
            <h1 className="text-sm font-extrabold text-[#0F172A] tracking-tight leading-tight">
              FoodBridge <span className="text-emerald-600 font-black">AI</span>
            </h1>
            <p className="text-[10px] text-[#64748B] font-medium">
              Volunteer Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/volunteer/notifications"
            className="p-2 rounded-xl text-[#64748B] hover:bg-[#f7f8fb] relative transition-colors"
          >
            <Bell className="w-5 h-5 text-[#334155]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </a>
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
        <div className="p-4 border-b border-[#E7EAF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1">
              <img src="/imgs/volunteer.png" alt="Volunteer Portal" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                FoodBridge <span className="text-emerald-600 font-black">AI</span>
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                Volunteer Dispatch Portal
              </p>
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

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Volunteer Menu
          </div>
          {navItems.map((item) => (
            <SidebarItem
              key={item.route}
              icon={item.icon}
              label={item.label}
              route={item.route}
              badge={item.badge}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>

        <SidebarProfile />
      </aside>
    </>
  );
};

export default VolunteerMobileSidebar;
