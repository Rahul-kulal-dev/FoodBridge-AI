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

  // Check existing Notification permission on mount & auto-fetch token if granted
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const currentPerm = Notification.permission;
      setPermissionStatus(currentPerm);

      if (currentPerm === 'granted') {
        const savedToken = localStorage.getItem('foodbridge_fcm_token');
        if (savedToken) {
          setFcmToken(savedToken);
        } else {
          requestNotificationPermission();
        }
      }
    } else {
      setIsSupportedDevice(false);
      setPermissionStatus('unsupported');
    }
  }, []);

  // Sync token registration with backend when user logs in and permission is already granted
  const registerTokenWithBackend = useCallback(async (deviceToken) => {
    const authToken = token || localStorage.getItem('foodbridge_token');
    if (!authToken || !deviceToken) return;
    try {
      const res = await fetch(getApiUrl('/api/notifications/fcm-token'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
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
          await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParams}`);
          swRegistration = await navigator.serviceWorker.ready;
          console.log('[FCM Context] Service Worker active & ready for FCM:', swRegistration?.scope);
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
          if ('serviceWorker' in navigator && !swRegistration) {
            try {
              swRegistration = await navigator.serviceWorker.ready;
            } catch (e) {
              console.warn('[FCM Context] SW ready wait warning:', e);
            }
          }

          const tokenOptions = {};
          if (swRegistration) {
            tokenOptions.serviceWorkerRegistration = swRegistration;
          }
          if (VAPID_KEY && VAPID_KEY.trim()) {
            tokenOptions.vapidKey = VAPID_KEY.trim();
          }

          let currentToken = null;
          try {
            currentToken = await getToken(messaging, tokenOptions);
          } catch (tokenErr) {
            console.warn('[FCM Context] Error getting token with VAPID key:', tokenErr.message);
            try {
              // Fallback without custom VAPID key options
              currentToken = await getToken(messaging);
            } catch (fallbackErr) {
              console.error('[FCM Context] Fallback getToken error:', fallbackErr.message);
            }
          }

          if (currentToken) {
            console.log('[FCM Context] Obtained FCM Token successfully:', currentToken.substring(0, 15) + '...');
            setFcmToken(currentToken);
            localStorage.setItem('foodbridge_fcm_token', currentToken);
            const authToken = token || localStorage.getItem('foodbridge_token');
            if (authToken) {
              await registerTokenWithBackend(currentToken);
            }
            setLoading(false);
            return true;
          } else {
            console.warn('[FCM Context] No registration token returned by Firebase.');
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
          const title = payload.notification?.title || payload.data?.title || 'FoodBridge AI Alert';
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

          // Trigger native system banner popup on OS/browser level
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((reg) => {
                  reg.showNotification(title, {
                    body,
                    icon: '/web-app-manifest-192x192.png',
                    badge: '/favicon-96x96.png',
                    tag: type || 'foodbridge-fcm-foreground',
                    data: { link },
                  });
                });
              } else {
                new Notification(title, {
                  body,
                  icon: '/web-app-manifest-192x192.png',
                  badge: '/favicon-96x96.png',
                  tag: type || 'foodbridge-fcm-foreground',
                  data: { link },
                });
              }
            } catch (notifErr) {
              console.warn('[FCM Context] Native notification popup fallback error:', notifErr);
            }
          }
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

  // Sync token when user authenticates or on page mount
  useEffect(() => {
    const authToken = token || localStorage.getItem('foodbridge_token');
    if (authToken && permissionStatus === 'granted') {
      const savedToken = fcmToken || localStorage.getItem('foodbridge_fcm_token');
      if (savedToken) {
        setFcmToken(savedToken);
        registerTokenWithBackend(savedToken);
      } else {
        requestNotificationPermission();
      }
    }
  }, [token, permissionStatus, registerTokenWithBackend]);

  const dismissToast = () => setToastNotif(null);

  return (
    <NotificationContext.Provider
      value={{
        permissionStatus,
        fcmToken,
        isPushEnabled: permissionStatus === 'granted',
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
