/**
 * Custom Leaflet Marker Icon Generator
 * Produces distinct, animated Leaflet DivIcons for Donor, Volunteer, and NGO pins.
 */

export const createCustomIcon = (L, type) => {
  let bgColor = '#16A34A'; // Green for Donor
  let imgPath = '/imgs/donor.png';

  if (type === 'courier' || type === 'volunteer') {
    bgColor = '#F97316'; // Orange for Volunteer Courier
    imgPath = '/imgs/volunteer.png';
  } else if (type === 'ngo') {
    bgColor = '#2563EB'; // Blue for NGO
    imgPath = '/imgs/ngo.png';
  }

  const pulseRing =
    type === 'courier' || type === 'volunteer'
      ? `
        <span style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background-color: ${bgColor};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
      `
      : '';

  return L.divIcon({
    className: 'custom-osm-marker-badge',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${pulseRing}
        <div style="
          position: relative;
          background-color: white;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2.5px solid ${bgColor};
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          overflow: hidden;
          padding: 4px;
        ">
          <img src="${imgPath}" alt="${type}" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

export default {
  createCustomIcon,
};
