/**
 * Geocoding Service Layer
 * Abstracts the underlying geocoding provider (Nominatim, Mapbox, Google, etc.)
 * so the UI component remains completely provider-agnostic.
 */

class NominatimProvider {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
  }

  /**
   * Search for locations matching query
   * @param {string} query
   * @returns {Promise<Array<{locationName: string, formattedAddress: string, latitude: number, longitude: number}>>}
   */
  async search(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const params = new URLSearchParams({
      q: query.trim(),
      format: 'json',
      addressdetails: '1',
      limit: '6',
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data.map((item) => {
      const name = item.name || item.display_name.split(',')[0] || 'Selected Location';
      const formattedAddress = item.display_name || '';
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);

      return {
        locationName: name,
        formattedAddress,
        latitude: isNaN(lat) ? 0 : lat,
        longitude: isNaN(lng) ? 0 : lng,
        placeId: item.place_id ? String(item.place_id) : Math.random().toString(),
      };
    });
  }
}

const defaultProvider = new NominatimProvider();

/**
 * Search locations using active geocoding provider
 * @param {string} query
 * @param {Object} [provider=defaultProvider]
 * @returns {Promise<Array>}
 */
export const searchLocations = async (query, provider = defaultProvider) => {
  return await provider.search(query);
};

export default {
  searchLocations,
};
