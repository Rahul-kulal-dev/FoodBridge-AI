import { getApiUrl } from '../config/api';

/**
 * Singleton Real-time Volunteer Location Tracker
 * Uses navigator.geolocation.watchPosition with accuracy filtering (>100m discarded)
 * and throttled backend API posting (5000ms minimum interval).
 */
class VolunteerLocationTracker {
  constructor() {
    this.watchId = null;
    this.authToken = null;
    this.statusCallback = null;
    this.lastPostTime = 0;
    this.currentStatus = 'idle'; // 'idle' | 'tracking' | 'permission_denied' | 'error'
    this.lastPosition = null;
    this.errorMessage = '';
    this.minUpdateIntervalMs = 5000; // Throttle: 5 seconds minimum between backend posts
  }

  /**
   * Start watching volunteer GPS location
   * @param {string} token - Auth bearer token
   * @param {Function} [onStatusChange] - Callback (status, data) => void
   */
  startTracking(token, onStatusChange) {
    if (token) {
      this.authToken = token;
    }
    if (onStatusChange) {
      this.statusCallback = onStatusChange;
    }

    if (this.watchId !== null) {
      // Already tracking
      this._emitStatus(this.currentStatus, {
        position: this.lastPosition,
        errorMessage: this.errorMessage,
      });
      return;
    }

    if (!navigator.geolocation) {
      this.currentStatus = 'error';
      this.errorMessage = 'Geolocation is not supported by your browser';
      this._emitStatus('error', { errorMessage: this.errorMessage });
      return;
    }

    this.currentStatus = 'acquiring';
    this.errorMessage = '';
    this._emitStatus('acquiring');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this._handlePositionSuccess(position),
      (error) => this._handlePositionError(error),
      options
    );
  }

  /**
   * Handle position update from watchPosition
   * @param {GeolocationPosition} position
   */
  _handlePositionSuccess(position) {
    const { latitude, longitude, accuracy, heading, speed } = position.coords;

    // Requirement 7: Ignore inaccurate GPS updates (>100 meters)
    if (accuracy > 100) {
      console.warn(`[GPS Tracker] Ignored inaccurate reading (Accuracy: ${accuracy}m > 100m threshold)`);
      return;
    }

    this.lastPosition = {
      latitude,
      longitude,
      accuracy,
      heading: heading || null,
      speed: speed || null,
      timestamp: new Date(),
    };

    this.currentStatus = 'tracking';
    this.errorMessage = '';
    this._emitStatus('tracking', { position: this.lastPosition });

    // Requirement 4: Update backend every 5-10 seconds (throttled)
    const now = Date.now();
    if (now - this.lastPostTime >= this.minUpdateIntervalMs) {
      this.lastPostTime = now;
      this._sendLocationToBackend(this.lastPosition);
    }
  }

  /**
   * Handle position error (Permission Denied, Position Unavailable, Timeout)
   * @param {GeolocationPositionError} error
   */
  _handlePositionError(error) {
    console.warn('[GPS Tracker Error]', error.code, error.message);

    if (error.code === error.PERMISSION_DENIED) {
      this.currentStatus = 'permission_denied';
      this.errorMessage = 'Location permission was denied. Please allow GPS access to enable live delivery dispatch.';
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      this.currentStatus = 'error';
      this.errorMessage = 'GPS position unavailable. Please check your device location settings.';
    } else if (error.code === error.TIMEOUT) {
      this.currentStatus = 'error';
      this.errorMessage = 'GPS signal search timed out. Retrying...';
    } else {
      this.currentStatus = 'error';
      this.errorMessage = error.message || 'Unknown GPS tracking error';
    }

    this._emitStatus(this.currentStatus, { errorMessage: this.errorMessage });
  }

  /**
   * Post updated coordinates to backend API
   * @param {Object} posData
   */
  async _sendLocationToBackend(posData) {
    const token = this.authToken || localStorage.getItem('foodbridge_token');
    if (!token) return;

    try {
      await fetch(getApiUrl('/api/volunteer/location'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: posData.latitude,
          longitude: posData.longitude,
          accuracy: posData.accuracy,
          heading: posData.heading,
          speed: posData.speed,
        }),
      });
    } catch (err) {
      console.warn('[GPS Tracker] Failed to update location to server:', err);
    }
  }

  /**
   * Stop tracking and cleanup resources completely (Requirement 6 & 10)
   */
  stopTracking() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.currentStatus = 'idle';
    this.lastPosition = null;
    this.errorMessage = '';
    this.lastPostTime = 0;
    this._emitStatus('idle');
  }

  /**
   * Retry tracking if permission denied or error occurred
   */
  retryTracking() {
    this.stopTracking();
    this.startTracking(this.authToken, this.statusCallback);
  }

  /**
   * Emit status to callback listener
   */
  _emitStatus(status, payload = {}) {
    if (typeof this.statusCallback === 'function') {
      this.statusCallback(status, {
        status,
        position: this.lastPosition,
        errorMessage: this.errorMessage,
        ...payload,
      });
    }
  }
}

const trackerInstance = new VolunteerLocationTracker();
export default trackerInstance;
