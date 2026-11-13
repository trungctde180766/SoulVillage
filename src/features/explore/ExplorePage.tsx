import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CulturalCategory, CulturalPlace } from '../../types/place';
import { fetchCulturalPlaces } from '../../services/api';
import { FilterBar } from './FilterBar';
import { PlaceCard } from './PlaceCard';
import { CultureMap } from './CultureMap';
import { Sparkles, MapPin, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ExplorePage: React.FC = () => {
  const [places, setPlaces] = useState<CulturalPlace[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CulturalCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCulturalPlaces(selectedCategory, searchQuery)
      .then((data) => {
        if (isMounted) setPlaces(data);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 text-ivory-100 py-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-800/80 border border-primary-700/60 text-xs font-medium text-ochre-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khám phá Cố đô Huế dưới lăng kính trí tuệ nhân tạo Gemini</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ivory-100 leading-tight">
            Chạm vào <span className="text-ochre-400">Hồn Làng</span>,<br className="hidden sm:inline" />
            Sống cùng di sản Việt
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ivory-300 font-normal leading-relaxed">
            Hồn Làng không chỉ là bản đồ du lịch thông thường. Chúng tôi đưa bạn vào chiều sâu của những nốt trầm lịch sử, bàn tay nghệ nhân làng nón, hương trầm thảo mộc và câu chuyện văn hóa ngàn năm.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/journey">
              <Button variant="accent" size="lg" className="w-full sm:w-auto flex items-center space-x-2 group">
                <Sparkles className="w-4 h-4 text-ochre-200" />
                <span>Khám phá Hành trình AI</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#explore-section">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-primary-950 bg-ivory-200 hover:bg-ivory-300">
                <Compass className="w-4 h-4 mr-2 text-primary-800" />
                <span>Xem Bản Đồ & Danh Sách</span>
              </Button>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 border-t border-primary-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            <div className="p-3 bg-primary-900/40 rounded-xl border border-primary-800/40">
              <p className="text-xs text-primary-300">Tiêu điểm khởi động</p>
              <p className="text-lg font-bold text-ivory-100">Cố đô Huế</p>
            </div>
            <div className="p-3 bg-primary-900/40 rounded-xl border border-primary-800/40">
              <p className="text-xs text-primary-300">Địa điểm thẩm định</p>
              <p className="text-lg font-bold text-ochre-400">8–12 Điểm</p>
            </div>
            <div className="p-3 bg-primary-900/40 rounded-xl border border-primary-800/40">
              <p className="text-xs text-primary-300">AI Engine</p>
              <p className="text-lg font-bold text-ivory-100">Gemini 2.5 Flash</p>
            </div>
            <div className="p-3 bg-primary-900/40 rounded-xl border border-primary-800/40">
              <p className="text-xs text-primary-300">Cơ sở dữ liệu</p>
              <p className="text-lg font-bold text-terracotta-400">MongoDB Atlas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Exploration Section */}
      <section id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header & Filters */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-terracotta-600 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>Bản đồ khảo sát di sản</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary-950">
            Các Điểm Đến Văn Hóa Tuyển Chọn
          </h2>
          <p className="text-sm text-stone-500 max-w-xl mx-auto">
            Mỗi địa điểm đều được chọn lọc kỹ lưỡng, đối chiếu nguồn tư liệu lịch sử và phỏng vấn nghệ nhân bản địa.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Places Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-900 border-t-transparent" />
            <p className="mt-3 text-sm text-stone-500">Đang tải danh mục di sản...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-700">Không tìm thấy địa điểm phù hợp</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc chọn &quot;Tất cả di sản&quot; để hiển thị trọn vẹn danh sách.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}

        {/* Interactive Culture Map */}
        <div className="pt-8">
          <CultureMap places={places} />
        </div>
      </section>

      {/* Trust & Heritage Source Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-900 text-ivory-100 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-ochre-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Tiêu chuẩn nội dung văn hóa</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
              Cam Kết Không Bịa Đặt Dữ Liệu Lịch Sử
            </h3>
            <p className="text-sm text-ivory-300 leading-relaxed">
              Mọi nội dung làng nghề, truyền thuyết và mốc lịch sử trong Hồn Làng đều được bảo chứng từ Trung tâm Bảo tồn Di tích Cố đô Huế, Cổng thông tin Tỉnh và nghệ nhân địa phương. Trí tuệ nhân tạo Gemini chỉ hỗ trợ tối ưu hóa lịch trình và trải nghiệm cá nhân hóa, không thay thế tính chân thực của di sản.
            </p>
          </div>
          <Link to="/journey">
            <Button variant="accent" size="lg" className="whitespace-nowrap">
              Khám phá Hành Trình AI
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
