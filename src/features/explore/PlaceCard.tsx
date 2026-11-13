import React from 'react';
import { Link } from 'react-router-dom';
import type { CulturalPlace } from '../../types/place';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clock, ArrowRight } from 'lucide-react';
import { formatMinutesToHours } from '../../lib/utils';

interface PlaceCardProps {
  place: CulturalPlace;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <Card hoverable className="flex flex-col h-full group">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.vietnameseName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
            Hình ảnh địa điểm
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge>{place.categoryLabel || 'Di sản'}</Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-primary-950 line-clamp-1">
            {place.vietnameseName}
          </h3>
          <p className="text-xs text-stone-500 italic">
            {place.name}
          </p>
          <p className="text-sm text-stone-600 line-clamp-2">
            {place.shortDescription}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatMinutesToHours(place.estimatedVisitTimeMinutes || 60)}</span>
          </div>
          <Link
            to={`/place/${place.id}`}
            className="inline-flex items-center space-x-1 font-semibold text-terracotta-600 hover:text-terracotta-700"
          >
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
