import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  MapPin,
  User,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Accepted Donations Page (/ngo/accepted-donations)
 */
const AcceptedDonationsPage = () => {
  const navigate = useNavigate();

  const acceptedItems = [
    {
      id: 'DON-9041',
      food: 'Fresh Prepared Lunch Meals (120 Portions)',
      donor: 'Grand Palace Hotel',
      volunteer: 'Rahul Verma (Express Courier)',
      pickupTime: 'Today at 3:15 PM',
      status: 'In Transit',
      statusColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      id: 'DON-9040',
      food: 'Artisan Bakery Bread Buns (40 kg)',
      donor: 'Daily Harvest Bakery',
      volunteer: 'Amit Kumar (Rider #2)',
      pickupTime: 'Today at 2:00 PM',
      status: 'Volunteer Assigned',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'DON-9035',
      food: 'Pasteurized Whole Milk Pouches (60 Units)',
      donor: 'Metro Supermarket',
      volunteer: 'Suresh Patel (EV Van)',
      pickupTime: 'Yesterday at 5:00 PM',
      status: 'Delivered',
      statusColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    {
      id: 'DON-9028',
      food: 'Canned Pantry Staples & Goods (200 Cans)',
      donor: 'City Retail Logistics',
      volunteer: 'Vikram Singh (Express #1)',
      pickupTime: '2 Days ago',
      status: 'Completed',
      statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]',
    },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Accepted Surplus Food Donations
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage accepted food donations, volunteer dispatch status, and live delivery timeline tracking
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/ngo/track-volunteer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all cursor-pointer text-center"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Volunteer</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E7EAF0] flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Accepted Donations Queue</h2>
          <span className="text-xs font-bold text-[#64748B]">4 Accepted Orders</span>
        </div>

        {/* Mobile View Card List (< md) */}
        <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
          {acceptedItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc]/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E7EAF0]">
                  {item.id}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-xs text-[#0F172A]">{item.food}</div>
                <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                  Donor: {item.donor} • {item.pickupTime}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7EAF0]/60 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  {item.volunteer}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/ngo/food-details')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0F172A] text-xs font-bold"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate('/ngo/track-volunteer')}
                    className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Truck className="w-3 h-3" />
                    <span>Track</span>
                  </button>
                </div>
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
                <th className="py-3.5 px-6">Food</th>
                <th className="py-3.5 px-6">Donor</th>
                <th className="py-3.5 px-6">Volunteer</th>
                <th className="py-3.5 px-6">Pickup Time</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF0] text-xs font-medium text-[#334155]">
              {acceptedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0F172A]">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.food}</td>
                  <td className="py-4 px-6">{item.donor}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      {item.volunteer}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#64748B]">{item.pickupTime}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate('/ngo/food-details')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate('/ngo/track-volunteer')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcceptedDonationsPage;
