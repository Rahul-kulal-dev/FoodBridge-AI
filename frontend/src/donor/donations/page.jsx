import React from 'react';
import { Package, Search, ArrowUpRight } from 'lucide-react';

const MyDonationsPage = () => {
  const donations = [
    { id: 'DON-8942', name: 'Fresh Organic Produce & Dairy', qty: '180 kg', date: 'Today, 2:15 PM', recipient: 'Metro City Shelter', status: 'In Transit', statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' },
    { id: 'DON-8941', name: 'Artisan Bakery Bread & Pastries', qty: '45 kg', date: 'Today, 11:30 AM', recipient: 'Hope Harvest Kitchen', status: 'Delivered', statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]' },
    { id: 'DON-8939', name: 'Canned Soups & Pantry Goods', qty: '320 units', date: 'Yesterday, 4:00 PM', recipient: 'St. Jude Youth Center', status: 'Pending Pickup', statusColor: 'bg-amber-50 text-amber-700 border border-amber-200/80' },
    { id: 'DON-8920', name: 'Prepared Buffet Entrees', qty: '95 kg', date: 'Aug 1, 2026', recipient: 'City Food Bank', status: 'Delivered', statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]' },
    { id: 'DON-8912', name: 'Seasonal Fruit Crates', qty: '210 kg', date: 'Jul 30, 2026', recipient: 'Community Pantry East', status: 'Delivered', statusColor: 'bg-slate-100 text-[#0F172A] border border-[#E7EAF0]' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.03em]">
              My Food Donations History
            </h1>
            <p className="text-xs text-[#64748B]">
              Audit trail, chain of custody logs, and safety certificates for all past surplus listings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donations..."
              className="pl-9 pr-4 py-2 rounded-xl border border-[#E7EAF0] bg-[#f7f8fb] text-xs text-[#0F172A] focus:outline-hidden focus:border-emerald-500 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f8fb] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-b border-[#E7EAF0]">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Item Name</th>
              <th className="px-6 py-3.5">Quantity</th>
              <th className="px-6 py-3.5">Matched Recipient</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7EAF0]">
            {donations.map((item) => (
              <tr key={item.id} className="hover:bg-[#f7f8fb]/60 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-xs text-[#0F172A]">
                  {item.id}
                </td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">
                  {item.name}
                  <div className="text-[11px] text-[#64748B] font-normal">{item.date}</div>
                </td>
                <td className="px-6 py-4 text-xs text-[#334155] font-medium">
                  {item.qty}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[#334155]">
                  {item.recipient}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg text-[#64748B] hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDonationsPage;
