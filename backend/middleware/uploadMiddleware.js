const multer = require('multer');
const path = require('path');

// Configure Multer to use memoryStorage for Vercel serverless read-only filesystem compatibility
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname || '').toLowerCase();

  const isAllowedExt = allowedExtensions.includes(ext);
  const isAllowedMime =
    !file.mimetype ||
    file.mimetype === 'application/octet-stream' ||
    file.mimetype === 'binary/octet-stream' ||
    file.mimetype === 'application/x-pdf' ||
    file.mimetype === 'application/pdf' ||
    /image\/(jpeg|png|webp|jpg|gif|svg)/i.test(file.mimetype) ||
    /application\/(pdf|x-pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/i.test(file.mimetype);

  if (isAllowedExt && isAllowedMime) {
    return cb(null, true);
  } else {
    cb(new Error('Images and document files only (jpg, jpeg, png, webp, pdf, doc, docx)!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Helper middleware wrapper to safely catch Multer errors (e.g. file size limit, invalid file type)
const handleUploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error(`[Upload Middleware Error - field "${fieldName}"]:`, err.message || err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed. Please ensure the file is an image or PDF under 15MB.',
        });
      }
      next();
    });
  };
};

module.exports = upload;
module.exports.handleUploadSingle = handleUploadSingle;


