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
  const path = require('path');
  const ext = path.extname(filePath).toLowerCase();
  const isPdf = ext === '.pdf';
  const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);

  let result;
  try {
    if (isPdf) {
      // Use 'image' resource_type with format 'pdf' so Cloudinary creates public /image/upload/ PDF URLs with 200 OK access
      result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        format: 'pdf',
        type: 'upload',
        access_mode: 'public',
      });
    } else if (isImage) {
      result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        type: 'upload',
        access_mode: 'public',
      });
    } else {
      result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
        type: 'upload',
        access_mode: 'public',
      });
    }
  } catch (error) {
    console.error('Cloudinary primary upload failed, retrying with auto public upload:', error.message);
    try {
      result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
        type: 'upload',
        access_mode: 'public',
      });
    } catch (retryErr) {
      console.warn('Cloudinary upload fallback to static upload server path:', retryErr.message);
      const filename = path.basename(filePath);
      const staticUrl = `/uploads/${filename}`;
      return {
        secure_url: staticUrl,
        public_id: filename,
        resource_type: isPdf ? 'raw' : 'image',
        format: isPdf ? 'pdf' : ext.replace('.', ''),
        bytes: 0,
        toString() {
          return staticUrl;
        },
      };
    }
  }

  // Cleanup local temp file immediately after upload
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const formatName = result.format || (isPdf ? 'pdf' : ext.replace('.', ''));
  console.log('[Cloudinary Upload Success]', {
    secure_url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
    format: formatName,
    bytes: result.bytes || 0,
  });

  const responseObj = {
    secure_url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
    format: formatName,
    bytes: result.bytes || 0,
    toString() {
      return this.secure_url;
    },
  };

  return responseObj;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
