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
  AlertTriangle,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { getApiUrl } from '../../config/api';

/**
 * Volunteer Notifications Center Page (/volunteer/notifications)
 * Real-time FCM push notifications and MongoDB backend notification history.
 */
const VolunteerNotificationsPage = () => {
  const { token } = useAuth();
  const {
    isPushEnabled,
    permissionStatus,
    loading: pushLoading,
    requestNotificationPermission,
    sendTestPushNotification,
  } = useNotificationContext();

  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [testPushStatus, setTestPushStatus] = useState('');

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
            ...n,
            id: n._id || `NOT-${idx + 1}`,
            title: n.title || 'System Notification',
            message: n.message || n.text || 'No details provided.',
            time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            category: n.type || 'Assignments',
            read: n.isRead !== undefined ? n.isRead : n.read || false,
            isRead: n.isRead !== undefined ? n.isRead : n.read || false,
          }))
        );
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.warn('Error fetching volunteer notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true, isRead: true } : n))
    );
    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (authToken && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        await fetch(getApiUrl(`/api/notifications/${id}/read`), {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    } catch (err) {
      console.warn('Error marking notification read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (authToken) {
        await fetch(getApiUrl('/api/notifications/read-all'), {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    } catch (err) {
      console.warn('Error marking all notifications read:', err);
    }
  };

  const handleDelete = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
    try {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (authToken && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        await fetch(getApiUrl(`/api/notifications/${id}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    } catch (err) {
      console.warn('Error deleting notification:', err);
    }
  };

  const handleTestPush = async () => {
    setTestPushStatus('Sending test notification...');
    const success = await sendTestPushNotification();
    if (success) {
      setTestPushStatus('Test notification sent!');
      setTimeout(() => setTestPushStatus(''), 4000);
      fetchNotifications();
    } else {
      setTestPushStatus('Failed to send test push.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read && !n.isRead;
    if (activeFilter === 'Urgent') return n.type === 'urgent' || n.category === 'urgent';
    return true;
  });

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Real-Time FCM Push Banner - Placed at Top */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isPushEnabled
          ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white border-emerald-500/30 shadow-emerald-900/10'
          : 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white border-emerald-400/30 shadow-emerald-900/10'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/20 text-white rounded-xl shrink-0 backdrop-blur-md border border-white/20">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-tight">FCM Real-Time Push Notifications</h3>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider backdrop-blur-md ${
                isPushEnabled
                  ? 'bg-white/20 text-white border border-white/40 shadow-xs'
                  : 'bg-amber-400/30 text-amber-100 border border-amber-300/40'
              }`}>
                {isPushEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-emerald-50/90 font-medium mt-0.5">
              {isPushEnabled
                ? 'Real-time FCM push notifications active! Receive instant pickup alerts even when browser is closed.'
                : permissionStatus === 'denied'
                ? 'Notifications blocked. Please enable notification permissions in browser settings.'
                : 'Enable push notifications to instantly get notified when new pickup tasks are available.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          {!isPushEnabled && permissionStatus !== 'denied' && (
            <button
              onClick={requestNotificationPermission}
              disabled={pushLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 border border-white/80"
            >
              {pushLoading ? 'Enabling...' : 'Enable Real-Time Push'}
            </button>
          )}

          {isPushEnabled && (
            <button
              onClick={handleTestPush}
              className="w-full sm:w-auto px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/25 backdrop-blur-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Push</span>
            </button>
          )}
        </div>
      </div>

      {testPushStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl shadow-xs">
          {testPushStatus}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-[-0.045em]">
              Volunteer Notifications Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981] text-white text-xs font-black shadow-xs">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Real-time push alerts for pickup assignments, navigation routes, and delivery status updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-emerald-200 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#E7EAF0] shadow-xs">
        {['All', 'Unread', 'Urgent'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card divide-y divide-[#E7EAF0]">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 sm:p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto stroke-[1.5]" />
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">No notifications found</p>
            <p className="text-xs text-[#64748B]">You're all caught up! New pickup tasks and status alerts will appear here.</p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isRead = item.read || item.isRead;
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 transition-colors ${
                  !isRead ? 'bg-emerald-50/20' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      item.type === 'urgent'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : item.type === 'system'
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    {item.type === 'urgent' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : item.type === 'system' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <Package className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-xs sm:text-sm font-bold ${!isRead ? 'text-[#0F172A]' : 'text-slate-700'}`}>
                        {item.title}
                      </h3>
                      {!isRead && (
                        <span className="px-2 py-0.5 rounded-md bg-[#10B981] text-white text-[10px] font-black uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.message}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                      {item.link && (
                        <a href={item.link} className="text-[11px] font-bold text-[#10B981] hover:underline">
                          View Task &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
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
