const User = require('../models/User');
const Notification = require('../models/Notification');
const { notifyAdmins } = require('../utils/notificationHelper');
const jwt = require('jsonwebtoken');

const generateToken = (id, user_role) => {
  return jwt.sign({ id, user_role }, process.env.JWT_SECRET || 'foodbridge_ai_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, user_role, phone, address, organizationName, location } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const assignedRole = user_role || role || 'donor';

    const regLat = Number(req.body.latitude || location?.lat) || 0;
    const regLng = Number(req.body.longitude || location?.lng) || 0;
    const regAddress = req.body.formattedAddress || address || '';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      user_role: assignedRole,
      phone: phone || '',
      address: regAddress,
      formattedAddress: regAddress,
      organizationName: organizationName || '',
      location: { lat: regLat, lng: regLng },
      latitude: regLat,
      longitude: regLng,
      locationName: req.body.locationName || '',
      locationUpdatedAt: new Date(),
    });

    // Create initial welcome notification for new user and alert admins
    try {
      await Notification.create({
        userId: user._id,
        role: assignedRole,
        title: `Welcome to FoodBridge AI (${assignedRole.toUpperCase()})`,
        message: `Welcome ${user.name || 'Partner'}! Your ${assignedRole.toUpperCase()} account is active. Connect with local donors, shelters, and volunteers to eliminate surplus food waste.`,
        type: 'system',
        link: assignedRole === 'donor' ? '/donor/donate' : assignedRole === 'ngo' ? '/ngo/browse-food' : assignedRole === 'volunteer' ? '/volunteer/assignments' : '/admin',
        isRead: false,
      });

      if (assignedRole !== 'admin') {
        await notifyAdmins({
          title: 'New Partner Registration Pending',
          message: `${user.name || 'A user'} registered as ${assignedRole.toUpperCase()} and requires account document review.`,
          type: 'warning',
          link: '/admin/verifications',
        });
      }
    } catch (notifErr) {
      console.warn('Notification creation notice:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.user_role),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        user_role: user.user_role || user.role,
        verificationStatus: user.verificationStatus,
        verificationDocs: user.verificationDocs || [],
        rejectionReason: user.rejectionReason || '',
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id, user.user_role || user.role),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        user_role: user.user_role || user.role,
        verificationStatus: user.verificationStatus,
        verificationDocs: user.verificationDocs || [],
        rejectionReason: user.rejectionReason || '',
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
