const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const path = require('path');

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an in-memory file buffer directly to Cloudinary via upload_stream
 * @param {Buffer|Object} fileInput - Buffer or req.file object containing buffer, originalname, and mimetype
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<Object>} - Metadata object including secure_url, public_id, resource_type, format, bytes
 */
const uploadToCloudinary = (fileInput, folder = 'foodbridge_uploads') => {
  return new Promise((resolve, reject) => {
    let buffer;
    let originalName = '';
    let mimetype = '';

    if (Buffer.isBuffer(fileInput)) {
      buffer = fileInput;
    } else if (fileInput && Buffer.isBuffer(fileInput.buffer)) {
      buffer = fileInput.buffer;
      originalName = fileInput.originalname || '';
      mimetype = fileInput.mimetype || '';
    } else {
      return reject(new Error('Invalid file input provided for Cloudinary upload. Expected memory buffer.'));
    }

    const ext = originalName ? path.extname(originalName).toLowerCase() : '';
    const isPdf = ext === '.pdf' || mimetype.includes('pdf');
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext) || mimetype.startsWith('image/');

    const uploadOptions = {
      folder,
      type: 'upload',
      access_mode: 'public',
    };

    if (isPdf) {
      uploadOptions.resource_type = 'auto';
    } else if (isImage) {
      uploadOptions.resource_type = 'image';
    } else {
      uploadOptions.resource_type = 'auto';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Stream Error]:', error.message || error);

          // Retry fallback for PDF if primary resource_type attempt failed
          if (isPdf) {
            console.log('[Cloudinary PDF Upload Fallback Attempt with raw resource_type]');
            const fallbackOptions = {
              folder,
              resource_type: 'raw',
              access_mode: 'public',
            };
            const fallbackStream = cloudinary.uploader.upload_stream(
              fallbackOptions,
              (fallbackErr, fallbackResult) => {
                if (fallbackErr) {
                  console.error('[Cloudinary Fallback Error]:', fallbackErr.message || fallbackErr);
                  return reject(fallbackErr);
                }
                const responseObj = {
                  secure_url: fallbackResult.secure_url,
                  url: fallbackResult.secure_url,
                  public_id: fallbackResult.public_id,
                  resource_type: fallbackResult.resource_type || 'raw',
                  format: fallbackResult.format || 'pdf',
                  bytes: fallbackResult.bytes || buffer.length || 0,
                  toString() {
                    return this.secure_url;
                  },
                };
                return resolve(responseObj);
              }
            );
            Readable.from(buffer).pipe(fallbackStream);
            return;
          }

          return reject(error);
        }

        const formatName = result.format || (isPdf ? 'pdf' : ext.replace('.', ''));
        const responseObj = {
          secure_url: result.secure_url,
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: formatName,
          bytes: result.bytes || buffer.length || 0,
          toString() {
            return this.secure_url;
          },
        };

        console.log('[Cloudinary Upload Stream Success]', {
          secure_url: responseObj.secure_url,
          public_id: responseObj.public_id,
          resource_type: responseObj.resource_type,
          format: responseObj.format,
          bytes: responseObj.bytes,
        });

        resolve(responseObj);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary by its publicId
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'image', 'raw', or 'video' (default 'image')
 * @returns {Promise<Object|null>}
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId || typeof publicId !== 'string' || publicId.trim() === '') {
    return null;
  }
  try {
    const resType = resourceType || 'image';
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resType,
      invalidate: true,
    });
    console.log('[Cloudinary Delete Success]', { publicId, resourceType: resType, result });
    return result;
  } catch (error) {
    console.error(`[Cloudinary Delete Error] Failed to delete ${publicId}:`, error.message || error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};

