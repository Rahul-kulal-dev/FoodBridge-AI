import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * Volunteer Notifications Center Page (/volunteer/notifications)
 * Connected to live MongoDB backend notifications API.
 */
const VolunteerNotificationsPage = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchNotifications = async () => {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (!authToken) return;
      try {
        const res = await fetch(getApiUrl('/api/notifications'), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (res.ok && data.notifications && data.notifications.length > 0) {
          setNotifications(
            data.notifications.map((n, idx) => ({
              id: n._id || `NOT-${idx + 1}`,
              title: n.title || 'System Notification',
              message: n.message || n.text || 'No details provided.',
              time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              category: n.type || 'Assignments',
              read: n.read || false,
            }))
          );
        } else {
          setNotifications([{
            id: 'welcome-volunteer',
            title: 'Welcome to FoodBridge AI!',
            message: 'Welcome to FoodBridge AI! Your Volunteer Courier account is active. Check assigned food pickups and navigate live delivery routes.',
            time: 'Just now',
            category: 'Assignments',
            read: false,
          }]);
        }
      } catch (err) {
        console.warn('Error fetching volunteer notifications:', err);
        setNotifications([{
          id: 'welcome-volunteer',
          title: 'Welcome to FoodBridge AI!',
          message: 'Welcome to FoodBridge AI! Your Volunteer Courier account is active. Check assigned food pickups and navigate live delivery routes.',
          time: 'Just now',
          category: 'Assignments',
          read: false,
        }]);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true, isRead: true } : n))
    );
    try {
      if (token && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        await fetch(getApiUrl(`/api/notifications/${id}/read`), {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn('Mark as read API notice:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
    try {
      if (token) {
        await fetch(getApiUrl('/api/notifications/read-all'), {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn('Mark all as read API notice:', err);
    }
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    const isItemUnread = !n.read && !n.isRead;
    if (activeFilter === 'Unread') return isItemUnread;
    if (activeFilter !== 'All') return n.category === activeFilter;
    return true;
  });

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Notifications Center
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-black shadow-xs shrink-0">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-emerald-200 w-full sm:w-auto shrink-0"
          >
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar text-xs">
        {['All', 'Unread', 'Assignments', 'Verification', 'Navigation'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
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
          <div className="p-8 sm:p-12 text-center text-slate-400 space-y-1">
            <Bell className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isItemRead = item.read || item.isRead;
            const targetId = item.id || item._id;
            return (
              <div
                key={targetId}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 transition-colors ${
                  !isItemRead ? 'bg-emerald-50/20' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] break-words">{item.title}</h3>
                      {!isItemRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#334155] font-medium leading-relaxed break-words">
                      {item.message}
                    </p>
                    <span className="text-[10px] font-bold text-[#64748B] block pt-0.5">
                      {item.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end border-slate-100/80">
                  {!isItemRead && (
                    <button
                      onClick={() => handleMarkAsRead(targetId)}
                      title="Mark as read"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="sm:hidden">Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(targetId)}
                    title="Delete notification"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VolunteerNotificationsPage;
