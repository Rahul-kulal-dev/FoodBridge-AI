import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase configuration loaded strictly from environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// VAPID Public Key for Web Push (Optional override)
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Messaging dynamically after feature checking
let messagingPromise = null;

export const getFirebaseMessaging = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const supported = await isSupported();
    if (supported) {
      if (!messagingPromise) {
        messagingPromise = getMessaging(app);
      }
      return messagingPromise;
    }
  } catch (err) {
    console.warn('[FCM Config] Firebase Messaging feature check failed:', err);
  }
  return null;
};
