import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  Navigation,
  ArrowRight,
  Loader2,
  Utensils
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';
import OpenStreetMap from '../../components/OpenStreetMap';

/**
 * Track Volunteer Page (/ngo/track-volunteer)
 * Displays live tracking for accepted donations from MongoDB database.
 */
const TrackVolunteerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationIdParam = searchParams.get('id');
  const { token, user } = useAuth();

  const [activeDonation, setActiveDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrackData = async () => {
    setLoading(true);
    try {
      if (!token) return;

      let targetUrl = getApiUrl('/api/ngo/donations/history');
      if (donationIdParam) {
        targetUrl = getApiUrl(`/api/ngo/donations/${donationIdParam}`);
      }

      const res = await fetch(targetUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        if (data.donation) {
          setActiveDonation(data.donation);
        } else if (data.donations && data.donations.length > 0) {
          setActiveDonation(data.donations[0]);
        } else {
          setActiveDonation(null);
        }
      } else {
        setActiveDonation(null);
      }
    } catch (err) {
      console.warn('Error fetching tracking data from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackData();
  }, [token, donationIdParam]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold">Loading live tracking from database...</p>
      </div>
    );
  }

  if (!activeDonation) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Truck className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-[#0F172A]">No Active Deliveries Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Accept a surplus food donation to track live volunteer courier dispatching.
        </p>
        <button
          onClick={() => navigate('/ngo/accepted-donations')}
          className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-emerald-btn"
        >
          View Accepted Queue
        </button>
      </div>
    );
  }

  const docId = `DON-${activeDonation._id.slice(-4).toUpperCase()}`;
  const volunteerObj = activeDonation.volunteerId || {};
  const volunteerName = volunteerObj.name || 'Express Dispatch Courier';
  const volunteerPhone = volunteerObj.phone || 'N/A';
  const donorName = activeDonation.donorId?.organizationName || activeDonation.donorId?.name || 'Food Donor';
  const ngoName = user?.organizationName || user?.name || 'NGO Partner';

  const timelineSteps = [
    { label: 'Assigned', time: '2:30 PM', completed: true },
    { label: 'Accepted', time: '2:35 PM', completed: true },
    { label: 'Picked Up', time: activeDonation.status === 'picked_up' || activeDonation.status === 'delivered', completed: activeDonation.status === 'picked_up' || activeDonation.status === 'delivered' },
    { label: 'In Transit', time: activeDonation.status === 'picked_up' ? 'Active' : 'Pending', completed: activeDonation.status === 'picked_up', active: activeDonation.status === 'picked_up' },
    { label: 'Delivered', time: activeDonation.status === 'delivered' ? 'Completed' : 'Estimated', completed: activeDonation.status === 'delivered' },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Live Volunteer Courier Dispatch
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Tracking order <span className="font-mono font-bold text-[#0F172A]">{docId}</span> — {activeDonation.title}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          Live Database Connection
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Volunteer Card & Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Volunteer Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xl flex items-center justify-center ring-4 ring-emerald-500/20 shadow-md">
                {volunteerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">{volunteerName}</h3>
                <p className="text-xs text-[#64748B]">Eco Courier Partner</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Courier
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Delivery Status</span>
                <span className="font-bold text-emerald-700 uppercase">{activeDonation.status}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Estimated ETA</span>
                <span className="font-bold text-emerald-600">12 Mins</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {volunteerPhone !== 'N/A' && (
                <a
                  href={`tel:${volunteerPhone}`}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Courier</span>
                </a>
              )}
              <button
                onClick={() => navigate('/ngo/notifications')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Progress Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Pickup & Delivery Progress Timeline</h3>

            <div className="space-y-4 pt-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx !== timelineSteps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                        step.completed ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                      step.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : step.active
                        ? 'bg-amber-500 text-white animate-pulse shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-extrabold ${
                          step.completed || step.active ? 'text-[#0F172A]' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-[10px] font-bold text-[#64748B]">{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live GPS Route Map Container */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-[#E7EAF0] shadow-xl overflow-hidden min-h-[480px] relative">
          <OpenStreetMap
            markers={[
              {
                lat: 12.9680,
                lng: 77.5890,
                title: `Courier: ${volunteerName}`,
                description: `Status: ${activeDonation.status.toUpperCase()}`,
                iconType: 'courier',
              },
              {
                lat: 12.9750,
                lng: 77.6000,
                title: `Donor: ${donorName}`,
                description: activeDonation.donorId?.address || activeDonation.pickupAddress || 'Pickup Location',
                iconType: 'donor',
              },
              {
                lat: 12.9850,
                lng: 77.6150,
                title: `NGO: ${ngoName}`,
                description: user?.address || 'NGO Dropoff Hub',
                iconType: 'ngo',
              },
            ]}
            drawRoute={true}
            className="w-full h-full min-h-[480px]"
          />

          {/* Map Live Floating Indicators */}
          <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1 pointer-events-auto shadow-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Destination</span>
              <p className="font-extrabold">{ngoName}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-bold flex items-center gap-2 pointer-events-auto shadow-xl">
              <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Status: {activeDonation.status.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackVolunteerPage;