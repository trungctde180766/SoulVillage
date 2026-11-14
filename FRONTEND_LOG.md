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
