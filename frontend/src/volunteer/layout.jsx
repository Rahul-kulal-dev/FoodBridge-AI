import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import VolunteerSidebar from './components/VolunteerSidebar';
import VolunteerTrackingBanner from './components/VolunteerTrackingBanner';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import volunteerLocationTracker from '../services/volunteerLocationTracker';

/**
 * VolunteerLayout Component
 * Wraps all pages under `/volunteer` route with live location tracking lifecycle.
 */
const VolunteerLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { token, user } = useAuth();

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

  // Location Tracking Lifecycle Engine (Req 2, 6, 10)
  useEffect(() => {
    let isMounted = true;

    const checkActiveTasksAndTrack = async () => {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (!authToken || !user) {
        volunteerLocationTracker.stopTracking();
        return;
      }

      try {
        const res = await fetch(getApiUrl('/api/volunteer/tasks'), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();

        if (isMounted && res.ok) {
          const rawTasks = data.tasks || [];
          const rawDonations = data.donations || [];
          const activeTask = rawTasks.find((t) => ['assigned', 'accepted', 'picked_up', 'on_the_way'].includes(t.status))
            || rawDonations.find((d) => ['assigned', 'accepted', 'picked_up', 'on_the_way'].includes(d.status));

          if (activeTask) {
            // Requirement 2: Start GPS tracking when delivery is active
            volunteerLocationTracker.startTracking(authToken);
          } else {
            // Requirement 6: Stop tracking when delivery completed/cancelled
            volunteerLocationTracker.stopTracking();
          }
        }
      } catch (err) {
        console.warn('Error checking volunteer active tasks for location tracking:', err);
      }
    };

    checkActiveTasksAndTrack();
    const intervalId = setInterval(checkActiveTasksAndTrack, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      volunteerLocationTracker.stopTracking();
    };
  }, [token, user]);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#334155] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Master Volunteer Navigation Sidebar */}
      <VolunteerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content View Container */}
      <div
        className={`flex flex-col min-h-screen pt-16 md:pt-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-20' : 'md:pl-20 lg:pl-72'
        }`}
      >
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 w-full mx-auto overflow-x-hidden space-y-4">
          <VolunteerTrackingBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VolunteerLayout;
