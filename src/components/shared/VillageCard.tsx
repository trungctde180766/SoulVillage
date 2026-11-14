import React from 'react';
import type { CulturalPlace } from '../../types/place';
import { TagBadge } from './TagBadge';

export interface VillageCardProps {
  place: CulturalPlace;
  aspectRatio?: '4/3' | '3/4';
  featured?: boolean;
  onClick?: (place: CulturalPlace) => void;
  className?: string;
}

export const VillageCard: React.FC<VillageCardProps> = ({
  place,
  aspectRatio,
  featured = false,
  onClick,
  className = '',
}) => {
  const ratioClass = (aspectRatio || (featured ? '3/4' : '4/3')) === '3/4' ? 'aspect-[3/4]' : 'aspect-[4/3]';

  return (
    <article
      onClick={() => onClick?.(place)}
      className={`group bg-cream border border-stone rounded-sm overflow-hidden transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className={`${ratioClass} w-full overflow-hidden bg-parchment`}>
        <img
          src={place.imageUrl}
          alt={place.vietnameseName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TagBadge variant="gold">{place.categoryLabel}</TagBadge>
          <span className="font-body text-[11px] uppercase tracking-[0.10em] text-ash">
            {place.estimatedVisitTimeMinutes} phút
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-display text-[22px] leading-[1.2] text-charcoal group-hover:text-lacquer transition-colors duration-300">
            {place.vietnameseName}
          </h3>
          <p className="font-body text-[11px] uppercase tracking-[0.10em] text-ash">
            {place.location}
          </p>
        </div>

        <p className="font-body text-body-sm text-ink/85 line-clamp-2">
          {place.shortDescription}
        </p>
      </div>
    </article>
  );
};

export default VillageCard;
