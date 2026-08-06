const Donation = require('../models/Donation');
const NgoRequest = require('../models/NgoRequest');
const VolunteerTask = require('../models/VolunteerTask');

const resolveDonationImages = (d) => {
  if (!d) return d;
  const obj = typeof d.toObject === 'function' ? d.toObject() : { ...d };
  const titleLower = (obj.title || '').toLowerCase();

  let validImgs = Array.isArray(obj.images)
    ? obj.images.filter((img) => img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:'))
    : [];

  if (obj.image && typeof obj.image === 'string' && obj.image.trim() !== '' && !obj.image.startsWith('blob:')) {
    if (!validImgs.includes(obj.image)) validImgs.unshift(obj.image);
  }

  if (validImgs.length === 0) {
    if (titleLower.includes('pizza') && titleLower.includes('sandwich')) {
      validImgs = [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      ];
    } else if (titleLower.includes('pizza')) {
      validImgs = ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'];
    } else if (titleLower.includes('sandwich')) {
      validImgs = ['https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'];
    } else {
      validImgs = ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'];
    }
  }

  obj.image = validImgs[0];
  obj.images = validImgs;
  return obj;
};

// @desc    Get nearby available donations
// @route   GET /api/ngo/donations/nearby
// @access  Private (NGO / Admin)
const getNearbyDonations = async (req, res, next) => {
  try {
    const rawDonations = await Donation.find({ status: 'available' })
      .populate('donorId', 'name email phone address organizationName')
      .sort({ createdAt: -1 });

    const donations = rawDonations.map(resolveDonationImages);

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

    // BUSINESS RULE: Only Verified NGOs can accept food donations
    if (req.user.verificationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Only Verified NGOs can accept food donations. Please upload mandatory documents and wait for admin approval.',
      });
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
    const rawDonations = await Donation.find({ ngoId: req.user._id })
      .populate('donorId', 'name email phone address')
      .populate('volunteerId', 'name email phone')
      .sort({ updatedAt: -1 });

    const donations = rawDonations.map(resolveDonationImages);

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
      donation: resolveDonationImages(donation),
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

