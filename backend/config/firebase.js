const admin = require('firebase-admin');
const User = require('../models/User');

let isFirebaseInitialized = false;

try {
  if (admin.apps.length === 0) {
    let credential = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
          : process.env.FIREBASE_SERVICE_ACCOUNT;
        credential = admin.credential.cert(serviceAccount);
      } catch (err) {
        console.warn('[FCM Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err.message);
      }
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    }

    if (credential) {
      admin.initializeApp({ credential });
      isFirebaseInitialized = true;
      console.log('[FCM Admin] Firebase Admin SDK initialized successfully with service credentials.');
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Fallback application initialization using environment project ID
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      isFirebaseInitialized = true;
      console.log('[FCM Admin] Firebase Admin SDK initialized with Project ID:', process.env.FIREBASE_PROJECT_ID);
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
 * @param {Object} params
 * @param {Array<string>} params.tokens - Array of FCM registration tokens
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body content
 * @param {string} [params.link] - Target route link upon notification click
 * @param {string} [params.type] - Notification category/type (info, warning, urgent, etc.)
 * @param {string} [params.role] - Recipient role
 * @param {string|ObjectId} [params.userId] - Target User ID for token cleanup if invalid
 */
const sendPushNotification = async ({ tokens = [], title, body, link = '', type = 'info', role = 'all', userId = null }) => {
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return { success: false, reason: 'No tokens provided' };
  }

  // Filter out empty or null token strings
  const validTokens = [...new Set(tokens.filter(t => typeof t === 'string' && t.trim().length > 0))];
  if (validTokens.length === 0) {
    return { success: false, reason: 'No valid tokens' };
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
      tokens: validTokens,
    };

    console.log(`[FCM Admin] Sending FCM push notification "${title}" to ${validTokens.length} token(s)...`);
    const response = await admin.messaging().sendEachForMulticast(payload);
    
    console.log(`[FCM Admin] Sent successfully: ${response.successCount}/${validTokens.length}. Failures: ${response.failureCount}`);

    // Clean up expired or invalid tokens from user record if failure occurs
    if (response.failureCount > 0 && userId) {
      const tokensToRemove = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToRemove.push(validTokens[idx]);
          }
        }
      });

      if (tokensToRemove.length > 0) {
        console.log(`[FCM Admin] Removing ${tokensToRemove.length} stale FCM token(s) for user ${userId}`);
        await User.findByIdAndUpdate(userId, {
          $pull: { fcmTokens: { $in: tokensToRemove } }
        });
      }
    }

    return {
      success: true,
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
  sendPushNotification,
};
