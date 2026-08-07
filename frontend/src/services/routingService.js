/**
 * Routing Service Wrapper
 * Handles distance/ETA formatting, route determination logic, and OSRM API helpers.
 */

export const formatDistance = (meters) => {
  if (meters === undefined || meters === null || isNaN(meters)) return '—';
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const formatDuration = (seconds) => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return '—';
  const mins = Math.round(seconds / 60);
  if (mins < 60) {
    return `${mins} mins`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours} hr ${remainingMins} mins`;
};

/**
 * Determine dynamic route endpoints based on delivery status (Requirement 6 & 8)
 * Pre-pickup (assigned / accepted): Volunteer (live) ➔ Donor
 * Post-pickup (picked_up / on_the_way): Volunteer (live) ➔ NGO
 *
 * @param {string} status - Delivery status ('assigned' | 'accepted' | 'picked_up' | 'on_the_way' | 'delivered')
 * @param {Object} volunteerPos - { lat, lng }
 * @param {Object} donorPos - { lat, lng, title, address }
 * @param {Object} ngoPos - { lat, lng, title, address }
 * @returns {{ from: Object, to: Object, routeType: string, phaseLabel: string }}
 */
export const determineActiveRoute = (status, volunteerPos, donorPos, ngoPos) => {
  const isPostPickup = status === 'picked_up' || status === 'on_the_way' || status === 'delivered';

  if (isPostPickup) {
    return {
      from: volunteerPos || donorPos,
      to: ngoPos,
      routeType: 'volunteer_to_ngo',
      phaseLabel: 'In Transit to NGO Dropoff',
    };
  }

  return {
    from: volunteerPos || donorPos,
    to: donorPos,
    routeType: 'volunteer_to_donor',
    phaseLabel: 'Heading to Donor Pickup',
  };
};

export default {
  formatDistance,
  formatDuration,
  determineActiveRoute,
};
