# Tài Liệu Bàn Giao & Tích Hợp Thành Viên 3 (`docs/team3/HANDOFF.md`)

**Dự án:** Hồn Làng (`SoulVillage × HoaLang`)  
**Thành viên:** TV3 — Danh mục Văn hóa Huế, Hộ chiếu Di sản & Quiz Văn hóa  
**Nhánh làm việc:** `HuyVLT/Passport`  
**Quy chuẩn tuân thủ:** `Contract v1` & `HoaLang UI Rule v1.0 (Luxury Editorial × Vietnamese Cultural Depth)`

---

## 1. Danh Mục File Đã Hoàn Thiện (Đúng Allowlist TV3)

| File / Thư mục | Mô tả chức năng |
| :--- | :--- |
| [`public/data/places.json`](../../public/data/places.json) | Nguồn dữ liệu địa điểm duy nhất (11 địa điểm làng nghề/di tích Huế phủ đủ 5 danh mục `craft`, `monument`, `spiritual`, `cuisine`, `nature`, có tọa độ và nguồn trích dẫn chính thống). |
| [`public/images/places/`](../../public/images/places/) | Bộ 11 ảnh chụp làng nghề/di tích Huế thực tế (`*.jpg`) + ảnh dự phòng `fallback-place.svg` chuẩn HoaLang Editorial. |
| [`src/data/places.ts`](../../src/data/places.ts) | Module truy cập đồng bộ `CULTURAL_PLACES`, `getPlacesSync()`, `getPlaceById()`, `filterCulturalPlaces()` và `FALLBACK_PLACE_IMAGE_URL`. |
| [`server/features/catalog/router.js`](../../server/features/catalog/router.js) | Xuất `getPlaces()` đồng bộ (dùng `import.meta.url`) cho TV2 và `createCatalogRouter()` phục vụ `GET /api/places?category=...&search=...` (hỗ trợ tìm kiếm tiếng Việt không dấu, trả `400` khi `category` không hợp lệ) và `GET /api/places/:id`. |
| [`src/services/storage.ts`](../../src/services/storage.ts) | Quản lý lưu trữ cục bộ an toàn với khóa `soulvillage.passport.v1`, khởi tạo `userId` duy nhất 1 lần, đọc số hành trình từ `loadSavedJourneys()` của TV2 (chỉ đọc), tự động mở khóa 4 huy hiệu văn hóa và đổi điểm lấy phiếu quà làng nghề (`redeemPassportReward` không làm mất huy hiệu đã mở). |
| [`src/features/passport/data/questions.ts`](../../src/features/passport/data/questions.ts) | Ngân hàng 6 câu hỏi trắc nghiệm văn hóa (`CULTURAL_QUESTIONS`) gắn với `placeId` có thật trong catalog, giữ nguyên trường `correctOptionIndex`, kèm câu dẫn gợi mở (`storyHook`), `explanation` và `culturalFunFact` song ngữ VI/EN. |
| [`src/features/passport/components/QuizCraftScene.tsx`](../../src/features/passport/components/QuizCraftScene.tsx) | Khung minh họa tương tác kết hợp ảnh thật làng nghề với 6 hoạt cảnh thủ công riêng cho từng câu đố (soi nón bài thơ dưới nắng, xòe hoa hương Thủy Xuân, gõ gốm Phước Tích, nở hoa sen giấy Thanh Tiên, chạm nổi Cửu Đỉnh, in mộc bản Làng Sình). |
| [`src/features/passport/PassportPage.tsx`](../../src/features/passport/PassportPage.tsx) | Giao diện trang Hộ Chiếu Văn Hóa, Thử Thách Quiz, Quầy Đổi Quà Làng Nghề & Sổ Tay Khám Phá tuân thủ 100% HoaLang UI Rule v1.0, bọc `PassportErrorBoundary` an toàn. |
| [`src/features/passport/index.ts`](../../src/features/passport/index.ts) | Điểm xuất module `PassportPage` và `CULTURAL_QUESTIONS` thuận tiện cho TV1 tích hợp router. |
| [`docs/team3/SOURCES.md`](./SOURCES.md) | Hồ sơ đối chiếu sử liệu và trích dẫn nguồn chính thống cho 11 địa điểm Huế. |
| [`messages/vi.json`](../../messages/vi.json) & [`messages/en.json`](../../messages/en.json) | Bổ sung đầy đủ từ điển song ngữ phần `passport` (giữ nguyên toàn bộ khóa gốc). |

---

## 2. Hướng Dẫn TV1 Tích Hợp Nhánh `HuyVLT/Passport`

### 2.1. Backend (`/api/places` & `getPlaces`)
`server.js` đã mount sẵn `createCatalogRouter()` và truyền `getPlaces` sang `createJourneyRouter({ getPlaces })`. Ngay sau khi merge nhánh của TV3:
- `GET /api/places` trả về `{ places: [...], total: 11 }`.
- `GET /api/places?category=craft&search=non+bai+tho` lọc chính xác theo danh mục và từ khóa tiếng Việt không dấu.
- `GET /api/places?category=invalid` trả về `HTTP 400` với `{ error: { code: 'INVALID_CATEGORY', message: '...' } }`.

### 2.2. Frontend Router (`/passport`)
Khi TV1 gắn router trong `src/App.tsx`:
```tsx
import { PassportPage } from './features/passport';
// Route: <Route path="/passport" element={<PassportPage />} />
```

---

## 3. Kịch Bản Demo & Thuyết Trình Trước Ban Giám Khảo (Pitching Script)

1. **Chiều sâu Dữ liệu Văn hóa Huế (`Explore` & `Catalog API`):**
   - Giới thiệu 7 làng nghề thủ công cổ truyền (Nón lá Tây Hồ, Hương Thủy Xuân, Gốm Phước Tích, Hoa giấy Thanh Tiên, Đúc đồng Phường Đúc, Tranh Làng Sình, Đệm bàng Phò Trạch) cùng 4 di tích – tâm linh – ẩm thực – cảnh quan cố đô.
   - Nhấn mạnh từng địa điểm đều có câu chuyện lịch sử, bí quyết kỹ nghệ (`craftDetails`), mẹo bản địa (`localTips`) và trích dẫn nguồn từ Cổng TTĐT Thừa Thiên Huế, Trung tâm Bảo tồn Di tích Cố đô Huế, UNESCO.
2. **Thử thách Tri thức & Hộ chiếu Di sản (`PassportPage`):**
   - Mở trang **Hộ Chiếu Văn Hóa Cố Đô**: trình diễn thiết kế cuốn sổ tay di sản bìa giấy dó, nhãn minh bạch *"Lưu trên thiết bị này"*, mã định danh hộ chiếu duy nhất.
   - Thực hiện trả lời đúng 2 câu hỏi liên tiếp (ví dụ: Nón bài thơ Tây Hồ và Hương Thủy Xuân):
     - Điểm số tăng mượt mà qua `AnimatedNumber` (`0 -> 50 -> 100`).
     - Hiển thị hộp trích dẫn **Điển Tích & Bí Quyết Làng Nghề** bằng chữ `Cormorant Garamond` nghiêng trang nhã.
     - Tự động mở khóa ấn triện **"Học giả di sản"** ngay lập tức.
   - Trả lời lại câu hỏi đã hoàn thành để chứng minh quy tắc điểm minh bạch: **không cộng dồn điểm trùng lặp**.
   - Reload trình duyệt (`F5`) để chứng minh toàn bộ điểm số, danh xưng, câu hỏi đã giải và số lượng hành trình lưu từ TV2 (`loadSavedJourneys`) được bảo toàn 100%.
