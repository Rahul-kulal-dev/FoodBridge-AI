const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.organizationName = req.body.organizationName !== undefined ? req.body.organizationName : user.organizationName;
    if (req.body.location) {
      user.location = req.body.location;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        verificationStatus: updatedUser.verificationStatus,
        phone: updatedUser.phone,
        address: updatedUser.address,
        organizationName: updatedUser.organizationName,
        location: updatedUser.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload verification document
// @route   POST /api/users/upload-verification
// @access  Private
const uploadVerificationDoc = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const docUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    
    user.verificationDocs.push({ docUrl });
    user.verificationStatus = 'pending';
    user.rejectionReason = '';
    await user.save();

    res.json({
      success: true,
      message: 'Verification document uploaded successfully',
      docUrl,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        user_role: user.user_role || user.role,
        verificationStatus: user.verificationStatus,
        verificationDocs: user.verificationDocs,
        rejectionReason: user.rejectionReason,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadVerificationDoc,
};
