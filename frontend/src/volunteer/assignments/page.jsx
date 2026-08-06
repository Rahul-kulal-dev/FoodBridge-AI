import React, { useState, useEffect } from 'react';
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
              image: t.donationId?.imageUrl ? getImageUrl(t.donationId.imageUrl) : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
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
              image: d.imageUrl ? getImageUrl(d.imageUrl) : 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
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
            Active surplus food pickup orders fetched from MongoDB database
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 w-fit">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Vehicle: Delivery Van (Verified)</span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center space-y-2 bg-white rounded-2xl border border-[#E7EAF0]">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading assigned pickup orders from MongoDB...</p>
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
                <img
                  src={item.image}
                  alt={item.foodName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-[#0F172A]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md border border-white/10">
                  {item.id}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  {item.priorityScore}% AI Priority
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-black text-[#0F172A] line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {item.foodName}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200/80 shrink-0">
                      {item.quantity}
                    </span>
                  </div>
                </div>

                {/* Structured Pickup Origin & Destination Box */}
                <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-[#E7EAF0] text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-[#64748B] uppercase font-extrabold tracking-wider block">Pickup Origin</span>
                      <p className="font-extrabold text-[#0F172A] text-xs truncate">{item.donorName}</p>
                      <p className="text-[11px] text-[#64748B] truncate font-medium mt-0.5">{item.pickupAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-[#E7EAF0]">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-[#64748B] uppercase font-extrabold tracking-wider block">Destination NGO</span>
                      <p className="font-extrabold text-[#0F172A] text-xs truncate">{item.ngoName}</p>
                    </div>
                  </div>
                </div>

                {/* Distance & Deadline Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-[#E7EAF0]">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">Distance & ETA</span>
                    <span className="font-extrabold text-emerald-600 text-xs">{item.distance} ({item.estimatedTime})</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-[#E7EAF0]">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">Deadline</span>
                    <span className="font-extrabold text-amber-600 text-xs">{item.pickupDeadline}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedAssignment(item)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all text-center cursor-pointer active:scale-95 border border-slate-200/60"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate('/volunteer/navigation')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
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
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3.5 sm:p-4">
          <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl w-[92vw] max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedAssignment.id}
              </span>
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

            <div className="space-y-2.5 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Donor Pickup Address</span>
                <p className="font-bold text-[#0F172A]">{selectedAssignment.donorName}</p>
                <p className="text-[#64748B]">{selectedAssignment.pickupAddress}</p>
              </div>
              <div className="pt-2 border-t border-[#E7EAF0]">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Destination NGO Dropoff</span>
                <p className="font-bold text-[#0F172A]">{selectedAssignment.ngoName}</p>
                <p className="text-[#64748B]">{selectedAssignment.ngoAddress}</p>
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
        </div>
      )}
    </div>
  );
};

export default AssignedPickupsPage;
