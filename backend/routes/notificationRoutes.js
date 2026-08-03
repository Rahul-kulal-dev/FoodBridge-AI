const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendNotification);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;
