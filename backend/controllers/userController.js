const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
    const { name, phone, address, organizationName, location } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (organizationName) user.organizationName = organizationName;
    if (location) user.location = location;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        user_role: updatedUser.user_role || updatedUser.role,
        verificationStatus: updatedUser.verificationStatus,
        verificationDocs: updatedUser.verificationDocs || [],
        rejectionReason: updatedUser.rejectionReason || '',
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

    // Upload file to Cloudinary and retrieve full metadata
    const cloudRes = await uploadToCloudinary(req.file.path, 'foodbridge_verifications');
    const finalDocUrl = cloudRes.secure_url || cloudRes.toString();

    // Find the authenticated user and save doc with metadata
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const docMetadata = {
      docUrl: finalDocUrl,
      publicId: cloudRes.public_id || '',
      resourceType: cloudRes.resource_type || 'auto',
      format: cloudRes.format || '',
      bytes: cloudRes.bytes || req.file.size || 0,
      fileName: req.file.originalname || '',
      uploadedAt: new Date(),
    };

    user.verificationDocs.push(docMetadata);
    user.verificationStatus = 'pending';
    user.rejectionReason = '';
    await user.save();

    res.json({
      success: true,
      message: 'Verification document uploaded successfully',
      docUrl: finalDocUrl,
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
