import React, { useEffect, useRef } from 'react';
import { Business } from '../types';
import { useDirectory } from '../context/DirectoryContext';
import { BOZEMAN_COORDINATES } from '../data/mockData';
import { isBusinessOpen, getContextualWhatsAppUrl } from '../utils/helpers';
import L from 'leaflet';

interface InteractiveMapProps {
  businesses: Business[];
  selectedBusinessId?: string | null;
  heightClass?: string;
  onMarkerClick?: (businessId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  businesses,
  selectedBusinessId,
  heightClass = 'h-[550px]',
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { openBusinessProfile, trackInteraction } = useDirectory();

  // Color mapping based on category
  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'contractors':
        return '#f59e0b'; // amber
      case 'restaurants':
        return '#ef4444'; // red
      case 'outdoor':
        return '#10b981'; // emerald
      case 'automotive':
        return '#6366f1'; // indigo
      case 'retail':
        return '#ec4899'; // pink
      case 'health':
        return '#06b6d4'; // cyan
      case 'wellness':
        return '#8b5cf6'; // purple
      default:
        return '#d97706'; // default amber
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [BOZEMAN_COORDINATES.lat, BOZEMAN_COORDINATES.lng],
        zoom: BOZEMAN_COORDINATES.zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // CartoDB Positron clean map tiles (high performance & modern look)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    // Add markers for each business
    businesses.forEach((b) => {
      const lat = b.location.lat;
      const lng = b.location.lng;
      if (!lat || !lng) return;

      const color = getCategoryColor(b.categoryId);
      const isSelected = selectedBusinessId === b.id;
      const openInfo = isBusinessOpen(b);

      // Custom SVG Pin Icon
      const pinSvg = `
        <div style="
          background-color: ${color};
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: pinSvg,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup content with rich mini business card
      const popupHtml = `
        <div style="font-family: inherit; width: 260px; overflow: hidden; border-radius: 12px; background: white;">
          <div style="position: relative; height: 110px; width: 100%; overflow: hidden;">
            <img src="${b.coverUrl}" alt="${b.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fbbf24; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">
              ${b.categoryName}
            </div>
          </div>
          <div style="padding: 12px;">
            <div style="font-size: 14px; font-weight: bold; color: #1c1917; margin-bottom: 2px; line-height: 1.2;">
              ${b.name}
            </div>
            <div style="font-size: 11px; color: #78716c; margin-bottom: 6px;">
              ${b.location.neighborhood} • ${b.priceRange}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; margin-bottom: 10px; border-top: 1px solid #f5f5f4; padding-top: 6px;">
              <span style="color: #ea580c; font-weight: bold;">★ ${b.rating} (${b.reviewsCount})</span>
              <span style="color: ${openInfo.isOpen ? '#047857' : '#78716c'}; font-weight: 600;">
                ${openInfo.isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <button id="btn-view-${b.id}" style="background: #f59e0b; color: #0c0a09; font-weight: bold; font-size: 11px; padding: 6px; border-radius: 6px; border: none; cursor: pointer;">
                View Profile
              </button>
              <button id="btn-wa-${b.id}" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 600; font-size: 11px; padding: 6px; border-radius: 6px; cursor: pointer;">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Handle popup events
      marker.on('popupopen', () => {
        setTimeout(() => {
          const viewBtn = document.getElementById(`btn-view-${b.id}`);
          const waBtn = document.getElementById(`btn-wa-${b.id}`);

          if (viewBtn) {
            viewBtn.onclick = (e) => {
              e.preventDefault();
              openBusinessProfile(b.id);
            };
          }
          if (waBtn) {
            waBtn.onclick = (e) => {
              e.preventDefault();
              trackInteraction(b.id, 'whatsappClicks');
              const url = getContextualWhatsAppUrl(b.contact.whatsapp, b.name);
              window.open(url, '_blank', 'noopener,noreferrer');
            };
          }
        }, 50);
      });

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(b.id);
      });

      bounds.extend([lat, lng]);
      markersRef.current.push(marker);
    });

    // Auto fit bounds if businesses exist
    if (businesses.length > 0 && mapInstanceRef.current) {
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    // Resize observer to ensure map tiles render properly if container size adjusts
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [businesses, selectedBusinessId]);

  // Jump to neighborhood shortcuts
  const jumpToArea = (lat: number, lng: number, zoom = 14) => {
    mapInstanceRef.current?.flyTo([lat, lng], zoom, { duration: 1 });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
      {/* Quick Neighborhood Shortcuts overlay */}
      <div className="absolute top-3 left-3 z-400 bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-stone-200 hidden sm:flex items-center gap-1 text-xs">
        <span className="text-[11px] font-semibold text-stone-500 px-2">Bozeman:</span>
        <button
          onClick={() => jumpToArea(45.6797, -111.0387, 13)}
          className="px-2 py-1 rounded-lg hover:bg-stone-100 font-medium text-stone-800 transition-colors"
        >
          All Valley
        </button>
        <button
          onClick={() => jumpToArea(45.6793, -111.0345, 15)}
          className="px-2 py-1 rounded-lg hover:bg-stone-100 font-medium text-stone-800 transition-colors"
        >
          Downtown Main St
        </button>
        <button
          onClick={() => jumpToArea(45.6885, -111.0305, 15)}
          className="px-2 py-1 rounded-lg hover:bg-stone-100 font-medium text-stone-800 transition-colors"
        >
          Cannery District
        </button>
        <button
          onClick={() => jumpToArea(45.6601, -111.1895, 14)}
          className="px-2 py-1 rounded-lg hover:bg-stone-100 font-medium text-stone-800 transition-colors"
        >
          Four Corners
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} bg-stone-100 z-10`} />

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-400 bg-stone-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] shadow-md flex items-center gap-2">
        <span className="font-semibold text-amber-400">Interactive Map:</span>
        <span>Click pins to view services, products & direct WhatsApp</span>
      </div>
    </div>
  );
};
