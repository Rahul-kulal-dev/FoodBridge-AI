const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a single notification for a specific user
 */
const createNotification = async ({ userId, role = 'all', title, message, type = 'info', link = '' }) => {
  try {
    if (!userId || !title || !message) return null;
    return await Notification.create({
      userId,
      role,
      title,
      message,
      type,
      link,
      isRead: false,
    });
  } catch (error) {
    console.error('[Notification Helper Error]:', error.message);
    return null;
  }
};

/**
 * Send notification to all admins (e.g. for pending approvals, photo reviews)
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

module.exports = {
  createNotification,
  notifyAdmins,
  notifyNgos,
  notifyVolunteers,
};
