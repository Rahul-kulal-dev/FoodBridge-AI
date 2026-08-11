const express = require('express');
const router = express.Router();
const {
  getVolunteerStats,
  getAssignedTasks,
  uploadPickupVerification,
  updateTaskStatus,
  getDeliveryHistory,
  updateVolunteerLocation,
  getVolunteerLocation,
} = require('../controllers/volunteerController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { handleUploadSingle } = require('../middleware/uploadMiddleware');

router.get('/stats', protect, authorizeRoles('volunteer', 'admin'), getVolunteerStats);
router.get('/tasks', protect, authorizeRoles('volunteer', 'admin'), getAssignedTasks);
router.post(
  '/tasks/:id/pickup-verification',
  protect,
  authorizeRoles('volunteer', 'admin'),
  handleUploadSingle('photo'),
  uploadPickupVerification
);
router.patch('/tasks/:id/status', protect, authorizeRoles('volunteer', 'admin'), updateTaskStatus);
router.get('/history', protect, authorizeRoles('volunteer', 'admin'), getDeliveryHistory);

router.post('/location', protect, authorizeRoles('volunteer', 'admin'), updateVolunteerLocation);
router.get('/location/:volunteerId', protect, authorizeRoles('volunteer', 'ngo', 'admin'), getVolunteerLocation);

module.exports = router;
