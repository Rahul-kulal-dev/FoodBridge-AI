import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  MapPin,
  User,
  ExternalLink,
  Loader2,
  Utensils
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Accepted Donations Page (/ngo/accepted-donations)
 * Fetches accepted donations for the logged in NGO from MongoDB backend.
 */
const AcceptedDonationsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAcceptedDonations = async () => {
    setLoading(true);
    try {
      if (!token) return;

      const res = await fetch(getApiUrl('/api/ngo/donations/history'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.donations) {
        setDonations(data.donations);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.warn('Error fetching accepted donations from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedDonations();
  }, [token]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'picked_up':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'delivered':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted / Volunteer Queue';
      case 'picked_up':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return status || 'Accepted';
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Accepted Surplus Food Donations
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Manage accepted food donations, volunteer dispatch status, and live delivery timeline tracking directly from database
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
          <span className="text-xs font-bold text-[#64748B]">{donations.length} Accepted Orders</span>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading accepted donations from database...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#0F172A]">No Accepted Donations Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse available surplus food listings and click "Accept Donation" to add them to your queue.
            </p>
            <Link
              to="/ngo/browse-food"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all"
            >
              Browse Surplus Food
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile View Card List (< md) */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {donations.map((item) => {
                const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
                const volunteerName = item.volunteerId?.name ? `${item.volunteerId.name} (${item.volunteerId.phone || 'Courier'})` : 'Volunteer Unassigned';
                const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                return (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl border border-[#E7EAF0] bg-[#f8fafc]/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E7EAF0]">
                        {docId}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(item.status)} uppercase`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{item.title}</div>
                      <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                        Donor: {donorName} • Quantity: {item.quantity} {item.unit || 'kg'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E7EAF0]/60 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        {volunteerName}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/ngo/food-details?id=${item._id}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0F172A] text-xs font-bold cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/ngo/track-volunteer?id=${item._id}`)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f8fb] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E7EAF0]">
                    <th className="py-3.5 px-6">Donation ID</th>
                    <th className="py-3.5 px-6">Food</th>
                    <th className="py-3.5 px-6">Donor</th>
                    <th className="py-3.5 px-6">Volunteer Courier</th>
                    <th className="py-3.5 px-6">Accepted Time</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAF0] text-xs font-medium text-[#334155]">
                  {donations.map((item) => {
                    const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                    const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
                    const volunteerName = item.volunteerId?.name ? `${item.volunteerId.name} (${item.volunteerId.phone || 'Courier'})` : 'Volunteer Unassigned';
                    const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#0F172A] font-mono">{docId}</td>
                        <td className="py-4 px-6 font-semibold text-[#0F172A]">
                          {item.title} ({item.quantity} {item.unit || 'kg'})
                        </td>
                        <td className="py-4 px-6">{donorName}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                            <User className="w-3.5 h-3.5 text-emerald-600" />
                            {volunteerName}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#64748B]">{dateStr}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(item.status)} uppercase text-[10px]`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/ngo/food-details?id=${item._id}`)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/ngo/track-volunteer?id=${item._id}`)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptedDonationsPage;
