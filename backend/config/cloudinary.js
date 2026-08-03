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
  // Check if Cloudinary credentials are configured
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn('Cloudinary credentials missing, keeping file locally.');
    const fileName = filePath.split('/').pop();
    return `/uploads/${fileName}`;
  }

  let result;
  try {
    // Use 'auto' for all files – Cloudinary classifies PDFs as 'image' type
    // which serves them with proper Content-Type headers for browser viewing
    result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
  } catch (firstError) {
    // Retry with 'raw' as fallback
    try {
      result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'raw',
      });
    } catch (secondError) {
      console.error('Cloudinary upload failed:', secondError.message);
      const fileName = filePath.split('/').pop();
      return `/uploads/${fileName}`;
    }
  }

  // Cleanup local temp file only if it is NOT a PDF (keep PDFs locally to serve as native PDFs with 200 OK application/pdf headers)
  const isPdf = filePath.toLowerCase().endsWith('.pdf');
  if (!isPdf && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  console.log('Cloudinary upload success:', result.secure_url, '| resource_type:', result.resource_type);
  return result.secure_url;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
