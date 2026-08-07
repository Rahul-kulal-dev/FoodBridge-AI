import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DonorSidebar from './components/DonorSidebar';
import usePwaStatus from '../ngo/hooks/usePwaStatus';
import OfflineIndicator from '../ngo/components/OfflineIndicator';
import PwaInstallBanner from '../ngo/components/PwaInstallBanner';

/**
 * DonorLayout Component
 * Wraps all pages under `/donor` route.
 * Pure Light Theme: Crisp White & Emerald Green matching the landing page.
 */
const DonorLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isOnline, isInstallable, isInstalled, triggerInstallPrompt } = usePwaStatus();

  // Ensure dark class is removed from html element for a pure light theme matching landing page
  useEffect(() => {
    document.documentElement.classList.remove('dark');

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Donor Service worker registered successfully:', registration.scope);
          })
          .catch((err) => {
            console.warn('[SW] Donor Service worker registration failed:', err);
          });
      });
    }
  }, []);

  // Sync collapsed state on screen resize
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
      {/* Master Donor Navigation Sidebar */}
      <DonorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content View Container */}
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

export default DonorLayout;
