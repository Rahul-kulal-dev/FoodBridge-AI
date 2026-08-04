import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Utensils,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';

/**
 * Browse Nearby Food Page (/ngo/browse-food)
 * Fetches surplus food listings directly from MongoDB database.
 */
const BrowseFoodPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Distance');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

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
    // BUSINESS RULE: Only Verified NGOs can accept food donations
    if (user?.verificationStatus !== 'approved') {
      setActionMessage({
        type: 'error',
        text: 'Only Verified NGOs can accept food donations. Please complete mandatory document verification first.',
      });
      setTimeout(() => {
        navigate('/ngo/verification');
      }, 1500);
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
      const matchesCategory =
        categoryFilter === 'All' ||
        itemFoodType.includes(categoryFilter.toLowerCase());

      const matchesFoodType =
        foodTypeFilter === 'All' ||
        itemFoodType.includes(foodTypeFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesFoodType;
    });
  }, [donations, searchTerm, categoryFilter, foodTypeFilter]);

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Browse Nearby Surplus Food
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Explore active surplus food donations fetched directly from MongoDB database
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
            AI Verified Freshness Engine
          </span>
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

      {/* Filter & Search Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food item or donor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb]"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E7EAF0] text-xs font-bold text-[#0F172A] bg-white focus:outline-emerald-500 cursor-pointer"
            >
              <option value="Distance">Nearest Location</option>
              <option value="Expiry">Earliest Expiry</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="pt-3 border-t border-[#E7EAF0] flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider mr-1">Category:</span>
          {['All', 'Cooked', 'Bakery', 'Packaged', 'Fruits_veg', 'Raw'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer text-xs ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading available surplus food from database...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A]">No Food Donations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {donations.length === 0
              ? 'No donors have listed surplus food yet.'
              : 'Try clearing your search or category filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
            const expiryStr = item.expiryTime ? new Date(item.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
            const imgSrc = getImageUrl(item.image);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Header Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center gap-2">
                      <Utensils className="w-8 h-8" />
                      <span className="text-xs font-bold text-emerald-700">Surplus Food</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-extrabold text-[#0F172A] shadow-xs uppercase">
                      {item.foodType || 'Cooked'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-white" />
                      Freshness Verified
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F172A] line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                      {item.description || 'Fresh surplus food available for pickup and distribution.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E7EAF0] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#64748B] text-[10px] font-bold uppercase block">Quantity</span>
                      <span className="font-extrabold text-[#0F172A]">{item.quantity} {item.unit || 'kg'}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[10px] font-bold uppercase block">Expiry Time</span>
                      <span className="font-extrabold text-amber-600 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" /> {expiryStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 text-[#64748B] font-medium truncate">
                      <span className="font-bold text-[#0F172A]">{donorName}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px] shrink-0">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {item.location?.address || 'Nearby'}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/ngo/food-details?id=${item._id}`)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      disabled={acceptingId === item._id}
                      onClick={() => handleAcceptDonation(item._id)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-emerald-btn cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-1 disabled:opacity-50"
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
    </div>
  );
};

export default BrowseFoodPage;
