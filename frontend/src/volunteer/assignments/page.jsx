import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Clock,
  Sparkles,
  Navigation,
  Building2,
  ChevronRight,
  Eye,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import volunteerData from '../data/volunteerData.json';

/**
 * Assigned Pickups Page (/volunteer/assignments)
 */
const AssignedPickupsPage = () => {
  const navigate = useNavigate();
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Assigned Pickup Orders
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            3 active food pickup orders assigned to your vehicle dispatch queue
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Vehicle: {volunteerData.profile.vehicleType}</span>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteerData.assignments.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
          >
            {/* Image Header */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.foodName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-[#0F172A]">
                {item.id}
              </div>
              <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-white" />
                {item.priorityScore}% AI Priority
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A] line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.foodName}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 font-semibold">Quantity: <span className="text-[#0F172A] font-extrabold">{item.quantity}</span></p>
              </div>

              {/* Addresses Box */}
              <div className="space-y-2 bg-[#f7f8fb] p-3 rounded-xl border border-[#E7EAF0] text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Pickup Origin</span>
                    <p className="font-bold text-[#0F172A] truncate">{item.donorName}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{item.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-[#E7EAF0]">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Destination NGO</span>
                    <p className="font-bold text-[#0F172A] truncate">{item.ngoName}</p>
                  </div>
                </div>
              </div>

              {/* Distance & Deadline Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Distance & ETA</span>
                  <span className="font-extrabold text-emerald-600">{item.distance} ({item.estimatedTime})</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Deadline</span>
                  <span className="font-extrabold text-amber-600">{item.pickupDeadline}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setSelectedAssignment(item)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all text-center cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate('/volunteer/navigation')}
                  className="flex-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start Nav</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl max-w-md w-full p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedAssignment.id}
              </span>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">{selectedAssignment.foodName}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Assigned to vehicle: {volunteerData.profile.vehicleNumber}</p>
            </div>

            <div className="space-y-2 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
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

            <div className="pt-3 border-t border-[#E7EAF0] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => navigate('/volunteer/navigation')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center gap-1.5 cursor-pointer"
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
