/**
 * API & Asset Configuration
 * Dynamically resolves API base URLs and Cloudinary assets without hardcoded localhost strings.
 */

const getDynamicBaseUrl = () => {
  // If explicitly provided via environment variables (and not default localhost fallback in production)
  if (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL !== 'http://localhost:5000') {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }

    // Local Wi-Fi network mobile testing (e.g., 192.168.x.x)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return `${window.location.protocol}//${hostname}:5000`;
    }

    // Production Vercel / Cloud deployment backend endpoint
    return 'https://food-bridge-backend.vercel.app';
  }

  return 'https://food-bridge-backend.vercel.app';
};

export const API_BASE_URL = getDynamicBaseUrl();

/**
 * Returns full API endpoint URL.
 * @param {string} endpoint - e.g. '/api/users/profile'
 */
export const getApiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Returns clean Cloudinary or external image URL.
 * @param {string} url - Cloudinary URL or image link
 * @param {string} fallback - Default image fallback
 */
export const getImageUrl = (url, fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80') => {
  if (!url || typeof url !== 'string' || url.trim() === '' || url.trim().startsWith('blob:')) {
    return fallback;
  }
  const targetUrl = url.trim();
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('data:image/')) {
    return targetUrl;
  }
  // Handles legacy relative paths gracefully
  return getApiUrl(targetUrl);
};
