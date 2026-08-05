import React, { useState, useEffect } from 'react';
import { Bell, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';

const DonorNotificationsPage = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        if (res.ok && data.notifications) {
          setNotifications(data.notifications);
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

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
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
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 font-bold">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto stroke-[1.5]" />
            <p className="text-sm font-bold text-[#0F172A]">No notifications found</p>
            <p className="text-xs text-[#64748B]">You're all caught up! New dispatch and donation updates will appear here.</p>
          </div>
        ) : (
          notifications.map((item, idx) => (
            <div key={item._id || idx} className="p-5 flex items-start gap-4 hover:bg-[#f7f8fb]/50 transition-colors">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A]">{item.title || 'Notification'}</h3>
                  <span className="text-[11px] text-[#64748B] font-medium">
                    {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
                <p className="text-xs text-[#334155] mt-1">{item.message || item.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorNotificationsPage;
