import React from 'react';
import { Bell, Truck, ShieldCheck } from 'lucide-react';

const DonorNotificationsPage = () => {
  const notifications = [
    { title: 'Recipient Driver En Route', msg: 'Metro City Shelter driver is 10 mins away for pickup DON-8942.', time: '5m ago', icon: Truck, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Tax Receipt Generated', msg: 'Form 8283 tax receipt issued for $840 donation value.', time: '2h ago', icon: ShieldCheck, color: 'bg-slate-100 text-[#0F172A]' },
    { title: 'Surplus Risk Warning', msg: 'AI detected 45 kg bakery items expiring within 6 hours.', time: '4h ago', icon: Bell, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.045em]">
              Real-Time Notifications
            </h1>
            <p className="text-xs text-[#64748B]">
              Live updates on dispatch status, driver arrivals, and AI alerts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card divide-y divide-[#E7EAF0]">
        {notifications.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="p-5 flex items-start gap-4 hover:bg-[#f7f8fb]/50 transition-colors">
              <div className={`p-2.5 rounded-xl ${item.color} shrink-0`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A]">{item.title}</h3>
                  <span className="text-[11px] text-[#64748B] font-medium">{item.time}</span>
                </div>
                <p className="text-xs text-[#334155] mt-1">{item.msg}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonorNotificationsPage;
