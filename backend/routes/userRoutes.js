const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, uploadVerificationDoc } = require('../controllers/userController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-verification', optionalProtect, upload.single('document'), uploadVerificationDoc);

module.exports = router;
