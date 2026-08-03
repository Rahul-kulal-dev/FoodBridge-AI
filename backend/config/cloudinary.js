const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'foodbridge',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Local path of uploaded file from Multer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} - Returns Cloudinary secure_url or fallback URL
 */
const uploadToCloudinary = async (filePath, folder = 'foodbridge_uploads') => {
  try {
    // Check if Cloudinary credentials are configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
      });

      // Cleanup local temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    } else {
      // Fallback if Cloudinary env vars are missing
      const fileName = filePath.split('/').pop();
      return `/uploads/${fileName}`;
    }
  } catch (error) {
    console.warn('Cloudinary upload notice (using fallback):', error.message);
    const fileName = filePath.split('/').pop();
    return `/uploads/${fileName}`;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
