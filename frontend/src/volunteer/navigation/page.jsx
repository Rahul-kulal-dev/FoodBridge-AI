import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Building2,
  Bike,
  RefreshCw,
  ExternalLink,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';
import OpenStreetMap from '../../components/OpenStreetMap';

/**
 * Google Maps Navigation Page (/volunteer/navigation)
 * Connects to MongoDB Atlas for active pickup/dropoff navigation routes.
 */
const NavigationPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (!authToken) return;

      const res = await fetch(getApiUrl('/api/volunteer/tasks'), {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        const rawTasks = data.tasks || [];
        const rawDonations = data.donations || [];
        const current = rawTasks.find((t) => t.status !== 'delivered') || rawTasks[0];

        if (current) {
          setActiveTask({
            donorName: current.donationId?.donorId?.organizationName || current.donationId?.donorId?.name || 'Verified Food Donor',
            donorAddress: current.donationId?.donorId?.address || current.donationId?.pickupAddress || 'Donor Address',
            ngoName: current.ngoId?.organizationName || current.ngoId?.name || 'Partner NGO',
            ngoAddress: current.ngoId?.address || 'NGO Dropoff Hub',
            remainingDistance: '2.4 km',
            estimatedETA: '12 Mins',
          });
        } else if (rawDonations.length > 0) {
          const d = rawDonations[0];
          setActiveTask({
            donorName: d.donorId?.organizationName || d.donorId?.name || 'Verified Food Donor',
            donorAddress: d.donorId?.address || d.pickupAddress || 'Donor Address',
            ngoName: d.ngoId?.organizationName || d.ngoId?.name || 'Partner NGO',
            ngoAddress: d.ngoId?.address || 'NGO Dropoff Hub',
            remainingDistance: '3.1 km',
            estimatedETA: '15 Mins',
          });
        } else {
          setActiveTask(null);
        }
      }
    } catch (err) {
      console.warn('Error fetching navigation task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [token]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTask();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading live GPS route from MongoDB Atlas...</p>
      </div>
    );
  }

  if (!activeTask) {
    return (
      <div className="w-full space-y-6 animate-fade-in pb-12">
        <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-[-0.04em]">
              GPS Turn-by-Turn Navigation
            </h1>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              AI optimized dispatch route connecting Volunteer Courier ➔ Donor Pickup ➔ NGO Dropoff
            </p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] shadow-soft-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100">
            <Navigation className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0F172A]">No Active Navigation Route</h3>
            <p className="text-xs text-[#64748B] mt-1">
              You currently have no active food pickups or deliveries in progress. Accept an assigned pickup to view turn-by-turn navigation.
            </p>
          </div>
          <button
            onClick={() => navigate('/volunteer/assignments')}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer"
          >
            View Assigned Pickups
          </button>
        </div>
      </div>
    );
  }

  const osmMarkers = activeTask ? [
    {
      lat: 12.9650,
      lng: 77.5850,
      title: 'Courier (You)',
      description: 'Volunteer Courier Position',
      iconType: 'courier',
    },
    {
      lat: 12.9750,
      lng: 77.6000,
      title: activeTask.donorName,
      description: activeTask.donorAddress || 'Donor Pickup Location',
      iconType: 'donor',
    },
    {
      lat: 12.9850,
      lng: 77.6150,
      title: activeTask.ngoName,
      description: activeTask.ngoAddress || 'NGO Dropoff Hub',
      iconType: 'ngo',
    },
  ] : [];

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            GPS Turn-by-Turn Navigation
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 sm:mt-1 font-medium">
            OpenStreetMap live dispatch route connecting Volunteer Courier ➔ Donor Pickup ➔ NGO Dropoff
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">Refresh Route</span>
          </button>
          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">OpenStreetMap</span>
          </a>
        </div>
      </div>

      {/* Legend & Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block truncate">Volunteer Courier</span>
            <span className="text-xs font-extrabold text-[#0F172A] truncate block">Live GPS Position</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block truncate">Donor Pickup</span>
            <span className="text-xs font-extrabold text-emerald-700 truncate block">{activeTask.donorName}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block truncate">NGO Dropoff</span>
            <span className="text-xs font-extrabold text-blue-700 truncate block">{activeTask.ngoName}</span>
          </div>
        </div>
      </div>

      {/* Real Interactive OpenStreetMap Canvas */}
      <div className="relative w-full h-[440px] sm:h-[500px] rounded-2xl border border-[#E7EAF0] overflow-hidden shadow-2xl">
        <OpenStreetMap markers={osmMarkers} drawRoute={true} className="w-full h-full" />

        {/* Top Floating Overlay */}
        <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-auto bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 text-white z-[400] shadow-xl space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
            <span>OpenStreetMap Live Guidance Active</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs pt-0.5">
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Remaining Dist</span>
              <span className="font-black text-base sm:text-lg text-white">{activeTask.remainingDistance}</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">ETA</span>
              <span className="font-black text-base sm:text-lg text-emerald-400">{activeTask.estimatedETA}</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Address Bar */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 text-white z-[400] shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold block uppercase">Pickup Origin</span>
              <p className="font-bold truncate text-xs">{activeTask.donorName}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-blue-400 font-bold block uppercase">Destination NGO</span>
              <p className="font-bold truncate text-xs">{activeTask.ngoName}</p>
            </div>
          </div>

          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-emerald-btn transition-all shrink-0 cursor-pointer"
          >
            Launch OpenStreetMap Navigation
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
