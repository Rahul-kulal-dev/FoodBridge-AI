const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerFcmToken,
  removeFcmToken,
  testPushNotification,
  broadcastNotification,
} = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendNotification);
router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// FCM Push Notification Token Management, Testing & Admin Broadcast
router.post('/fcm-token', registerFcmToken);
router.delete('/fcm-token', removeFcmToken);
router.post('/test-push', testPushNotification);
router.post('/broadcast', authorizeRoles('admin'), broadcastNotification);

module.exports = router;
