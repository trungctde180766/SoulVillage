import React, { useState } from 'react';
import { generateAIJourney } from '../../services/api';
import { saveLocalItinerary } from '../../services/storage';
import type { JourneyItinerary, JourneyPreference } from '../../types/journey';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Clock, MapPin, Compass, AlertCircle, CheckCircle, Navigation, ShieldAlert, Bookmark } from 'lucide-react';

export const JourneyPage: React.FC = () => {
  const [durationHours, setDurationHours] = useState<number>(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['craft', 'monument']);
  const [startLocation, setStartLocation] = useState<string>('Trung tâm TP. Huế');
  const [companion, setCompanion] = useState<'solo' | 'couple' | 'family' | 'friends'>('solo');

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<JourneyItinerary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const interestOptions = [
    { id: 'craft', label: 'Làng nghề & Nghệ nhân' },
    { id: 'monument', label: 'Di tích & Cung đình' },
    { id: 'cuisine', label: 'Ẩm thực & Chè Huế' },
    { id: 'spiritual', label: 'Tâm linh & Cổ tự' },
  ];

  const handleToggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((item) => item !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    const preference: JourneyPreference = {
      durationHours,
      interests: selectedInterests,
      startLocation,
      pace: 'moderate',
      companion,
    };

    try {
      const result = await generateAIJourney(preference);
      setItinerary(result);
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      setErrorMsg(err.message || 'Không thể tạo hành trình lúc này.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = () => {
    if (itinerary) {
      saveLocalItinerary(itinerary);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
          <span>Cá nhân hóa bằng Google Gemini 2.5 Flash</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-primary-950">
          Lập Hành Trình Văn Hóa Riêng Bạn
        </h1>
        <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
          Không khuôn mẫu. Gemini AI sẽ tính toán thời lượng, khoảng cách địa lý và sở thích để tạo nên một hành trình sống động nhất tại Cố đô.
        </p>
      </div>

      {/* Main Form Configuration */}
      <Card className="p-6 sm:p-8 bg-white border border-stone-200/90 shadow-card">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Thời lượng khám phá
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { hours: 3, label: '3 Giờ (Nhanh)' },
                  { hours: 5, label: '5 Giờ (Nửa ngày)' },
                  { hours: 8, label: '8 Giờ (Trọn ngày)' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setDurationHours(item.hours)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      durationHours === item.hours
                        ? 'bg-primary-900 text-white border-primary-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-ivory-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Bạn đồng hành
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'solo', label: 'Một mình' },
                  { id: 'couple', label: 'Cặp đôi' },
                  { id: 'family', label: 'Gia đình' },
                  { id: 'friends', label: 'Nhóm bạn' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCompanion(item.id as any)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium border text-center transition ${
                      companion === item.id
                        ? 'bg-primary-900 text-white border-primary-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-ivory-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Sở thích văn hóa bạn muốn ưu tiên:
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleInterest(opt.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition ${
                      isSelected
                        ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-ivory-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Starting Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Điểm xuất phát dự kiến
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="Ví dụ: Cầu Tràng Tiền, Ga Huế, Khách sạn trung tâm..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={loading}
              className="w-full flex items-center justify-center space-x-2 text-base font-semibold"
            >
              <Sparkles className="w-5 h-5 text-ochre-300" />
              <span>Khởi Tạo Hành Trình Bằng Gemini AI</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Itinerary Result Display */}
      {itinerary && (
        <div className="space-y-8 animate-fadeIn">
          {/* Result Card Header */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-ivory-100 border-none shadow-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary-800/80 pb-6">
              <div className="space-y-1">
                {itinerary.isFallback && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-400 text-amber-950 mb-1">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Hành trình tuyển chọn (Fallback Model)
                  </span>
                )}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                  {itinerary.title}
                </h2>
                <p className="text-xs sm:text-sm text-ivory-300">
                  {itinerary.summary}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSaveItinerary}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-stone-900 hover:bg-stone-100"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" />
                      <span>Đã Lưu!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-1.5" />
                      <span>Lưu Hành Trình</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Highlights Chips */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-primary-300 font-semibold uppercase tracking-wider mb-2">
                  Điểm nhấn văn hóa nổi bật:
                </p>
                <ul className="space-y-1 text-ivory-200">
                  {itinerary.culturalHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-ochre-400" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-primary-300 font-semibold uppercase tracking-wider mb-2">
                  Chi phí dự kiến:
                </p>
                <p className="text-lg font-bold text-ochre-300">
                  {itinerary.totalEstimatedCostVND}
                </p>
                <p className="text-[11px] text-ivory-400 mt-1">
                  Đã bao gồm phí tham quan di tích và phụ phí trải nghiệm thủ công.
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline View of Stops */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary-950 flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-terracotta-600" />
              <span>Chi Tiết Các Chặng Khám Phá</span>
            </h3>

            <div className="relative border-l-2 border-primary-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
              {itinerary.stops.map((stop) => (
                <div key={stop.order} className="relative group">
                  {/* Timeline Badge Dot */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full bg-primary-900 text-ivory-100 flex items-center justify-center font-bold text-xs ring-4 ring-ivory-100 shadow-sm">
                    {stop.order}
                  </div>

                  {/* Stop Card */}
                  <Card className="p-5 sm:p-6 bg-white border border-stone-200 shadow-soft space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-serif font-bold text-lg text-primary-950">
                        {stop.placeName}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-stone-500">
                        <span className="font-semibold text-terracotta-600 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{stop.timeSlot}</span>
                        </span>
                        <span>•</span>
                        <span>{stop.durationMinutes} phút</span>
                      </div>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed">
                      {stop.activityRecommendation}
                    </p>

                    {/* Cultural Insight Box */}
                    <div className="p-3.5 rounded-xl bg-ivory-200 border border-ivory-300 text-xs text-stone-800 space-y-1">
                      <span className="font-bold text-primary-900 uppercase tracking-wide text-[10px]">
                        Góc nhìn văn hóa từ Gemini:
                      </span>
                      <p className="italic leading-relaxed">{stop.culturalInsight}</p>
                    </div>

                    {stop.transportTip && (
                      <p className="text-xs text-stone-500 flex items-center space-x-1 pt-1">
                        <Compass className="w-3.5 h-3.5 text-stone-400" />
                        <span>Mẹo di chuyển: {stop.transportTip}</span>
                      </p>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
