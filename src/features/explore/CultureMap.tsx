import React from 'react';
import { Navigation, Info } from 'lucide-react';

// TODO (Hackathon Day): Tích hợp bản đồ trực quan hoặc thư viện bản đồ trong thời gian thi
export const CultureMap: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-terracotta-600" />
          <h3 className="font-serif font-bold text-xl text-primary-950">
            Bản Đồ Văn Hóa Tương Tác
          </h3>
        </div>
        <div className="text-xs text-stone-500 flex items-center space-x-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200">
          <Info className="w-3.5 h-3.5" />
          <span>Trạng thái: Khung bản đồ (Chưa triển khai logic tọa độ)</span>
        </div>
      </div>

      {/* Map Placeholder Canvas */}
      <div className="relative aspect-[21/9] min-h-[260px] w-full bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-6 text-center space-y-2">
        <Navigation className="w-10 h-10 text-stone-300 animate-pulse" />
        <p className="font-serif font-semibold text-stone-700 text-sm">
          Khu vực hiển thị Bản đồ văn hóa
        </p>
        <p className="text-xs text-stone-400 max-w-md">
          Tính năng tích hợp bản đồ số, đánh dấu tọa độ di sản và hiển thị chỉ dẫn đường sẽ được phát triển trong ngày thi.
        </p>
      </div>
    </div>
  );
};
