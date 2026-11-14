# 📋 Handoff Report — Thành Viên 2 (TV2: Gemini & Cultural Journey)

> **Nhánh phát triển:** `NHANH_TV2`  
> **Trạng thái:** ✅ Sẵn sàng tích hợp (Ready for Integration)  
> **Hợp đồng tuân thủ:** `docs/TEAM_CONTRACTS.md` (v1) & `HoaLang UI Rule v1.0`

---

## 1. Các File Đã Xây Dựng & Thuộc Quyền Sở Hữu TV2

### Backend (`server/features/journey/`)
- `router.js`: Express router xử lý `POST /api/itinerary`, nhận `getPlaces` injected từ server.js.
- `service.js`: Tích hợp `@google/genai` v3 với chuỗi model `GEMINI_MODEL` → `gemini-3.5-flash-lite` → `gemini-3.5-flash`. Cả chuỗi dùng **chung một hạn 20s**; mỗi lần thử không phải cuối cùng bị giới hạn thêm 12s để model chậm không chiếm hết thời gian. Quá hạn/429/sai schema → thuật toán greedy-packing cục bộ (`isFallback: true`). Prompt nhấn mạnh người đồng hành (solo/couple/family/friends) và nhịp điệu (relaxed/moderate/intensive).
- `validator.js`: Kiểm định chặt chẽ đầu vào (duration 2–8h, categories, max 3 selected IDs) và bóc tách schema đầu ra, đối chiếu placeId với catalog, ghi đè placeName từ catalog.
- `test/fixtures.json`: Bộ dữ liệu 3 địa điểm Huế độc lập dùng để test offline.
- `test/journey.test.js`: 18 unit tests tự động chạy bằng `node:test` (100% pass).

### Frontend (`src/features/journey/` & `src/services/`)
- `JourneyPage.tsx`: Trang điều phối chính, đọc `?placeId=` từ URL, gọi API với `AbortController`, quản lý state kết quả và danh sách hành trình đã lưu.
- `JourneyForm.tsx`: Form mobile-first (quỹ thời gian, chip sở thích, điểm khởi hành, nhịp điệu, người đồng hành). **Chặn khởi tạo khi chưa đăng nhập**; có nút "Đăng Nhập 1 Chạm (TV2 AI Demo)" dùng tài khoản demo `tv2@soulvillage.vn`.
- `JourneyTimeline.tsx`: Hiển thị timeline dọc theo phong cách HoaLang Luxury Editorial, nhãn Gemini vs. Fallback, thông tin di chuyển, chi phí ước tính, nút Lưu và Chia sẻ (`navigator.share`).
- `src/services/journeyApi.ts`: Client gọi `POST /api/itinerary`, timeout phía client 25s (dài hơn hạn 20s phía server), phân biệt lỗi mạng/timeout với hủy yêu cầu.
- `src/services/journeyStorage.ts`: Lưu trữ cục bộ khóa `soulvillage.itineraries.v1` chống trùng ID (tối đa 20 mục).
- `messages/vi.json` & `messages/en.json`: Bổ sung toàn bộ chuỗi song ngữ cho module Journey.

---

## 2. Kết Quả Kiểm Thử (Verification Evidence)

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- |
| **Backend Unit Tests** | `node --test server/features/journey/` | **18 / 18 passed** |
| **Backend Syntax** | `node --check server/features/journey/*.js` | **0 errors** |
| **TypeScript & Build** | `npm run build` | **Passed** |
| **Linter** | `npm run lint` | **Passed** (`oxlint`) |
| **Live Gemini (catalog thật TV3, 11 địa điểm)** | `curl POST /api/itinerary` với key thật, `GEMINI_MODEL=gemini-3.5-flash-lite` | **200, `isFallback: false`**, ~2.5–3s; ID ưu tiên `lang-gom-phuoc-tich` được giữ ở chặng 1 |
| **Model chính bị treo** | Ép model đầu là `gemini-3.8-flash` | Bị cắt ở 12s, `gemini-3.5-flash-lite` trả kết quả → vẫn `isFallback: false` (~15s) |
| **Hạn chung 20s** | Gọi chuỗi model với `timeoutMs: 1500` | Hủy sau ~1.5s |
| **Request sai** | `durationHours: 99` | **400 `INVALID_REQUEST`** |
| **Mobile** | Ảnh chụp 390px của bản dựng | Đã xem ở 390px; **chưa** kiểm thử đủ 360/430px và chưa thử trên điện thoại thật |
| **Cloud Run** | — | **Chưa kiểm chứng** — chờ TV1 deploy |

---

## 3. Hướng Dẫn TV1 Kiểm Tra Sau Merge

1. **Khởi động server:**
   ```bash
   node --env-file=.env.local server.js
   ```
2. **Kiểm tra endpoint `POST /api/itinerary`:**
   ```bash
   curl -X POST http://localhost:8080/api/itinerary \
     -H "Content-Type: application/json" \
     -d '{"durationHours":4,"interests":["craft","monument"],"startLocation":"Trung tâm Huế","pace":"moderate","companion":"solo"}'
   ```
   - Mong đợi: HTTP 200 trả về đối tượng `JourneyItinerary` trực tiếp.
3. **Mở trình duyệt:** Truy cập `/#/journey` (hoặc `/#/journey?placeId=lang-non-tay-ho`) để kiểm tra toàn bộ form và timeline.

---

## 4. Cấu Hình Khi Deploy (TV1)

| Biến | Bắt buộc | Ghi chú |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Có | Gắn qua Secret Manager; thiếu → `503 AI_NOT_CONFIGURED`. |
| `GEMINI_MODEL` | Nên đặt | **`gemini-3.5-flash-lite`** (đo ~2s với catalog 11 địa điểm). `gemini-3.5-flash` hợp lệ nhưng ~14s; `gemini-3.8-flash` từng treo >60s; `gemini-2.5-flash` đã bị Google ngừng cho người dùng mới (404). |
| `ALLOW_FIXTURE_CATALOG` | Không | **Không đặt trên production.** Catalog TV3 đã có dữ liệu; biến này chỉ dùng để test offline với `test/fixtures.json`. |

## 5. Hạn Chế Còn Lại

- Chưa so sánh chất lượng nội dung giữa `gemini-3.5-flash-lite` và `gemini-3.5-flash`; đổi model chỉ cần sửa `GEMINI_MODEL`, nhưng `gemini-3.5-flash` (~14s) gần chạm hạn 20s.
- Thời gian di chuyển giữa các chặng là ước lượng (15–20 phút), chưa có dữ liệu định tuyến.
- Hành trình chỉ lưu trên thiết bị (`localStorage`), không đồng bộ.
