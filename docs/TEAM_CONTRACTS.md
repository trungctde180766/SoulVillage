# Hợp Đồng Dữ Liệu, API & Quy Chuẩn Thiết Kế (Contract v1)

**Dự án:** SoulVillage × HoaLang  
**Phiên bản hợp đồng:** `v1`  
**Quy chuẩn giao diện:** `HoaLang UI Rule v1.0 (Luxury Editorial × Vietnamese Cultural Depth)`

> **Quy tắc bất biến:** Nếu phải thay đổi trường dữ liệu hoặc chữ ký hàm, TV1 cập nhật tài liệu này và file trong `src/types/` rồi thông báo cho cả TV2 và TV3; tuyệt đối không tự ý đổi âm thầm. Mọi JSON trả về dùng `camelCase`, mã hóa `UTF-8` và thời gian chuẩn `ISO 8601`.

---

## 1. Sơ Đồ Nối Module Toàn Hệ Thống

```text
server.js                                              (TV1)
├── GET  /api/health     -> 200 OK                     (TV1)
├── /api/places          -> createCatalogRouter()      (TV3)
├── /api/itinerary       -> createJourneyRouter({getPlaces}) (TV2)
│   └── getPlaces() đọc public/data/places.json        (TV3)
└── ALL  /api/passport   -> 501 Not Implemented        (Ngoài phạm vi MVP backend)

Frontend React + Vite + TypeScript + Tailwind CSS
├── Design System HoaLang (Tailwind tokens, Shared UI) (TV1 kiến tạo, TV2/TV3 kế thừa)
├── Explore & PlaceDetail (HoaLang Editorial)          (TV1)
├── Journey + journeyApi + journeyStorage              (TV2)
└── Passport + Quiz + storage                          (TV3)
```

---

## 2. Hợp Đồng Dữ Liệu Địa Điểm (`public/data/places.json`)

- `public/data/places.json` là nguồn dữ liệu địa điểm duy nhất (Single Source of Truth) cho toàn bộ hệ thống, chứa một JSON array các đối tượng `CulturalPlace` khớp với `src/types/place.ts`.
- Không tạo bản sao dữ liệu địa điểm riêng cho từng tính năng.
- **Các trường bắt buộc:**
  - `id`: `string` (slug duy nhất, không đổi sau khi đưa vào quiz/hành trình)
  - `name`: `string` (tên tiếng Anh)
  - `vietnameseName`: `string` (tên tiếng Việt có dấu chuẩn xác)
  - `category`: `'craft' | 'monument' | 'cuisine' | 'spiritual' | 'nature'`
  - `categoryLabel`: `string`
  - `location`: `string`
  - `coordinates`: `{ lat: number, lng: number }`
  - `shortDescription`: `string`
  - `story`: `string`
  - `localTips`: `string[]`
  - `imageUrl`: `string` (ảnh sắc nét, bố cục nghệ thuật chuẩn Luxury Editorial, bọc trong khung tỉ lệ cố định)
  - `tags`: `string[]`
  - `estimatedVisitTimeMinutes`: `number`
  - `sources`: `{ title: string, url?: string }[]` (`url` trỏ thẳng tới bài viết/tư liệu chính thống)
- **Các trường tùy chọn:**
  - `craftDetails?: string`
  - `historicalSignificance?: string`

---

## 3. Chữ Ký Module Backend (ESM JavaScript)

Các file `api/*.ts` cũ (nếu có) đóng băng, không dùng làm runtime chính. Mọi backend mới chạy bằng ESM JavaScript trong `server/features/`.

```js
// server/features/catalog/router.js — do TV3 tiếp quản
export function getPlaces() {
  /* Đọc và trả về CulturalPlace[] đồng bộ từ public/data/places.json */
}

export function createCatalogRouter() {
  /* Trả về express.Router xử lý GET / (hỗ trợ query ?category=...&search=...) */
}

// server/features/journey/router.js — do TV2 tiếp quản
export function createJourneyRouter({ getPlaces }) {
  /* Khai báo router.post('/', ...); trả về express.Router */
}
```

---

## 4. Hợp Đồng API Hành Trình Cá Nhân Hóa (`POST /api/itinerary`)

- **Đầu vào (`JourneyPreference`):**
  - `durationHours`: `number` (số hữu hạn từ `2` đến `8`)
  - `interests`: `string[]` (mảng `category` hợp lệ, không rỗng)
  - `startLocation`: `string` (tối đa 200 ký tự)
  - `pace`: `'relaxed' | 'moderate' | 'intensive'`
  - `companion`: `'solo' | 'couple' | 'family' | 'friends'`
  - `selectedPlaceIds?`: `string[]` (tối đa 3 ID tồn tại trong danh mục, dùng khi chuyển tiếp từ trang chi tiết `/journey?placeId=<id>`)
- **Đầu ra thành công (`HTTP 200`):**
  - Trả trực tiếp đối tượng `JourneyItinerary` theo `src/types/journey.ts` (không bọc trong `data`).
  - Mọi `stop.placeId` bắt buộc phải tồn tại trong `getPlaces()`.
  - Khi Google Gemini xử lý thành công: `isFallback: false`.
  - Khi AI gặp lỗi / hết quota / timeout: trả `HTTP 200` bằng thuật toán fallback cục bộ với `isFallback: true` và giao diện phải hiển thị rõ bằng nhãn `TagBadge` variant `stone`.
- **Đầu ra lỗi chuẩn hóa (`{ error: { code, message } }`):**
  - Request không hợp lệ: `HTTP 400` (`INVALID_REQUEST`)
  - Chưa có dữ liệu địa điểm: `HTTP 503` (`DATA_NOT_READY`)
  - Thiếu `GEMINI_API_KEY`: `HTTP 503` (`AI_NOT_CONFIGURED`)

---

## 5. Hợp Đồng Dịch Vụ Frontend & Lưu Trữ Cục Bộ (`localStorage`)

| Tên khóa / Nguồn dữ liệu | Chủ sở hữu ghi | Phương thức truy cập hợp lệ |
| :--- | :--- | :--- |
| `soulvillage.passport.v1` | TV3 | `getLocalPassport` / `saveLocalPassport` trong `src/services/storage.ts` |
| `soulvillage.itineraries.v1` | TV2 | `loadSavedJourneys(): JourneyItinerary[]` và `saveJourney(itinerary: JourneyItinerary): void` trong `src/services/journeyStorage.ts` (TV3 chỉ import `loadSavedJourneys` để đọc số lượng hành trình) |
| `public/data/places.json` | TV3 | `GET /api/places` cho frontend; `getPlaces()` cho server Express |

---

## 6. Quy Chuẩn Thiết Kế Giao Diện HoaLang UI Rule v1.0

**Định hướng:** Luxury Editorial × Vietnamese Cultural Depth  
**Triết lý:** Less is more, but details matter · Culture through restraint · Image-first · Bilingual elegance

### 6.1. Bảng Màu Chuẩn (Palette Tokens)

| Token | Mã Hex | Mục đích sử dụng bắt buộc |
| :--- | :--- | :--- |
| `parchment` (`--color-parchment`) | `#F5F0E8` | Nền trang chính — màu giấy dó truyền thống |
| `cream` (`--color-cream`) | `#FAF7F2` | Nền card, panel, section xen kẽ, ô nhập liệu |
| `ink` (`--color-ink`) | `#1A1208` | Màu chữ chính (body text), tiêu đề nhỏ |
| `charcoal` (`--color-charcoal`) | `#2E2318` | Section tối, footer, header nổi bật, tiêu đề đậm |
| `lacquer` (`--color-lacquer`) | `#8B1A1A` | Đỏ sơn mài — button primary, điểm nhấn hành động chính |
| `gold` (`--color-gold`) | `#C4952A` | Vàng nghệ — section label, tag văn hóa, icon điểm xuyết |
| `bronze` (`--color-bronze`) | `#7A5C2E` | Nâu đồng — liên kết, trạng thái hover, đường nét phụ |
| `stone` (`--color-stone`) | `#D4C9B5` | Đường viền (border 1px solid), đường phân cách (divider), input border |
| `ash` (`--color-ash`) | `#8C8070` | Chữ phụ, ghi chú meta, caption ảnh, placeholder |

> **Tuyệt đối cấm:** Không dùng màu trắng thuần (`#FFFFFF`) làm nền trang; không dùng màu xanh dương/tím/xanh lá chói kiểu generic SaaS; không dùng gradient tím-hồng kiểu AI đại trà.

### 6.2. Typography & Font Scale

- **Display / Heading (`font-display`):** `'Cormorant Garamond', Georgia, serif` (Weights: 300, 400, 600, 700)
- **Body / UI (`font-body`):** `'Be Vietnam Pro', 'Helvetica Neue', sans-serif` (Weights: 300, 400, 500, 600)
- **Cấm sử dụng:** Inter, Roboto, Arial, system-ui, Space Grotesk.

### 6.3. Bo Góc (Radius), Bóng Đổ (Shadow) & Chuyển Động (Motion)

- **Bo góc:** `rounded-xs` (`2px` cho tag/badge), `rounded-sm` (`3px` mặc định cho card/button/input), `rounded-md` (`6px` cho modal/drawer/passport card). Cấm dùng `rounded-2xl` hoặc `rounded-full` cho card/button chính.
- **Bóng đổ:** Trạng thái tĩnh của Card **không có shadow**, chỉ dùng `border border-stone` (`1px solid #D4C9B5`). Khi hover: `translateY(-5px)` kết hợp `shadow-hover` (`0 16px 40px rgba(26, 18, 8, 0.12)`) trong `300ms`.
- **Hình ảnh:** Bọc trong container `overflow-hidden` với `aspect-ratio` cố định (`4/3`, `3/4`, `1/1`, `16/9`), `object-cover`, hover `scale(1.04)` mượt mà `600ms ease-out`.
- **Mobile-first:** Thiết kế ưu tiên màn hình điện thoại (`360px`, `390px`, `430px`), vùng chạm tương tác tối thiểu `44 × 44px`, không tràn ngang.

### 6.4. Đa Ngôn Ngữ (i18n) & Nhật Ký Phát Triển

- Toàn bộ chuỗi hiển thị được quản lý qua `messages/vi.json` và `messages/en.json`. Tiếng Việt có dấu 100% chuẩn xác, văn phong nghệ thuật thanh lịch.
- Mọi thay đổi tính năng phải được ghi nhận vào `FRONTEND_LOG.md` hoặc `BACKEND_LOG.md`.
