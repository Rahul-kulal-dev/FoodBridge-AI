import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Navigation,
  ShoppingBag,
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  Layers,
  Crosshair,
  Loader2,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';
import OpenStreetMap from '../../components/OpenStreetMap';

/**
 * NGO OpenStreetMap Integration Page (/ngo/maps)
 * Maps live database donations and volunteer dispatch positions.
 */
const NgoMapsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [volunteerPickerDonationId, setVolunteerPickerDonationId] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  const [volunteerError, setVolunteerError] = useState('');

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
      console.warn('Error fetching map donations from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [token]);

  const fetchVolunteers = async () => {
    setLoadingVolunteers(true);
    try {
      const res = await fetch(getApiUrl('/api/ngo/volunteers'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.volunteers) {
        setVolunteers(data.volunteers);
      }
    } catch (err) {
      console.warn('Error fetching volunteers:', err);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  const handleAcceptDonation = (id) => {
    setSelectedMarker(null);
    setVolunteerPickerDonationId(id);
    setSelectedVolunteerId('');
    setVolunteerError('');
    fetchVolunteers();
  };

  const confirmAccept = async () => {
    if (!volunteerPickerDonationId) return;
    if (!selectedVolunteerId) {
      setVolunteerError('Please select a volunteer courier to proceed.');
      return;
    }
    setVolunteerError('');
    setAcceptingId(volunteerPickerDonationId);
    try {
      const res = await fetch(getApiUrl(`/api/ngo/donations/${volunteerPickerDonationId}/accept`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ volunteerId: selectedVolunteerId }),
      });

      if (res.ok) {
        setVolunteerPickerDonationId(null);
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
    name: user?.organizationName || user?.name || 'NGO Hub (Your Location)',
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

  const ngoOsmMarker = {
    lat: user?.location?.lat || 12.9716,
    lng: user?.location?.lng || 77.5946,
    title: user?.organizationName || user?.name || 'NGO Hub (Your Location)',
    description: user?.address || 'NGO Headquarters',
    iconType: 'ngo',
  };

  const donationOsmMarkers = donations.map((d, idx) => {
    const latOffset = (idx % 2 === 0 ? 1 : -1) * (0.008 + (idx * 0.005));
    const lngOffset = (idx % 3 === 0 ? -1 : 1) * (0.007 + (idx * 0.004));
    return {
      lat: (user?.location?.lat || 12.9716) + latOffset,
      lng: (user?.location?.lng || 77.5946) + lngOffset,
      title: d.title || `${d.foodType} (${d.quantity} ${d.unit})`,
      description: `Donor: ${d.donorId?.organizationName || d.donorId?.name || 'Verified Donor'} • Expiry: ${d.expiryDate ? new Date(d.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}`,
      iconType: 'donor',
    };
  });

  const allOsmMarkers = [ngoOsmMarker, ...donationOsmMarkers];

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            NGO OpenStreetMap Radar & Surplus Heatmap
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 sm:mt-1 font-medium">
            Live map layer tracking active surplus donations and volunteer couriers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {donations.length} Active Donations
          </span>
        </div>
      </div>

      {/* Main Interactive Map Container */}
      <div className="relative w-full h-[540px] bg-slate-900 rounded-2xl border border-[#E7EAF0] overflow-hidden shadow-xl">
        <OpenStreetMap markers={allOsmMarkers} drawRoute={false} className="w-full h-full" />

        {/* Selected Marker Details Modal Popup Card */}
        {selectedMarker && (
          <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-96 bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-2xl z-30 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  selectedMarker.type === 'NGO'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                <img
                  src={selectedMarker.type === 'NGO' ? '/imgs/ngo.png' : '/imgs/donor.png'}
                  alt={selectedMarker.type}
                  className="w-3.5 h-3.5 object-contain"
                />
                <span>{selectedMarker.type}</span>
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

      {/* Volunteer Selection Modal */}
      {volunteerPickerDonationId &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#E7EAF0] shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Assign Volunteer</h3>
                  <p className="text-xs text-slate-500">Select a volunteer courier for this donation</p>
                </div>
              </div>

              {volunteerError && (
                <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200 font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{volunteerError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Volunteer Courier *</label>
                {loadingVolunteers ? (
                  <div className="flex items-center gap-2 py-3 text-xs text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading volunteers...
                  </div>
                ) : volunteers.length === 0 ? (
                  <p className="text-xs text-rose-500 py-3 font-semibold">No volunteers registered in system yet.</p>
                ) : (
                  <select
                    value={selectedVolunteerId}
                    onChange={(e) => {
                      setSelectedVolunteerId(e.target.value);
                      if (e.target.value) setVolunteerError('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">-- Select a volunteer courier --</option>
                    {volunteers.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} {v.phone ? `(${v.phone})` : ''} {v.activeTaskCount > 0 ? `[${v.activeTaskCount} active deliveries]` : '[Available]'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVolunteerPickerDonationId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={acceptingId === volunteerPickerDonationId}
                  onClick={confirmAccept}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-emerald-btn transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {acceptingId === volunteerPickerDonationId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept & Assign'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NgoMapsPage;
