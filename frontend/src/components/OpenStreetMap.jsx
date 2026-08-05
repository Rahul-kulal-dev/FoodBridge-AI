import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable OpenStreetMap component using Leaflet tile layer & OSM.
 * Dynamically loads Leaflet CSS & JS via CDN to ensure zero extra build dependencies.
 */
const OpenStreetMap = ({
  markers = [],
  center = [12.9716, 77.5946], // Default latitude & longitude
  zoom = 13,
  drawRoute = true,
  className = 'w-full h-full rounded-2xl overflow-hidden',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet CSS and JS dynamically from CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Add Leaflet JS
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

  // Initialize and update Map when Leaflet and mapContainer are ready
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = window.L;

    // Destroy previous map instance if re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create Map
    const initialCenter = markers.length > 0 && markers[0].lat && markers[0].lng
      ? [markers[0].lat, markers[0].lng]
      : center;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(initialCenter, zoom);

    mapInstanceRef.current = map;

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const latLngList = [];

    // Helper to create custom HTML pin markers
    const createCustomIcon = (type, label) => {
      let bgColor = '#10B981'; // Emerald default
      if (type === 'courier') bgColor = '#F59E0B'; // Amber
      if (type === 'ngo') bgColor = '#2563EB'; // Blue
      if (type === 'donor') bgColor = '#10B981'; // Green

      return L.divIcon({
        className: 'custom-osm-pin',
        html: `
          <div style="
            background-color: ${bgColor};
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            font-family: inherit;
          ">
            <span>●</span>
            <span>${label || 'Point'}</span>
          </div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 15],
      });
    };

    // Add Markers
    markers.forEach((m) => {
      if (typeof m.lat === 'number' && typeof m.lng === 'number') {
        const point = [m.lat, m.lng];
        latLngList.push(point);

        const customIcon = createCustomIcon(m.iconType, m.title);
        const marker = L.marker(point, { icon: customIcon }).addTo(map);

        if (m.popupContent || m.title || m.description) {
          const content = `
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="font-size: 13px; color: #0F172A; display: block; margin-bottom: 2px;">${m.title || ''}</strong>
              <span style="font-size: 11px; color: #64748B;">${m.description || m.popupContent || ''}</span>
            </div>
          `;
          marker.bindPopup(content);
        }
      }
    });

    // Draw route polyline if enabled and multiple points exist
    if (drawRoute && latLngList.length >= 2) {
      L.polyline(latLngList, {
        color: '#10B981',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(map);
    }

    // Auto fit map bounds if points exist
    if (latLngList.length > 0) {
      const bounds = L.latLngBounds(latLngList);
      if (latLngList.length === 1) {
        map.setView(latLngList[0], zoom);
      } else {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, JSON.stringify(markers), center, zoom, drawRoute]);

  return (
    <div className={`relative ${className}`}>
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold z-10">
          <span>Loading OpenStreetMap engine...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};

export default OpenStreetMap;
