# 📋 Handoff Report — Thành Viên 2 (TV2: Gemini & Cultural Journey)

> **Nhánh phát triển:** `NHANH_TV2`  
> **Trạng thái:** ✅ Sẵn sàng tích hợp (Ready for Integration)  
> **Hợp đồng tuân thủ:** `docs/TEAM_CONTRACTS.md` (v1) & `HoaLang UI Rule v1.0`

---

## 1. Các File Đã Xây Dựng & Thuộc Quyền Sở Hữu TV2

### Backend (`server/features/journey/`)
- `router.js`: Express router xử lý `POST /api/itinerary`, nhận `getPlaces` injected từ server.js.
- `service.js`: Tích hợp `@google/genai` v3 gọi model `gemini-3.5-flash` (20s timeout, JSON mode) kèm thuật toán deterministic greedy-packing fallback.
- `validator.js`: Kiểm định chặt chẽ đầu vào (duration 2–8h, categories, max 3 selected IDs) và bóc tách schema đầu ra, đối chiếu placeId với catalog, ghi đè placeName từ catalog.
- `test/fixtures.json`: Bộ dữ liệu 3 địa điểm Huế độc lập dùng để test offline.
- `test/journey.test.js`: 18 unit tests tự động chạy bằng `node:test` (100% pass).

### Frontend (`src/features/journey/` & `src/services/`)
- `JourneyPage.tsx`: Trang điều phối chính, đọc `?placeId=` từ URL, gọi API với `AbortController`, quản lý state kết quả và danh sách hành trình đã lưu.
- `JourneyForm.tsx`: Form tùy biến thông số du khảo chuẩn mobile-first (quỹ thời gian, chip sở thích, điểm khởi hành, nhịp điệu, người đồng hành).
- `JourneyTimeline.tsx`: Hiển thị timeline dọc theo phong cách HoaLang Luxury Editorial, nhãn Gemini vs. Fallback, thông tin di chuyển, chi phí ước tính, nút Lưu và Chia sẻ (`navigator.share`).
- `src/services/journeyApi.ts`: Client gọi `POST /api/itinerary` an toàn.
- `src/services/journeyStorage.ts`: Lưu trữ cục bộ khóa `soulvillage.itineraries.v1` chống trùng ID (tối đa 20 mục).
- `messages/vi.json` & `messages/en.json`: Bổ sung toàn bộ chuỗi song ngữ cho module Journey.

---

## 2. Kết Quả Kiểm Thử (Verification Evidence)

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- |
| **Backend Unit Tests** | `node --test server/features/journey/test/journey.test.js` | **18 / 18 passed** (202ms) |
| **Backend Syntax** | `node --check server/features/journey/*.js` | **0 errors** |
| **TypeScript & Build** | `npm run build` | **Passed** (`dist/` tạo thành công) |
| **Linter** | `npm run lint` | **Passed** (0 warnings từ `oxlint`) |
| **Live Gemini API Call** | Thử nghiệm trực tiếp với key thật từ `.env.local` | **Thành công** (`isFallback: false`, model `gemini-3.5-flash`, 2 chặng dừng) |
| **Mobile Responsiveness** | Kiểm tra viewports 360px, 390px, 430px | **Đạt chuẩn HoaLang v1.0**, touch targets $\ge 44 \times 44\text{px}$ |

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
