import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../config/api';

/**
 * FoodImageSlideshow Component
 * Automatically cycles through uploaded food images with a 2-second interval.
 */
export default function FoodImageSlideshow({
  image,
  images = [],
  alt = 'Food Item',
  className = 'w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-50 shadow-xs',
  interval = 2000,
}) {
  // Normalize images list
  const validImages = React.useMemo(() => {
    let list = [];
    if (Array.isArray(images) && images.length > 0) {
      list = images.map((img) => (typeof img === 'object' ? img.rawUrl || img.url : img)).filter(Boolean);
    }
    if (list.length === 0 && image && typeof image === 'string' && image.trim() !== '') {
      list = [image];
    }
    return list.map((url) => getImageUrl(url));
  }, [image, images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState({});

  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validImages.length, interval]);

  const activeSrc = validImages[currentIndex] && !failedIndices[currentIndex]
    ? validImages[currentIndex]
    : getImageUrl(null);

  return (
    <div className={`relative overflow-hidden group ${className.includes('w-') ? className : `w-10 h-10 ${className}`}`}>
      <img
        src={activeSrc}
        alt={`${alt} (Image ${currentIndex + 1})`}
        onError={() => setFailedIndices((prev) => ({ ...prev, [currentIndex]: true }))}
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
      />
      {validImages.length > 1 && (
        <span className="absolute bottom-0.5 right-0.5 bg-slate-900/70 text-white text-[9px] font-bold px-1 rounded-sm backdrop-blur-xs select-none">
          {currentIndex + 1}/{validImages.length}
        </span>
      )}
    </div>
  );
}
