const express = require('express');
const router = express.Router();
const {
  getNearbyDonations,
  acceptDonation,
  getDonationHistory,
} = require('../controllers/ngoController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/donations/nearby', protect, authorizeRoles('ngo', 'admin'), getNearbyDonations);
router.post('/donations/:id/accept', protect, authorizeRoles('ngo', 'admin'), acceptDonation);
router.get('/donations/history', protect, authorizeRoles('ngo', 'admin'), getDonationHistory);

module.exports = router;
