const User = require('../models/User');
const Donation = require('../models/Donation');
const VolunteerTask = require('../models/VolunteerTask');
const Feedback = require('../models/Feedback');

// @desc    Get pending NGOs awaiting verification
// @route   GET /api/admin/pending-ngos
// @access  Private (Admin)
const getPendingNGOs = async (req, res, next) => {
  try {
    const ngos = await User.find({ role: 'ngo', verificationStatus: 'pending' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: ngos.length,
      ngos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending Donors awaiting verification
// @route   GET /api/admin/pending-donors
// @access  Private (Admin)
const getPendingDonors = async (req, res, next) => {
  try {
    const donors = await User.find({ role: 'donor', verificationStatus: 'pending' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve user verification
// @route   PATCH /api/admin/users/:id/approve
// @access  Private (Admin)
const approveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verificationStatus = 'approved';
    user.rejectionReason = '';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} approved successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject user verification
// @route   PATCH /api/admin/users/:id/reject
// @access  Private (Admin)
const rejectUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { rejectionReason } = req.body;
    user.verificationStatus = 'rejected';
    user.rejectionReason = rejectionReason || 'Document incomplete or illegible. Please re-upload clear government-issued document.';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} verification rejected`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage/Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const filter = {
      role: { $ne: 'admin' },
      user_role: { $ne: 'admin' },
    };
    if (role && role !== 'all') filter.role = role;
    if (status) filter.verificationStatus = status;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin overall platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ $or: [{ role: 'donor' }, { user_role: 'donor' }] });
    const totalNGOs = await User.countDocuments({ $or: [{ role: 'ngo' }, { user_role: 'ngo' }] });
    const totalVolunteers = await User.countDocuments({ $or: [{ role: 'volunteer' }, { user_role: 'volunteer' }] });
    const pendingVerifications = await User.countDocuments({
      verificationStatus: 'pending',
      role: { $ne: 'admin' },
      user_role: { $ne: 'admin' },
    });

    const totalDonations = await Donation.countDocuments();
    const completedDonations = await Donation.countDocuments({ status: { $in: ['completed', 'delivered'] } });
    const activeDonations = await Donation.countDocuments({ status: { $in: ['available', 'accepted', 'picked_up', 'in_transit'] } });

    const feedbacks = await Feedback.find();
    const avgRating = feedbacks.length > 0 
      ? (feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      analytics: {
        users: { total: totalUsers, donors: totalDonors, ngos: totalNGOs, volunteers: totalVolunteers, pending: pendingVerifications },
        donations: { total: totalDonations, completed: completedDonations, active: activeDonations },
        feedbacks: { total: feedbacks.length, averageRating: Number(avgRating) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations for admin monitoring
// @route   GET /api/admin/donations
// @access  Private (Admin)
const getAllDonations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const donations = await Donation.find(filter)
      .populate('donorId', 'name organizationName email phone')
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
  getPendingNGOs,
  getPendingDonors,
  approveUser,
  rejectUser,
  getAllUsers,
  getAllDonations,
  getAdminAnalytics,
};
