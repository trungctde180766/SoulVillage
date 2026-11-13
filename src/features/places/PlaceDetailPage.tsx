import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// TODO (Hackathon Day): Xây dựng trang chi tiết địa điểm, câu chuyện di sản và nguồn thẩm định trong ngày thi
export const PlaceDetailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 text-center space-y-4 shadow-soft">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
          <Landmark className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-semibold text-terracotta-600 tracking-wider">
            Chi Tiết Địa Điểm Văn Hóa
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-950">
            Trang Chi Tiết (Chưa triển khai)
          </h1>
        </div>

        <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50 text-amber-900 text-xs flex items-center space-x-2.5 text-left border border-amber-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Nội dung câu chuyện, quy trình làng nghề và nguồn tài liệu lịch sử sẽ được hoàn thiện trong thời gian thi.</span>
        </div>

        <div className="pt-4">
          <Button variant="primary" onClick={() => navigate('/')}>
            Trở về Trang Khám Phá
          </Button>
        </div>
      </div>
    </div>
  );
};
