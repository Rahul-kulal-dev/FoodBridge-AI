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
    const {
      name,
      phone,
      address,
      organizationName,
      location,
      vehicleType,
      vehicleNumber,
      emergencyContact,
      deliveryRadius,
      availability,
      servingCapacity,
      operatingHours,
      foodCategories,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (organizationName !== undefined) user.organizationName = organizationName;
    if (location !== undefined) user.location = location;
    if (vehicleType !== undefined) user.vehicleType = vehicleType;
    if (vehicleNumber !== undefined) user.vehicleNumber = vehicleNumber;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (deliveryRadius !== undefined) user.deliveryRadius = deliveryRadius;
    if (availability !== undefined) user.availability = availability;
    if (servingCapacity !== undefined) user.servingCapacity = servingCapacity;
    if (operatingHours !== undefined) user.operatingHours = operatingHours;
    if (foodCategories !== undefined) user.foodCategories = foodCategories;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userObject,
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

    const docType = req.body.docType || req.body.docLabel || 'Compliance Document';

    // Upload file to Cloudinary and retrieve full metadata
    const cloudRes = await uploadToCloudinary(req.file.path, 'foodbridge_verifications');
    const finalDocUrl = cloudRes.secure_url || cloudRes.toString();

    // Find the authenticated user and save doc with metadata
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const docMetadata = {
      docType,
      docUrl: finalDocUrl,
      publicId: cloudRes.public_id || '',
      resourceType: cloudRes.resource_type || 'auto',
      format: cloudRes.format || '',
      bytes: cloudRes.bytes || req.file.size || 0,
      fileName: req.file.originalname || '',
      uploadedAt: new Date(),
    };

    if (!user.verificationDocs) {
      user.verificationDocs = [];
    }

    // Check if a document with the same docType already exists and replace it
    const existingIndex = user.verificationDocs.findIndex(
      (d) => d.docType && d.docType.toLowerCase() === docType.toLowerCase()
    );

    if (existingIndex !== -1) {
      user.verificationDocs[existingIndex] = docMetadata;
    } else {
      user.verificationDocs.push(docMetadata);
    }

    // Verification status starts/resets as Pending after submission
    user.verificationStatus = 'pending';
    user.rejectionReason = '';
    await user.save();

    res.json({
      success: true,
      message: `${docType} uploaded successfully to Cloudinary & MongoDB`,
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
