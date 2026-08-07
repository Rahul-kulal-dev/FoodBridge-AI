import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Package,
  MapPin,
  Clock,
  Navigation,
  Building2,
  ChevronRight,
  Eye,
  CheckCircle2,
  Truck,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, getImageUrl } from '../../config/api';
import FoodImageSlideshow from '../../components/FoodImageSlideshow';

/**
 * Assigned Pickups Page (/volunteer/assignments)
 * Fetches real assigned pickup orders directly from MongoDB database.
 */
const AssignedPickupsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/volunteer/tasks'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const rawTasks = data.tasks || [];
          const rawDonations = data.donations || [];

          if (rawTasks.length > 0) {
            const formatted = rawTasks.map((t, idx) => ({
              id: t._id ? `TSK-${t._id.slice(-4).toUpperCase()}` : `TSK-00${idx + 1}`,
              foodName: t.donationId?.title || 'Surplus Food Package',
              quantity: t.donationId?.quantity ? `${t.donationId.quantity} ${t.donationId.unit || 'units'}` : 'Bulk Package',
              image: t.donationId?.image,
              images: t.donationId?.images,
              donorName: t.donationId?.donorId?.organizationName || t.donationId?.donorId?.name || 'Verified Donor',
              pickupAddress: t.donationId?.donorId?.address || 'Donor Pickup Address',
              ngoName: t.ngoId?.organizationName || t.ngoId?.name || 'Partner NGO',
              ngoAddress: t.ngoId?.address || 'NGO Care Center',
              distance: '2.4 km',
              estimatedTime: '12 mins',
              pickupDeadline: t.pickupDeadline ? new Date(t.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Flexible',
              priorityScore: 94,
              status: t.status || 'Assigned',
            }));
            setAssignments(formatted);
          } else if (rawDonations.length > 0) {
            const formatted = rawDonations.map((d, idx) => ({
              id: d._id ? `DON-${d._id.slice(-4).toUpperCase()}` : `DON-00${idx + 1}`,
              foodName: d.title || `${d.foodType} Package`,
              quantity: `${d.quantity} ${d.unit || 'kg'}`,
              image: d.image,
              images: d.images,
              donorName: d.donorId?.organizationName || d.donorId?.name || 'Verified Donor',
              pickupAddress: d.donorId?.address || d.pickupAddress || 'City Food Hub',
              ngoName: d.ngoId?.organizationName || d.ngoId?.name || 'Partner NGO',
              ngoAddress: d.ngoId?.address || 'NGO Hub',
              distance: '3.1 km',
              estimatedTime: '15 mins',
              pickupDeadline: d.expiryDate ? new Date(d.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
              priorityScore: 92,
              status: d.status || 'Assigned',
            }));
            setAssignments(formatted);
          } else {
            setAssignments([]);
          }
        }
      } catch (err) {
        console.warn('Error fetching volunteer tasks from MongoDB:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Assigned Pickup Orders
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 sm:mt-1 font-medium">
            Active surplus food pickup orders assigned to your route
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 w-fit">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{assignments.length} Active Pickups</span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center space-y-2 bg-white rounded-2xl border border-[#E7EAF0]">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading assigned pickup orders...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center space-y-2 bg-white rounded-2xl border border-[#E7EAF0]">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Active Pickup Orders</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no active pickup assignments in your queue.
          </p>
        </div>
      ) : (
        /* Assignment Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {assignments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              {/* Full-bleed Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <FoodImageSlideshow
                  image={item.image}
                  images={item.images}
                  alt={item.foodName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-[#0F172A]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md border border-white/10 z-10">
                  {item.id}
                </div>
              </div>

              {/* Card Body - Minimal Data */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[#0F172A] line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {item.foodName}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200/80 shrink-0">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Minimal Pickup Origin & Dropoff Summary */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-[#E7EAF0] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span className="font-medium text-[11px] uppercase tracking-wider text-[#64748B]">Pickup</span>
                      <span className="font-extrabold text-[#0F172A] truncate max-w-[180px] text-right">{item.donorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748B] pt-2 border-t border-[#E7EAF0]">
                      <span className="font-medium text-[11px] uppercase tracking-wider text-[#64748B]">Dropoff</span>
                      <span className="font-extrabold text-[#0F172A] truncate max-w-[180px] text-right">{item.ngoName}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAssignment(item)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all text-center cursor-pointer active:scale-95 border border-slate-200/60"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (item.status === 'picked_up' || item.status === 'on_the_way' || item.status === 'delivered') {
                        navigate('/volunteer/navigation');
                      } else {
                        navigate('/volunteer/verification');
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Start Nav</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Details Modal */}
      {selectedAssignment &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3.5 sm:p-4">
            <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl w-[92vw] max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-scale-up space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedAssignment.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedAssignment.quantity}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">{selectedAssignment.foodName}</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Assigned Courier: {user?.name || 'Verified Courier'}</p>
              </div>

              <div className="space-y-3 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Donor Pickup Address</span>
                  <p className="font-bold text-[#0F172A]">{selectedAssignment.donorName}</p>
                  <p className="text-[#64748B] text-[11px] font-medium mt-0.5">{selectedAssignment.pickupAddress}</p>
                </div>
                <div className="pt-2.5 border-t border-[#E7EAF0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Destination NGO Dropoff</span>
                  <p className="font-bold text-[#0F172A]">{selectedAssignment.ngoName}</p>
                  <p className="text-[#64748B] text-[11px] font-medium mt-0.5">{selectedAssignment.ngoAddress}</p>
                </div>

                <div className="pt-2.5 border-t border-[#E7EAF0] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Distance & ETA</span>
                    <span className="font-extrabold text-emerald-600 text-xs">{selectedAssignment.distance} ({selectedAssignment.estimatedTime})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Deadline</span>
                    <span className="font-extrabold text-amber-600 text-xs">{selectedAssignment.pickupDeadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E7EAF0] flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate('/volunteer/navigation')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Launch GPS Navigation</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AssignedPickupsPage;
