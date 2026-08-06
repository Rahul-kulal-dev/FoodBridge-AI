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
import FoodImageSlideshow from '../../components/FoodImageSlideshow';

/**
 * Accepted Donations Page (/ngo/accepted-donations)
 * Fetches accepted donations for the logged in NGO from MongoDB backend.
 */
const AcceptedDonationsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickCounts, setClickCounts] = useState({});
  const [revertingId, setRevertingId] = useState(null);
  const [revertMessage, setRevertMessage] = useState(null);

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

  const handleImageTripleClick = async (donationId) => {
    const currentCount = (clickCounts[donationId] || 0) + 1;

    if (currentCount >= 3) {
      setClickCounts((prev) => ({ ...prev, [donationId]: 0 }));
      setRevertingId(donationId);
      try {
        const res = await fetch(getApiUrl(`/api/ngo/donations/${donationId}/revert`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setRevertMessage({ type: 'success', text: 'Food donation acceptance reverted successfully! Listing is back in nearby food.' });
          fetchAcceptedDonations();
        } else {
          setRevertMessage({ type: 'error', text: data.message || 'Failed to revert acceptance' });
        }
      } catch (err) {
        setRevertMessage({ type: 'error', text: 'Server error while reverting donation acceptance' });
      } finally {
        setRevertingId(null);
      }
    } else {
      setClickCounts((prev) => ({ ...prev, [donationId]: currentCount }));

      setTimeout(() => {
        setClickCounts((prev) => {
          if (prev[donationId] === currentCount) {
            return { ...prev, [donationId]: 0 };
          }
          return prev;
        });
      }, 1500);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-amber-50 text-amber-800 border border-amber-200/80';
      case 'accepted':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200/80';
      case 'picked_up':
      case 'in_transit':
        return 'bg-blue-50 text-blue-800 border border-blue-200/80';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'assigned':
        return 'Assigned to Courier';
      case 'accepted':
        return 'Accepted by Courier';
      case 'picked_up':
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return status ? status.replace('_', ' ') : 'Assigned';
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.03em]">
            Accepted Surplus Food Donations
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium max-w-2xl">
            Manage accepted food donations, volunteer dispatch status, and live delivery timeline tracking (click food photo 3x to revert acceptance)
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/ngo/track-volunteer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Volunteer</span>
          </Link>
        </div>
      </div>

      {revertMessage && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fade-in ${
          revertMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          <span>{revertMessage.text}</span>
          <button onClick={() => setRevertMessage(null)} className="font-mono text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-[20px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Accepted Donations Queue</h2>
          <span className="text-xs font-extrabold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {donations.length} Active Orders
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Fetching accepted donations from database...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16A34A] mx-auto flex items-center justify-center border border-emerald-100">
              <PackageCheck className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-black text-[#0F172A]">No Accepted Donations Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse available surplus food listings and click "Accept Donation" to add them to your live dispatch queue.
            </p>
            <Link
              to="/ngo/browse-food"
              className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Browse Surplus Food
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile View Cards (< md) */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {donations.map((item) => {
                const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
                const hasVolunteer = Boolean(item.volunteerId?.name);
                const volunteerName = hasVolunteer
                  ? `${item.volunteerId.name} (${item.volunteerId.phone || 'Courier'})`
                  : 'Pending Courier';
                const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                return (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                        {docId}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${getStatusBadgeStyle(item.status)} uppercase`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => handleImageTripleClick(item._id)}
                        title="Click photo 3 times to revert acceptance"
                        className="relative cursor-pointer group shrink-0"
                      >
                        <FoodImageSlideshow
                          image={item.image}
                          images={item.images}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200 group-hover:border-rose-400 transition-all bg-slate-50 shadow-xs"
                        />
                        {clickCounts[item._id] > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-md animate-pulse z-10">
                            {clickCounts[item._id]}/3
                          </span>
                        )}
                        {revertingId === item._id && (
                          <div className="absolute inset-0 bg-slate-900/60 rounded-xl flex items-center justify-center z-20">
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0F172A]">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Donor: <span className="font-bold text-slate-700">{donorName}</span> • Quantity: <span className="font-bold text-slate-700">{item.quantity} {item.unit || 'kg'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      {hasVolunteer ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                          <User className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{volunteerName}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Pending Courier</span>
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/ngo/food-details?id=${item._id}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/ngo/track-volunteer?id=${item._id}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-4 px-6 w-32 whitespace-nowrap">Donation ID</th>
                    <th className="py-4 px-6 min-w-[180px] whitespace-nowrap">Food Package</th>
                    <th className="py-4 px-6 min-w-[140px] whitespace-nowrap">Donor</th>
                    <th className="py-4 px-6 min-w-[180px] whitespace-nowrap">Volunteer Courier</th>
                    <th className="py-4 px-6 whitespace-nowrap">Accepted Time</th>
                    <th className="py-4 px-6 whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {donations.map((item) => {
                    const docId = `DON-${item._id.slice(-4).toUpperCase()}`;
                    const donorName = item.donorId?.organizationName || item.donorId?.name || 'Donor';
                    const hasVolunteer = Boolean(item.volunteerId?.name);
                    const volunteerName = hasVolunteer
                      ? `${item.volunteerId.name} (${item.volunteerId.phone || 'Courier'})`
                      : 'Pending Courier';
                    const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-black text-slate-900 font-mono whitespace-nowrap">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200/60">
                            {docId}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => handleImageTripleClick(item._id)}
                              title="Click photo 3 times to revert acceptance"
                              className="relative cursor-pointer group shrink-0"
                            >
                              <FoodImageSlideshow
                                image={item.image}
                                images={item.images}
                                alt={item.title}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200 group-hover:border-rose-400 transition-all bg-slate-50 shadow-xs"
                              />
                              {clickCounts[item._id] > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-md animate-pulse z-10">
                                  {clickCounts[item._id]}/3
                                </span>
                              )}
                              {revertingId === item._id && (
                                <div className="absolute inset-0 bg-slate-900/60 rounded-xl flex items-center justify-center z-20">
                                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900">{item.title}</div>
                              <div className="font-normal text-[#64748B] text-[11px] mt-0.5">{item.quantity} {item.unit || 'kg'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">{donorName}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {hasVolunteer ? (
                            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{volunteerName}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Pending Courier</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-500 whitespace-nowrap font-medium">{dateStr}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-lg ${getStatusBadgeStyle(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/ngo/food-details?id=${item._id}`)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/ngo/track-volunteer?id=${item._id}`)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
