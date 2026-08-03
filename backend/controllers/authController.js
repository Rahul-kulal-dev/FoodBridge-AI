const User = require('../models/User');
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

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      user_role: assignedRole,
      phone: phone || '',
      address: address || '',
      organizationName: organizationName || '',
      location: location || { lat: 0, lng: 0 },
    });

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
