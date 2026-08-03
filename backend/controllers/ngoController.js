const Donation = require('../models/Donation');
const NgoRequest = require('../models/NgoRequest');
const VolunteerTask = require('../models/VolunteerTask');

// @desc    Get nearby available donations
// @route   GET /api/ngo/donations/nearby
// @access  Private (NGO / Admin)
const getNearbyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ status: 'available' })
      .populate('donorId', 'name email phone address organizationName')
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

// @desc    Accept donation
// @route   POST /api/ngo/donations/:id/accept
// @access  Private (NGO)
const acceptDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ success: false, message: `Donation is already ${donation.status}` });
    }

    donation.status = 'accepted';
    donation.ngoId = req.user._id;
    await donation.save();

    const ngoRequest = await NgoRequest.create({
      donationId: donation._id,
      ngoId: req.user._id,
      status: 'accepted',
    });

    res.json({
      success: true,
      message: 'Donation accepted successfully',
      donation,
      ngoRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get accepted donation history for NGO
// @route   GET /api/ngo/donations/history
// @access  Private (NGO)
const getDonationHistory = async (req, res, next) => {
  try {
    const donations = await Donation.find({ ngoId: req.user._id })
      .populate('donorId', 'name email phone address')
      .populate('volunteerId', 'name email phone')
      .sort({ updatedAt: -1 });

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
  getNearbyDonations,
  acceptDonation,
  getDonationHistory,
};
