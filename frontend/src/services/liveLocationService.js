import { getApiUrl } from '../config/api';

/**
 * Live Volunteer Location Subscription Service
 * Manages periodic polling of volunteer live GPS position for NGO/Volunteer tracking screens.
 */
class LiveLocationService {
  /**
   * Subscribe to live location updates for a specific volunteer
   * @param {string} volunteerId - Volunteer User ID
   * @param {string} token - Auth Token
   * @param {Function} onLocationUpdate - Callback (location) => void
   * @param {number} [intervalMs=6000] - Polling interval in ms (default 6 seconds)
   * @returns {Function} Unsubscribe function
   */
  subscribe(volunteerId, token, onLocationUpdate, intervalMs = 6000) {
    if (!volunteerId || !onLocationUpdate) {
      return () => {};
    }

    let isSubscribed = true;

    const fetchLocation = async () => {
      const authToken = token || localStorage.getItem('foodbridge_token');
      if (!authToken) return;

      try {
        const res = await fetch(getApiUrl(`/api/volunteer/location/${volunteerId}`), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();

        if (isSubscribed && res.ok && data.location) {
          onLocationUpdate({
            latitude: Number(data.location.latitude),
            longitude: Number(data.location.longitude),
            accuracy: data.location.accuracy || 0,
            heading: data.location.heading || null,
            speed: data.location.speed || null,
            updatedAt: data.location.updatedAt || new Date(),
          });
        }
      } catch (err) {
        console.warn('[LiveLocationService] Error fetching volunteer coordinates:', err);
      }
    };

    fetchLocation();
    const intervalId = setInterval(fetchLocation, intervalMs);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }
}

const liveLocationService = new LiveLocationService();
export default liveLocationService;
