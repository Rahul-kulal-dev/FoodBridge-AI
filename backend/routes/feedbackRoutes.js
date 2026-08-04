const express = require('express');
const router = express.Router();
const {
  getEligibleDonationsForNgo,
  submitFeedback,
  getFeedbacks,
  getNgoFeedbacks,
  getDonorFeedbacks,
  getVolunteerFeedbacks,
  getAdminFeedbackLogs,
} = require('../controllers/feedbackController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/eligible-donations', protect, authorizeRoles('ngo', 'admin'), getEligibleDonationsForNgo);
router.post('/', protect, authorizeRoles('ngo'), submitFeedback);
router.get('/ngo', protect, authorizeRoles('ngo'), getNgoFeedbacks);
router.get('/donor', protect, authorizeRoles('donor', 'admin'), getDonorFeedbacks);
router.get('/volunteer', protect, authorizeRoles('volunteer', 'admin'), getVolunteerFeedbacks);
router.get('/admin-logs', protect, authorizeRoles('admin'), getAdminFeedbackLogs);
router.get('/', protect, getFeedbacks);

module.exports = router;

