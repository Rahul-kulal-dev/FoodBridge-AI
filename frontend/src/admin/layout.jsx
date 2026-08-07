import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import usePwaStatus from '../ngo/hooks/usePwaStatus';
import OfflineIndicator from '../ngo/components/OfflineIndicator';
import PwaInstallBanner from '../ngo/components/PwaInstallBanner';

/**
 * AdminLayout Component
 * Wraps all pages under `/admin` route with FoodBridge AI design system.
 */
const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isOnline, isInstallable, isInstalled, triggerInstallPrompt } = usePwaStatus();

  useEffect(() => {
    document.documentElement.classList.remove('dark');

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Admin Service worker registered successfully:', registration.scope);
          })
          .catch((err) => {
            console.warn('[SW] Admin Service worker registration failed:', err);
          });
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#334155] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex flex-col min-h-screen pt-16 md:pt-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-20' : 'md:pl-20 lg:pl-72'
        }`}
      >
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full mx-auto">
          {/* Global Offline Status Alert */}
          <OfflineIndicator isOnline={isOnline} />

          {/* PWA App Install Banner Prompt */}
          <PwaInstallBanner
            isInstallable={isInstallable}
            isInstalled={isInstalled}
            triggerInstallPrompt={triggerInstallPrompt}
          />

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
