const Donation = require('../models/Donation');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Donor / Admin)
const createDonation = async (req, res, next) => {
  try {
    const { title, description, foodType, quantity, unit, expiryTime, location, image } = req.body;

    const donation = await Donation.create({
      donorId: req.user._id,
      title,
      description,
      foodType,
      quantity,
      unit,
      expiryTime,
      location: location || { address: req.user.address, lat: req.user.location?.lat, lng: req.user.location?.lng },
      image: image || '',
      status: 'available',
    });

    res.status(201).json({
      success: true,
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

    const imageUrl = `/uploads/${req.file.filename}`;
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

    // Ensure owner or admin
    if (donation.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this donation' });
    }

    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      donation: updated,
    });
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

    if (donation.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this donation' });
    }

    await donation.deleteOne();

    res.json({
      success: true,
      message: 'Donation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's donations
// @route   GET /api/donations/my
// @access  Private (Donor)
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
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
