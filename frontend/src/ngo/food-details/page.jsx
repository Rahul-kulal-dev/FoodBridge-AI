import React, { useState } from 'react';
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
  Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Food Details Page (/ngo/food-details)
 */
const FoodDetailsPage = () => {
  const navigate = useNavigate();

  const foodItem = {
    id: 'DON-9041',
    name: 'Fresh Prepared Lunch Meals (Paneer Curry, Naan & Veg Rice Trays)',
    category: 'Cooked Meals',
    description: 'Freshly prepared vegetarian catering surplus from a corporate lunch banquet. Maintained in high-temp stainless thermal carriers.',
    quantity: '120 Portions',
    weight: '65 kg Total Weight',
    packaging: 'Insulated Food-Grade Thermal Containers & Sealed Trays',
    preparedTime: 'Today at 1:30 PM',
    expiryTime: '3 Hours Remaining (Expires 6:30 PM)',
    freshnessScore: 98,
    recommendedPriority: 'HIGH PRIORITY — Dispatch within 45 Mins',
    donor: {
      name: 'Grand Palace Hotel & Banquets',
      email: 'logistics@grandpalace.com',
      phone: '+91 98765 43210',
      address: '74 MG Road, Sector 4, Metro City',
      verificationStatus: 'Verified Tier 1 Donor',
      avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
    },
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    ],
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ID: {foodItem.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Food Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
            {/* Main Featured Image */}
            <div className="relative h-80 w-full rounded-xl overflow-hidden bg-slate-900 group">
              <img
                src={foodItem.images[activeImageIndex]}
                alt={foodItem.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                {foodItem.freshnessScore}% AI Score
              </div>

              {/* Prev / Next Controls */}
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === 0 ? foodItem.images.length - 1 : prev - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#0F172A] shadow-md transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === foodItem.images.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#0F172A] shadow-md transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Carousel Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {foodItem.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[#E7EAF0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Priority Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold text-[#0F172A]">AI Dispatch Priority Recommendation</h4>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">{foodItem.recommendedPriority}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info & Donor Profile */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
            <div>
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">
                {foodItem.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
                {foodItem.name}
              </h1>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{foodItem.description}</p>
            </div>

            {/* Metric Details Cards Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-4 rounded-xl border border-[#E7EAF0]">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Quantity</span>
                <span className="font-extrabold text-[#0F172A] text-sm">{foodItem.quantity}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Total Weight</span>
                <span className="font-extrabold text-[#0F172A] text-sm">{foodItem.weight}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Prepared Time</span>
                <span className="font-bold text-[#0F172A]">{foodItem.preparedTime}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Expiry Deadline</span>
                <span className="font-bold text-amber-600">{foodItem.expiryTime}</span>
              </div>
            </div>

            {/* Packaging Details */}
            <div>
              <h4 className="text-xs font-extrabold text-[#0F172A]">Packaging & Storage Conditions</h4>
              <p className="text-xs text-[#334155] mt-1 font-medium bg-slate-50 p-3 rounded-xl border border-[#E7EAF0]">
                {foodItem.packaging}
              </p>
            </div>

            {/* Donor Info Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E7EAF0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={foodItem.donor.avatar}
                    alt={foodItem.donor.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{foodItem.donor.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                      {foodItem.donor.verificationStatus}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${foodItem.donor.phone}`}
                  className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-600 border border-[#E7EAF0] text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              </div>

              <div className="text-xs text-[#64748B] flex items-center gap-1.5 pt-2 border-t border-[#E7EAF0]">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{foodItem.donor.address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => navigate('/ngo/accepted-donations')}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-emerald-btn transition-all text-center cursor-pointer"
              >
                Accept Donation & Dispatch Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsPage;
