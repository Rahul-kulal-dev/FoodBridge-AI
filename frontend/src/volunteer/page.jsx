import React, { useState } from 'react';
import {
  Package,
  Navigation,
  BadgeCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Eye,
  Truck,
  Building2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import volunteerData from './data/volunteerData.json';

/**
 * Volunteer Dashboard Overview Page (/volunteer)
 */
const VolunteerDashboardPage = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(volunteerData.assignments);

  const stats = [
    {
      label: 'DELIVERIES COMPLETED',
      value: volunteerData.profile.totalDeliveries,
      icon: CheckCircle2,
    },
    {
      label: 'ACTIVE ASSIGNMENTS',
      value: assignments.length,
      icon: Package,
    },
    {
      label: "TODAY'S PICKUPS",
      value: '3',
      icon: Clock,
    },
    {
      label: 'AVG DELIVERY RATING',
      value: `${volunteerData.profile.rating} ★`,
      icon: Star,
    },
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Hero Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Welcome back, <span className="text-emerald-600">{volunteerData.profile.name}</span>
          </h1>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Volunteer Badge
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <Link
            to="/volunteer/assignments"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Package className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">View Assignments</span>
          </Link>
          <Link
            to="/volunteer/navigation"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.01]"
          >
            <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="whitespace-nowrap">Open Navigation</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards - 2 Grid Columns on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider line-clamp-1">
                  {stat.label}
                </span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 shrink-0">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Assignment Banner */}
      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <Sparkles className="w-4 h-4 fill-emerald-600" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
            <span className="text-emerald-700 font-extrabold">Today's Assignment:</span> 3 food pickups are assigned today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/volunteer/assignments"
            className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all duration-200"
          >
            View Assignments
          </Link>
          <Link
            to="/volunteer/navigation"
            className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E7EAF0] text-xs font-bold transition-all duration-200"
          >
            Open Maps
          </Link>
        </div>
      </div>

      {/* Assigned Pickups Table & Card Section */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E7EAF0] flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">Assigned Pickup Schedule</h2>
            <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">Real-time assigned surplus food pickups & destinations</p>
          </div>
          <Link
            to="/volunteer/assignments"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
          >
            <span>All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile View: Cards Layout (< 768px) */}
        <div className="block md:hidden divide-y divide-[#E7EAF0]">
          {assignments.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-[#0F172A] text-xs px-2.5 py-1 bg-slate-100 rounded-lg">
                  {item.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'In Transit'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-[#0F172A]">{item.foodName}</h3>
                <div className="mt-1.5 space-y-1 text-xs text-[#64748B]">
                  <p className="flex items-center gap-1 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[#0F172A]">From:</span> {item.donorName}
                  </p>
                  <p className="flex items-center gap-1 text-slate-700 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-[#0F172A]">To:</span> {item.ngoName}
                  </p>
                  <p className="text-[11px] text-amber-600 font-bold pt-0.5">
                    Pickup Deadline: {item.pickupDeadline}
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => navigate('/volunteer/assignments')}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 font-bold transition-all border border-transparent hover:border-emerald-200 text-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table Layout (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8fb] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E7EAF0]">
                <th className="py-3.5 px-6">Assignment ID</th>
                <th className="py-3.5 px-6">Food</th>
                <th className="py-3.5 px-6">Pickup Location</th>
                <th className="py-3.5 px-6">Destination NGO</th>
                <th className="py-3.5 px-6">Pickup Time</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF0] text-xs font-medium text-[#334155]">
              {assignments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0F172A]">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.foodName}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {item.donorName}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-[#0F172A]">{item.ngoName}</td>
                  <td className="py-4 px-6 text-[#64748B]">{item.pickupDeadline}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'In Transit'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => navigate('/volunteer/assignments')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 font-bold transition-all border border-transparent hover:border-emerald-200 cursor-pointer text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboardPage;
