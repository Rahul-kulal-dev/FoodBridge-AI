const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const User = require('../models/User');

let isFirebaseInitialized = false;
let hasServiceAccountCredential = false;

try {
  if (admin.apps.length === 0) {
    let credential = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
          : process.env.FIREBASE_SERVICE_ACCOUNT;
        credential = admin.credential.cert(serviceAccount);
        hasServiceAccountCredential = true;
      } catch (err) {
        console.warn('[FCM Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err.message);
      }
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      try {
        credential = admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || '',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        hasServiceAccountCredential = true;
      } catch (err) {
        console.warn('[FCM Admin] Failed to initialize credentials from clientEmail/privateKey:', err.message);
      }
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      try {
        const filePath = path.isAbsolute(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
          ? process.env.FIREBASE_SERVICE_ACCOUNT_PATH
          : path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        
        if (fs.existsSync(filePath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          credential = admin.credential.cert(serviceAccount);
          hasServiceAccountCredential = true;
          console.log('[FCM Admin] Loaded service account credentials from file:', filePath);
        } else {
          console.warn('[FCM Admin] Service account file specified in .env not found:', filePath);
        }
      } catch (err) {
        console.warn('[FCM Admin] Failed to read FIREBASE_SERVICE_ACCOUNT_PATH file:', err.message);
      }
    }

    if (credential) {
      admin.initializeApp({ credential });
      isFirebaseInitialized = true;
      console.log('[FCM Admin] Firebase Admin SDK initialized successfully with service credentials.');
    } else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      isFirebaseInitialized = true;
      console.log('[FCM Admin] Firebase Admin SDK initialized with Project ID:', process.env.FIREBASE_PROJECT_ID);
      console.warn('[FCM Admin] Note: To send live push notifications via FCM HTTP v1 API, please provide FIREBASE_SERVICE_ACCOUNT or FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY in backend/.env');
    } else {
      console.warn('[FCM Admin] Warning: FIREBASE_PROJECT_ID or service account credentials not configured in backend .env');
    }
  } else {
    isFirebaseInitialized = true;
  }
} catch (error) {
  console.warn('[FCM Admin] Warning during Firebase Admin initialization:', error.message);
}

/**
 * Send FCM Multicast Push Notification to specified user tokens
 */
const sendPushNotification = async ({ tokens = [], title, body, link = '', type = 'info', role = 'all', userId = null }) => {
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return { success: false, reason: 'No tokens provided' };
  }

  const validTokens = [...new Set(tokens.filter(t => typeof t === 'string' && t.trim().length > 0))];
  if (validTokens.length === 0) {
    return { success: false, reason: 'No valid tokens' };
  }

  if (!hasServiceAccountCredential) {
    console.warn(`[FCM Admin] Cannot dispatch push notification "${title}". Reason: Firebase Admin SDK requires service account credentials (FIREBASE_SERVICE_ACCOUNT, FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, or FIREBASE_SERVICE_ACCOUNT_PATH) in backend .env to authorize with FCM HTTP v1 API.`);
    return {
      success: false,
      reason: 'Missing Firebase Service Account credentials in backend .env',
      tokensCount: validTokens.length
    };
  }

  try {
    const payload = {
      notification: {
        title: title || 'FoodBridge AI Alert',
        body: body || '',
      },
      data: {
        title: title || 'FoodBridge AI Alert',
        body: body || '',
        link: link || '/',
        type: type || 'info',
        role: role || 'all',
        click_action: link || '/',
      },
      webpush: {
        headers: {
          Urgency: 'high',
          TTL: '86400',
        },
        notification: {
          title: title || 'FoodBridge AI Alert',
          body: body || '',
          icon: '/web-app-manifest-192x192.png',
          badge: '/favicon-96x96.png',
          requireInteraction: true,
          vibrate: [200, 100, 200, 100, 200],
          renotify: true,
          actions: [
            { action: 'open', title: 'Open App' },
            { action: 'dismiss', title: 'Dismiss' }
          ]
        },
        fcmOptions: {
          link: link || '/',
        },
      },
      tokens: validTokens,
    };

    console.log(`[FCM Admin] Sending FCM push notification "${title}" to ${validTokens.length} token(s)...`);
    const response = await admin.messaging().sendEachForMulticast(payload);
    
    console.log(`[FCM Admin] Sent successfully: ${response.successCount}/${validTokens.length}. Failures: ${response.failureCount}`);

    if (response.failureCount > 0) {
      const tokensToRemove = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          const errMsg = resp.error?.message;
          console.warn(`[FCM Admin] Push delivery failed for token [${validTokens[idx].substring(0, 15)}...]:`, errCode || errMsg || resp.error);

          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToRemove.push(validTokens[idx]);
          }
        }
      });

      if (tokensToRemove.length > 0 && userId) {
        console.log(`[FCM Admin] Removing ${tokensToRemove.length} stale FCM token(s) for user ${userId}`);
        await User.findByIdAndUpdate(userId, {
          $pull: { fcmTokens: { $in: tokensToRemove } }
        });
      }
    }

    return {
      success: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('[FCM Admin] Error sending FCM multicast push notification:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  admin,
  isFirebaseInitialized,
  hasServiceAccountCredential,
  sendPushNotification,
};
