import React, { useState } from 'react';
import type { CulturalPlace } from '../../types/place';
import { useLocale, useTranslations } from '../../lib/i18n';
import { TagBadge } from './TagBadge';

const FALLBACK_HERITAGE_IMAGE =
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80';

export interface VillageCardProps {
  place: CulturalPlace;
  aspectRatio?: '4/3' | '3/4';
  featured?: boolean;
  indexNumber?: number;
  onClick?: (place: CulturalPlace) => void;
  className?: string;
}

export const VillageCard: React.FC<VillageCardProps> = ({
  place,
  aspectRatio,
  featured = false,
  indexNumber,
  onClick,
  className = '',
}) => {
  const { locale } = useLocale();
  const t = useTranslations();
  const [imgSrc, setImgSrc] = useState<string>(place.imageUrl || FALLBACK_HERITAGE_IMAGE);

  const ratioClass =
    (aspectRatio || (featured ? '3/4' : '4/3')) === '3/4' ? 'aspect-[3/4]' : 'aspect-[4/3]';

  const displayTitle = locale === 'en' ? place.name : place.vietnameseName;
  const secondaryTitle = locale === 'en' ? place.vietnameseName : place.name;
  const categoryText =
    t.explore.categories[place.category] || place.categoryLabel;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(place);
    }
  };

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(place)}
      onKeyDown={handleKeyDown}
      className={`group relative bg-cream border border-stone rounded-sm overflow-hidden transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover flex flex-col justify-between ${
        onClick ? 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-bronze' : ''
      } ${className}`}
    >
      <div>
        <div className={`relative ${ratioClass} w-full overflow-hidden bg-parchment border-b border-stone/60`}>
          <img
            src={imgSrc}
            alt={displayTitle}
            loading="lazy"
            onError={() => {
              if (imgSrc !== FALLBACK_HERITAGE_IMAGE) {
                setImgSrc(FALLBACK_HERITAGE_IMAGE);
              }
            }}
            className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
          />
          {typeof indexNumber === 'number' && (
            <span
              aria-hidden="true"
              className="absolute bottom-2 right-3 font-display text-4xl font-light leading-none text-cream/85 drop-shadow select-none"
            >
              {String(indexNumber).padStart(2, '0')}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TagBadge variant="gold">{categoryText}</TagBadge>
            <span className="font-body text-[11px] uppercase tracking-[0.10em] text-ash">
              {place.estimatedVisitTimeMinutes} {t.explore.visitTime}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-[22px] leading-[1.2] text-charcoal group-hover:text-lacquer transition-colors duration-300">
              {displayTitle}
            </h3>
            <p className="font-body text-[11px] italic text-bronze/90">
              {secondaryTitle}
            </p>
            <p className="font-body text-[11px] uppercase tracking-[0.10em] text-ash pt-0.5">
              {place.location}
            </p>
          </div>

          <p className="font-body text-body-sm text-ink/85 line-clamp-3">
            {place.shortDescription}
          </p>
        </div>
      </div>

      {place.tags && place.tags.length > 0 && (
        <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-stone/40 flex flex-wrap gap-1.5">
          {place.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} variant="stone">
              {tag}
            </TagBadge>
          ))}
        </div>
      )}
    </article>
  );
};

export default VillageCard;
