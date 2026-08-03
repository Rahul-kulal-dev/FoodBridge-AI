const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedbacks,
  getAdminFeedbackLogs,
} = require('../controllers/feedbackController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, submitFeedback);
router.get('/', protect, getFeedbacks);
router.get('/admin-logs', protect, authorizeRoles('admin'), getAdminFeedbackLogs);

module.exports = router;
