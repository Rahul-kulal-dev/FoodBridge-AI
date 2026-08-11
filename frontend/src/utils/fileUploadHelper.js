/**
 * Client-side File Upload Helper
 * Handles image compression and size checks to prevent mobile PWA upload failures and Vercel payload limits.
 */

/**
 * Compress an image file using HTML5 Canvas if it exceeds target size.
 * @param {File} file - Original file object
 * @param {number} maxDimension - Max width/height in px (default 1920)
 * @param {number} quality - Quality compression ratio 0.0-1.0 (default 0.8)
 * @returns {Promise<File>} Compressed file or original file
 */
export const compressImageIfNeeded = (file, maxDimension = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    // Return original if not an image or if small enough (< 1MB)
    if (!file || !file.type || !file.type.startsWith('image/') || file.size < 1024 * 1024) {
      return resolve(file);
    }

    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target.result;
    };

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };

    image.onerror = () => resolve(file);
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

/**
 * Validates file size before uploading (Vercel max payload limit is ~4.5 MB).
 * @param {File} file
 * @param {number} maxSizeBytes - Max allowed bytes (default 4.5 MB)
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFileSize = (file, maxSizeBytes = 4.5 * 1024 * 1024) => {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (file.size > maxSizeBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMB} MB) exceeds maximum allowed size (4.5 MB). Please choose a smaller file or compress your PDF.`,
    };
  }
  return { valid: true };
};
