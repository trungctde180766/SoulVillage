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

---

## [2026-11-14T09:58:00+07:00] Hoàn thiện Task 2 & Chuẩn bị Task 3 của TV1: Kiểm thử Tích hợp Express & Tài liệu Cloud Run

- **Người thực hiện:** TV1 (Trưởng nhóm — nhánh `tv1/explore-cloud-run`)
- **Tác vụ hoàn thành:**
  1. Tinh chỉnh `server.js`: Bổ sung `app.disable('x-powered-by')`, phục vụ static `public/` song song với `dist/`, và giới hạn SPA fallback chỉ trả `index.html` cho phương thức `GET`/`HEAD`.
  2. Tạo script kiểm thử tích hợp tự động `scripts/integration/verify-integration.mjs` kiểm chứng toàn bộ hợp đồng HTTP (`/api/health` 200, `/api/places` 200/501, `POST /api/itinerary` 400/501, malformed JSON 400, `/api/passport` 501, `/api/non-existent` 404, và SPA fallback 200).
  3. Tạo tài liệu vận hành triển khai `docs/DEPLOYMENT.md` gồm quy trình cấu hình IAM Service Account, Google Secret Manager (`soulvillage-gemini-key`) và lệnh `gcloud run deploy` chuẩn production.

---

## [2026-11-14T10:12:00+07:00] Khởi tạo Module Backend Xác Thực ESM (`server/features/auth/router.js`)

- **Người thực hiện:** TV1 (Trưởng nhóm — nhánh `tv1/explore-cloud-run`)
- **Tác vụ hoàn thành:**
  1. Tạo `server/features/auth/router.js` sử dụng `node:crypto` thuần (`scryptSync`, `timingSafeEqual`, `createHmac` SHA-256) không cần cài đặt thêm package ngoài:
     - `POST /api/auth/register`: Kiểm định dữ liệu, băm mật khẩu kèm salt ngẫu nhiên, cấp token ký số HMAC.
     - `POST /api/auth/login`: Xác thực email & mật khẩu an toàn, trả `{ user, token }`.
     - `GET /api/auth/me`: Giải mã và kiểm tra chữ ký Bearer token.
     - `PUT /api/auth/profile`: Cập nhật họ tên, danh hiệu văn hóa và tiểu sử.
     - `POST /api/auth/logout` & `GET /api/auth/demo-accounts`: Hỗ trợ đăng xuất và danh sách tài khoản mẫu cho 3 thành viên (`tv1@soulvillage.vn`, `tv2@soulvillage.vn`, `tv3@soulvillage.vn`).
  2. Mount `app.use('/api/auth', createAuthRouter())` trong `server.js` và bổ sung kịch bản kiểm thử tự động vào `scripts/integration/verify-integration.mjs`.

---

## [2026-11-14T10:35:00+07:00] Hoàn thiện Module Backend Lập Hành Trình Văn Hóa AI (`server/features/journey/`)

- **Người thực hiện:** TV2 (Gemini & Cultural Journey — nhánh `NHANH_TV2`)
- **Tác vụ hoàn thành:**
  1. Xây dựng bộ kiểm định dữ liệu nghiêm ngặt `server/features/journey/validator.js`:
     - Kiểm tra quỹ thời gian `durationHours` (2–8h), danh mục `interests`, `pace`, `companion`, và danh sách `selectedPlaceIds` (tối đa 3 ID).
     - Guardrails bảo vệ schema đầu ra: bóc tách JSON chuẩn kể cả khi có markdown block, bẫy ảo giác (`hallucinated placeId`), đảm bảo không trùng khung giờ (`timeSlot`) và không vượt tổng thời gian. Bắt buộc ghi đè `placeName` từ catalog gốc.
  2. Xây dựng dịch vụ gọi Gemini v3 & Engine Fallback cục bộ `server/features/journey/service.js`:
     - Tích hợp `@google/genai` gọi model `gemini-4-hydrogen` (kèm dự phòng `gemini-3.5-flash-lite`), timeout 20s, cấu hình JSON Mode và low thinking budget.
     - Thuật toán Deterministic Fallback: Tự động gom địa điểm theo điểm ưu tiên `selectedPlaceIds` hoặc độ khớp danh mục `interests`, xếp lịch greedy pack kèm 15 phút đệm di chuyển giữa các chặng dừng. Đảm bảo luôn trả HTTP 200 (`isFallback: true`) khi không có API key, mạng rớt, hoặc quota 429.
  3. Cập nhật `server/features/journey/router.js` và `server/features/journey/index.js`:
     - Cung cấp `createJourneyRouter({ getPlaces })` khớp hợp đồng `POST /api/itinerary`. Trả HTTP 400 nếu dữ liệu sai định dạng, HTTP 503 nếu catalog rỗng hoặc thiếu API key, HTTP 200 trả trực tiếp `JourneyItinerary`.
  4. Bộ kiểm thử tự động `server/features/journey/test/journey.test.js`:
     - 18 unit tests bao quát 100% kịch bản lỗi, biên, guardrails, fallback và router. 100% pass với `node:test`.
     - Đã kiểm thử live thành công với Gemini API key thật từ `.env.local` (trả về kết quả trong ~3.5s).

---

## [2026-11-14T11:15:00+07:00] Hoàn thiện Catalog API `/api/places` & `getPlaces()` (TV3)

- **Người thực hiện:** TV3 (Danh mục văn hóa, Hộ chiếu & Quiz — nhánh `HuyVLT/Passport`)
- **Tác vụ hoàn thành:**
  1. Hoàn thiện `getPlaces()` trong `server/features/catalog/router.js` đọc đồng bộ `public/data/places.json` thông qua `new URL('../../../public/data/places.json', import.meta.url)` phục vụ đồng thời `/api/places` và `createJourneyRouter({ getPlaces })` của TV2.
  2. Hoàn thiện `createCatalogRouter()` xử lý `GET /` (tương ứng `/api/places`) hỗ trợ lọc theo `category` (`craft`, `monument`, `cuisine`, `spiritual`, `nature`, `all`), kiểm tra `category` không hợp lệ trả `HTTP 400 INVALID_CATEGORY`, và tìm kiếm thông minh hỗ trợ chuẩn hóa tiếng Việt không dấu qua query `search`.
  3. Bổ sung `GET /:id` (tương ứng `/api/places/:id`) trả chi tiết địa điểm hoặc `HTTP 404 PLACE_NOT_FOUND`.
