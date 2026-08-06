import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ShoppingBag,
  Map,
  BadgeCheck,
  Utensils,
  PackageCheck,
  Clock,
  MapPin,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl, getImageUrl } from '../config/api';

/**
 * NGO Dashboard Main Overview Page (/ngo)
 * Removes hardcoded data and fetches directly from MongoDB Atlas database.
 */
const NgoDashboardPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    mealsReceived: 0,
    activeDonations: 0,
    nearbyDonations: 0,
  });
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [volunteerPickerItem, setVolunteerPickerItem] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats & nearby donations in parallel
      const [statsRes, nearbyRes] = await Promise.all([
        fetch(getApiUrl('/api/ngo/stats'), { headers }),
        fetch(getApiUrl('/api/ngo/donations/nearby'), { headers }),
      ]);

      const statsJson = await statsRes.json();
      const nearbyJson = await nearbyRes.json();

      if (statsRes.ok && statsJson.stats) {
        setStatsData(statsJson.stats);
      }

      if (nearbyRes.ok && nearbyJson.donations) {
        setNearbyDonations(nearbyJson.donations);
      } else {
        setNearbyDonations([]);
      }
    } catch (err) {
      console.warn('Error fetching NGO dashboard data from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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

  const handleAccept = (item) => {
    setSelectedDonation(null);
    setVolunteerPickerItem(item);
    setSelectedVolunteerId('');
    fetchVolunteers();
  };

  const confirmAccept = async () => {
    if (!volunteerPickerItem) return;
    setAcceptingId(volunteerPickerItem._id);
    try {
      const body = {};
      if (selectedVolunteerId) body.volunteerId = selectedVolunteerId;

      const res = await fetch(getApiUrl(`/api/ngo/donations/${volunteerPickerItem._id}/accept`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage({ type: 'success', text: 'Donation accepted successfully!' });
        setVolunteerPickerItem(null);
        fetchDashboardData();
        setTimeout(() => {
          navigate('/ngo/accepted-donations');
        }, 800);
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to accept donation' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Server error while accepting donation' });
    } finally {
      setAcceptingId(null);
    }
  };

  const stats = [
    {
      label: 'MEALS RECEIVED',
      value: statsData.mealsReceived.toLocaleString(),
      icon: Utensils,
    },
    {
      label: 'ACTIVE DONATIONS',
      value: statsData.activeDonations,
      icon: PackageCheck,
    },
    {
      label: 'NEARBY DONATIONS',
      value: statsData.nearbyDonations,
      icon: MapPin,
    },
  ];

  const ngoName = user?.organizationName || user?.name || 'NGO Partner';
  const isVerified = user?.verificationStatus === 'approved';

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Hero Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Welcome back, <span className="text-emerald-600">{ngoName}</span>
          </h1>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
            isVerified 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : 'bg-amber-50 text-amber-700 border border-amber-200/80'
          }`}>
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            {isVerified ? 'Verified NGO Badge' : 'Verification Pending'}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            to="/ngo/browse-food"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Browse Food</span>
          </Link>
          <Link
            to="/ngo/maps"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.01] text-center"
          >
            <Map className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Nearby Map</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fade-in ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider line-clamp-1">
                  {stat.label}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 shrink-0">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div
                  className={`font-black text-[#0F172A] tracking-[-0.03em] ${
                    typeof stat.value === 'string' && stat.value.length > 6
                      ? 'text-sm sm:text-base lg:text-lg leading-snug'
                      : 'text-xl sm:text-2xl lg:text-3xl'
                  }`}
                >
                  {loading ? '...' : stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <Utensils className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
            <span className="text-emerald-700 font-extrabold">AI Recommendation:</span> {nearbyDonations.length} fresh food donations are currently available in your region.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <Link
            to="/ngo/browse-food"
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 text-center truncate"
          >
            Browse Food
          </Link>
          <Link
            to="/ngo/maps"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold transition-all duration-200 text-center truncate"
          >
            Open Map
          </Link>
        </div>
      </div>

      {/* Nearby Food Table Section */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E7EAF0] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
              Nearby Surplus Food
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Real-time available surplus food listings
            </p>
          </div>
          <Link
            to="/ngo/browse-food"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Fetching live donations from database...</p>
          </div>
        ) : nearbyDonations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#0F172A]">No Available Surplus Food Right Now</h3>
            <p className="text-xs text-slate-500">Check back soon or browse all listings.</p>
          </div>
        ) : (
          <>
            {/* Mobile View Card List (< md) */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {nearbyDonations.map((item) => {
                const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                const donorName = item.donorId?.organizationName || item.donorId?.name || 'Anonymous Donor';
                const expiryDate = item.expiryTime ? new Date(item.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                return (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc]/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E7EAF0]">
                        {docId}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        {item.status || 'Available'}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{item.title}</div>
                      <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                        {item.quantity} {item.unit || 'kg'} • Offered by {donorName}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E7EAF0]/60 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {item.location?.address || 'Nearby'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {expiryDate}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedDonation(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f8fb] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E7EAF0]">
                    <th className="py-3.5 px-6">Donation ID</th>
                    <th className="py-3.5 px-6">Food Title</th>
                    <th className="py-3.5 px-6">Quantity</th>
                    <th className="py-3.5 px-6">Location</th>
                    <th className="py-3.5 px-6">Donor</th>
                    <th className="py-3.5 px-6">Expiry</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAF0] text-xs font-medium text-[#334155]">
                  {nearbyDonations.map((item) => {
                    const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                    const donorName = item.donorId?.organizationName || item.donorId?.name || 'Anonymous Donor';
                    const expiryDate = item.expiryTime ? new Date(item.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#0F172A] font-mono">{docId}</td>
                        <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.title}</td>
                        <td className="py-4 px-6">{item.quantity} {item.unit || 'kg'}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {item.location?.address || 'Nearby'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium">{donorName}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {expiryDate}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase text-[10px]">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedDonation(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 font-bold transition-all border border-transparent hover:border-emerald-200 cursor-pointer text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedDonation &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#E7EAF0] shadow-2xl max-w-lg w-full p-6 animate-scale-up">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7EAF0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    DON-{selectedDonation._id.slice(-4).toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B]">{selectedDonation.location?.address || 'Nearby'}</span>
                </div>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-5 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">{selectedDonation.title}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Offered by {selectedDonation.donorId?.organizationName || selectedDonation.donorId?.name || 'Donor'}
                  </p>
                  {selectedDonation.description && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {selectedDonation.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
                  <div>
                    <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Quantity</span>
                    <span className="font-bold text-[#0F172A] text-sm">{selectedDonation.quantity} {selectedDonation.unit || 'kg'}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Food Category</span>
                    <span className="font-bold text-emerald-700 text-sm capitalize">{selectedDonation.foodType || 'Cooked'}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Expiry Time</span>
                    <span className="font-bold text-amber-600 text-sm">
                      {new Date(selectedDonation.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Status</span>
                    <span className="font-bold text-emerald-700 text-sm uppercase">{selectedDonation.status}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  disabled={acceptingId === selectedDonation._id}
                  onClick={() => handleAccept(selectedDonation)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {acceptingId === selectedDonation._id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <span>Accept Donation</span>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Volunteer Selection Modal */}
      {volunteerPickerItem &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#E7EAF0] shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Assign Volunteer</h3>
                  <p className="text-xs text-slate-500">Select a volunteer courier for <strong>"{volunteerPickerItem.title}"</strong></p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Volunteer</label>
                {loadingVolunteers ? (
                  <div className="flex items-center gap-2 py-3 text-xs text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading volunteers...
                  </div>
                ) : volunteers.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No volunteers registered yet.</p>
                ) : (
                  <select
                    value={selectedVolunteerId}
                    onChange={(e) => setSelectedVolunteerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">-- No volunteer (assign later) --</option>
                    {volunteers.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} {v.phone ? `(${v.phone})` : ''} {v.verificationStatus === 'approved' ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVolunteerPickerItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={acceptingId === volunteerPickerItem._id}
                  onClick={confirmAccept}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-emerald-btn transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {acceptingId === volunteerPickerItem._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept & Assign'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NgoDashboardPage;
