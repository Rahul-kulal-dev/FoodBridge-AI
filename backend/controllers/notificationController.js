const Notification = require('../models/Notification');
const User = require('../models/User');
const { createNotification, notifyAllUsers } = require('../utils/notificationHelper');
const { sendPushNotification } = require('../config/firebase');

// @desc    Send notification to a user
// @route   POST /api/notifications
// @access  Private
const sendNotification = async (req, res, next) => {
  try {
    const { userId, role, title, message, type, link } = req.body;

    const notification = await createNotification({
      userId: userId || req.user._id,
      role: role || req.user.user_role || req.user.role || 'all',
      title: title || 'Notification',
      message: message || '',
      type: type || 'info',
      link: link || '',
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's role-based notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const activeRole = req.user.user_role || req.user.role || 'donor';
    let notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Auto-seed initial welcome notification for any user with 0 notifications
    if (notifications.length === 0) {
      const roleUpper = activeRole.toUpperCase();
      let roleSpecificWelcome = `Welcome ${req.user.name || 'Partner'}! Your ${roleUpper} account is active.`;
      
      if (activeRole === 'donor') {
        roleSpecificWelcome += ' Post your surplus food to connect with local NGOs and volunteers.';
      } else if (activeRole === 'ngo') {
        roleSpecificWelcome += ' Browse nearby food posts and request pickups for community distribution.';
      } else if (activeRole === 'volunteer') {
        roleSpecificWelcome += ' Check your assignments to navigate and assist in food redistribution.';
      } else if (activeRole === 'admin') {
        roleSpecificWelcome += ' Monitor platform verifications, user roles, and photo reviews.';
      }

      const welcomeNotif = await createNotification({
        userId: req.user._id,
        role: activeRole,
        title: `Welcome to FoodBridge AI (${roleUpper})`,
        message: roleSpecificWelcome,
        type: 'system',
        link: activeRole === 'donor' ? '/donor/donate' : activeRole === 'ngo' ? '/ngo/browse-food' : activeRole === 'volunteer' ? '/volunteer/assignments' : '/admin',
      });
      
      notifications = welcomeNotif ? [welcomeNotif] : [];
    }

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({ success: true, message: 'Notification marked as read' });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.json({ success: true, message: 'Notification marked as read' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      await Notification.findOneAndDelete({ _id: id, userId: req.user._id });
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user FCM push notification token
// @route   POST /api/notifications/fcm-token
// @access  Private
const registerFcmToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, message: 'FCM Token is required' });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { fcmTokens: token.trim() } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'FCM push token registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove user FCM push notification token
// @route   DELETE /api/notifications/fcm-token
// @access  Private
const removeFcmToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      // Remove all tokens for user on complete logout
      await User.findByIdAndUpdate(req.user._id, { $set: { fcmTokens: [] } });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $pull: { fcmTokens: token.trim() } });
    }

    res.json({
      success: true,
      message: 'FCM token removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send test FCM push notification
// @route   POST /api/notifications/test-push
// @access  Private
const testPushNotification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('fcmTokens role user_role name');
    const userRole = user?.user_role || user?.role || 'donor';

    const testNotif = await createNotification({
      userId: req.user._id,
      role: userRole,
      title: 'Real-Time FCM Push Test',
      message: `Hello ${user.name || 'User'}! Real-time FCM push notifications are working on your device.`,
      type: 'info',
      link: `/${userRole}/notifications`,
    });

    res.json({
      success: true,
      message: 'Test FCM push notification triggered',
      tokensCount: user?.fcmTokens?.length || 0,
      notification: testNotif,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin broadcast push notification to all users via Firebase FCM
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
const broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, targetRole, type, link } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Notification title and message body are required' });
    }

    const result = await notifyAllUsers({
      title: title.trim(),
      message: message.trim(),
      targetRole: targetRole || 'all',
      type: type || 'system',
      link: link || '/',
    });

    res.status(200).json({
      success: true,
      message: 'Push notification broadcast dispatched successfully via Firebase FCM',
      details: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerFcmToken,
  removeFcmToken,
  testPushNotification,
  broadcastNotification,
};

