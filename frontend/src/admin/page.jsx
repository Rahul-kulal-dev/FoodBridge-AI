import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Package,
  Heart,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  BadgeCheck,
  Building2,
  Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

/**
 * Admin Dashboard Overview Page (/admin)
 * Refactored to match FoodBridge AI design system 1:1
 */
const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState({
    users: { total: 0, donors: 0, ngos: 0, volunteers: 0, pending: 0 },
    donations: { total: 0, completed: 0, active: 0 },
    feedbacks: { total: 0, averageRating: 0 },
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(getApiUrl('/api/admin/analytics'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.warn('Analytics fetch notice from MongoDB Atlas:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statCards = [
    {
      label: 'TOTAL REGISTERED USERS',
      value: analytics.users.total ?? 0,
      subText: `${analytics.users.donors ?? 0} Donors • ${analytics.users.ngos ?? 0} NGOs`,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'PENDING VERIFICATIONS',
      value: analytics.users.pending ?? 0,
      subText: 'Requires Admin approval',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'TOTAL DONATIONS LISTED',
      value: analytics.donations.total ?? 0,
      subText: `${analytics.donations.active ?? 0} active in redistribution`,
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'COMPLETED DELIVERIES',
      value: analytics.donations.completed ?? 0,
      subText: 'Verified food delivery',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Admin <span className="text-emerald-600">Control Center</span>
          </h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 w-fit">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            Live System Monitoring
          </span>
        </div>

        <button
          onClick={fetchAnalytics}
          className="px-4 py-2.5 rounded-xl border border-[#E7EAF0] hover:bg-slate-50 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider line-clamp-1">
                  {card.label}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 shrink-0">
                  <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em] truncate">
                  {card.value}
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium block mt-1">
                  {card.subText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Verification Action Card */}
        <Link
          to="/admin/verifications"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl shadow-emerald-btn transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
              Action Needed
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black tracking-tight">Approve / Reject Verifications</h3>
            <p className="text-xs text-emerald-50 mt-1 font-medium leading-relaxed">
              Review submitted FSSAI & tax compliance documents for Donors and NGOs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold pt-2 text-white transition-colors">
            <span>Review Queue ({analytics.users.pending || 0})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* User Directory Card */}
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#64748B]">Directory</span>
          </div>

          <div>
            <h3 className="text-lg font-black text-[#0F172A] tracking-tight">Manage System Users</h3>
            <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">
              Filter registered Donors, NGOs, Volunteers, and Admins across the network.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
            <span>Manage All Users</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Donation Monitoring Card */}
        <Link
          to="/admin/donations"
          className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#64748B]">Live Monitor</span>
          </div>

          <div>
            <h3 className="text-lg font-black text-[#0F172A] tracking-tight">Monitor Food Surplus</h3>
            <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">
              Track live food donations, pickup dispatch status, and recipient delivery metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
            <span>Monitor Donations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
