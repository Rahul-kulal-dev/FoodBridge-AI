import React from 'react';
import {
  PlusCircle,
  Brain,
  Package,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Donor Dashboard Main Overview Page (/donor)
 * Matches attached Dashboard UI spec 1:1
 */
const DonorDashboardPage = () => {
  const stats = [
    {
      label: 'MEALS PROVIDED',
      value: '14,820',
      icon: Heart,
    },
    {
      label: 'ACTIVE SURPLUS ITEMS',
      value: '6',
      icon: Package,
    },
    {
      label: 'AI MATCH ACCURACY',
      value: '98.4%',
      icon: Brain,
    },
    {
      label: 'VERIFICATION LEVEL',
      value: 'Tier 1 Verified',
      icon: ShieldCheck,
    },
  ];

  const recentDonations = [
    {
      id: 'DON-8942',
      title: 'Fresh Organic Produce & Dairy',
      quantity: '180 kg',
      recipient: 'Metro City Shelter & Food Bank',
      status: 'In Transit',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      time: '20 mins ago',
    },
    {
      id: 'DON-8941',
      title: 'Artisan Bakery Bread & Pastries',
      quantity: '45 kg',
      recipient: 'Hope Harvest Community Kitchen',
      status: 'Delivered',
      statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]',
      time: '2 hours ago',
    },
    {
      id: 'DON-8939',
      title: 'Canned Soups & Pantry Goods',
      quantity: '320 units',
      recipient: 'St. Jude Youth Center',
      status: 'Pending Pickup',
      statusColor: 'bg-amber-50 text-amber-700 border border-amber-200/80',
      time: '4 hours ago',
    },
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Welcome back, <span className="text-emerald-600">GreenHarvest</span> Market
          </h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 w-fit">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Donor
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            to="/donor/create-donation"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">Create Donation</span>
          </Link>
          <Link
            to="/donor/ai-predictions"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.01] text-center"
          >
            <Brain className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">AI Predictions</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid - 2 cols on mobile, 4 cols on desktop */}
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

      {/* AI Surplus Prediction Banner */}
      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <Sparkles className="w-4 h-4 fill-emerald-600" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
            Predicted Surplus Alert: <span className="text-emerald-600 font-black">120 kg Produce</span> in 8 Hours
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <Link
            to="/donor/create-donation"
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 text-center truncate"
          >
            Auto-List Surplus
          </Link>
          <Link
            to="/donor/ai-predictions"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 truncate"
          >
            <span>Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Recent Donations Container */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E7EAF0] flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-[-0.03em]">
            Recent Food Donations
          </h3>
          <Link
            to="/donor/donations"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile View Card List (< md) */}
        <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
          {recentDonations.map((row) => (
            <div
              key={row.id}
              className="p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc]/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E7EAF0]">
                  {row.id}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.statusColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {row.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-xs text-[#0F172A]">{row.title}</div>
                <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                  {row.quantity} • {row.time}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7EAF0]/60 text-[11px] text-[#334155]">
                <span className="text-[#64748B]">Matched: </span>
                <span className="font-semibold">{row.recipient}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop & Tablet Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-[#64748B] text-[11px] font-bold uppercase tracking-wider border-b border-[#E7EAF0]">
              <tr>
                <th className="px-6 py-4">DONATION ID</th>
                <th className="px-6 py-4">ITEMS & QUANTITY</th>
                <th className="px-6 py-4">MATCHED RECIPIENT</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF0]">
              {recentDonations.map((row) => (
                <tr key={row.id} className="hover:bg-[#f8fafc]/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#0F172A]">
                    {row.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#0F172A]">{row.title}</div>
                    <div className="text-[11px] text-[#64748B] font-medium mt-0.5">{row.quantity}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#334155]">
                    {row.recipient}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${row.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[#64748B] font-medium">
                    {row.time}
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

export default DonorDashboardPage;
