import React, { useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { TagBadge } from '../../../components/shared';
import { FALLBACK_PLACE_IMAGE_URL } from '../../../data/places';
import type { SupportedLocale } from '../../../lib/i18n';
import type { CulturalPlace } from '../../../types/place';
import type { CraftSceneType, QuizSceneMeta } from '../data/questions';

export interface QuizCraftSceneProps {
  place?: CulturalPlace;
  meta: QuizSceneMeta;
  locale: SupportedLocale;
  isAnswered: boolean;
  onSelectPlace?: (placeId: string) => void;
}

function renderCraftArtwork(sceneType: CraftSceneType, active: boolean): React.ReactNode {
  switch (sceneType) {
    case 'poem-hat':
      return (
        <svg
          viewBox="0 0 280 170"
          className="w-full h-36 sm:h-40 select-none"
          aria-hidden="true"
        >
          {/* Golden Sun & Sunbeams */}
          <circle
            cx="140"
            cy="26"
            r={active ? '18' : '12'}
            fill="#C4952A"
            fillOpacity={active ? '0.35' : '0.15'}
            className="transition-transform duration-700 ease-out-expo"
          />
          <circle cx="140" cy="26" r="7" fill="#C4952A" />
          <g
            stroke="#C4952A"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity={active ? 0.85 : 0.25}
            className="transition-opacity duration-700 ease-out-expo"
          >
            <line x1="140" y1="36" x2="82" y2="128" />
            <line x1="140" y1="36" x2="112" y2="132" />
            <line x1="140" y1="36" x2="140" y2="134" />
            <line x1="140" y1="36" x2="168" y2="132" />
            <line x1="140" y1="36" x2="198" y2="128" />
          </g>

          {/* Conical Hat Silhouette */}
          <path
            d="M46 132 L140 48 L234 132 Z"
            fill={active ? '#FAF7F2' : '#F5F0E8'}
            stroke="#2E2318"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Bamboo Rings */}
          <path d="M72 109 Q140 120 208 109" stroke="#D4C9B5" strokeWidth="1" fill="none" />
          <path d="M96 87 Q140 95 184 87" stroke="#D4C9B5" strokeWidth="1" fill="none" />
          <path d="M118 68 Q140 72 162 68" stroke="#D4C9B5" strokeWidth="1" fill="none" />

          {/* Hidden Poem & Truong Tien Arches (Revealed when backlit by sunlight!) */}
          <g
            opacity={active ? 1 : 0.06}
            className="transition-opacity duration-700 ease-out-expo"
          >
            <path
              d="M84 125 Q102 114 121 125 Q140 114 159 125 Q178 114 196 125"
              stroke="#8B1A1A"
              strokeWidth="1.5"
              fill="none"
            />
            <text
              x="140"
              y="110"
              textAnchor="middle"
              fill="#7A5C2E"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontStyle="italic"
              fontSize="10.5"
              fontWeight="600"
            >
              “Ai ra xứ Huế mộng mơ...”
            </text>
          </g>

          {/* Silk Chin Strap */}
          <path
            d="M46 132 Q140 148 234 132"
            stroke="#8B1A1A"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );

    case 'incense-bloom': {
      const angles = [-48, -32, -16, 0, 16, 32, 48];
      return (
        <svg
          viewBox="0 0 280 170"
          className="w-full h-36 sm:h-40 select-none"
          aria-hidden="true"
        >
          {/* Gentle Herbal Smoke Wisps */}
          <g
            opacity={active ? 0.85 : 0.2}
            className="transition-opacity duration-700 ease-out-expo"
            stroke="#C4952A"
            strokeWidth="1.4"
            fill="none"
          >
            <path d="M140 54 Q130 38 142 24 T138 6" />
            <path d="M122 60 Q114 44 124 30" strokeOpacity="0.6" />
            <path d="M158 60 Q166 44 156 30" strokeOpacity="0.6" />
          </g>

          {/* Fanning Incense Bouquet */}
          <g transform="translate(140, 146)">
            {angles.map((deg, idx) => {
              const effectiveDeg = active ? deg : deg * 0.35;
              const isGold = idx % 2 === 1;
              return (
                <g
                  key={deg}
                  style={{
                    transform: `rotate(${effectiveDeg}deg)`,
                    transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-84"
                    stroke={isGold ? '#C4952A' : '#8B1A1A'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="0"
                    cy="-86"
                    r={active ? '4.5' : '3'}
                    fill={isGold ? '#C4952A' : '#8B1A1A'}
                  />
                </g>
              );
            })}
            {/* Tied Bamboo Base */}
            <rect x="-14" y="-12" width="28" height="14" rx="2" fill="#2E2318" />
            <line x1="-14" y1="-5" x2="14" y2="-5" stroke="#C4952A" strokeWidth="1.5" />
          </g>
        </svg>
      );
    }

    case 'kiln-pottery':
      return (
        <svg
          viewBox="0 0 280 170"
          className="w-full h-36 sm:h-40 select-none"
          aria-hidden="true"
        >
          {/* Acoustic Resonance Rings ("Gõ ngân vang như chuông đồng") */}
          <circle
            cx="140"
            cy="88"
            r={active ? '66' : '42'}
            stroke="#C4952A"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
            opacity={active ? 0.75 : 0.15}
            className="transition-opacity duration-700 ease-out-expo"
          />
          <circle
            cx="140"
            cy="88"
            r={active ? '50' : '36'}
            stroke="#8B1A1A"
            strokeWidth="1"
            fill="none"
            opacity={active ? 0.55 : 0.1}
            className="transition-opacity duration-700 ease-out-expo"
          />

          {/* Warm Kiln Glow */}
          <ellipse
            cx="140"
            cy="138"
            rx={active ? '56' : '38'}
            ry="10"
            fill="#8B1A1A"
            fillOpacity={active ? '0.22' : '0.08'}
          />

          {/* Traditional Phuoc Tich Clay Pot ("Om Ngự") */}
          <path
            d="M104 62 L176 62 L168 72 C184 86 182 120 162 132 L118 132 C98 120 96 86 112 72 Z"
            fill={active ? '#7A5C2E' : '#8C8070'}
            stroke="#2E2318"
            strokeWidth="2"
            className="transition-colors duration-700"
          />
          {/* Pot Lid & Rim */}
          <ellipse cx="140" cy="62" rx="36" ry="6" fill="#FAF7F2" stroke="#2E2318" strokeWidth="1.8" />
          <circle cx="140" cy="53" r="5" fill="#C4952A" stroke="#2E2318" strokeWidth="1.5" />
          {/* Engraved Shoulder Band */}
          <path d="M106 84 Q140 92 174 84" stroke="#FAF7F2" strokeOpacity="0.65" strokeWidth="1.3" fill="none" />
        </svg>
      );

    case 'paper-lotus': {
      const outerPositions = [
        { x: 74, y: 82 },
        { x: 96, y: 42 },
        { x: 140, y: 26 },
        { x: 184, y: 42 },
        { x: 206, y: 82 },
      ];
      const innerPositions = [
        { x: 112, y: 92 },
        { x: 140, y: 72 },
        { x: 168, y: 92 },
      ];
      return (
        <svg
          viewBox="0 0 280 170"
          className="w-full h-36 sm:h-40 select-none"
          aria-hidden="true"
        >
          {/* Bamboo Stems */}
          <g stroke="#7A5C2E" strokeWidth="1.6">
            {outerPositions.map((pos, idx) => (
              <line key={`os-${idx}`} x1="140" y1="152" x2={pos.x} y2={pos.y} />
            ))}
            {innerPositions.map((pos, idx) => (
              <line key={`is-${idx}`} x1="140" y1="152" x2={pos.x} y2={pos.y} strokeWidth="2.2" />
            ))}
          </g>

          {/* 5 Smaller Blossoms (Ngũ Thường) */}
          {outerPositions.map((pos, idx) => (
            <g
              key={`ob-${idx}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${active ? 1.08 : 0.82})`,
                transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <circle r="11" fill="#FAF7F2" stroke="#C4952A" strokeWidth="1.6" />
              <circle r="4" fill="#C4952A" />
            </g>
          ))}

          {/* 3 Large Central Blossoms (Tam Cương) */}
          {innerPositions.map((pos, idx) => (
            <g
              key={`ib-${idx}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${active ? 1.15 : 0.9})`,
                transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <circle r="16" fill="#8B1A1A" fillOpacity={active ? '0.9' : '0.65'} stroke="#FAF7F2" strokeWidth="1.5" />
              <circle r="6" fill="#C4952A" />
            </g>
          ))}
        </svg>
      );
    }

    case 'bronze-urn':
      return (
        <svg
          viewBox="0 0 280 170"
          className="w-full h-36 sm:h-40 select-none"
          aria-hidden="true"
        >
          {/* Imperial Halo */}
          <circle
            cx="140"
            cy="88"
            r={active ? '62' : '46'}
            fill="#C4952A"
            fillOpacity={active ? '0.20' : '0.07'}
            className="transition-opacity duration-700 ease-out-expo"
          />

          {/* Two Bronze Handles */}
          <path d="M96 64 L82 64 L82 46 L102 46" stroke="#2E2318" strokeWidth="3" fill="none" />
          <path d="M184 64 L198 64 L198 46 L178 46" stroke="#2E2318" strokeWidth="3" fill="none" />

          {/* Tripod Legs */}
          <path d="M112 122 L104 152" stroke="#2E2318" strokeWidth="5" strokeLinecap="round" />
          <path d="M140 126 L140 154" stroke="#2E2318" strokeWidth="5" strokeLinecap="round" />
          <path d="M168 122 L176 152" stroke="#2E2318" strokeWidth="5" strokeLinecap="round" />

          {/* Dynastic Urn Body */}
          <path
            d="M94 58 L186 58 L180 112 C174 126 106 126 100 112 Z"
            fill={active ? '#C4952A' : '#7A5C2E'}
            stroke="#2E2318"
            strokeWidth="2.2"
            className="transition-colors duration-700"
          />

          {/* Embossed Relief of Mountains, Sun & Waves */}
          <g
            stroke={active ? '#2E2318' : '#FAF7F2'}
            strokeWidth="1.5"
            fill="none"
            opacity={active ? 1 : 0.45}
            className="transition-opacity duration-700"
          >
            <circle cx="140" cy="74" r="5" />
            <path d="M110 98 L126 80 L140 94 L156 78 L170 98" strokeLinejoin="round" />
            <path d="M108 108 Q124 102 140 108 T172 108" />
          </g>
        </svg>
      );

    case 'woodblock-print':
    default:
      return (
        <svg
          viewBox="0 0 280 170"
          className="w-full h-36 sm:h-40 select-none"
          aria-hidden="true"
        >
          {/* Pearlescent Scallop-Coated Do Paper Sheet */}
          <rect
            x="66"
            y="24"
            width="148"
            height="122"
            rx="3"
            fill="#FAF7F2"
            stroke={active ? '#C4952A' : '#D4C9B5'}
            strokeWidth="2"
          />
          {/* Subtle Pearlescent Shimmer Dots */}
          <g fill="#C4952A" opacity={active ? 0.55 : 0.2}>
            <circle cx="82" cy="40" r="1.5" />
            <circle cx="196" cy="44" r="1.5" />
            <circle cx="88" cy="130" r="1.5" />
            <circle cx="192" cy="126" r="1.5" />
          </g>

          {/* Woodblock Printed Folk Artwork (Revealed crisp ink & natural colors) */}
          <g
            opacity={active ? 1 : 0.22}
            className="transition-opacity duration-700 ease-out-expo"
          >
            <rect
              x="82"
              y="38"
              width="116"
              height="94"
              rx="2"
              fill="none"
              stroke="#8B1A1A"
              strokeWidth="1.5"
            />
            <circle cx="140" cy="76" r="20" fill="#C4952A" fillOpacity="0.25" stroke="#2E2318" strokeWidth="1.8" />
            <path d="M126 76 L140 60 L154 76 L140 92 Z" fill="#8B1A1A" fillOpacity="0.8" />
            <text
              x="140"
              y="118"
              textAnchor="middle"
              fill="#2E2318"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="12"
              fontWeight="700"
              letterSpacing="2"
            >
              LÀNG SÌNH
            </text>
          </g>
        </svg>
      );
  }
}

export const QuizCraftScene: React.FC<QuizCraftSceneProps> = ({
  place,
  meta,
  locale,
  isAnswered,
  onSelectPlace,
}) => {
  const [manualPreview, setManualPreview] = useState<boolean>(false);

  const isSceneActive = isAnswered || manualPreview;

  return (
    <div className="space-y-4">
      {/* Engaging Storytelling Curiosity Hook */}
      <p className="font-display italic text-[19px] sm:text-[21px] leading-[1.45] text-bronze bg-parchment/75 border-l-2 border-gold px-4 py-3 rounded-sm">
        “{meta.storyHook}”
      </p>

      {/* Split Visual Stage: Left = Real Village Photo | Right = Interactive Craft Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Left: Real Cultural Photography */}
        {place && (
          <div
            onClick={() => onSelectPlace?.(place.id)}
            className={`sm:col-span-6 group rounded-sm border border-stone bg-parchment overflow-hidden flex flex-col justify-between ${
              onSelectPlace ? 'cursor-pointer hover:border-bronze transition-colors duration-300' : ''
            }`}
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-parchment relative">
              <img
                src={place.imageUrl}
                alt={locale === 'en' ? place.name : place.vietnameseName}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith(FALLBACK_PLACE_IMAGE_URL)) {
                    target.src = FALLBACK_PLACE_IMAGE_URL;
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute top-2.5 left-2.5">
                <TagBadge variant="gold" className="bg-cream/92 backdrop-blur-sm">
                  {place.categoryLabel}
                </TagBadge>
              </div>
            </div>

            <div className="p-3.5 bg-parchment border-t border-stone/70 space-y-1">
              <h4 className="font-display text-lg font-semibold text-charcoal leading-snug">
                {locale === 'en' ? place.name : place.vietnameseName}
              </h4>
              <p className="inline-flex items-center gap-1.5 font-body text-caption text-ash">
                <MapPin className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span className="line-clamp-1">{place.location}</span>
              </p>
            </div>
          </div>
        )}

        {/* Right: Interactive Thematic Craft Animation */}
        <div
          className={`${
            place ? 'sm:col-span-6' : 'sm:col-span-12'
          } rounded-sm border border-stone bg-parchment p-3.5 flex flex-col justify-between gap-2`}
        >
          <div className="rounded-xs bg-cream border border-stone/70 flex items-center justify-center overflow-hidden">
            {renderCraftArtwork(meta.sceneType, isSceneActive)}
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setManualPreview((prev) => !prev)}
              className={`w-full min-h-[40px] px-3 py-2 rounded-sm border font-body text-[11px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300 flex items-center justify-center gap-1.5 ${
                isSceneActive
                  ? 'border-gold bg-gold-20 text-charcoal'
                  : 'border-stone bg-cream text-bronze hover:border-bronze hover:text-lacquer'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>
                {isSceneActive ? meta.interactiveActiveLabel : meta.interactiveActionLabel}
              </span>
            </button>

            {isSceneActive && (
              <p className="font-body text-caption text-ink/85 text-center px-1 animate-fade-up">
                {meta.interactiveCaption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCraftScene;
