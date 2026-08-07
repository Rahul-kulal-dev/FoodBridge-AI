import React, { useEffect, useRef } from 'react';
import { fetchOSRMRoute, validateCoordinates } from '../../services/routingService';

/**
 * Custom Leaflet OSRM Route Layer Component
 * Directly fetches and renders OSRM driving routes with snapping and map auto-bounds fitting.
 * Destroys existing polyline prior to creating a new one (Task 12).
 */
const RoutingMachine = ({
  map,
  from,
  to,
  donor,
  ngo,
  onRouteFound,
  onError,
}) => {
  const polylineRef = useRef(null);

  const startLat = from?.lat;
  const startLng = from?.lng;
  const endLat = to?.lat;
  const endLng = to?.lng;

  const routeKey = `${startLat},${startLng}->${endLat},${endLng}`;

  useEffect(() => {
    if (!map || !window.L) return;
    const L = window.L;

    let isMounted = true;

    const buildRoute = async () => {
      // Task 3: Validate coordinates before routing
      if (!validateCoordinates(startLat, startLng) || !validateCoordinates(endLat, endLng)) {
        console.warn('[ROUTING MACHINE] Invalid or missing coordinates for route:', { from, to });
        if (onError) onError('Invalid route coordinates provided');
        return;
      }

      // Task 12: Destroy any previous routing control/polyline before creating a new one
      if (polylineRef.current) {
        try {
          map.removeLayer(polylineRef.current);
        } catch (e) {
          // ignore cleanup error
        }
        polylineRef.current = null;
      }

      console.log(`[ROUTING MACHINE] Requesting route for key: ${routeKey}`);
      const result = await fetchOSRMRoute(startLat, startLng, endLat, endLng, {
        volunteer: from,
        destination: to,
        donor,
        ngo,
      });

      if (!isMounted) return;

      if (result.success && result.coordinates && result.coordinates.length > 0) {
        try {
          // Task 7: Leaflet uses [latitude, longitude]
          const polyline = L.polyline(result.coordinates, {
            color: '#10B981',
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map);

          polylineRef.current = polyline;

          // Requirement 11: Ensure map automatically fits the generated route
          const bounds = polyline.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [55, 55], maxZoom: 15 });
          }

          if (onRouteFound) {
            onRouteFound({
              distance: result.formattedDistance,
              duration: result.formattedDuration,
              distanceMeters: result.distanceMeters,
              durationSeconds: result.durationSeconds,
            });
          }
        } catch (err) {
          console.error('[ROUTING MACHINE] Error rendering route polyline layer:', err);
          if (onError) onError('Error rendering route polyline');
        }
      } else {
        // Task 6: Display exact OSRM error message while keeping map active
        console.warn('[ROUTING MACHINE] Route calculation failed:', result.error);
        if (onError) onError(result.error || 'Unable to calculate driving route');
      }
    };

    buildRoute();

    return () => {
      isMounted = false;
      if (polylineRef.current && map) {
        try {
          map.removeLayer(polylineRef.current);
        } catch (e) {
          // ignore cleanup error
        }
        polylineRef.current = null;
      }
    };
  }, [map, routeKey]);

  return null;
};

export default RoutingMachine;
