const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendPushNotification } = require('../config/firebase');

/**
 * Create a single notification for a specific user and send real-time FCM push notification
 */
const createNotification = async ({ userId, role = 'all', title, message, type = 'info', link = '' }) => {
  try {
    if (!userId || !title || !message) return null;

    // 1. Save in-app notification in MongoDB history
    const notification = await Notification.create({
      userId,
      role,
      title,
      message,
      type,
      link,
      isRead: false,
    });

    // 2. Fetch user's FCM tokens and dispatch real-time FCM push notification
    try {
      const user = await User.findById(userId).select('fcmTokens');
      if (user && user.fcmTokens && user.fcmTokens.length > 0) {
        sendPushNotification({
          tokens: user.fcmTokens,
          title,
          body: message,
          link,
          type,
          role,
          userId: user._id,
        }).catch((pushErr) => {
          console.warn('[Notification Helper Push Error]:', pushErr.message);
        });
      }
    } catch (pushLookupErr) {
      console.warn('[Notification Helper FCM Fetch Error]:', pushLookupErr.message);
    }

    return notification;
  } catch (error) {
    console.error('[Notification Helper Error]:', error.message);
    return null;
  }
};

/**
 * Send notification to all admins (e.g. for pending approvals, photo reviews, completed deliveries)
 */
const notifyAdmins = async ({ title, message, type = 'warning', link = '/admin/verifications' }) => {
  try {
    const admins = await User.find({
      $or: [{ role: 'admin' }, { user_role: 'admin' }],
    });

    const notifications = await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin._id,
          role: 'admin',
          title,
          message,
          type,
          link,
        })
      )
    );

    return notifications.filter(Boolean);
  } catch (error) {
    console.error('[Notify Admins Error]:', error.message);
    return [];
  }
};

/**
 * Send notification to all approved NGOs (e.g. for nearby food posts)
 */
const notifyNgos = async ({ title, message, type = 'info', link = '/ngo/browse-food' }) => {
  try {
    const ngos = await User.find({
      $or: [{ role: 'ngo' }, { user_role: 'ngo' }],
    });

    const notifications = await Promise.all(
      ngos.map((ngo) =>
        createNotification({
          userId: ngo._id,
          role: 'ngo',
          title,
          message,
          type,
          link,
        })
      )
    );

    return notifications.filter(Boolean);
  } catch (error) {
    console.error('[Notify NGOs Error]:', error.message);
    return [];
  }
};

/**
 * Send notification to all verified volunteers (e.g. when new task becomes available)
 */
const notifyVolunteers = async ({ title, message, type = 'info', link = '/volunteer/assignments' }) => {
  try {
    const volunteers = await User.find({
      $or: [{ role: 'volunteer' }, { user_role: 'volunteer' }],
    });

    const notifications = await Promise.all(
      volunteers.map((vol) =>
        createNotification({
          userId: vol._id,
          role: 'volunteer',
          title,
          message,
          type,
          link,
        })
      )
    );

    return notifications.filter(Boolean);
  } catch (error) {
    console.error('[Notify Volunteers Error]:', error.message);
    return [];
  }
};

/**
 * Send broadcast notification to all registered users (donors, ngos, volunteers, admins)
 */
const notifyAllUsers = async ({ title, message, type = 'system', link = '/', targetRole = 'all' }) => {
  try {
    let query = {};
    if (targetRole && targetRole !== 'all') {
      query = { $or: [{ role: targetRole }, { user_role: targetRole }] };
    }

    const targetUsers = await User.find(query).select('_id fcmTokens role user_role');
    if (!targetUsers || targetUsers.length === 0) {
      return { success: false, reason: 'No matching target users found in database' };
    }

    // 1. Create in-app notifications in MongoDB history for all target users
    const notifDocs = targetUsers.map((u) => ({
      userId: u._id,
      role: u.user_role || u.role || 'all',
      title,
      message,
      type,
      link,
      isRead: false,
    }));
    await Notification.insertMany(notifDocs);

    // 2. Aggregate all active FCM push tokens across all target users
    const allTokens = [];
    targetUsers.forEach((u) => {
      if (u.fcmTokens && Array.isArray(u.fcmTokens)) {
        u.fcmTokens.forEach((t) => {
          if (t && typeof t === 'string' && t.trim().length > 0) {
            allTokens.push(t.trim());
          }
        });
      }
    });

    const uniqueTokens = [...new Set(allTokens)];

    // 3. Dispatch FCM Push Notification via Firebase Admin SDK
    let pushResult = { success: false, successCount: 0, failureCount: 0 };
    if (uniqueTokens.length > 0) {
      pushResult = await sendPushNotification({
        tokens: uniqueTokens,
        title,
        body: message,
        link,
        type,
        role: targetRole || 'all',
      });
    }

    return {
      success: true,
      totalUsers: targetUsers.length,
      tokensCount: uniqueTokens.length,
      pushResult,
    };
  } catch (error) {
    console.error('[Notify All Users Error]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createNotification,
  notifyAdmins,
  notifyNgos,
  notifyVolunteers,
  notifyAllUsers,
};

