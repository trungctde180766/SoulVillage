import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CulturalCategory, CulturalPlace } from '../../types/place';
import { FilterBar } from './FilterBar';
import { PlaceCard } from './PlaceCard';
import { CultureMap } from './CultureMap';
import { Sparkles, Compass, ArrowRight, AlertTriangle, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// TODO (Hackathon Day): Tải dữ liệu thật từ API và kết nối logic tìm kiếm/lọc trong ngày thi
export const ExplorePage: React.FC = () => {
  const [places] = useState<CulturalPlace[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CulturalCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-12 pb-16">
      {/* Starter Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4 text-center text-xs text-amber-900 font-medium flex items-center justify-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>Bản Starter Kit (Chuẩn bị Hackathon) — Toàn bộ dữ liệu di sản và logic AI chưa kích hoạt trước giờ thi.</span>
      </div>

      {/* Hero Section (Khung UI) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 text-ivory-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-800/80 border border-primary-700/60 text-xs font-medium text-ochre-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Khung Dự Án Sẵn Sàng Cho Hackathon 270 Phút</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-ivory-100 leading-tight">
            Hồn Làng — Bản Đồ Văn Hóa Sống
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-ivory-300 font-normal leading-relaxed">
            Bộ khung starter tối giản: Giao diện Modern Vietnamese Heritage, tích hợp Google Gemini API SDK và sẵn sàng triển khai trên Google Cloud Run.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/journey">
              <Button variant="accent" size="md" className="w-full sm:w-auto flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Xem Khung Hành Trình AI</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#places-skeleton">
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                <Compass className="w-4 h-4 mr-2" />
                <span>Xem Vùng Dữ Liệu</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Places Area (Placeholder) */}
      <section id="places-skeleton" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-950">
            Khu Vực Khám Phá Di Sản
          </h2>
          <p className="text-xs text-stone-500">
            Dữ liệu địa điểm và bộ lọc sẽ được nghiên cứu, nhập liệu và tích hợp API trong thời gian thi.
          </p>
        </div>

        {/* FilterBar Placeholder */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Empty State / Skeleton Area */}
        {places.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-12 text-center space-y-3">
            <Compass className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif font-bold text-base text-stone-700">
              Chưa có dữ liệu địa điểm (Chưa triển khai)
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Theo quy định chuẩn bị hackathon, toàn bộ nội dung làng nghề và di tích sẽ được thẩm định và nhập vào trong 270 phút thi đấu chính thức.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}

        {/* Culture Map Placeholder */}
        <CultureMap />
      </section>
    </div>
  );
};
