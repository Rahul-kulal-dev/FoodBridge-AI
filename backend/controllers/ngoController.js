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

// @desc    Get stats for NGO dashboard
// @route   GET /api/ngo/stats
// @access  Private (NGO / Admin)
const getNgoStats = async (req, res, next) => {
  try {
    const ngoId = req.user._id;

    const nearbyCount = await Donation.countDocuments({ status: 'available' });
    const activeDonationsCount = await Donation.countDocuments({
      ngoId,
      status: { $in: ['accepted', 'picked_up'] },
    });
    const acceptedDonations = await Donation.find({
      ngoId,
      status: { $in: ['accepted', 'picked_up', 'delivered'] },
    });

    const totalMealsReceived = acceptedDonations.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    res.json({
      success: true,
      stats: {
        mealsReceived: totalMealsReceived,
        activeDonations: activeDonationsCount,
        nearbyDonations: nearbyCount,
        volunteerEta: activeDonationsCount > 0 ? '12 mins' : 'N/A',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation details
// @route   GET /api/ngo/donations/:id
// @access  Private (NGO / Admin)
const getDonationDetails = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email phone address organizationName verificationStatus')
      .populate('volunteerId', 'name email phone address')
      .populate('ngoId', 'name email phone address organizationName');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({
      success: true,
      donation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNgoStats,
  getNearbyDonations,
  getDonationDetails,
  acceptDonation,
  getDonationHistory,
};

