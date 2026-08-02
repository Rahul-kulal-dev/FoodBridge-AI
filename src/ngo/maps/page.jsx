import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Sparkles,
  ShoppingBag,
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  Layers,
  Crosshair
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * NGO Google Maps Integration Page (/ngo/maps)
 */
const NgoMapsPage = () => {
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState(null);

  const ngoLocation = {
    id: 'NGO-MAIN',
    name: 'Hope Community Kitchen (Your Location)',
    type: 'NGO',
    color: 'blue',
    x: 45,
    y: 50,
    address: 'Sector 5 Community Hub, Metro City',
  };

  const markers = [
    {
      id: 'MAP-DON-1',
      name: 'Fresh Lunch Trays (120 Portions)',
      donor: 'Grand Palace Hotel',
      type: 'Donation',
      status: 'Available',
      color: 'green',
      distance: '1.2 km',
      quantity: '120 Portions',
      expiry: '3 Hours',
      x: 30,
      y: 35,
    },
    {
      id: 'MAP-DON-2',
      name: 'Artisan Bread Buns (40 kg)',
      donor: 'Daily Harvest Bakery',
      type: 'Donation',
      status: 'Available',
      color: 'green',
      distance: '2.5 km',
      quantity: '40 kg',
      expiry: '6 Hours',
      x: 65,
      y: 30,
    },
    {
      id: 'MAP-DON-3',
      name: 'Organic Farm Produce (85 kg)',
      donor: 'GreenHarvest Market',
      type: 'Donation',
      status: 'Available',
      color: 'green',
      distance: '3.1 km',
      quantity: '85 kg',
      expiry: '12 Hours',
      x: 75,
      y: 65,
    },
    {
      id: 'MAP-VOL-1',
      name: 'Volunteer Express #4 (Rahul Verma)',
      vehicle: 'Refrigerated EV Van',
      type: 'Volunteer',
      status: 'En Route',
      color: 'orange',
      distance: '0.8 km',
      eta: '8 Mins',
      x: 40,
      y: 42,
    },
    {
      id: 'MAP-VOL-2',
      name: 'Volunteer Rider #2 (Amit Kumar)',
      vehicle: 'Eco Cargo Bike',
      type: 'Volunteer',
      status: 'In Transit',
      color: 'orange',
      distance: '2.1 km',
      eta: '14 Mins',
      x: 58,
      y: 58,
    },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Google Maps Dispatch Radar
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Real-time live map showing nearby available donations, volunteer couriers, and optimal route dispatching
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-3 bg-[#f7f8fb] p-2 rounded-xl border border-[#E7EAF0] text-xs font-bold">
          <span className="flex items-center gap-1.5 text-blue-700">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" /> NGO Location
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" /> Available Donation
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" /> Active Volunteer
          </span>
        </div>
      </div>

      {/* Main Interactive Map Container */}
      <div className="relative w-full h-[540px] bg-slate-900 rounded-2xl border border-[#E7EAF0] overflow-hidden shadow-xl">
        {/* Map Background Canvas Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#0284c7 1px, #0f172a 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        />

        {/* Map Roads Visual Simulation */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-700/60 stroke-[3] fill-none">
          <path d="M 0 150 Q 200 180 400 120 T 800 200 T 1200 160" />
          <path d="M 150 0 Q 180 200 250 400 T 200 600" />
          <path d="M 600 0 Q 550 250 650 500" />
          <path d="M 0 350 C 300 300, 500 450, 1200 380" strokeDasharray="6 6" className="stroke-emerald-500/50" />
        </svg>

        {/* Radar Pulse Effect around NGO */}
        <div
          className="absolute w-40 h-40 rounded-full border-2 border-emerald-500/30 animate-ping pointer-events-none"
          style={{ left: `${ngoLocation.x - 5}%`, top: `${ngoLocation.y - 12}%` }}
        />

        {/* NGO Main Location Marker (Blue) */}
        <div
          onClick={() => setSelectedMarker(ngoLocation)}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
          style={{ left: `${ngoLocation.x}%`, top: `${ngoLocation.y}%` }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap border border-slate-700 shadow-md">
              Hope Community Kitchen
            </span>
          </div>
        </div>

        {/* Dynamic Markers (Green & Orange) */}
        {markers.map((marker) => {
          const isGreen = marker.color === 'green';
          return (
            <div
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-9 h-9 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white group-hover:scale-125 transition-transform ${
                    isGreen ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                >
                  {isGreen ? <ShoppingBag className="w-4.5 h-4.5" /> : <Truck className="w-4.5 h-4.5" />}
                </div>
                <span className="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap border border-slate-700 shadow-md">
                  {marker.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Marker Details Modal Popup Card */}
        {selectedMarker && (
          <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-96 bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-2xl z-30 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  selectedMarker.type === 'NGO'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : selectedMarker.type === 'Donation'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {selectedMarker.type}
              </span>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-3 space-y-2">
              <h3 className="text-sm font-extrabold text-[#0F172A]">{selectedMarker.name}</h3>
              {selectedMarker.donor && (
                <p className="text-xs text-[#64748B]">Donor: <span className="font-bold text-[#0F172A]">{selectedMarker.donor}</span></p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#f7f8fb] p-3 rounded-xl border border-[#E7EAF0] mt-2">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Distance</span>
                  <span className="font-bold text-emerald-600">{selectedMarker.distance || '0 km'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Expiry / ETA</span>
                  <span className="font-bold text-amber-600">{selectedMarker.expiry || selectedMarker.eta || 'N/A'}</span>
                </div>
              </div>
            </div>

            {selectedMarker.type === 'Donation' && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => navigate('/ngo/accepted-donations')}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer"
                >
                  Accept Donation & Dispatch
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoMapsPage;
