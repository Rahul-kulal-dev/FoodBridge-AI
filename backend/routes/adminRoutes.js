const express = require('express');
const router = express.Router();
const {
  getPendingNGOs,
  getPendingDonors,
  approveUser,
  rejectUser,
  getAllUsers,
  getAdminAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Allow admin endpoints to be accessible with standard authentication
router.use(protect);

router.get('/pending-ngos', getPendingNGOs);
router.get('/pending-donors', getPendingDonors);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);
router.get('/users', getAllUsers);
router.get('/analytics', getAdminAnalytics);

module.exports = router;
