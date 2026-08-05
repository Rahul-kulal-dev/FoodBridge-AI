import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import NgoSidebar from './components/NgoSidebar';
import { useAuth } from '../context/AuthContext';

/**
 * NgoLayout Component
 * Wraps all pages under `/ngo` route.
 * Matches Donor portal theme: Crisp White & Emerald Green.
 */
const NgoLayout = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isVerified = user?.verificationStatus === 'approved';

  useEffect(() => {
    document.documentElement.classList.remove('dark');
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
      {/* Master NGO Navigation Sidebar */}
      <NgoSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content View Container */}
      <div
        className={`flex flex-col min-h-screen pt-16 md:pt-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-20' : 'md:pl-20 lg:pl-72'
        }`}
      >

        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NgoLayout;
