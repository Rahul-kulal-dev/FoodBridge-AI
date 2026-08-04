import React, { useState, useEffect, useMemo } from 'react';
import { Package, Search, Filter, Loader2, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';

/**
 * My Food Donations Page (/donor/donations)
 * Displays food donations stored in MongoDB Atlas and images hosted on Cloudinary.
 */
const MyDonationsPage = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState({});

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      if (!token) {
        setDonations([]);
        return;
      }

      const res = await fetch(getApiUrl('/api/donations/my'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.donations) {
        setDonations(data.donations);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.warn('Error fetching my donations from MongoDB Atlas:', err.message);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [token]);

  const formatImageUrl = (imgUrl) => {
    return getImageUrl(imgUrl);
  };

  const handleImageError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'accepted':
        return 'Accepted by NGO';
      case 'picked_up':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Available';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
      case 'accepted':
      case 'picked_up':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80';
      case 'delivered':
        return 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]';
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    }
  };

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
      const recipientName = item.ngoId?.organizationName || item.ngoId?.name || 'Awaiting NGO Request';
      
      const matchesSearch =
        docId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipientName.toLowerCase().includes(searchQuery.toLowerCase());

      const statusLabel = getStatusLabel(item.status);
      const matchesStatus = selectedStatus === 'All' || statusLabel === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [donations, searchQuery, selectedStatus]);

  const statuses = ['All', 'Available', 'Accepted by NGO', 'In Transit', 'Delivered'];

  return (
    <div className="space-y-6 animate-fade-in w-full pb-8">
      {/* Header Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
                My Food Donations History
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                Live donations database fetched directly from MongoDB Atlas.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donations..."
              className="w-full pl-9 pr-4 py-2.5 sm:py-2 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-emerald-500 font-medium transition-colors"
            />
          </div>
        </div>

        {/* Filter Chips / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-[#E7EAF0]/60 scrollbar-none">
          <span className="text-xs text-[#64748B] font-semibold mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-[#f7f8fb] text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading your donations from database...</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-[#64748B] mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">No donations found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto font-medium">
            {donations.length === 0
              ? 'You have not published any food surplus listings yet.'
              : 'Try adjusting your search query or filter.'}
          </p>
          {donations.length === 0 ? (
            <a
              href="/donor/create-donation"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all"
            >
              Create First Donation
            </a>
          ) : (
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus('All'); }}
              className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer block mx-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredDonations.map((item) => {
              const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
              const statusLabel = getStatusLabel(item.status);
              const recipientName = item.ngoId?.organizationName || item.ngoId?.name || 'Awaiting NGO Request';
              const imgSrc = formatImageUrl(item.image);
              const hasImageFailed = failedImages[item._id];

              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#E7EAF0]/60 pb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {docId}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(item.status)} uppercase`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {imgSrc && !hasImageFailed ? (
                      <img
                        src={imgSrc}
                        alt={item.title}
                        onError={() => handleImageError(item._id)}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Utensils className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-[#0F172A] text-sm">{item.title}</h4>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">{item.quantity} {item.unit || 'kg'}</p>
                    </div>
                  </div>

                  <div className="pt-1 text-xs text-slate-500 font-medium space-y-1">
                    <p>Recipient: <strong className="text-slate-800">{recipientName}</strong></p>
                    <p>Listed Date: {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-[#64748B] text-[11px] font-bold uppercase tracking-wider border-b border-[#E7EAF0]">
                  <tr>
                    <th className="px-6 py-4">DONATION ID & ITEM</th>
                    <th className="px-6 py-4">QUANTITY</th>
                    <th className="px-6 py-4">LISTED DATE</th>
                    <th className="px-6 py-4">ASSIGNED RECIPIENT</th>
                    <th className="px-6 py-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAF0]">
                  {filteredDonations.map((item) => {
                    const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                    const statusLabel = getStatusLabel(item.status);
                    const recipientName = item.ngoId?.organizationName || item.ngoId?.name || 'Awaiting NGO Request';
                    const imgSrc = formatImageUrl(item.image);
                    const hasImageFailed = failedImages[item._id];

                    return (
                      <tr key={item._id} className="hover:bg-[#f8fafc]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {imgSrc && !hasImageFailed ? (
                              <img
                                src={imgSrc}
                                alt={item.title}
                                onError={() => handleImageError(item._id)}
                                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-50"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                                <Utensils className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <span className="font-mono font-bold text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {docId}
                              </span>
                              <div className="font-extrabold text-[#0F172A] text-xs sm:text-sm mt-0.5">
                                {item.title}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-bold text-[#0F172A]">
                          {item.quantity} {item.unit || 'kg'}
                        </td>

                        <td className="px-6 py-4 font-medium text-[#64748B]">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 font-medium text-[#334155]">
                          {recipientName}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeStyle(item.status)} uppercase text-[10px]`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonationsPage;
