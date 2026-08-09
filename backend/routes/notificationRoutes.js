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
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendNotification);
router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// FCM Push Notification Token Management & Testing
router.post('/fcm-token', registerFcmToken);
router.delete('/fcm-token', removeFcmToken);
router.post('/test-push', testPushNotification);

module.exports = router;
