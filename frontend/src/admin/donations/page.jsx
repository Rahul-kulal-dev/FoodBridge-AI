import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Admin Monitor Donations Page (/admin/donations)
 * Directly connected to MongoDB Atlas database (GET /api/admin/donations).
 * Zero dummy data fallback.
 */
const AdminDonationsPage = () => {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/donations'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok && data.donations) {
        const formatted = data.donations.map((d) => ({
          _id: `DON-${d._id.slice(-4).toUpperCase()}`,
          title: d.title,
          foodType: d.foodType || 'cooked',
          quantity: d.quantity,
          unit: d.unit || 'kg',
          status: d.status,
          donorName: d.donorId?.organizationName || d.donorId?.name || 'Verified Donor',
          ngoName: d.ngoId?.organizationName || d.ngoId?.name || 'Awaiting NGO Request',
          updatedAt: d.updatedAt || d.createdAt,
        }));
        setDonations(formatted);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.warn('Error fetching admin donations:', err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filtered = donations.filter((d) => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ngoName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              Monitor Platform Donations
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              Real-time monitoring of food surplus listings from MongoDB Atlas database.
            </p>
          </div>
        </div>

        <button
          onClick={fetchDonations}
          className="px-4 py-2.5 rounded-xl border border-[#E7EAF0] hover:bg-slate-50 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search donation item, donor, or NGO recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm text-[#0F172A] focus:outline-none placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="md:col-span-4 bg-[#F7F8FB] p-1.5 rounded-2xl border border-[#E7EAF0] flex items-center gap-1 text-xs font-bold">
          {['all', 'available', 'picked_up', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex-1 py-2 rounded-xl transition-all capitalize text-center cursor-pointer ${
                statusFilter === s
                  ? 'bg-white text-emerald-700 shadow-xs border border-[#E7EAF0]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading donations database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No donations found</h3>
            <p className="text-xs text-slate-400 font-medium">There are currently no donations matching your query in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#64748B] text-[11px] font-bold uppercase tracking-wider border-b border-[#E7EAF0]">
                <tr>
                  <th className="px-6 py-4">ID & ITEM TITLE</th>
                  <th className="px-6 py-4">QUANTITY</th>
                  <th className="px-6 py-4">DONOR</th>
                  <th className="px-6 py-4">MATCHED RECIPIENT</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">LAST UPDATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EAF0]">
                {filtered.map((d) => {
                  let statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (d.status === 'delivered') statusBadge = 'bg-slate-100 text-slate-800 border-slate-200';
                  if (d.status === 'picked_up' || d.status === 'accepted') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                    <tr key={d._id} className="hover:bg-[#f8fafc]/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-xs text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 block w-fit mb-1">
                          {d._id}
                        </span>
                        <div className="font-extrabold text-[#0F172A] text-sm">{d.title}</div>
                      </td>

                      <td className="px-6 py-4 font-bold text-[#0F172A]">
                        {d.quantity} {d.unit}
                      </td>

                      <td className="px-6 py-4 font-medium text-[#334155]">
                        {d.donorName}
                      </td>

                      <td className="px-6 py-4 font-medium text-[#334155]">
                        {d.ngoName}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge} uppercase text-[10px]`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {d.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-[#64748B] font-medium">
                        {new Date(d.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDonationsPage;
