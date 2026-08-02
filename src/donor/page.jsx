import React from 'react';
import {
  PlusCircle,
  Brain,
  Package,
  BadgeCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Donor Dashboard Main Overview Page (/donor)
 * Clean White & Emerald Green Theme (No black containers)
 */
const DonorDashboardPage = () => {
  const stats = [
    {
      label: 'Meals Provided',
      value: '14,820',
      change: '+18% this month',
      icon: Heart,
    },
    {
      label: 'Active Surplus Items',
      value: '6 Listings',
      change: '2 expiring in 4h',
      icon: Package,
    },
    {
      label: 'AI Match Accuracy',
      value: '98.4%',
      change: 'Zero food waste streak',
      icon: Brain,
    },
    {
      label: 'Verification Level',
      value: 'Tier 1 Verified',
      change: 'Tax deductible status active',
      icon: BadgeCheck,
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
      statusColor: 'bg-[#f7f8fb] text-[#0F172A] border border-[#E7EAF0]',
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
              Welcome back, <span className="text-emerald-600">GreenHarvest</span> Market
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Donor
            </span>
          </div>
          <p className="text-sm text-[#334155]">
            Here is your real-time food donation impact & AI surplus forecast for today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/donor/create-donation"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-emerald-btn transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Donation</span>
          </Link>
          <Link
            to="/donor/ai-predictions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-sm font-semibold shadow-soft-card transition-all duration-200 hover:scale-[1.02]"
          >
            <Brain className="w-4 h-4 text-emerald-600" />
            <span>AI Predictions</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card hover:shadow-soft-hover transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-[#0F172A] tracking-[-0.04em]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Surplus Prediction Spotlight Card - Pure White Paper Card with Soft Emerald Wash */}
      <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-soft-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Surplus Warning & Smart Logistics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-[-0.04em]">
              Predicted Surplus Alert: <span className="highlight-green-swipe text-emerald-600">120 kg Produce</span> in 8 Hours
            </h2>
            <p className="text-sm text-[#334155] font-normal leading-relaxed">
              FoodBridge AI models predict potential excess stock based on historical sales data & upcoming inventory arrivals. Auto-list items now to ensure 100% redistribution before shelf-life expiry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/donor/create-donation"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-emerald-btn transition-all duration-200"
            >
              Auto-List Surplus
            </Link>
            <Link
              to="/donor/ai-predictions"
              className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-sm font-semibold shadow-soft-card transition-all flex items-center gap-1.5"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="p-5 border-b border-[#E7EAF0] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Recent Food Donations
            </h3>
            <p className="text-xs text-[#64748B]">
              Track real-time dispatch, pickup status, and recipient handoffs.
            </p>
          </div>
          <Link
            to="/donor/donations"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>View All Donations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f7f8fb] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-b border-[#E7EAF0]">
              <tr>
                <th className="px-6 py-3.5">Donation ID</th>
                <th className="px-6 py-3.5">Food Items & Quantity</th>
                <th className="px-6 py-3.5">Matched Recipient</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF0]">
              {recentDonations.map((row) => (
                <tr key={row.id} className="hover:bg-[#f7f8fb]/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-[#0F172A] text-xs">
                    {row.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#0F172A]">{row.title}</div>
                    <div className="text-xs text-[#64748B]">{row.quantity}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-[#334155]">
                    {row.recipient}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#64748B] font-medium">
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
