import React, { useState } from 'react';
import {
  History,
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Eye,
  MapPin,
  Building2
} from 'lucide-react';
import volunteerData from '../data/volunteerData.json';

/**
 * Delivery History Page (/volunteer/history)
 */
const DeliveryHistoryPage = () => {
  const [historyItems, setHistoryItems] = useState(volunteerData.history);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.food.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ngo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Completed Delivery History
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Archived log of past completed food pickups, delivery timestamps, and NGO feedback ratings
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Total Delivered: {volunteerData.profile.totalDeliveries}</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food, donor or NGO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7EAF0] text-xs focus:outline-emerald-500 bg-[#f7f8fb]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-[#64748B] mr-1">Status:</span>
          {['All', 'Delivered', 'Cancelled', 'Expired'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8fb] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E7EAF0]">
                <th className="py-3.5 px-6">Assignment ID</th>
                <th className="py-3.5 px-6">Food</th>
                <th className="py-3.5 px-6">Donor</th>
                <th className="py-3.5 px-6">NGO</th>
                <th className="py-3.5 px-6">Pickup Time</th>
                <th className="py-3.5 px-6">Delivery Time</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF0] text-xs font-medium text-[#334155]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0F172A]">{item.id}</td>
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.food}</td>
                  <td className="py-4 px-6">{item.donor}</td>
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">{item.ngo}</td>
                  <td className="py-4 px-6 text-[#64748B]">{item.pickupTime}</td>
                  <td className="py-4 px-6 text-[#64748B]">{item.deliveryTime}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {item.rating} / 5
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 text-xs font-bold transition-all border border-transparent hover:border-emerald-200 cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-2xl max-w-md w-full p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF0]">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedItem.id}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">{selectedItem.food}</h3>
              <p className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Rated {selectedItem.rating} / 5 by {selectedItem.ngo}
              </p>
            </div>

            <div className="space-y-2 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
              <div>
                <span className="text-[10px] text-[#64748B] font-bold uppercase block">Donor Pickup</span>
                <p className="font-bold text-[#0F172A]">{selectedItem.donor}</p>
              </div>
              <div className="pt-2 border-t border-[#E7EAF0]">
                <span className="text-[10px] text-[#64748B] font-bold uppercase block">Recipient NGO</span>
                <p className="font-bold text-[#0F172A]">{selectedItem.ngo}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistoryPage;
