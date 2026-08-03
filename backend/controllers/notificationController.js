const Notification = require('../models/Notification');

// @desc    Send notification to a user
// @route   POST /api/notifications
// @access  Private
const sendNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;

    const notification = await Notification.create({
      userId: userId || req.user._id,
      title,
      message,
      type: type || 'info',
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
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
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
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

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
};
