import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Utensils
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';

/**
 * Food Details Page (/ngo/food-details)
 * Displays detailed information about a specific donation from MongoDB database.
 */
const FoodDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationIdParam = searchParams.get('id');
  const { token } = useAuth();

  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

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

  const handleAcceptDonation = async () => {
    if (!foodItem?._id) return;
    setAccepting(true);
    try {
      const res = await fetch(getApiUrl(`/api/ngo/donations/${foodItem._id}/accept`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage({ type: 'success', text: 'Donation accepted successfully!' });
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
        <p className="text-xs text-slate-500 font-bold">Loading donation details from database...</p>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-[#0F172A]">Donation Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested donation listing does not exist in the database or has already been completed.
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
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fade-in ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
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
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={foodItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center gap-2">
                  <Utensils className="w-12 h-12" />
                  <span className="text-sm font-bold text-emerald-700">Surplus Food Photo</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                AI Freshness Verified
              </div>
            </div>
          </div>

          {/* Recommended Priority Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold text-[#0F172A]">AI Dispatch Priority Recommendation</h4>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">HIGH PRIORITY — Recommended for immediate NGO dispatch</p>
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
    </div>
  );
};

export default FoodDetailsPage;
