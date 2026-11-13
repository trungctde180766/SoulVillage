import React from 'react';
import { Link } from 'react-router-dom';
import type { CulturalPlace } from '../../types/place';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { formatMinutesToHours } from '../../lib/utils';

interface PlaceCardProps {
  place: CulturalPlace;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <Card hoverable className="flex flex-col h-full group">
      {/* Image Container with Tag */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={place.imageUrl}
          alt={place.vietnameseName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 left-3">
          <Badge variant={place.category === 'craft' ? 'craft' : place.category === 'monument' ? 'monument' : 'spiritual'}>
            {place.categoryLabel}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-1 drop-shadow-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatMinutesToHours(place.estimatedVisitTimeMinutes)}</span>
          </div>
          <div className="flex items-center space-x-1 drop-shadow-md text-stone-200">
            <MapPin className="w-3.5 h-3.5 text-ochre-300" />
            <span className="truncate max-w-[140px]">{place.location.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-primary-950 group-hover:text-primary-800 transition-colors line-clamp-1">
            {place.vietnameseName}
          </h3>
          <p className="text-xs text-stone-500 font-medium italic">
            {place.name}
          </p>
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {place.shortDescription}
          </p>
        </div>

        {/* Tags & Action Link */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {place.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          <Link
            to={`/place/${place.id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition"
          >
            <span>Khám phá</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
