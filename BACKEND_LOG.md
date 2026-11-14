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
