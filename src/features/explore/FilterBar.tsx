import React from 'react';
import type { CulturalCategory } from '../../types/place';
import { Search, Sparkles, Hammer, Landmark, Utensils, Mountain } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CulturalCategory | 'all';
  onSelectCategory: (category: CulturalCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: CulturalCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'Tất cả di sản', icon: Sparkles },
    { id: 'craft', label: 'Làng nghề thủ công', icon: Hammer },
    { id: 'monument', label: 'Di tích lịch sử', icon: Landmark },
    { id: 'cuisine', label: 'Ẩm thực cung đình & dân gian', icon: Utensils },
    { id: 'spiritual', label: 'Tâm linh & Cổ tự', icon: Mountain },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm nón bài thơ, làng hương Thủy Xuân, Đại Nội Huế..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-stone-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm placeholder-stone-400 text-stone-800 transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-2 px-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-900 text-ivory-100 shadow-md ring-2 ring-primary-900/20'
                  : 'bg-white text-stone-700 hover:bg-ivory-200 border border-stone-200/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-ochre-300' : 'text-stone-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
