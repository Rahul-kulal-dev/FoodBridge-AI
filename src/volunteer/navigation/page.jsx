import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

/**
 * Google Maps Navigation Page (/volunteer/navigation)
 */
const NavigationPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const routeDetails = {
    volunteerLocation: 'Current Position (Sector 4 Flyover)',
    donorName: 'Grand Palace Hotel (Pickup)',
    donorAddress: '74 MG Road, Sector 4, Metro City',
    ngoName: 'Hope Community Kitchen (Dropoff)',
    ngoAddress: 'Sector 5 Community Hub, Metro City',
    remainingDistance: '2.1 km',
    estimatedETA: '12 Mins',
    routeSpeed: '38 km/h',
    trafficCondition: 'Clear Eco Route (Optimized by AI)',
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            GPS Turn-by-Turn Navigation
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 sm:mt-1 font-medium">
            AI optimized dispatch route connecting Volunteer Courier ➔ Donor Pickup ➔ NGO Dropoff
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
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Open Maps</span>
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
            <span className="text-xs font-extrabold text-[#0F172A] truncate block">Orange Pin (Live)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block truncate">Donor Pickup</span>
            <span className="text-xs font-extrabold text-emerald-700 truncate block">Green Pin (Grand Palace)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block truncate">NGO Dropoff</span>
            <span className="text-xs font-extrabold text-blue-700 truncate block">Blue Pin (Hope Kitchen)</span>
          </div>
        </div>
      </div>

      {/* Interactive GPS Route Canvas Map Simulator */}
      <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] bg-slate-900 rounded-2xl border border-[#E7EAF0] overflow-hidden shadow-2xl">
        {/* Map Background Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#0284c7 1px, #0f172a 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Vector SVG Path Simulation */}
        <svg className="absolute inset-0 w-full h-full stroke-emerald-400 stroke-[3] sm:stroke-[4] fill-none">
          <path d="M 100 280 Q 250 180 450 240 T 750 140" strokeDasharray="10 6" className="animate-pulse" />
        </svg>

        {/* Marker 1: Orange Volunteer Marker */}
        <div className="absolute top-[60%] left-[18%] sm:left-[22%] -translate-x-1/2 -translate-y-1/2 z-20 group">
          <div className="relative flex flex-col items-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-500 border-2 border-white shadow-2xl flex items-center justify-center text-white animate-bounce">
              <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="mt-1 bg-slate-900/90 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap">
              You (Courier)
            </span>
          </div>
        </div>

        {/* Marker 2: Green Donor Marker */}
        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 group">
          <div className="relative flex flex-col items-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-500 border-2 border-white shadow-2xl flex items-center justify-center text-white">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="mt-1 bg-slate-900/90 text-emerald-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap">
              Grand Palace
            </span>
          </div>
        </div>

        {/* Marker 3: Blue NGO Marker */}
        <div className="absolute top-[32%] left-[82%] sm:left-[80%] -translate-x-1/2 -translate-y-1/2 z-20 group">
          <div className="relative flex flex-col items-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="mt-1 bg-slate-900/90 text-blue-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap">
              Hope Kitchen
            </span>
          </div>
        </div>

        {/* Top Floating Dashboard Overlay */}
        <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-auto bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 text-white z-30 shadow-xl space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
            <span>AI GPS Guidance Active</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs pt-0.5">
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Remaining Dist</span>
              <span className="font-black text-base sm:text-lg text-white">{routeDetails.remainingDistance}</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">ETA</span>
              <span className="font-black text-base sm:text-lg text-emerald-400">{routeDetails.estimatedETA}</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Address Bar */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 text-white z-30 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold block uppercase">Pickup Origin</span>
              <p className="font-bold truncate text-xs">{routeDetails.donorName}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-blue-400 font-bold block uppercase">Destination NGO</span>
              <p className="font-bold truncate text-xs">{routeDetails.ngoName}</p>
            </div>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-emerald-btn transition-all shrink-0 cursor-pointer"
          >
            Launch GPS Navigation
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
