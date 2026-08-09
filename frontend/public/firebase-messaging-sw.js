/* eslint-disable no-undef */
// Firebase Cloud Messaging Background Service Worker for FoodBridge AI PWA
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Parse Firebase configuration dynamically from query parameters passed during service worker registration
const params = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
  measurementId: params.get('measurementId') || '',
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  // Handle Background Push Notifications when PWA tab/browser is closed or in background
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background FCM payload:', payload);

    const title = payload.notification?.title || payload.data?.title || 'FoodBridge AI Alert';
    const body = payload.notification?.body || payload.data?.body || 'You have a new notification.';
    const link = payload.data?.link || payload.data?.click_action || '/';
    const icon = payload.notification?.icon || '/web-app-manifest-192x192.png';

    const notificationOptions = {
      body,
      icon,
      badge: '/favicon-96x96.png',
      tag: payload.data?.type || 'foodbridge-fcm-push',
      data: {
        link,
        timestamp: Date.now(),
      },
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    self.registration.showNotification(title, notificationOptions);
  });
}

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
