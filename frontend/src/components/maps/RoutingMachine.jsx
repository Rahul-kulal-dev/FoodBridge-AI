import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable RoutingMachine component using Leaflet Routing Machine & OSRM backend.
 * Dynamically loads Leaflet Routing Machine JS & CSS CDN for Vite compatibility.
 */
const RoutingMachine = ({
  map,
  from,
  to,
  waypoints = [],
  onRouteFound,
  onError,
}) => {
  const routingControlRef = useRef(null);
  const [lrmLoaded, setLrmLoaded] = useState(false);

  // Dynamically load Leaflet Routing Machine CSS & JS
  useEffect(() => {
    if (window.L && window.L.Routing) {
      setLrmLoaded(true);
      return;
    }

    // Load LRM CSS
    if (!document.getElementById('lrm-css')) {
      const link = document.createElement('link');
      link.id = 'lrm-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
      document.head.appendChild(link);
    }

    // Load LRM JS
    if (!document.getElementById('lrm-js')) {
      const script = document.createElement('script');
      script.id = 'lrm-js';
      script.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
      script.onload = () => setLrmLoaded(true);
      script.onerror = () => {
        if (onError) onError('Unable to calculate driving route.');
      };
      document.body.appendChild(script);
    } else {
      const existingScript = document.getElementById('lrm-js');
      existingScript.addEventListener('load', () => setLrmLoaded(true));
    }
  }, []);

  const fromKey = from ? `${from.lat},${from.lng}` : '';
  const toKey = to ? `${to.lat},${to.lng}` : '';
  const waypointsKey = JSON.stringify(waypoints);

  useEffect(() => {
    if (!lrmLoaded || !map || !from || !to || typeof from.lat !== 'number' || typeof to.lat !== 'number') {
      return;
    }

    const L = window.L;
    if (!L || !L.Routing) return;

    // Clean up previous routing control
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {
        // ignore
      }
      routingControlRef.current = null;
    }

    const points = [
      L.latLng(from.lat, from.lng),
      ...(waypoints || []).map((w) => L.latLng(w.lat, w.lng)),
      L.latLng(to.lat, to.lng),
    ];

    try {
      const control = L.Routing.control({
        waypoints: points,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
        }),
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false, // Hides default itinerary panel
        showAlternatives: false,
        createMarker: () => null, // Disables default LRM markers to preserve custom markers
        lineOptions: {
          styles: [
            {
              color: '#16A34A',
              opacity: 0.9,
              weight: 6,
              lineCap: 'round',
              lineJoin: 'round',
            },
          ],
        },
      }).addTo(map);

      routingControlRef.current = control;

      control.on('routesfound', (e) => {
        const routes = e.routes;
        if (routes && routes.length > 0 && onRouteFound) {
          const summary = routes[0].summary;
          const distanceKm = (summary.totalDistance / 1000).toFixed(1) + ' km';
          const durationMins = Math.round(summary.totalTime / 60) + ' mins';
          onRouteFound({ distance: distanceKm, duration: durationMins });
        }
      });

      control.on('routingerror', (err) => {
        console.warn('Leaflet Routing Machine Error:', err);
        if (onError) onError('Unable to calculate driving route.');
      });
    } catch (err) {
      console.warn('Error initializing Leaflet Routing Machine:', err);
      if (onError) onError('Unable to calculate driving route.');
    }

    return () => {
      if (routingControlRef.current && map) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          // ignore cleanup error
        }
        routingControlRef.current = null;
      }
    };
  }, [lrmLoaded, map, fromKey, toKey, waypointsKey]);

  return null;
};

export default RoutingMachine;
