import React, { useEffect, useRef, useState } from 'react';
import RoutingMachine from './maps/RoutingMachine';

/**
 * Reusable OpenStreetMap component using Leaflet tile layer & Leaflet Routing Machine.
 */
const OpenStreetMap = ({
  markers = [],
  center = [12.9716, 77.5946],
  zoom = 13,
  drawRoute = true,
  onRouteCalculated,
  className = 'w-full h-full rounded-2xl overflow-hidden',
}) => {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [routeError, setRouteError] = useState(false);

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      const existingScript = document.getElementById('leaflet-js');
      existingScript.addEventListener('load', () => setLeafletLoaded(true));
    }
  }, []);

  const markersKey = JSON.stringify(markers);
  const centerKey = Array.isArray(center) ? center.join(',') : center;

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = window.L;

    setRouteError(false);

    const validMarkers = markers.filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number');
    const initialCenter = validMarkers.length > 0 ? [validMarkers[0].lat, validMarkers[0].lng] : (Array.isArray(center) ? center : [12.9716, 77.5946]);

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView(initialCenter, zoom);

    setMapInstance(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const createCustomIcon = (type) => {
      let bgColor = '#16A34A';
      let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>`;

      if (type === 'courier') {
        bgColor = '#F97316';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
      } else if (type === 'ngo') {
        bgColor = '#2563EB';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
      }

      const pulseRing = type === 'courier' ? `
        <span style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background-color: ${bgColor};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
      ` : '';

      return L.divIcon({
        className: 'custom-osm-marker-badge',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${pulseRing}
            <div style="
              position: relative;
              background-color: ${bgColor};
              color: white;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 2.5px solid white;
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s ease;
            ">
              ${iconSvg}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    };

    validMarkers.forEach((m) => {
      const point = [m.lat, m.lng];
      const customIcon = createCustomIcon(m.iconType);
      const marker = L.marker(point, { icon: customIcon }).addTo(map);

      if (m.title || m.description) {
        const content = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2px 4px;">
            <div style="font-weight: 800; font-size: 12px; color: #0F172A; margin-bottom: 2px;">${m.title || ''}</div>
            ${m.description ? `<div style="font-size: 11px; color: #64748B; font-weight: 500;">${m.description}</div>` : ''}
          </div>
        `;
        marker.bindTooltip(m.title || 'Location', { direction: 'top', offset: [0, -12], opacity: 0.95 });
        marker.bindPopup(content);
      }
    });

    return () => {
      try {
        map.remove();
      } catch (e) {
        // ignore
      }
      setMapInstance(null);
    };
  }, [leafletLoaded, markersKey, centerKey, zoom]);

  const validMarkers = markers.filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number');
  const fromMarker = validMarkers.length > 0 ? validMarkers[0] : null;
  const toMarker = validMarkers.length > 1 ? validMarkers[validMarkers.length - 1] : null;
  const waypointMarkers = validMarkers.length > 2 ? validMarkers.slice(1, validMarkers.length - 1) : [];

  return (
    <div className={`relative ${className}`}>
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold z-10">
          <span>Loading OpenStreetMap & Leaflet Routing Machine...</span>
        </div>
      )}

      {routeError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xl z-[500] border border-rose-500 flex items-center gap-2">
          <span>⚠️ Unable to calculate driving route.</span>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {drawRoute && mapInstance && fromMarker && toMarker && (
        <RoutingMachine
          map={mapInstance}
          from={fromMarker}
          to={toMarker}
          waypoints={waypointMarkers}
          onRouteFound={({ distance, duration }) => {
            setRouteError(false);
            if (onRouteCalculated) {
              onRouteCalculated({ distance, duration, error: false });
            }
          }}
          onError={() => {
            setRouteError(true);
            if (onRouteCalculated) {
              onRouteCalculated({ error: true });
            }
          }}
        />
      )}
    </div>
  );
};

export default OpenStreetMap;
