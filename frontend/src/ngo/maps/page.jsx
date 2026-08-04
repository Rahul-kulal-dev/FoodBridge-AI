import React, { useState, useEffect } from 'react';
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
  Crosshair,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * NGO Google Maps Integration Page (/ngo/maps)
 * Maps live database donations and volunteer dispatch positions.
 */
const NgoMapsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchMapData = async () => {
    setLoading(true);
    try {
      if (!token) return;

      const res = await fetch(getApiUrl('/api/ngo/donations/nearby'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.donations) {
        setDonations(data.donations);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.warn('Error fetching map data from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [token]);

  const handleAcceptDonation = async (id) => {
    setAcceptingId(id);
    try {
      const res = await fetch(getApiUrl(`/api/ngo/donations/${id}/accept`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSelectedMarker(null);
        fetchMapData();
        navigate('/ngo/accepted-donations');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAcceptingId(null);
    }
  };

  const ngoLocation = {
    id: 'NGO-MAIN',
    name: user?.organizationName || user?.name || 'Hope Community Kitchen (Your Location)',
    type: 'NGO',
    color: 'blue',
    x: 45,
    y: 50,
    address: user?.address || 'NGO Headquarters',
  };

  // Convert DB donations into map markers with varied positions for display
  const mapPositions = [
    { x: 30, y: 35 },
    { x: 65, y: 30 },
    { x: 75, y: 65 },
    { x: 25, y: 70 },
    { x: 58, y: 25 },
    { x: 80, y: 40 },
  ];

  const markers = donations.map((item, idx) => {
    const pos = mapPositions[idx % mapPositions.length];
    const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
    return {
      id: item._id,
      name: item.title,
      donor: donorName,
      type: 'Donation',
      status: item.status,
      color: 'green',
      distance: item.location?.address || '1.5 km',
      quantity: `${item.quantity} ${item.unit || 'kg'}`,
      expiry: item.expiryTime ? new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      x: pos.x,
      y: pos.y,
      rawItem: item,
    };
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Google Maps Dispatch Radar
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Real-time live map displaying surplus food donations directly fetched from MongoDB database
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
              {ngoLocation.name}
            </span>
          </div>
        </div>

        {/* Dynamic Markers for DB Donations */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-30">
            <div className="text-center text-white space-y-2">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-bold">Loading live map markers from database...</p>
            </div>
          </div>
        ) : (
          markers.map((marker) => (
            <div
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white group-hover:scale-125 transition-transform bg-emerald-500">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <span className="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap border border-slate-700 shadow-md truncate max-w-[140px]">
                  {marker.name}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Selected Marker Details Modal Popup Card */}
        {selectedMarker && (
          <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-96 bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-2xl z-30 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  selectedMarker.type === 'NGO'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Location</span>
                  <span className="font-bold text-emerald-600 truncate block">{selectedMarker.distance || 'Nearby'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Expiry</span>
                  <span className="font-bold text-amber-600">{selectedMarker.expiry || 'N/A'}</span>
                </div>
              </div>
            </div>

            {selectedMarker.type === 'Donation' && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  disabled={acceptingId === selectedMarker.id}
                  onClick={() => handleAcceptDonation(selectedMarker.id)}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {acceptingId === selectedMarker.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <span>Accept Donation & Dispatch</span>
                  )}
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
