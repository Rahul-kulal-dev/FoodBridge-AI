/* eslint-disable no-undef */
// Firebase Cloud Messaging Background Service Worker for FoodBridge AI PWA
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Parse Firebase configuration dynamically from query parameters passed during SW registration
const params = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
  measurementId: params.get('measurementId') || ''
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const messaging = firebase.messaging();

  // Handle Background Push Notifications when PWA tab/browser is closed or in background
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background FCM payload:', payload);

    const title = payload.notification?.title || payload.data?.title || 'FoodBridge AI Alert';
    const body = payload.notification?.body || payload.data?.body || 'You have a new notification.';
    const link = payload.data?.link || payload.data?.click_action || '/';
    const icon = payload.notification?.icon || '/web-app-manifest-192x192.png';
    const badge = payload.notification?.badge || '/favicon-96x96.png';

    const notificationOptions = {
      body,
      icon,
      badge,
      tag: payload.data?.type || 'foodbridge-fcm-push',
      data: {
        link,
        timestamp: Date.now(),
      },
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      renotify: true,
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    // Return the Promise so FCM SDK can keep the Service Worker alive via event.waitUntil()
    return self.registration.showNotification(title, notificationOptions);
  });
} catch (err) {
  console.warn('[firebase-messaging-sw.js] Firebase initialization error:', err);
}

// Native Web Push Event Fallback Handler (Catches direct push events when app is closed)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Native push event received:', event);
  
  let title = 'FoodBridge AI Alert';
  let body = 'You have a new notification.';
  let link = '/';

  if (event.data) {
    try {
      const rawData = event.data.json();
      title = rawData.notification?.title || rawData.data?.title || title;
      body = rawData.notification?.body || rawData.data?.body || body;
      link = rawData.data?.link || rawData.data?.click_action || link;
    } catch {
      try {
        body = event.data.text() || body;
      } catch (textErr) {
        console.warn('[firebase-messaging-sw.js] Push payload read error:', textErr);
      }
    }
  }

  const options = {
    body,
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    tag: 'foodbridge-push-fallback',
    data: { link, timestamp: Date.now() },
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle User Click on Push Notification Banner
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetLink = event.notification.data?.link || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.focus();
          if ('navigate' in client && targetLink) {
            client.navigate(targetLink);
          }
          return;
        }
      }
      // Open new PWA window if closed
      if (clients.openWindow) {
        return clients.openWindow(targetLink);
      }
    })
  );
});

// Import PWA Offline Caching logic from sw.js
try {
  importScripts('/sw.js');
} catch (swImportErr) {
  console.warn('[firebase-messaging-sw.js] Could not import sw.js caching:', swImportErr);
}

