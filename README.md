# 🇻🇳 Hồn Làng (SoulVillage) — Starter Kit (Hackathon Skeleton)

> **Sự kiện:** GDG DevFest MienTrung Hackathon 2026  
> **Địa điểm:** Grand Tourane Hotel, Đà Nẵng | Ngày thi: 14/11/2026  
> **Repository:** [https://github.com/trungctde180766/SoulVillage.git](https://github.com/trungctde180766/SoulVillage.git)  
> **Nhánh chuẩn bị:** `codex/prep-skeleton`  
> **Trạng thái:** 🟡 Minimal Starter Kit (Bộ khung kỹ thuật tối giản — Đang chờ phát triển nghiệp vụ trong 270 phút thi đấu)

---

## 📌 Bối Cảnh & Quy Định Ban Tổ Chức (Hình ảnh thể lệ)
* **Giới hạn code chuẩn bị:** Dự án có sẵn chỉ được hoàn thiện **tối đa 30%**.
* **Yêu cầu Google bắt buộc:** Tối thiểu gọi **Google Gemini API** và triển khai trên **Google Cloud Run**.
* **Quy trình nộp bài:** Dùng Git, commit & push tiến độ liên tục và nộp bài qua GitHub.
* **Quy tắc minh bạch:** Xem chi tiết tại [docs/PREP_SCOPE.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/PREP_SCOPE.md) về phân định phạm vi code trước/sau rút gọn.

---

## 🔍 Trạng Thái Hiện Tại Của Starter Kit

### Những gì ĐÃ CÓ trong starter kit:
* **Bộ khung giao diện:** React 19, Vite, TypeScript, Tailwind CSS (theme văn hóa Việt: Xanh ngọc bích, Kem ấm, Cam đất).
* **Điều hướng & Trang placeholder:** Router và 4 trang khung hiển thị (`ExplorePage`, `PlaceDetailPage`, `JourneyPage`, `PassportPage`) với nhãn ghi rõ trạng thái *Chưa triển khai*.
* **Node.js Production Server:** `server.js` lắng nghe trên `0.0.0.0` (port qua `process.env.PORT || 8080`), phục vụ frontend build và endpoint `GET /api/health` trả về HTTP 200.
* **Cấu hình Container:** Multi-stage `Dockerfile` và `.dockerignore` sẵn sàng cho Google Cloud Run.
* **Cấu hình & SDK:** Dependency SDK `@google/genai`, `mongodb`, `express`. Các biến môi trường an toàn dạng placeholder trong `.env.example`.
* **CI Pipeline:** GitHub Actions kiểm tra typecheck và build frontend.

### Những gì CHƯA CÓ (Bắt buộc xây dựng trong 270 phút ngày thi):
* ❌ **Chưa có dữ liệu văn hóa thật:** Mảng dữ liệu địa điểm đang rỗng (`src/data/places.ts`).
* ❌ **Chưa có logic Gemini AI:** Chưa có prompt, chưa có logic sinh hành trình và chưa có kết quả AI (API `/api/itinerary` đang trả về HTTP 501 Not Implemented).
* ❌ **Chưa có logic Hộ chiếu & Quiz:** Chưa có câu hỏi trắc nghiệm, chưa có logic chấm điểm và cấp huy hiệu (API `/api/passport` trả về HTTP 501 Not Implemented).
* ❌ **Chưa có tài nguyên Cloud Run thực tế:** Chưa tạo dịch vụ hay triển khai lên tài khoản Google Cloud của người dùng.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Quick Start)

### 1. Cài đặt các gói phụ thuộc
```bash
npm ci
```

### 2. Thiết lập Biến Môi Trường (Placeholder)
```bash
cp .env.example .env.local
```

### 3. Chạy môi trường Frontend Dev (Vite)
```bash
npm run dev
# Truy cập: http://localhost:5173
```

### 4. Chạy môi trường Production Server (Google Cloud Run Server)
```bash
# Build frontend
npm run build

# Khởi động Node.js server
npm start
# Truy cập website: http://localhost:8080
# Kiểm tra Health Check: http://localhost:8080/api/health
```

---

## 📂 Tài Liệu Chi Tiết Trong Thư Mục `docs/`
* [docs/PREP_SCOPE.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/PREP_SCOPE.md): Báo cáo đối chiếu phạm vi chuẩn bị trước và sau rút gọn để xuất trình cho BTC.
* [docs/SETUP.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/SETUP.md): Hướng dẫn cài đặt, chạy Docker và lệnh deploy Cloud Run.
* [docs/BUILD_DAY.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/BUILD_DAY.md): Kế hoạch tác chiến 270 phút chi tiết theo từng Milestone (M1 – M6).
* [docs/COMPETITION_RULES.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/COMPETITION_RULES.md): Đối chiếu các quy định thể lệ thi đấu.
