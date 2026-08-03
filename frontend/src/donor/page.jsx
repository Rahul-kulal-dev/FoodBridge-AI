import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Brain,
  Package,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Donor Dashboard Main Overview Page (/donor)
 * Enforces business logic & rules:
 * - Access control for verified donors
 * - Auto-calculated system statistics updated after every completed donation
 * - Active & recent donation history
 * - Read-only AI surplus predictions
 */

const DonorDashboardPage = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: 'Donor', verificationStatus: 'pending' };
  });

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setDonations([]);
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/donations/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.donations) {
        const formatted = data.donations.map((d) => {
          let color = 'bg-amber-50 text-amber-700 border border-amber-200/80';
          if (d.status === 'delivered') color = 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]';
          if (d.status === 'picked_up' || d.status === 'accepted') color = 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';

          return {
            id: `DON-${d._id.slice(-4).toUpperCase()}`,
            title: d.title,
            quantity: `${d.quantity} ${d.unit || 'kg'}`,
            recipient: d.ngoId?.organizationName || d.ngoId?.name || 'Awaiting NGO Request',
            status: d.status.replace('_', ' ').toUpperCase(),
            statusColor: color,
            time: new Date(d.updatedAt || d.createdAt).toLocaleDateString(),
            rawQuantity: Number(d.quantity) || 0,
            rawStatus: d.status,
          };
        });
        setDonations(formatted);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.warn('API error fetching donor data:', err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  // Check donor verification status
  const isVerified = user.verificationStatus === 'approved';

  // System auto-calculated statistics
  const activeCount = donations.filter(d => ['available', 'accepted', 'picked_up', 'Pending Pickup', 'In Transit'].includes(d.rawStatus || d.status)).length;
  const completedDonations = donations.filter(d => ['delivered', 'Delivered'].includes(d.rawStatus || d.status));
  const totalMealsCalculated = completedDonations.reduce((acc, d) => acc + (d.rawQuantity ? d.rawQuantity * 3 : 0), 0);

  const stats = [
    {
      label: 'MEALS PROVIDED',
      value: totalMealsCalculated.toLocaleString(),
      icon: Heart,
      subText: 'Auto-updated after completed donations',
    },
    {
      label: 'ACTIVE SURPLUS ITEMS',
      value: activeCount.toString(),
      icon: Package,
      subText: 'Real-time active items',
    },
    {
      label: 'AI MATCH ACCURACY',
      value: '98.4%',
      icon: Brain,
      subText: 'Read-only engine score',
    },
    {
      label: 'VERIFICATION LEVEL',
      value: isVerified ? 'Tier 1 Verified' : 'Pending Review',
      icon: ShieldCheck,
      subText: isVerified ? 'Full Access Granted' : 'Verification Required',
    },
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* 1. Unverified Access Restriction Warning (Business Rule 1) */}
      {!isVerified && (
        <div className="bg-amber-50 border-2 border-amber-300 p-4 sm:p-5 rounded-2xl shadow-soft-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-amber-900 text-sm sm:text-base">
                  Account Verification Pending
                </h3>
                <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800 font-medium mt-1">
                Only verified donors can publish live food surplus. Please upload your verification documents to unlock full dashboard capabilities.
              </p>
            </div>
          </div>
          <Link
            to="/donor/verification"
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Documents</span>
          </Link>
        </div>
      )}

      {/* 2. Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Welcome back, <span className="text-emerald-600">{user.organizationName || user.name || 'Donor'}</span>
          </h1>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border w-fit ${
            isVerified 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' 
              : 'bg-amber-50 text-amber-700 border-amber-200/80'
          }`}>
            {isVerified ? (
              <>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Donor
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Pending Verification
              </>
            )}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {isVerified ? (
            <Link
              to="/donor/create-donation"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-center"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">Create Donation</span>
            </Link>
          ) : (
            <button
              disabled
              title="Verification required to create donation"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed text-center opacity-70"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span className="truncate">Create Donation</span>
            </button>
          )}

          <Link
            to="/donor/ai-predictions"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.01] text-center"
          >
            <Brain className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">AI Predictions</span>
          </Link>
        </div>
      </div>

      {/* 3. System Auto-Calculated Metrics Grid (Business Logic 4 & Business Rule 3) */}
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
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  {stat.subText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. AI Surplus Prediction Banner - Read-Only (Business Logic 3 & Business Rule 2) */}
      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <Sparkles className="w-4 h-4 fill-emerald-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
              Predicted Surplus Alert (Read-Only): <span className="text-emerald-600 font-black">120 kg Produce</span> in 8 Hours
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              System AI surplus intelligence calculated automatically based on historical distribution patterns.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          {isVerified ? (
            <Link
              to="/donor/create-donation"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 text-center truncate"
            >
              Auto-List Surplus
            </Link>
          ) : (
            <span className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold text-center truncate cursor-not-allowed">
              Auto-List Surplus
            </span>
          )}
          <Link
            to="/donor/ai-predictions"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 truncate"
          >
            <span>Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          </Link>
        </div>
      </div>

      {/* 5. Recent Food Donations Container (Business Logic 2) */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E7EAF0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Recent Food Donations
            </h3>
            <button
              onClick={fetchMyDonations}
              title="Refresh Donations"
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <Link
            to="/donor/donations"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#0F172A] text-sm">No Food Donations Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't listed any surplus food items yet. Click "Create Donation" to publish your first surplus batch!
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View Card List (< md) */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {donations.map((row) => (
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
                    <span className="text-[#64748B]">Matched Recipient: </span>
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
                  {donations.map((row) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default DonorDashboardPage;
