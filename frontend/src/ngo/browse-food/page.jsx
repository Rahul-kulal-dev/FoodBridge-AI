import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ShoppingBag,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Utensils,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';
import FoodImageSlideshow from '../../components/FoodImageSlideshow';

/**
 * Browse Nearby Food Page (/ngo/browse-food)
 * Fetches surplus food listings directly from MongoDB database.
 */
const BrowseFoodPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Distance');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);

  const fetchAvailableDonations = async () => {
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
      console.warn('Error fetching nearby donations from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, [token]);

  const handleAcceptDonation = async (foodId) => {
    if (user?.verificationStatus !== 'approved') {
      setShowUnverifiedModal(true);
      return;
    }

    setAcceptingId(foodId);
    try {
      const res = await fetch(getApiUrl(`/api/ngo/donations/${foodId}/accept`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage({ type: 'success', text: 'Donation accepted successfully!' });
        fetchAvailableDonations();
        setTimeout(() => {
          navigate('/ngo/accepted-donations');
        }, 800);
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to accept donation' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Server error accepting donation' });
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredItems = useMemo(() => {
    return donations.filter((item) => {
      const donorName = item.donorId?.organizationName || item.donorId?.name || '';
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const itemFoodType = (item.foodType || '').toLowerCase();
      const catQuery = categoryFilter === 'Fruits_veg' ? 'fruit' : categoryFilter.toLowerCase();
      const matchesCategory =
        categoryFilter === 'All' ||
        itemFoodType.includes(catQuery);

      const matchesFoodType =
        foodTypeFilter === 'All' ||
        itemFoodType.includes(foodTypeFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesFoodType;
    });
  }, [donations, searchTerm, categoryFilter, foodTypeFilter]);

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.03em]">
            Browse Nearby Surplus Food
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium max-w-xl">
            Explore active surplus food donations available for immediate pickup
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            AI Verified Freshness Engine
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fade-in ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter & Search Controls Bar */}
      <div className="bg-white p-5 rounded-[20px] border border-slate-200/80 shadow-xs space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food item or donor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 bg-[#F8FAFC] font-medium"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs font-extrabold text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 bg-white focus:outline-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="Distance">Nearest Location</option>
              <option value="Expiry">Earliest Expiry</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-extrabold text-slate-400 text-[11px] uppercase tracking-wider mr-1">Category:</span>
          {['All', 'Cooked', 'Bakery', 'Packaged', 'Fruits_veg', 'Raw'].map((cat) => {
            const displayLabel = cat === 'Fruits_veg' ? 'Fruits & Veg' : cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer text-xs ${
                  categoryFilter === cat
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Cards Grid */}
      {loading ? (
        <div className="bg-white p-16 rounded-[20px] border border-slate-200/80 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading available surplus food from database...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-16 rounded-[20px] border border-slate-200/80 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16A34A] mx-auto flex items-center justify-center border border-emerald-100">
            <Utensils className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-[#0F172A]">No Food Donations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {donations.length === 0
              ? 'No donors have listed surplus food yet.'
              : 'Try clearing your search or category filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
            const expiryStr = item.expiryTime ? new Date(item.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
            const rawImg = item.image || item.imageUrl;
            const imgSrc = rawImg ? getImageUrl(rawImg) : null;
            const cleanLocation = (item.location?.address || item.pickupAddress || 'Nearby Location').replace(/^Current Location:\s*/i, '');

            return (
              <div
                key={item._id}
                className="bg-white rounded-[20px] border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image Header Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  <FoodImageSlideshow
                    image={item.image}
                    images={item.images}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-500"
                  />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-black text-slate-800 shadow-sm uppercase border border-slate-200/60">
                      {item.foodType || 'Cooked'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-[#16A34A] text-white text-[10px] font-black shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      Freshness Verified
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#0F172A] line-clamp-1 group-hover:text-[#16A34A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-2 leading-relaxed">
                      {item.description || 'Fresh surplus food available for pickup and distribution.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Quantity</span>
                      <span className="font-black text-slate-900">{item.quantity} {item.unit || 'kg'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Expiry Time</span>
                      <span className="font-black text-amber-600 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" /> {expiryStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 gap-2">
                    <span className="font-extrabold text-slate-800 truncate">{donorName}</span>
                    <span className="inline-flex items-center gap-1 text-[#16A34A] font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 text-[11px] truncate max-w-[160px] shrink-0" title={cleanLocation}>
                      <MapPin className="w-3 h-3 text-[#16A34A] shrink-0" />
                      <span className="truncate">{cleanLocation}</span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/ngo/food-details?id=${item._id}`)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      disabled={acceptingId === item._id}
                      onClick={() => handleAcceptDonation(item._id)}
                      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer bg-[#16A34A] hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {acceptingId === item._id ? (
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
              </div>
            );
          })}
        </div>
      )}

      {/* Verification Required Modal */}
      {showUnverifiedModal &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <ShieldAlert className="w-6 h-6" />
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
                  className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
                >
                  Complete Verification
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BrowseFoodPage;
