import React, { useState, useEffect } from 'react';
import { Bell, Truck, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { getApiUrl } from '../../config/api';

const DonorNotificationsPage = () => {
  const { token } = useAuth();
  const {
    isPushEnabled,
    permissionStatus,
    loading: pushLoading,
    requestNotificationPermission,
    sendTestPushNotification,
  } = useNotificationContext();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testPushStatus, setTestPushStatus] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const authToken = token || localStorage.getItem('foodbridge_token');
        if (!authToken) return;

        const res = await fetch(getApiUrl('/api/notifications'), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (res.ok && data.notifications && data.notifications.length > 0) {
          setNotifications(
            data.notifications.map((n) => ({
              ...n,
              read: n.isRead !== undefined ? n.isRead : n.read || false,
            }))
          );
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.warn('Error fetching donor notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true, isRead: true } : n))
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
    setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
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
    } else {
      setTestPushStatus('Failed to send test push.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-[-0.045em]">
              Donor Notifications Center
            </h1>
            <p className="text-xs text-[#64748B] font-medium">
              Live push & in-app updates on dispatch status, driver arrivals, and NGO requests.
            </p>
          </div>
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Real-Time FCM Push Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-slate-800 text-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#ff6b35]/20 text-[#ff6b35] rounded-xl shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">FCM Real-Time Push Notifications</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isPushEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isPushEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isPushEnabled
                ? 'Push notifications are enabled! You will receive alerts even when the PWA is closed.'
                : permissionStatus === 'denied'
                ? 'Push permissions blocked. Please enable notification permissions in your browser site settings.'
                : 'Enable real-time push notifications to get background alerts for food claims & driver pickups.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          {!isPushEnabled && permissionStatus !== 'denied' && (
            <button
              onClick={requestNotificationPermission}
              disabled={pushLoading}
              className="w-full sm:w-auto px-4 py-2 bg-[#ff6b35] hover:bg-[#e05a2b] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {pushLoading ? 'Enabling...' : 'Enable Real-Time Push'}
            </button>
          )}

          {isPushEnabled && (
            <button
              onClick={handleTestPush}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-600"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Push</span>
            </button>
          )}
        </div>
      </div>

      {testPushStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
          {testPushStatus}
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] shadow-soft-card divide-y divide-[#E7EAF0]">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 font-bold">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 sm:p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto stroke-[1.5]" />
            <p className="text-xs sm:text-sm font-bold text-[#0F172A]">No notifications found</p>
            <p className="text-xs text-[#64748B]">You're all caught up! New dispatch and donation updates will appear here.</p>
          </div>
        ) : (
          notifications.map((item, idx) => {
            const isItemRead = item.read || item.isRead;
            const targetId = item._id || item.id || idx;
            return (
              <div
                key={targetId}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 transition-colors ${
                  !isItemRead ? 'bg-emerald-50/20' : 'hover:bg-slate-50/70'
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
                      <Truck className="w-5 h-5" />
                    ) : item.type === 'system' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-xs sm:text-sm font-bold ${
                          !isItemRead ? 'text-[#0F172A]' : 'text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!isItemRead && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.message}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          className="text-[11px] font-bold text-[#ff6b35] hover:underline"
                        >
                          View Details &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isItemRead && (
                    <button
                      onClick={() => handleMarkAsRead(targetId)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(targetId)}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
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

export default DonorNotificationsPage;
