const express = require('express');
const router = express.Router();
const {
  createDonation,
  uploadFoodImage,
  updateDonation,
  deleteDonation,
  getMyDonations,
} = require('../controllers/donorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorizeRoles('donor', 'admin'), createDonation);
router.post('/upload-image', protect, authorizeRoles('donor', 'admin'), upload.single('image'), uploadFoodImage);
router.get('/my', protect, authorizeRoles('donor', 'admin'), getMyDonations);
router.put('/:id', protect, authorizeRoles('donor', 'admin'), updateDonation);
router.delete('/:id', protect, authorizeRoles('donor', 'admin'), deleteDonation);

module.exports = router;
