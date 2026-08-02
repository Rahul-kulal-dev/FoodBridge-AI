import React, { useState } from 'react';
import {
  Truck,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Track Volunteer Page (/ngo/track-volunteer)
 */
const TrackVolunteerPage = () => {
  const navigate = useNavigate();

  const volunteer = {
    name: 'Rahul Verma',
    role: 'Senior Eco Dispatch Courier',
    phone: '+91 98765 11223',
    vehicle: 'Refrigerated EV Van (KA-03-EV-8842)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    liveStatus: 'In Transit to Hope Community Kitchen',
    estimatedArrival: '12 Mins (2.1 km away)',
    pickupId: 'DON-9041',
    foodItem: 'Fresh Prepared Lunch Meals (120 Portions)',
    donorName: 'Grand Palace Hotel',
  };

  const timelineSteps = [
    { label: 'Assigned', time: '2:30 PM', completed: true },
    { label: 'Accepted', time: '2:35 PM', completed: true },
    { label: 'Picked Up', time: '3:00 PM', completed: true },
    { label: 'In Transit', time: '3:12 PM', completed: true, active: true },
    { label: 'Delivered', time: 'Estimated 3:27 PM', completed: false },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Live Volunteer Courier Dispatch
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Tracking order <span className="font-bold text-[#0F172A]">{volunteer.pickupId}</span> — {volunteer.foodItem}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          Live GPS Signal Connected
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Volunteer Card & Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Volunteer Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={volunteer.photo}
                  alt={volunteer.name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">{volunteer.name}</h3>
                <p className="text-xs text-[#64748B]">{volunteer.role}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Courier
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Vehicle</span>
                <span className="font-bold text-[#0F172A]">{volunteer.vehicle}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">Estimated ETA</span>
                <span className="font-bold text-emerald-600">{volunteer.estimatedArrival}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${volunteer.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Courier</span>
              </a>
              <button
                onClick={() => navigate('/ngo/notifications')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Progress Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Pickup & Delivery Progress Timeline</h3>

            <div className="space-y-4 pt-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx !== timelineSteps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                        step.completed ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                      step.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : step.active
                        ? 'bg-amber-500 text-white animate-pulse shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-extrabold ${
                          step.completed || step.active ? 'text-[#0F172A]' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-[10px] font-bold text-[#64748B]">{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live GPS Route Map Container */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-[#E7EAF0] shadow-xl overflow-hidden min-h-[480px] relative flex flex-col justify-between p-6">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#3b82f6 1px, #0f172a 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Map Vector Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-emerald-400 stroke-[3] fill-none">
            <path d="M 120 180 Q 280 220 450 160 T 700 240" strokeDasharray="8 8" className="animate-pulse" />
          </svg>

          {/* Map Live Floating Indicators */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Destination</span>
              <p className="font-extrabold">Hope Community Kitchen (Sector 5)</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-bold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Speed: 38 km/h</span>
            </div>
          </div>

          <div className="relative z-10 flex justify-center py-12">
            <div className="bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
              <Truck className="w-4 h-4" />
              <span>Rahul Verma (EV Van) — 2.1 km away</span>
            </div>
          </div>

          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-white text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Pickup Origin</span>
              <p className="font-bold text-white">{volunteer.donorName}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Delivery Dropoff</span>
              <p className="font-bold text-white">Hope Community Kitchen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackVolunteerPage;
