import React from 'react';
import { Compass, Sparkles, Terminal } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-100 text-stone-800 flex flex-col justify-between font-sans selection:bg-terracotta-200 selection:text-terracotta-900">
      {/* Header */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-primary-900 flex items-center justify-center text-ivory-100 shadow-sm">
              <Compass className="w-5 h-5 text-ochre-400" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-primary-950">Hồn Làng</span>
              <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 bg-stone-100 text-stone-600 font-semibold rounded-md border border-stone-200">
                Starter Template
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              DevFest 2026 Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Starter Hero & Team Tasks Matrix */}
      <main className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8 flex-grow flex flex-col justify-center">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Bộ Khung Kỹ Thuật Tối Giản (0% Business Logic)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-primary-950 tracking-tight leading-tight">
            Hồn Làng — Bản Đồ Văn Hóa Sống
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-600 leading-relaxed">
            Môi trường kỹ thuật sẵn sàng: React 19, Vite, TypeScript, Tailwind CSS và Google Cloud Run. Toàn bộ tính năng nghiệp vụ văn hóa, Gemini AI và Hộ chiếu sẽ được lập trình trong 270 phút thi đấu.
          </p>
        </div>

        {/* 3 Member Task Assignment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-900 flex items-center justify-center font-bold text-xs">
              TV1
            </div>
            <h3 className="font-serif font-bold text-sm text-primary-950">Trưởng Nhóm & Explore</h3>
            <p className="text-xs text-stone-500">Quản lý main, Explore UI, Chi tiết địa điểm, Cloud Run deployment.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-100 text-terracotta-900 flex items-center justify-center font-bold text-xs">
              TV2
            </div>
            <h3 className="font-serif font-bold text-sm text-primary-950">Gemini AI Journey</h3>
            <p className="text-xs text-stone-500">Prompt Engineering cho Gemini 2.5 Flash, API tạo hành trình và timeline UI.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
              TV3
            </div>
            <h3 className="font-serif font-bold text-sm text-primary-950">Dữ Liệu & Hộ Chiếu</h3>
            <p className="text-xs text-stone-500">Khảo sát 8-12 địa điểm văn hóa Huế, Quiz di sản và hệ thống huy hiệu.</p>
          </div>
        </div>

        {/* Quick Instructions & Documentation Note */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 max-w-xl mx-auto flex items-center justify-center space-x-2">
          <Terminal className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <span>Mã nguồn tham khảo & đặc tả kỹ thuật: Xem tại <code>docs/WEB_SPECIFICATIONS.md</code></span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-500">
        <p>© 2026 Hồn Làng (SoulVillage). GDG DevFest MienTrung 2026 Hackathon Starter.</p>
      </footer>
    </div>
  );
};

export default App;
