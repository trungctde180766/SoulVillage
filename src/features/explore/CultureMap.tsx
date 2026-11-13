import React, { useState } from 'react';
import type { CulturalPlace } from '../../types/place';
import { MapPin, Navigation, ExternalLink, Info } from 'lucide-react';

interface CultureMapProps {
  places: CulturalPlace[];
  onSelectPlace?: (place: CulturalPlace) => void;
}

export const CultureMap: React.FC<CultureMapProps> = ({ places, onSelectPlace }) => {
  const [activePlace, setActivePlace] = useState<CulturalPlace | null>(places[0] || null);

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-terracotta-600" />
            <h3 className="font-serif font-bold text-xl text-primary-950">
              Bản Đồ Văn Hóa Cố Đô Huế
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Không gian tọa độ tương tác kết nối các làng nghề ven sông Hương và quần thể di sản hoàng cung.
          </p>
        </div>
        <div className="text-xs text-stone-500 flex items-center space-x-1.5 bg-ivory-200 px-3 py-1.5 rounded-full">
          <Info className="w-3.5 h-3.5 text-primary-700" />
          <span>Vị trí trọng điểm: {places.length} điểm văn hóa</span>
        </div>
      </div>

      {/* Stylized Visual Map Representation */}
      <div className="relative aspect-[21/9] min-h-[300px] w-full bg-gradient-to-br from-emerald-50/70 via-stone-100 to-amber-50/60 rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center p-6">
        {/* River Perfume Representation SVG Graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 800 300">
          <path
            d="M 0,220 C 200,260 250,120 400,160 C 550,200 650,90 800,110"
            fill="none"
            stroke="#99f6e4"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 0,220 C 200,260 250,120 400,160 C 550,200 650,90 800,110"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <text x="320" y="145" fill="#0f766e" fontSize="12" fontStyle="italic" fontWeight="600">
            ~ Dòng Sông Hương ~
          </text>
        </svg>

        {/* Dynamic Markers for Places */}
        <div className="relative z-10 w-full h-full">
          {places.map((place, index) => {
            // Coordinate projection onto visual map box
            const positions = [
              { left: '22%', top: '35%' },
              { left: '42%', top: '65%' },
              { left: '55%', top: '25%' },
              { left: '78%', top: '50%' },
            ];
            const pos = positions[index % positions.length];
            const isSelected = activePlace?.id === place.id;

            return (
              <button
                key={place.id}
                onClick={() => {
                  setActivePlace(place);
                  if (onSelectPlace) onSelectPlace(place);
                }}
                style={{ left: pos.left, top: pos.top }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none`}
              >
                <div
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full shadow-md text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary-900 text-white ring-4 ring-terracotta-400/40 scale-110 z-20'
                      : 'bg-white text-stone-800 hover:bg-ivory-100 border border-stone-200 hover:scale-105'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-ochre-400' : 'text-terracotta-500'}`} />
                  <span className="whitespace-nowrap">{place.vietnameseName}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Pin Detail Drawer */}
      {activePlace && (
        <div className="mt-4 p-4 rounded-2xl bg-ivory-200 border border-ivory-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={activePlace.imageUrl}
              alt={activePlace.vietnameseName}
              className="w-14 h-14 rounded-xl object-cover border border-stone-300/80 shadow-sm"
            />
            <div>
              <span className="text-xs font-semibold text-terracotta-600 uppercase tracking-wider">
                {activePlace.categoryLabel}
              </span>
              <h4 className="font-serif font-bold text-base text-primary-950">
                {activePlace.vietnameseName}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-1">
                {activePlace.location}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                activePlace.vietnameseName + ' ' + activePlace.location
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-stone-700 hover:text-stone-900 px-3 py-2 rounded-xl bg-white border border-stone-200 flex items-center space-x-1 shadow-sm"
            >
              <span>Xem Google Maps</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
            <a
              href={`#/place/${activePlace.id}`}
              className="text-xs font-semibold text-white px-4 py-2 rounded-xl bg-primary-900 hover:bg-primary-800 shadow-sm transition"
            >
              Chi tiết câu chuyện
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
