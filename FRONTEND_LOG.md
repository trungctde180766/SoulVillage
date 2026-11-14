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
