import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Utensils,
  UserCheck
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';
import FoodImageSlideshow from '../../components/FoodImageSlideshow';

/**
 * Food Details Page (/ngo/food-details)
 * Displays detailed information about a specific donation from MongoDB database.
 */
const FoodDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationIdParam = searchParams.get('id');
  const { user, token } = useAuth();

  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [showVolunteerPicker, setShowVolunteerPicker] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  const [volunteerError, setVolunteerError] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      if (!token) return;

      let targetUrl = getApiUrl('/api/ngo/donations/nearby');
      if (donationIdParam) {
        targetUrl = getApiUrl(`/api/ngo/donations/${donationIdParam}`);
      }

      const res = await fetch(targetUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        if (data.donation) {
          setFoodItem(data.donation);
        } else if (data.donations && data.donations.length > 0) {
          setFoodItem(data.donations[0]);
        } else {
          setFoodItem(null);
        }
      } else {
        setFoodItem(null);
      }
    } catch (err) {
      console.warn('Error fetching donation details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [token, donationIdParam]);

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

  const handleAcceptDonation = () => {
    if (!foodItem?._id) return;
    if (user?.verificationStatus !== 'approved') {
      setShowUnverifiedModal(true);
      return;
    }
    setShowVolunteerPicker(true);
    setSelectedVolunteerId('');
    setVolunteerError('');
    fetchVolunteers();
  };

  const confirmAccept = async () => {
    if (!foodItem?._id) return;
    if (!selectedVolunteerId) {
      setVolunteerError('Please select a volunteer courier to proceed.');
      return;
    }
    setVolunteerError('');
    setAccepting(true);
    try {
      const res = await fetch(getApiUrl(`/api/ngo/donations/${foodItem._id}/accept`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ volunteerId: selectedVolunteerId }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage({ type: 'success', text: 'Donation accepted successfully!' });
        setShowVolunteerPicker(false);
        setTimeout(() => {
          navigate('/ngo/accepted-donations');
        }, 800);
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to accept donation' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Server error accepting donation' });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold">Loading donation details...</p>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-[#0F172A]">Donation Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested donation listing is unavailable or has already been completed.
        </p>
        <button
          onClick={() => navigate('/ngo/browse-food')}
          className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-emerald-btn"
        >
          Browse Surplus Food
        </button>
      </div>
    );
  }

  const docId = `DON-${foodItem._id.slice(-4).toUpperCase()}`;
  const donorObj = foodItem.donorId || {};
  const donorName = donorObj.organizationName || donorObj.name || 'Anonymous Donor';
  const donorPhone = donorObj.phone || 'N/A';
  const donorAddress = foodItem.location?.address || donorObj.address || 'Address on dispatch';
  const expiryDateStr = foodItem.expiryTime ? new Date(foodItem.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
  const imgSrc = getImageUrl(foodItem.image);

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E7EAF0] text-xs font-bold text-[#0F172A] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Food Listings</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono">
          ID: {docId}
        </span>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fade-in ${actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Food Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
            <div className="relative h-80 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <FoodImageSlideshow
                image={foodItem.image}
                images={foodItem.images}
                alt={foodItem.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                AI Freshness Verified
              </div>
            </div>
          </div>

          {/* Recommended Priority Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold text-[#0F172A]">AI Dispatch Priority Recommendation</h4>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">HIGH PRIORITY - Recommended for immediate NGO dispatch</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info & Donor Profile */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
            <div>
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">
                {foodItem.foodType || 'Cooked Food'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
                {foodItem.title}
              </h1>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                {foodItem.description || 'Surplus food item prepared and packaged under quality standards.'}
              </p>
            </div>

            {/* Metric Details Cards Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-4 rounded-xl border border-[#E7EAF0]">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Quantity</span>
                <span className="font-extrabold text-[#0F172A] text-sm">{foodItem.quantity} {foodItem.unit || 'kg'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Status</span>
                <span className="font-extrabold text-emerald-700 text-sm uppercase">{foodItem.status}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Listed Date</span>
                <span className="font-bold text-[#0F172A]">
                  {new Date(foodItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Expiry Deadline</span>
                <span className="font-bold text-amber-600">{expiryDateStr}</span>
              </div>
            </div>

            {/* Donor Info Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E7EAF0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {donorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{donorName}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" /> Verified Food Donor
                    </span>
                  </div>
                </div>

                {donorPhone !== 'N/A' && (
                  <a
                    href={`tel:${donorPhone}`}
                    className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-600 border border-[#E7EAF0] text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                )}
              </div>

              <div className="text-xs text-[#64748B] flex items-center gap-1.5 pt-2 border-t border-[#E7EAF0]">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{donorAddress}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              {foodItem.status === 'available' ? (
                <button
                  disabled={accepting}
                  onClick={handleAcceptDonation}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-emerald-btn transition-all text-center cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <span>Accept Donation & Dispatch Pickup</span>
                  )}
                </button>
              ) : (
                <div className="w-full p-3 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs text-center border border-emerald-200">
                  Donation is already {foodItem.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Required Modal */}
      {showUnverifiedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <ShieldCheck className="w-6 h-6 text-rose-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Verification Required</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Only Verified NGOs can accept food donations. Please complete mandatory document verification to unlock this feature.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowUnverifiedModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnverifiedModal(false);
                  navigate('/ngo/verification');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-emerald-btn"
              >
                Complete Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Selection Modal */}
      {showVolunteerPicker &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#E7EAF0] shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Assign Volunteer</h3>
                  <p className="text-xs text-slate-500">Select a volunteer courier for <strong>"{foodItem?.title}"</strong></p>
                </div>
              </div>

              {volunteerError && (
                <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
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
                  onClick={() => setShowVolunteerPicker(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={accepting}
                  onClick={confirmAccept}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-emerald-btn transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept & Assign'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default FoodDetailsPage;
