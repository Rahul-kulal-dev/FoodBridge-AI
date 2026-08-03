import React, { useState, useMemo } from 'react';
import { Package, Search, ArrowUpRight, Filter, Clock } from 'lucide-react';

const MyDonationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const donations = [
    { id: 'DON-8942', name: 'Fresh Organic Produce & Dairy', qty: '180 kg', date: 'Today, 2:15 PM', recipient: 'Metro City Shelter', status: 'In Transit', statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' },
    { id: 'DON-8941', name: 'Artisan Bakery Bread & Pastries', qty: '45 kg', date: 'Today, 11:30 AM', recipient: 'Hope Harvest Kitchen', status: 'Delivered', statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]' },
    { id: 'DON-8939', name: 'Canned Soups & Pantry Goods', qty: '320 units', date: 'Yesterday, 4:00 PM', recipient: 'St. Jude Youth Center', status: 'Pending Pickup', statusColor: 'bg-amber-50 text-amber-700 border border-amber-200/80' },
    { id: 'DON-8920', name: 'Prepared Buffet Entrees', qty: '95 kg', date: 'Aug 1, 2026', recipient: 'City Food Bank', status: 'Delivered', statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]' },
    { id: 'DON-8912', name: 'Seasonal Fruit Crates', qty: '210 kg', date: 'Jul 30, 2026', recipient: 'Community Pantry East', status: 'Delivered', statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]' },
  ];

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const statuses = ['All', 'In Transit', 'Pending Pickup', 'Delivered'];

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
              <p className="text-xs text-[#64748B] mt-0.5">
                Audit trail, chain of custody logs, and safety certificates for all past surplus listings.
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
      {filteredDonations.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-[#64748B] mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">No donations found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Try adjusting your search query or filter to find what you are looking for.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedStatus('All'); }}
            className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredDonations.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded-md">
                    {item.id}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-[#0F172A]">{item.name}</h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#94A3B8]" /> {item.date}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f1f5f9] grid grid-cols-2 gap-2 text-xs text-[#334155]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Quantity</span>
                    <span className="font-semibold">{item.qty}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Matched Recipient</span>
                    <span className="font-semibold truncate block">{item.recipient}</span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm min-w-[650px]">
                <thead className="bg-[#f7f8fb] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-b border-[#E7EAF0]">
                  <tr>
                    <th className="px-6 py-3.5 whitespace-nowrap">ID</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Item Name</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Quantity</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Matched Recipient</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAF0]">
                  {filteredDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f7f8fb]/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-xs text-[#0F172A] whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#0F172A]">
                        <div>{item.name}</div>
                        <div className="text-[11px] text-[#64748B] font-normal mt-0.5">{item.date}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#334155] font-medium whitespace-nowrap">
                        {item.qty}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#334155]">
                        {item.recipient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button className="p-2 rounded-lg text-[#64748B] hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
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

