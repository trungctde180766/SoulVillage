# Nhật Ký Phát Triển Frontend (FRONTEND_LOG.md)

Tài liệu này ghi nhận mọi thay đổi về UI components, styling, Design Tokens HoaLang, state management, i18n và router theo Quy chuẩn Thiết kế HoaLang UI Rule v1.0.

---

## [2026-11-14T09:05:00+07:00] Khởi tạo Design System HoaLang UI Rule v1.0 & Shared Components (Trước READY)

- **Người thực hiện:** TV1 (Trưởng nhóm & Kiến trúc sư UI)
- **Tác vụ hoàn thành:**
  1. Cấu hình `tailwind.config.js` với đầy đủ bảng màu tokens HoaLang (`parchment`, `cream`, `ink`, `charcoal`, `lacquer`, `gold`, `bronze`, `stone`, `ash`), hệ thống font (`Cormorant Garamond` cho `display`, `Be Vietnam Pro` cho `body`), thang chữ (`display-2xl` -> `caption`), `borderRadius` (`xs: 2px`, `sm: 3px`, `md: 6px`), `shadow-hover` và `ease-out-expo`.
  2. Cập nhật `index.html` và `src/index.css` nạp Google Fonts `Cormorant Garamond` và `Be Vietnam Pro`, thiết lập nền mặc định `bg-parchment text-ink` (`#F5F0E8` / `#1A1208`).
  3. Khởi tạo bộ thư viện `src/components/shared/`:
     - `SectionLabel.tsx`: Nhãn uppercase 11px màu gold kèm thanh gạch ngang 32px bên trái.
     - `PageHeader.tsx`: Header nền charcoal, tiêu đề Cormorant Garamond, hỗ trợ breadcrumb.
     - `VillageCard.tsx`: Card làng nghề nền cream, viền stone 1px, bo góc 3px, không shadow tĩnh, hover `translateY(-5px)` + `shadow-hover`, ảnh `overflow-hidden` tỉ lệ 4/3 hoặc 3/4 zoom `scale(1.04)`.
     - `CraftCard.tsx`: Card sản phẩm thủ công tỉ lệ vuông 1/1 kèm overlay xem nhanh.
     - `OrnamentDivider.tsx`: Hoa văn phân đoạn `◆ ─────── ◆` màu stone.
     - `TagBadge.tsx`: Badge variant `gold`, `stone`, `lacquer` bo góc `2px`.
     - `Button.tsx`: Hỗ trợ variant `primary` (đỏ sơn mài `lacquer`), `ghost`, `ghost-dark`, `link`.
     - `Input.tsx`: Hỗ trợ variant `box` và `underline` với cỡ chữ 16px chống tự phóng to trên iOS Safari.
     - `AnimatedNumber.tsx` & `LocaleText.tsx`: Hiệu ứng số chạy và hiển thị văn bản song ngữ.
  4. Khởi tạo từ điển đa ngôn ngữ `messages/vi.json`, `messages/en.json` và helper `src/lib/i18n.ts`.
  5. Tạo module dịch vụ frontend stub `src/services/journeyApi.ts`, `src/services/journeyStorage.ts` và `src/services/api.ts` khớp 100% hợp đồng v1.
- **Lưu ý quan trọng:**
  - Tuyệt đối không dùng màu nền trắng thuần `#FFFFFF` hoặc bo góc `rounded-2xl` / `rounded-full`.
  - Mọi thành viên TV1, TV2, TV3 kế thừa các component từ `src/components/shared/`.

---

## [2026-11-14T09:58:00+07:00] Hoàn thiện Task 1 của TV1: Layout, ExplorePage & PlaceDetailPage chuẩn HoaLang Luxury Editorial

- **Người thực hiện:** TV1 (Trưởng nhóm — nhánh `tv1/explore-cloud-run`)
- **Tác vụ hoàn thành:**
  1. **Layout (`src/components/layout/`):**
     - `Navbar.tsx`: Mặc định trong suốt đè lên Hero nền charcoal (`text-cream`), tự động chuyển sang `bg-parchment/92 backdrop-blur-md border-b border-stone shadow-hover` khi cuộn (`scrollY > 20`). Hỗ trợ chuyển đổi ngôn ngữ trực tiếp (`VI` / `EN`) và ngăn kéo menu trên điện thoại (`min-h-[44px]`, tự đóng khi chọn link).
     - `Footer.tsx`: Nền `bg-charcoal`, `text-cream/80`, đường kẻ `border-stone/30`, bố cục 3 cột bất đối xứng (`5 / 3 / 4`).
     - `Layout.tsx`: Khung bao bọc toàn trang với `Navbar`, `<main>` và `Footer`.
  2. **Trang Khám Phá (`src/features/explore/`):**
     - `FilterBar.tsx`: Bộ lọc danh mục dùng `TagBadge` (`gold` khi đang chọn, `stone` khi chưa chọn, bo góc `2px`, không dùng pill tròn), ô tìm kiếm gạch chân `border-b border-stone` cỡ chữ `16px` chống zoom trên iOS Safari.
     - `ExplorePage.tsx`: Hero nền `charcoal` kèm số liệu `AnimatedNumber`; thanh lọc trên nền `cream`; lưới phá lưới **Asymmetric Grid** trên nền `parchment` (Card #1 tiêu điểm chiếm tỷ lệ `7/5` kèm số thứ tự `01` lớn ở nền; các card tiếp theo xếp lưới 3 cột tỉ lệ ảnh `4/3` có hiệu ứng `animate-fade-up` stagger `0.1s`). Tích hợp debounce tìm kiếm `250ms` và `AbortController`.
  3. **Trang Chi Tiết Địa Điểm (`src/features/places/PlaceDetailPage.tsx`):**
     - `PageHeader` nền `charcoal` với tiêu đề `Cormorant Garamond` lớn, breadcrumb điều hướng và thông tin danh mục/thời lượng.
     - Ảnh phóng sự khổ lớn tỷ lệ `16/9` bọc `overflow-hidden` viền `stone`.
     - Câu chuyện lịch sử `Be Vietnam Pro` `body-lg` (`18px`, `line-height 1.8`), trích dẫn ý nghĩa di sản chữ nghiêng `Cormorant Garamond` `24px` viền vàng, phân cách bằng `OrnamentDivider` (`◆ ─────── ◆`).
     - Khung kỹ nghệ thủ công & lời khuyên nghệ nhân nền `cream` viền `stone`, danh sách nguồn trích dẫn (`sources`) mở tab mới an toàn (`rel="noreferrer noopener"`), và nút CTA chính `Lên Hành Trình Cùng Gemini` điều hướng tới `/#/journey?placeId=<id>`.
  4. **Router & Đa ngôn ngữ (`src/App.tsx`, `src/lib/i18n.ts`, `messages/*.json`):**
     - Cấu hình `HashRouter` và `LocaleProvider` song ngữ Việt - Anh hoàn chỉnh.
     - Tự động kết nối `JourneyPage` (TV2) và `PassportPage` (TV3) qua `import.meta.glob` ngay khi merge nhánh mà không chạm vào file thuộc quyền TV2/TV3.

---

## [2026-11-14T10:12:00+07:00] Bổ sung Hệ thống Định Danh & Xác Thực Đầy Đủ (Login, Register, Profile & Quick Switch TV1/TV2/TV3)

- **Người thực hiện:** TV1 (Trưởng nhóm — nhánh `tv1/explore-cloud-run`)
- **Tác vụ hoàn thành:**
  1. Tạo `src/types/auth.ts` và `src/lib/auth.ts` (`AuthProvider`, `useAuth()`) quản lý phiên đăng nhập bền vững qua `soulvillage.auth.v1`, kết nối API `/api/auth/*` kèm cơ chế dự phòng local khi chạy Vite dev độc lập.
  2. Xây dựng trang `src/components/auth/AuthPage.tsx` (tại `/#/auth`, `/#/login`, `/#/register`) chuẩn HoaLang Luxury Editorial:
     - **Đăng nhập (Login):** Email, mật khẩu (có nút Hiện/Ẩn), thông báo lỗi tinh tế.
     - **Đăng ký (Register):** Họ tên, Email, chọn Vai trò trong hệ sinh thái (`TV1`, `TV2`, `TV3`, `Lữ Khách`, `Nghệ Nhân`, `Học Giả`), Danh hiệu văn hóa tùy chỉnh, xác nhận mật khẩu.
     - **Hồ sơ đang đăng nhập (Active Identity Dossier):** Thẻ Ấn Triện Định Danh hiển thị rõ ai đang thao tác, mã thành viên, ngày gia nhập và biểu mẫu chỉnh sửa trực tiếp Họ tên / Danh hiệu / Tiểu sử.
     - **Chuyển nhanh danh tính 1 chạm (Demo Switcher):** Cho phép chuyển tức thì giữa **TV1 (Trưởng nhóm)**, **TV2 (Gemini AI)** và **TV3 (Hộ chiếu & Dữ liệu)**.
  3. Cập nhật `src/components/layout/Navbar.tsx` hiển thị trực tiếp **Ấn Triện + Họ Tên + Danh Hiệu** của người đang đăng nhập ngay trên thanh điều hướng (cả Desktop và Mobile) kèm nút Đăng xuất nhanh.

---

## [2026-11-14T10:35:00+07:00] Hoàn thiện Giao diện Lập Hành Trình Văn Hóa AI Mobile-First (`src/features/journey/`)

- **Người thực hiện:** TV2 (Gemini & Cultural Journey — nhánh `NHANH_TV2`)
- **Tác vụ hoàn thành:**
  1. Module Dịch vụ Frontend:
     - `src/services/journeyApi.ts`: Client gọi `POST /api/itinerary` kèm `AbortSignal`, định dạng lỗi `JourneyApiError` chuẩn hợp đồng v1.
     - `src/services/journeyStorage.ts`: Quản lý lưu trữ cục bộ khóa `soulvillage.itineraries.v1`, chống trùng lặp theo `id`, giới hạn 20 hành trình (TV3 có thể đọc để tính huy hiệu Passport).
  2. Các Component Giao diện Chuẩn HoaLang UI Rule v1.0:
     - `src/features/journey/JourneyPage.tsx`: Trang chủ đạo gắn với route `/#/journey`, tự động đọc `?placeId=` từ URL để ghim địa điểm ưu tiên, tích hợp `AbortController`, quản lý danh sách hành trình đã lưu. Header có khoảng đệm `pt-24 sm:pt-28` tương thích hoàn hảo với fixed Navbar của TV1.
     - `src/features/journey/JourneyForm.tsx`: Biểu mẫu tùy biến thông số du khảo chuẩn mobile-first (quỹ thời gian slider 2–8h, chip sở thích đa lựa chọn bo góc `2px`, điểm khởi hành, nhịp độ `relaxed|moderate|packed`, người đồng hành `solo|couple|family|friends`).
     - `src/features/journey/JourneyTimeline.tsx`: Hiển thị dòng thời gian dọc phong cách Luxury Editorial, phân biệt nhãn Gemini (`lacquer`) và Fallback (`gold`), thông tin di chuyển, chi phí ước tính, nút Lưu và Chia sẻ nhanh (`navigator.share`).
  3. Đa Ngôn ngữ Song ngữ (i18n):
     - Bổ sung trọn vẹn từ điển `"journey"` trong `messages/vi.json` và `messages/en.json`, bảo toàn các khóa standby của TV1.

---

## [2026-11-14T11:15:00+07:00] Hoàn thiện Danh mục Dữ liệu Văn hóa Huế, Hộ Chiếu Di Sản, Quiz Tương Tác & Đổi Quà (TV3)

- **Người thực hiện:** TV3 (Danh mục văn hóa, Hộ chiếu & Quiz — nhánh `HuyVLT/Passport`)
- **Tác vụ hoàn thành:**
  1. Biên khảo và nhập liệu chuẩn xác 11 địa điểm làng nghề, di tích, cổ tự, ẩm thực và cảnh quan Cố đô Huế trong `public/data/places.json` kèm bộ 11 ảnh chụp thực tế tại `public/images/places/*.jpg`, ảnh dự phòng `fallback-place.svg` và module truy cập `src/data/places.ts`.
  2. Xây dựng module lưu trữ cục bộ `src/services/storage.ts` quản lý khóa `soulvillage.passport.v1`, khởi tạo `userId` duy nhất, tích hợp đọc số lượng hành trình từ `loadSavedJourneys()` (`src/services/journeyStorage.ts`), tự động mở khóa 4 huy hiệu văn hóa và hỗ trợ đổi điểm lấy phiếu quà làng nghề (`redeemPassportReward` không làm mất huy hiệu đã mở).
  3. Tạo ngân hàng 6 câu hỏi trắc nghiệm văn hóa gắn với `placeId` thực tế trong `src/features/passport/data/questions.ts` kèm hoạt cảnh thủ công tương tác riêng `src/features/passport/components/QuizCraftScene.tsx` (hỗ trợ song ngữ VI/EN).
  4. Xây dựng giao diện `src/features/passport/PassportPage.tsx` tuân thủ 100% `HoaLang UI Rule v1.0`, đồng bộ ngôn ngữ với `LocaleProvider` và điều hướng liền mạch sang `/places/:id` (TV1) và `/journey` (TV2).
  5. Cập nhật từ điển song ngữ `messages/vi.json` và `messages/en.json` cho phân hệ `passport`.
