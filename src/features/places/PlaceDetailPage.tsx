import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { CulturalPlace } from '../../types/place';
import { SAMPLE_CULTURAL_PLACES } from '../../data/places';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Clock, MapPin, Sparkles, BookOpen, Hammer, ExternalLink, CheckCircle } from 'lucide-react';
import { formatMinutesToHours } from '../../lib/utils';

export const PlaceDetailPage: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<CulturalPlace | null>(null);
  const [activeTab, setActiveTab] = useState<'story' | 'craft' | 'sources'>('story');
  const [addedToJourney, setAddedToJourney] = useState(false);

  useEffect(() => {
    const found = SAMPLE_CULTURAL_PLACES.find((p) => p.id === placeId);
    if (found) {
      setPlace(found);
    }
  }, [placeId]);

  if (!place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Không tìm thấy địa điểm này</h2>
        <p className="text-stone-500 text-sm">Địa điểm văn hóa bạn tìm kiếm chưa có trong danh mục thẩm định.</p>
        <Link to="/">
          <Button variant="primary">Trở về Trang Khám Phá</Button>
        </Link>
      </div>
    );
  }

  const handleAddToJourney = () => {
    setAddedToJourney(true);
    setTimeout(() => setAddedToJourney(false), 2500);
  };

  return (
    <div className="pb-20 space-y-8">
      {/* Back Button Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Hero Banner Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative aspect-[21/9] sm:aspect-[24/10] rounded-3xl overflow-hidden shadow-card">
          <img
            src={place.imageUrl}
            alt={place.vietnameseName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Banner Overlay Content */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={place.category === 'craft' ? 'craft' : 'monument'}>
                {place.categoryLabel}
              </Badge>
              <span className="text-xs text-stone-300 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Thời lượng tham quan: {formatMinutesToHours(place.estimatedVisitTimeMinutes)}</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ivory-100">
              {place.vietnameseName}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 italic">
              {place.name}
            </p>

            <div className="flex items-center space-x-1.5 text-xs text-ochre-300 pt-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{place.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Content Tabs & Sticky Action Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tabs & Stories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex border-b border-stone-200 gap-4">
            <button
              onClick={() => setActiveTab('story')}
              className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'story'
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Câu Chuyện & Lịch Sử</span>
            </button>
            <button
              onClick={() => setActiveTab('craft')}
              className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'craft'
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>Làng Nghề & Trải Nghiệm</span>
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'sources'
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Nguồn Dữ Liệu</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-6">
            {activeTab === 'story' && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-primary-950">
                  Huyền tích & Dấu ấn thời gian
                </h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {place.story}
                </p>
                {place.historicalSignificance && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                    <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                      Ý nghĩa di sản văn hóa
                    </span>
                    <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                      {place.historicalSignificance}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'craft' && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-primary-950">
                  Bàn tay nghệ nhân & Kỹ nghệ dân gian
                </h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {place.craftDetails || 'Đang cập nhật quy trình chế tác chi tiết từ các nghệ nhân...'}
                </p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Mẹo trải nghiệm từ người bản xứ:
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600 list-disc list-inside">
                    {place.localTips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-primary-950">
                  Nguồn Thẩm Định & Tham Khảo Uy Tín
                </h3>
                <p className="text-xs text-stone-500">
                  Nhằm đảm bảo tính chính xác và tuân thủ thể lệ GDG DevFest, thông tin tại Hồn Làng được đối chiếu với các nguồn tài liệu chính thống:
                </p>
                <div className="space-y-2">
                  {place.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-ivory-200 border border-ivory-300 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-stone-800">{src.title}</span>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-terracotta-600 hover:underline flex items-center space-x-1"
                        >
                          <span>Xem nguồn</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Action Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-lg text-primary-950">
              Đồng Hành Khám Phá
            </h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span>Vùng miền:</span>
                <span className="font-semibold text-stone-900">Cố đô Huế</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span>Thể loại:</span>
                <span className="font-semibold text-stone-900">{place.categoryLabel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span>Thời gian lý tưởng:</span>
                <span className="font-semibold text-stone-900">{formatMinutesToHours(place.estimatedVisitTimeMinutes)}</span>
              </div>
            </div>

            <Button
              variant={addedToJourney ? 'primary' : 'accent'}
              className="w-full flex items-center justify-center space-x-2"
              onClick={handleAddToJourney}
            >
              {addedToJourney ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Đã thêm vào hành trình!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Thêm vào Hành Trình Khám Phá</span>
                </>
              )}
            </Button>

            <Link to="/journey" className="block">
              <Button variant="secondary" className="w-full text-xs">
                Lập lịch trình thông minh với Gemini
              </Button>
            </Link>

            <p className="text-[11px] text-stone-400 text-center leading-normal">
              Thêm địa điểm này sẽ giúp Gemini AI ưu tiên các chặng dừng lân cận phù hợp nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
