import React from 'react';
import type { CulturalCategory } from '../../types/place';
import { Search, Sparkles, Hammer, Landmark, Utensils, Mountain } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CulturalCategory | 'all';
  onSelectCategory: (category: CulturalCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// TODO (Hackathon Day): Triển khai thuật toán lọc nâng cao & tìm kiếm toàn văn trong thời gian thi
export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: CulturalCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'Tất cả (Khung)', icon: Sparkles },
    { id: 'craft', label: 'Làng nghề', icon: Hammer },
    { id: 'monument', label: 'Di tích', icon: Landmark },
    { id: 'cuisine', label: 'Ẩm thực', icon: Utensils },
    { id: 'spiritual', label: 'Tâm linh', icon: Mountain },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar (Placeholder UI) */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm địa điểm văn hóa (Khung UI - Logic lọc chưa kích hoạt)..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-stone-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-700 text-sm placeholder-stone-400 text-stone-800"
        />
      </div>

      {/* Category Pills (Placeholder UI) */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-2 px-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-primary-900 text-ivory-100 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
