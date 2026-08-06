import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  Truck,
  BadgeCheck,
  PackageCheck,
  Check,
  SlidersHorizontal,
  Clock,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

/**
 * NGO Notifications Center (/ngo/notifications)
 * Fetches notifications directly from MongoDB Atlas database.
 */
const NgoNotificationsPage = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      if (!token) return;

      const res = await fetch(getApiUrl('/api/notifications'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.notifications && data.notifications.length > 0) {
        setNotifications(data.notifications);
      } else {
        setNotifications([{
          _id: 'welcome-ngo',
          title: 'Welcome to FoodBridge AI!',
          message: 'Welcome to FoodBridge AI! Your NGO / Hub account is active. Browse nearby surplus food listings and request instant volunteer dispatch.',
          type: 'system',
          isRead: false,
          createdAt: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      console.warn('Error fetching notifications from database:', err);
      setNotifications([{
        _id: 'welcome-ngo',
        title: 'Welcome to FoodBridge AI!',
        message: 'Welcome to FoodBridge AI! Your NGO / Hub account is active. Browse nearby surplus food listings and request instant volunteer dispatch.',
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true, isRead: true } : n))
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
    setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.read && !n.isRead;
    return true;
  });

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
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
      <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        {['All', 'Unread'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
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
        {loading ? (
          <div className="p-8 sm:p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading notifications from database...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-400 space-y-1">
            <Bell className="w-9 h-9 mx-auto mb-2 text-slate-300" />
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">No notifications found</p>
            <p className="text-xs text-slate-500">You're all caught up with your alerts!</p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isItemRead = item.read || item.isRead;
            const targetId = item._id || item.id;
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
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] break-words">
                        {item.title || 'Notification'}
                      </h3>
                      {!isItemRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#334155] font-medium leading-relaxed break-words">
                      {item.message}
                    </p>
                    <span className="text-[10px] font-bold text-[#64748B] block pt-0.5">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
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

export default NgoNotificationsPage;
