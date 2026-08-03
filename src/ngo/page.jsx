import React, { useState } from 'react';
import {
  ShoppingBag,
  Map,
  BadgeCheck,
  Sparkles,
  Utensils,
  PackageCheck,
  Clock,
  MapPin,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * NGO Dashboard Main Overview Page (/ngo)
 */
const NgoDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [acceptedIds, setAcceptedIds] = useState([]);

  const stats = [
    {
      label: 'MEALS RECEIVED',
      value: '18,450',
      icon: Utensils,
    },
    {
      label: 'ACTIVE DONATIONS',
      value: '8',
      icon: PackageCheck,
    },
    {
      label: 'NEARBY DONATIONS',
      value: '15',
      icon: MapPin,
    },
    {
      label: 'VOLUNTEER ETA',
      value: '12 mins',
      icon: Clock,
    },
  ];

  const nearbyDonations = [
    {
      id: 'DON-9041',
      foodType: 'Prepared Meals & Rice Trays',
      quantity: '120 Portions',
      distance: '1.2 km',
      donor: 'Grand Palace Hotel & Catering',
      expiry: '3 Hours',
      status: 'Available',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      freshnessScore: 98,
    },
    {
      id: 'DON-9040',
      foodType: 'Artisan Bakery Bread & Buns',
      quantity: '40 kg',
      distance: '2.5 km',
      donor: 'Daily Harvest Bakery',
      expiry: '6 Hours',
      status: 'Available',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      freshnessScore: 95,
    },
    {
      id: 'DON-9038',
      foodType: 'Fresh Organic Produce & Fruits',
      quantity: '85 kg',
      distance: '3.1 km',
      donor: 'GreenHarvest Market',
      expiry: '12 Hours',
      status: 'Reserved',
      statusColor: 'bg-amber-50 text-amber-700 border border-amber-200/80',
      freshnessScore: 92,
    },
    {
      id: 'DON-9035',
      foodType: 'Packaged Dairy & Milk Items',
      quantity: '60 Units',
      distance: '4.8 km',
      donor: 'Metro Supermarket',
      expiry: '1 Hour',
      status: 'Available',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      freshnessScore: 89,
    },
    {
      id: 'DON-9030',
      foodType: 'Canned Soups & Pantry Goods',
      quantity: '200 Cans',
      distance: '5.4 km',
      donor: 'City Retail Logistics',
      expiry: 'Picked Up',
      status: 'Picked Up',
      statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]',
      freshnessScore: 100,
    },
  ];

  const handleAccept = (item) => {
    setAcceptedIds([...acceptedIds, item.id]);
    setSelectedDonation(null);
    navigate('/ngo/accepted-donations');
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Hero Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Welcome back, <span className="text-emerald-600">Hope Community</span> Kitchen
          </h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 w-fit">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified NGO Badge
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

      {/* Statistics Cards - 2 cols on mobile, 4 cols on desktop */}
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
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em] truncate">
                  {stat.value}
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
            <Sparkles className="w-4 h-4 fill-emerald-600" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
            <span className="text-emerald-700 font-extrabold">AI Recommendation:</span> 15 fresh food donations are available within 5 km.
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
              Real-time available surplus food matching your serving area
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

        {/* Mobile View Card List (< md) */}
        <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
          {nearbyDonations.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc]/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E7EAF0]">
                  {item.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    acceptedIds.includes(item.id)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : item.statusColor
                  }`}
                >
                  {acceptedIds.includes(item.id) ? 'Reserved' : item.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-xs text-[#0F172A]">{item.foodType}</div>
                <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                  {item.quantity} • Offered by {item.donor}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7EAF0]/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {item.distance}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {item.expiry}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedDonation(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop & Tablet Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8fb] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E7EAF0]">
                <th className="py-3.5 px-6">Donation ID</th>
                <th className="py-3.5 px-6">Food Type</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6">Distance</th>
                <th className="py-3.5 px-6">Donor</th>
                <th className="py-3.5 px-6">Expiry</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF0] text-xs font-medium text-[#334155]">
              {nearbyDonations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0F172A]">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.foodType}</td>
                  <td className="py-4 px-6">{item.quantity}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {item.distance}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium">{item.donor}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {item.expiry}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        acceptedIds.includes(item.id)
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : item.statusColor
                      }`}
                    >
                      {acceptedIds.includes(item.id) ? 'Reserved' : item.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7EAF0]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedDonation.id}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">{selectedDonation.distance} away</span>
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
                <h3 className="text-lg font-black text-[#0F172A]">{selectedDonation.foodType}</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Offered by {selectedDonation.donor}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
                <div>
                  <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Quantity</span>
                  <span className="font-bold text-[#0F172A] text-sm">{selectedDonation.quantity}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Expiry Time</span>
                  <span className="font-bold text-amber-600 text-sm">{selectedDonation.expiry}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-semibold text-[10px] uppercase">AI Freshness</span>
                  <span className="font-bold text-emerald-600 text-sm">{selectedDonation.freshnessScore}% Verified</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Pickup Status</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedDonation.status}</span>
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
                onClick={() => handleAccept(selectedDonation)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer"
              >
                Accept Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboardPage;
