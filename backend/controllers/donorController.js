const Donation = require('../models/Donation');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Donor / Admin)
const createDonation = async (req, res, next) => {
  try {
    const { title, description, foodType, quantity, unit, expiryTime, location, image, checklist } = req.body;

    // Business Rule 7: Only verified donors can publish donations
    if (req.user.verificationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Only verified donors can publish donations. Please complete document verification first.',
      });
    }

    // Business Rule 1: Food image is required
    if (!image || (typeof image === 'string' && image.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required.',
      });
    }

    // Business Rule 2: Food name is required
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Food name is required.',
      });
    }

    // Business Rule 3: Quantity must be greater than 0
    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0.',
      });
    }

    // Business Rule 4: Expiry time must be after current time
    if (!expiryTime || new Date(expiryTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Expiry time must be after current time.',
      });
    }

    // Business Rule 5: Pickup location is mandatory
    const addressStr = typeof location === 'string' ? location : location?.address;
    if (!addressStr || addressStr.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Pickup location is mandatory.',
      });
    }

    // Business Rule 6: All checklist items must be accepted
    if (checklist) {
      const { freshlyPrepared, hygienicallyPacked, properlySealed, safeTempMaintained, noDamage } = checklist;
      if (!freshlyPrepared || !hygienicallyPacked || !properlySealed || !safeTempMaintained || !noDamage) {
        return res.status(400).json({
          success: false,
          message: 'All food quality checklist items must be accepted.',
        });
      }
    }

    // Business Rule 5: Donation becomes Available (status: 'available')
    const donation = await Donation.create({
      donorId: req.user._id,
      title: title.trim(),
      description: description || '',
      foodType: foodType || 'cooked',
      quantity: Number(quantity),
      unit: unit || 'kg',
      expiryTime: new Date(expiryTime),
      location: typeof location === 'object' ? location : { address: addressStr },
      image,
      status: 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully and is now Available.',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload food image
// @route   POST /api/donations/upload-image
// @access  Private (Donor / Admin)
const uploadFoodImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Upload food image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.path, 'foodbridge_donations');
    res.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private (Donor / Admin)
const updateDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.donorId.toString() !== req.user._id.toString() && req.user.user_role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this donation' });
    }

    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, donation: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private (Donor / Admin)
const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.donorId.toString() !== req.user._id.toString() && req.user.user_role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this donation' });
    }

    await donation.deleteOne();
    res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my donations
// @route   GET /api/donations/my
// @access  Private (Donor / Admin)
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id })
      .populate('ngoId', 'name organizationName phone')
      .populate('volunteerId', 'name phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  uploadFoodImage,
  updateDonation,
  deleteDonation,
  getMyDonations,
};
