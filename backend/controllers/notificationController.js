const Notification = require('../models/Notification');

// @desc    Send notification to a user
// @route   POST /api/notifications
// @access  Private
const sendNotification = async (req, res, next) => {
  try {
    const { userId, role, title, message, type, link } = req.body;

    const notification = await Notification.create({
      userId: userId || req.user._id,
      role: role || req.user.role || 'all',
      title,
      message,
      type: type || 'info',
      link: link || '',
      isRead: false,
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

      const welcomeNotif = await Notification.create({
        userId: req.user._id,
        role: activeRole,
        title: `Welcome to FoodBridge AI (${roleUpper})`,
        message: roleSpecificWelcome,
        type: 'system',
        link: activeRole === 'donor' ? '/donor/donate' : activeRole === 'ngo' ? '/ngo/browse-food' : activeRole === 'volunteer' ? '/volunteer/assignments' : '/admin',
        isRead: false,
      });
      notifications = [welcomeNotif];
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

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
