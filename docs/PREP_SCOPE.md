# 📋 Báo Cáo Phạm Vi Chuẩn Bị (PREP Scope Report) — Hồn Làng (SoulVillage)

> **Mục đích:** Tài liệu minh bạch hóa phạm vi mã nguồn starter kit phục vụ việc đối chiếu với Ban Tổ Chức và Ban Giám Khảo cuộc thi Hackathon GDG DevFest MienTrung 2026.

---

## A. Những phần ĐÃ GỠ BỎ HOÀN TOÀN khỏi mã nguồn Web
Nhằm đảm bảo repository là một **Starter Template kỹ thuật tối giản (0% logic nghiệp vụ web)**, toàn bộ mã nguồn liên quan đến tính năng web đã được gỡ bỏ khỏi `src/`:
1. **Gỡ bỏ toàn bộ thư mục tính năng (`src/features/`):**
   - Đã xóa `src/features/explore/` (ExplorePage, FilterBar, PlaceCard, CultureMap).
   - Đã xóa `src/features/places/` (PlaceDetailPage).
   - Đã xóa `src/features/journey/` (JourneyPage).
   - Đã xóa `src/features/passport/` (PassportPage).
2. **Gỡ bỏ dữ liệu và dịch vụ (`src/data/`, `src/services/`):**
   - Đã xóa `src/data/places.ts`.
   - Đã xóa `src/services/api.ts` và `src/services/storage.ts`.
3. **Gỡ bỏ thư mục `api/` cũ:**
   - Toàn bộ backend được chuyển giao về server Cloud Run (`server.js`) theo đúng phân công của 3 thành viên.

---

## B. Những phần CÒN GIỮ trong Starter Template
Repository hiện tại chỉ còn lại bộ khung kỹ thuật thuần túy:
1. **Cấu hình & Môi trường:** Vite, React 19, TypeScript, Tailwind CSS (`tailwind.config.js` mang bảng màu Cố Đô: Xanh ngọc, Kem ấm, Cam đất), ESLint/oxlint.
2. **Trang Starter Template (`src/App.tsx`):** Giao diện landing đơn giản giới thiệu dự án, thông tin 3 vai trò (TV1, TV2, TV3) và trạng thái sẵn sàng cho 270 phút thi đấu.
3. **Thành phần UI nguyên tử (`src/components/ui/`):** Các primitive tái sử dụng (`Button.tsx`, `Card.tsx`, `Badge.tsx`).
4. **Hợp đồng kiểu dữ liệu (`src/types/`):** Interface định nghĩa hợp đồng giữa 3 thành viên (`place.ts`, `journey.ts`, `passport.ts`).
5. **Google Cloud Run Server & Container:**
   - `server.js`: Node.js Express server phục vụ frontend đã build và endpoint `GET /api/health` trả về HTTP 200.
   - `Dockerfile` & `.dockerignore`: Multi-stage Docker build chuẩn hóa cho Google Cloud Run.
6. **Thư viện phụ thuộc:** Đã cài sẵn `@google/genai`, `mongodb`, `express`, `lucide-react`.

---

## C. Nơi Lưu Trữ Mã Nguồn & Bản Vẽ Thiết Kế (Documentation Blueprints)
Toàn bộ mã nguồn mẫu, component, thuật toán gọi Gemini và danh mục dữ liệu đã được tổng hợp đầy đủ vào:
1. **File Word phân công trong `deliverables/Hackathon_3_nguoi/`:**
   - `01_TV1_Truong_nhom_Explore_Cloud_Run.docx`: Chứa code mẫu Navbar, Explore, Filter, Detail, Map.
   - `02_TV2_Gemini_Journey.docx`: Chứa code mẫu Router Gemini 2.5 Flash, Prompt Engineering, Journey UI.
   - `03_TV3_Du_lieu_Passport_Quiz.docx`: Chứa danh mục JSON 4 địa điểm Huế, Catalog Router, Quiz bank & Passport UI.
2. **Tài liệu tổng hợp [docs/WEB_SPECIFICATIONS.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/WEB_SPECIFICATIONS.md):**
   - Bản vẽ thiết kế và toàn bộ mã nguồn TypeScript/JSX hoàn chỉnh để 3 thành viên sao chép hoặc tham khảo nhanh trong thời gian thi.

---

## D. Cam Kết Với Ban Tổ Chức (BTC)
- **Tính nguyên bản:** Repository chỉ đóng vai trò bộ khung môi trường kỹ thuật (Starter Template).
- **Phát triển thực tế:** 100% tính năng ứng dụng (khám phá văn hóa, gọi Gemini API, hộ chiếu di sản) sẽ được lập trình trong 270 phút diễn ra sự kiện.
