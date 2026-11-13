import React from 'react';
import { Card } from '../../components/ui/Card';
import { Award, HelpCircle, User, Info, AlertTriangle } from 'lucide-react';

// TODO (Hackathon Day): Xây dựng ngân hàng câu hỏi quiz, logic chấm điểm và cấp huy hiệu trong ngày thi
export const PassportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <span>Trạng thái: Khung giao diện Hộ Chiếu & Quiz — Chưa triển khai dữ liệu điểm thưởng, câu hỏi và cơ chế cấp huy hiệu.</span>
      </div>

      {/* Profile Header Skeleton */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-ivory-100 border-none shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-primary-800 border border-primary-700 flex items-center justify-center text-ochre-300">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="font-serif text-2xl font-bold text-ivory-100">
                Lữ Khách Khám Phá
              </h1>
              <p className="text-xs text-ivory-300">
                Hồ sơ thành viên (Khung placeholder)
              </p>
              <div className="text-xs text-primary-300 flex items-center space-x-1 pt-1">
                <Info className="w-3.5 h-3.5" />
                <span>Tiến độ cá nhân sẽ được lưu trữ qua MongoDB / LocalStorage trong ngày thi</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-primary-900/80 border border-primary-800 text-center min-w-[120px]">
            <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold">
              Điểm Tích Lũy
            </p>
            <p className="text-2xl font-extrabold text-ochre-400 mt-0.5">
              0
            </p>
            <p className="text-[10px] text-ivory-400">Chưa bắt đầu thử thách</p>
          </div>
        </div>
      </Card>

      {/* Badges Collection Area (Skeleton) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-terracotta-600" />
          <h2 className="font-serif text-xl font-bold text-primary-950">
            Bộ Sưu Tập Huy Hiệu (Chưa triển khai)
          </h2>
        </div>

        <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-stone-200 text-center space-y-2">
          <Award className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="font-serif font-semibold text-stone-700 text-sm">
            Khu vực hiển thị Huy hiệu văn hóa
          </p>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Hệ thống danh hiệu, điều kiện mở khóa và biểu tượng làng nghề sẽ được định nghĩa và lập trình trong 270 phút thi đấu.
          </p>
        </div>
      </div>

      {/* Quiz Area (Skeleton) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-primary-800" />
          <h2 className="font-serif text-xl font-bold text-primary-950">
            Thử Thách Tri Thức Di Sản (Chưa triển khai)
          </h2>
        </div>

        <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-stone-200 text-center space-y-2">
          <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="font-serif font-semibold text-stone-700 text-sm">
            Khu vực Mini Quiz tương tác
          </p>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Bộ câu hỏi trắc nghiệm tìm hiểu văn hóa, cơ chế chấm điểm và phản hồi kiến thức sẽ được xây dựng trong ngày thi.
          </p>
        </div>
      </div>
    </div>
  );
};
