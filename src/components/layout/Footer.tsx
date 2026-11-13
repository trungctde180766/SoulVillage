import React from 'react';
import { Landmark, Heart, Code2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-950 text-ivory-300 border-t border-primary-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-ochre-400">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl text-ivory-100">
                Hồn Làng
              </span>
            </div>
            <p className="text-sm text-ivory-400 max-w-md leading-relaxed">
              Bản đồ văn hóa sống Việt Nam — Tôn vinh vẻ đẹp làng nghề thủ công, di sản cung đình và câu chuyện ngàn năm của các bậc tiền nhân thông qua sức mạnh của công nghệ AI hiện đại.
            </p>
            <div className="text-xs text-primary-300 flex items-center space-x-1.5 pt-1">
              <span>GDG DevFest MienTrung Hackathon 2026 — Grand Tourane Hotel, Đà Nẵng</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory-100 mb-3">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-sm text-ivory-400">
              <li>
                <a href="#/" className="hover:text-ochre-300 transition-colors">
                  Làng Nghề Truyền Thống
                </a>
              </li>
              <li>
                <a href="#/journey" className="hover:text-ochre-300 transition-colors">
                  Lập Lịch Trình Gemini AI
                </a>
              </li>
              <li>
                <a href="#/passport" className="hover:text-ochre-300 transition-colors">
                  Hộ Chiếu & Huy Hiệu Di Sản
                </a>
              </li>
            </ul>
          </div>

          {/* Tech & Heritage Sources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory-100 mb-3">
              Công Nghệ & Nguồn
            </h4>
            <ul className="space-y-2 text-sm text-ivory-400">
              <li className="flex items-center space-x-1">
                <span>Google Gemini 2.5 Flash</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>MongoDB Atlas & Vercel</span>
              </li>
              <li>
                <a
                  href="https://github.com/trungctde180766/SoulVillage"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-ochre-300 hover:underline"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-900/60 flex flex-col sm:flex-row justify-between items-center text-xs text-ivory-400 gap-4">
          <p>© 2026 Hồn Làng (SoulVillage). Dự án chuẩn bị cho Hackathon GDG DevFest MienTrung.</p>
          <p className="flex items-center space-x-1">
            <span>Được kiến tạo với</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" />
            <span>và niềm tự hào di sản Việt</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
