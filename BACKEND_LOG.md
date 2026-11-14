# Nhật Ký Phát Triển Backend (BACKEND_LOG.md)

Tài liệu này ghi nhận mọi thay đổi về server Express, router module ESM, tích hợp API và cấu hình triển khai container theo Hợp đồng v1 (`docs/TEAM_CONTRACTS.md`).

---

## [2026-11-14T09:05:00+07:00] Khởi tạo Khung Nối Module ESM Backend & Container (Trước READY)

- **Người thực hiện:** TV1 (Trưởng nhóm)
- **Tác vụ hoàn thành:**
  1. Tạo `public/data/places.json` khởi tạo mảng rỗng `[]` làm nguồn dữ liệu địa điểm duy nhất.
  2. Khởi tạo `server/features/catalog/router.js` xuất `getPlaces()` đồng bộ trả `[]` và `createCatalogRouter()` với `GET /` trả `HTTP 501`.
  3. Khởi tạo `server/features/journey/router.js` xuất `createJourneyRouter({ getPlaces })` với `POST /` trả `HTTP 501`.
  4. Cập nhật `server.js` để import `getPlaces`, `createCatalogRouter`, `createJourneyRouter` và mount `/api/places` cùng `/api/itinerary` trước `/api` 404 handler và SPA fallback.
  5. Cập nhật `Dockerfile` và `.gcloudignore` để đồng bộ `dist/`, `public/`, `server/` và `server.js` vào container runtime.
- **Lưu ý quan trọng:**
  - TV3 tiếp quản `server/features/catalog/` và `public/data/places.json`.
  - TV2 tiếp quản `server/features/journey/` và sử dụng hàm `getPlaces` được inject từ `server.js`.
