import React from 'react';
import { Search, X } from 'lucide-react';
import type { CulturalCategory } from '../../types/place';
import { useTranslations } from '../../lib/i18n';
import { TagBadge } from '../../components/shared/TagBadge';

export interface FilterBarProps {
  selectedCategory: CulturalCategory | 'all';
  onSelectCategory: (cat: CulturalCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalResults?: number;
  onResetFilters?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalResults,
  onResetFilters,
}) => {
  const t = useTranslations();

  const categories: { id: CulturalCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.explore.categories.all },
    { id: 'craft', label: t.explore.categories.craft },
    { id: 'monument', label: t.explore.categories.monument },
    { id: 'cuisine', label: t.explore.categories.cuisine },
    { id: 'spiritual', label: t.explore.categories.spiritual },
    { id: 'nature', label: t.explore.categories.nature },
  ];

  const hasActiveFilter = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* Category Filter Chips (TagBadge gold when active, stone when inactive, rounded-xs 2px) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.map((category) => {
          const active = selectedCategory === category.id;
          return (
            <TagBadge
              key={category.id}
              variant={active ? 'gold' : 'stone'}
              onClick={() => onSelectCategory(category.id)}
              className={`min-h-[44px] px-4 py-2 text-[11px] tracking-[0.12em] ${
                active
                  ? 'border-gold bg-gold/20 text-gold'
                  : 'border-stone text-ash hover:border-bronze hover:text-ink'
              }`}
            >
              {category.label}
            </TagBadge>
          );
        })}
      </div>

      {/* Underline Search Input (16px font size to prevent iOS Safari auto-zoom) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-gold absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.explore.searchPlaceholder}
            aria-label={t.explore.searchPlaceholder}
            className="w-full min-h-[44px] bg-transparent border-0 border-b border-stone pl-7 pr-9 py-2.5 text-base text-ink placeholder:text-ash focus:border-bronze focus:outline-none transition-colors duration-300"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label={t.explore.clearFilter}
              className="absolute right-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-ash hover:text-lacquer transition-colors duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Result Count & Clear Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          {typeof totalResults === 'number' && (
            <span className="font-body text-caption text-ash">
              <strong className="font-semibold text-charcoal">{totalResults}</strong>{' '}
              {t.explore.resultsCount}
            </span>
          )}

          {hasActiveFilter && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center min-h-[44px] font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-bronze border-b border-stone hover:text-lacquer hover:border-lacquer transition-colors duration-300"
            >
              {t.explore.clearFilter}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
