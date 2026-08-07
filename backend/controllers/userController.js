const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

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
      locationName,
      formattedAddress,
      latitude,
      longitude,
      locationUpdatedAt,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (organizationName !== undefined) user.organizationName = organizationName;
    if (vehicleType !== undefined) user.vehicleType = vehicleType;
    if (vehicleNumber !== undefined) user.vehicleNumber = vehicleNumber;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (deliveryRadius !== undefined) user.deliveryRadius = deliveryRadius;
    if (availability !== undefined) user.availability = availability;
    if (servingCapacity !== undefined) user.servingCapacity = servingCapacity;
    if (operatingHours !== undefined) user.operatingHours = operatingHours;
    if (foodCategories !== undefined) user.foodCategories = foodCategories;

    // Handle address synchronization
    const resolvedAddress = formattedAddress || address;
    if (resolvedAddress !== undefined) {
      user.address = resolvedAddress;
      user.formattedAddress = resolvedAddress;
    }

    if (locationName !== undefined) user.locationName = locationName;

    // Handle lat/lng synchronization across all formats (location object or top-level latitude/longitude)
    let finalLat = latitude !== undefined ? Number(latitude) : (location?.lat !== undefined ? Number(location.lat) : undefined);
    let finalLng = longitude !== undefined ? Number(longitude) : (location?.lng !== undefined ? Number(location.lng) : undefined);

    if (finalLat !== undefined && !isNaN(finalLat)) {
      user.latitude = finalLat;
    }
    if (finalLng !== undefined && !isNaN(finalLng)) {
      user.longitude = finalLng;
    }

    if (user.latitude !== undefined || user.longitude !== undefined) {
      user.location = {
        lat: Number(user.latitude) || 0,
        lng: Number(user.longitude) || 0,
      };
    }

    if (locationUpdatedAt !== undefined) {
      user.locationUpdatedAt = locationUpdatedAt;
    } else if (finalLat !== undefined || resolvedAddress !== undefined) {
      user.locationUpdatedAt = new Date();
    }

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
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const docType = req.body.docType || req.body.docLabel || 'Compliance Document';

    // Find the authenticated user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.verificationDocs) {
      user.verificationDocs = [];
    }

    // Check if a document with the same docType already exists and replace it
    const existingIndex = user.verificationDocs.findIndex(
      (d) => d.docType && d.docType.toLowerCase() === docType.toLowerCase()
    );

    // Delete old Cloudinary file if replacing an existing document
    if (existingIndex !== -1) {
      const oldDoc = user.verificationDocs[existingIndex];
      if (oldDoc && oldDoc.publicId) {
        await deleteFromCloudinary(oldDoc.publicId, oldDoc.resourceType || 'image');
      }
    }

    // Upload in-memory file buffer directly to Cloudinary
    const cloudRes = await uploadToCloudinary(req.file, 'foodbridge_verifications');
    const finalDocUrl = cloudRes.secure_url || cloudRes.url || cloudRes.toString();

    const docMetadata = {
      docType,
      docUrl: finalDocUrl,
      publicId: cloudRes.public_id || '',
      resourceType: cloudRes.resource_type || 'image',
      format: cloudRes.format || '',
      bytes: cloudRes.bytes || req.file.size || 0,
      fileName: req.file.originalname || '',
      uploadedAt: new Date(),
    };

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
