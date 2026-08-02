import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Package,
  Navigation,
  Check,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import volunteerData from '../data/volunteerData.json';

/**
 * Volunteer Notifications Center Page (/volunteer/notifications)
 */
const VolunteerNotificationsPage = () => {
  const [notifications, setNotifications] = useState(volunteerData.notifications);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter !== 'All') return n.category === activeFilter;
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Courier Notification Radar
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-black shadow-xs">
              {unreadCount} Unread
            </span>
          )}
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-emerald-200"
        >
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-2 flex-wrap text-xs">
        {['All', 'Unread', 'Assignments', 'Verification', 'Navigation'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-emerald-500 text-white shadow-emerald-btn'
                : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card divide-y divide-[#E7EAF0]">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-[#0F172A]">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? 'bg-emerald-50/20' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#0F172A]">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-[#334155] font-medium leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] font-bold text-[#64748B] block pt-1">
                    {item.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete notification"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerNotificationsPage;
