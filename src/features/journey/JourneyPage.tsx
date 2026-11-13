import React, { useState } from 'react';
import { generateAIJourney } from '../../services/api';
import type { JourneyPreference } from '../../types/journey';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, MapPin, AlertCircle, Info } from 'lucide-react';

// TODO (Hackathon Day): Xây dựng prompt Gemini API và xử lý timeline hành trình trong thời gian thi
export const JourneyPage: React.FC = () => {
  const [durationHours, setDurationHours] = useState<number>(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['craft']);
  const [startLocation, setStartLocation] = useState<string>('Trung tâm TP. Huế');

  const [loading, setLoading] = useState(false);
  const [apiResponseMsg, setApiResponseMsg] = useState<string | null>(null);

  const interestOptions = [
    { id: 'craft', label: 'Làng nghề & Nghệ nhân' },
    { id: 'monument', label: 'Di tích & Cung đình' },
    { id: 'cuisine', label: 'Ẩm thực dân gian' },
    { id: 'spiritual', label: 'Tâm linh & Cổ tự' },
  ];

  const handleToggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleTestApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponseMsg(null);

    const preference: JourneyPreference = {
      durationHours,
      interests: selectedInterests,
      startLocation,
      pace: 'moderate',
      companion: 'solo',
    };

    try {
      await generateAIJourney(preference);
      setApiResponseMsg('Đã nhận kết quả.');
    } catch (err: any) {
      setApiResponseMsg(err.message || 'API trả về mã lỗi 501 (Chưa triển khai).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-amber-700" />
          <span>Khung Tích Hợp Google Gemini API (Chưa triển khai logic prompt)</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-950">
          Khung Lập Hành Trình Cá Nhân Hóa
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Giao diện nhập sở thích và thời lượng. Toàn bộ logic Prompt Engineering và gọi model Gemini 2.5 Flash sẽ được viết trong ngày thi.
        </p>
      </div>

      {/* Form UI Skeleton */}
      <Card className="p-6 sm:p-8 bg-white border border-stone-200/90 shadow-card">
        <form onSubmit={handleTestApi} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Thời lượng (Khung UI)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 8].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDurationHours(h)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      durationHours === h
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {h} Giờ
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Điểm xuất phát (Khung UI)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Sở thích ưu tiên (Khung UI)
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleInterest(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-terracotta-500 text-white border-terracotta-500'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={loading}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kiểm Tra Endpoint API (/api/itinerary)</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Response Feedback */}
      {apiResponseMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-900 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Phản hồi từ Server Backend:</p>
            <p className="mt-0.5 text-stone-700">{apiResponseMsg}</p>
          </div>
        </div>
      )}

      {/* Placeholder Timeline Area */}
      <div className="p-8 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-300 text-center space-y-2">
        <p className="font-serif font-semibold text-stone-700 text-sm">
          Khu vực hiển thị kết quả Hành trình AI (Chưa triển khai)
        </p>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Khi gọi Gemini API trong ngày thi, danh sách các chặng dừng (Timeline stops), thời gian di chuyển và lưu ý văn hóa sẽ được render tại đây.
        </p>
      </div>
    </div>
  );
};
