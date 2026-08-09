import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging, VAPID_KEY, firebaseConfig } from '../firebase/firebaseConfig';
import { getApiUrl } from '../config/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  const [toastNotif, setToastNotif] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSupportedDevice, setIsSupportedDevice] = useState(true);

  // Check existing Notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setIsSupportedDevice(false);
      setPermissionStatus('unsupported');
    }
  }, []);

  // Sync token registration with backend when user logs in and permission is already granted
  const registerTokenWithBackend = useCallback(async (deviceToken) => {
    if (!token || !deviceToken) return;
    try {
      const res = await fetch(getApiUrl('/api/notifications/fcm-token'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: deviceToken }),
      });
      if (res.ok) {
        console.log('[FCM Context] Registered FCM push token with MongoDB backend successfully.');
      }
    } catch (err) {
      console.warn('[FCM Context] Failed to register FCM token with backend:', err);
    }
  }, [token]);

  // Request Notification Permission & Obtain FCM Token
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Push notifications are not supported by this browser.');
      return false;
    }

    setLoading(true);
    try {
      // 1. Register service worker for background messages if needed
      let swRegistration = null;
      if ('serviceWorker' in navigator) {
        try {
          const swParams = new URLSearchParams({
            apiKey: firebaseConfig.apiKey || '',
            authDomain: firebaseConfig.authDomain || '',
            projectId: firebaseConfig.projectId || '',
            storageBucket: firebaseConfig.storageBucket || '',
            messagingSenderId: firebaseConfig.messagingSenderId || '',
            appId: firebaseConfig.appId || '',
            measurementId: firebaseConfig.measurementId || '',
          }).toString();
          swRegistration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParams}`);
          console.log('[FCM Context] Service Worker registered for FCM:', swRegistration.scope);
        } catch (swErr) {
          console.warn('[FCM Context] SW registration fallback:', swErr);
        }
      }

      // 2. Request browser permission
      const result = await Notification.requestPermission();
      setPermissionStatus(result);

      if (result === 'granted') {
        const messaging = await getFirebaseMessaging();
        if (messaging) {
          const tokenOptions = {
            serviceWorkerRegistration: swRegistration || undefined,
          };
          if (VAPID_KEY) {
            tokenOptions.vapidKey = VAPID_KEY;
          }

          const currentToken = await getToken(messaging, tokenOptions);
          if (currentToken) {
            setFcmToken(currentToken);
            localStorage.setItem('foodbridge_fcm_token', currentToken);
            if (token) {
              await registerTokenWithBackend(currentToken);
            }
            setLoading(false);
            return true;
          } else {
            console.warn('[FCM Context] No registration token available. Request permission to generate one.');
          }
        }
      }
    } catch (error) {
      console.error('[FCM Context] Error requesting push notification permission:', error);
    }
    setLoading(false);
    return false;
  };

  // Unregister / Disable Push Notifications
  const unregisterNotificationPermission = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const storedToken = fcmToken || localStorage.getItem('foodbridge_fcm_token');
      await fetch(getApiUrl('/api/notifications/fcm-token'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: storedToken }),
      });
      setFcmToken(null);
      localStorage.removeItem('foodbridge_fcm_token');
      console.log('[FCM Context] FCM token removed from backend.');
    } catch (err) {
      console.warn('[FCM Context] Error removing FCM token from backend:', err);
    }
    setLoading(false);
  };

  // Send Test Push Notification
  const sendTestPushNotification = async () => {
    if (!token) return false;
    try {
      const res = await fetch(getApiUrl('/api/notifications/test-push'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error('[FCM Context] Test push request error:', err);
      return false;
    }
  };

  // Setup Foreground Messaging Listener
  useEffect(() => {
    let unsubscribe = () => {};

    const setupForegroundListener = async () => {
      if (permissionStatus !== 'granted') return;
      const messaging = await getFirebaseMessaging();
      if (messaging) {
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('[FCM Context] Received foreground FCM payload:', payload);
          const title = payload.notification?.title || payload.data?.title || 'New Notification';
          const body = payload.notification?.body || payload.data?.body || '';
          const link = payload.data?.link || '';
          const type = payload.data?.type || 'info';

          setToastNotif({
            id: Date.now(),
            title,
            body,
            link,
            type,
          });
        });
      }
    };

    setupForegroundListener();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [permissionStatus]);

  // Sync token when user authenticates
  useEffect(() => {
    if (user && token && permissionStatus === 'granted') {
      const savedToken = localStorage.getItem('foodbridge_fcm_token');
      if (savedToken) {
        setFcmToken(savedToken);
        registerTokenWithBackend(savedToken);
      } else {
        requestNotificationPermission();
      }
    }
  }, [user, token, permissionStatus, registerTokenWithBackend]);

  const dismissToast = () => setToastNotif(null);

  return (
    <NotificationContext.Provider
      value={{
        permissionStatus,
        fcmToken,
        isPushEnabled: permissionStatus === 'granted' && !!fcmToken,
        loading,
        isSupportedDevice,
        toastNotif,
        requestNotificationPermission,
        unregisterNotificationPermission,
        sendTestPushNotification,
        dismissToast,
      }}
    >
      {children}
      {/* Real-Time Foreground Toast Banner */}
      {toastNotif && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl border border-[#ff6b35]/30 animate-bounce-short transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b35] animate-ping" />
                <h4 className="font-bold text-sm text-white">{toastNotif.title}</h4>
              </div>
              <p className="text-xs text-slate-300 mt-1">{toastNotif.body}</p>
              {toastNotif.link && (
                <a
                  href={toastNotif.link}
                  onClick={() => setToastNotif(null)}
                  className="inline-block mt-2 text-xs text-[#ff6b35] font-semibold hover:underline"
                >
                  View Details &rarr;
                </a>
              )}
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white text-base font-bold p-1"
              aria-label="Close notification toast"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext) || {};
}
