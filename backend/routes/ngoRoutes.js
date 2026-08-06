const express = require('express');
const router = express.Router();
const {
  getNearbyDonations,
  acceptDonation,
  revertDonationAcceptance,
  getDonationHistory,
  getNgoStats,
  getDonationDetails,
  getAvailableVolunteers,
} = require('../controllers/ngoController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorizeRoles('ngo', 'admin'), getNgoStats);
router.get('/volunteers', protect, authorizeRoles('ngo', 'admin'), getAvailableVolunteers);
router.get('/donations/nearby', protect, authorizeRoles('ngo', 'admin'), getNearbyDonations);
router.get('/donations/history', protect, authorizeRoles('ngo', 'admin'), getDonationHistory);
router.get('/donations/:id', protect, authorizeRoles('ngo', 'admin'), getDonationDetails);
router.post('/donations/:id/accept', protect, authorizeRoles('ngo', 'admin'), acceptDonation);
router.post('/donations/:id/revert', protect, authorizeRoles('ngo', 'admin'), revertDonationAcceptance);

module.exports = router;
