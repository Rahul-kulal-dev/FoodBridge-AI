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
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeRoles('admin'));

router.get('/pending-ngos', getPendingNGOs);
router.get('/pending-donors', getPendingDonors);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);
router.get('/users', getAllUsers);
router.get('/analytics', getAdminAnalytics);

module.exports = router;
