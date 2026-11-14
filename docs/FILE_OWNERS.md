# Phân Quyền Sở Hữu File (File Ownership Matrix)

**Dự án:** SoulVillage × HoaLang  
**Nguyên tắc:** Quyền sửa là quyền thay đổi nội dung, đổi tên hoặc xóa file. Mọi thành viên đều được phép đọc và `import` file của thành viên khác theo đúng hợp đồng `docs/TEAM_CONTRACTS.md`. TV1 chỉ khởi tạo khung nối trong bước setup trước tín hiệu `READY`; sau `READY`, không ai tự ý sửa vùng file của người khác nếu chưa có bàn giao rõ ràng.

---

## 1. Bảng Phân Quyền Sau Tín Hiệu `READY`

| Chủ sở hữu | Vai trò | Danh sách file / thư mục được phép sửa sau `READY` |
| :--- | :--- | :--- |
| **TV1** | Trưởng nhóm, Explore, PlaceDetail, Design System & Cloud Run | `server.js`; `Dockerfile`; `.dockerignore`; `.gcloudignore`; `package.json`; `package-lock.json`; `vite.config.ts`; `tsconfig*.json`; `.github/`; `.gitignore`; `.env.example`; `index.html`; `README.md`; `docs/*.md` (ở gốc `docs/`); `src/App.tsx`; `src/main.tsx`; `src/index.css`; `src/App.css`; `src/types/`; `src/lib/`; `src/components/` (`Navbar`, `Footer`, `Layout`, `src/components/shared/`); `src/features/explore/`; `src/features/places/`; `src/services/api.ts`; `src/assets/`; `public/` (trừ `public/data/` và `public/images/places/`); `scripts/integration/`; `tailwind.config.*`; `messages/*.json` (cấu trúc chung); `FRONTEND_LOG.md`; `BACKEND_LOG.md`. |
| **TV2** | Hành trình cá nhân hóa Gemini AI | `src/features/journey/`; `src/services/journeyApi.ts`; `src/services/journeyStorage.ts`; `server/features/journey/`; `docs/team2/`; cập nhật chuỗi dịch i18n phần Journey trong `messages/*.json`; ghi nhận vào `FRONTEND_LOG.md` / `BACKEND_LOG.md`. |
| **TV3** | Danh mục văn hóa Huế, Hộ chiếu & Quiz | `public/data/`; `public/images/places/`; `src/data/places.ts`; `src/features/passport/`; `src/services/storage.ts`; `server/features/catalog/`; `docs/team3/`; cập nhật chuỗi dịch i18n phần Passport & Quiz trong `messages/*.json`; ghi nhận vào `FRONTEND_LOG.md` / `BACKEND_LOG.md`. |

---

## 2. Quy Tắc Phối Hợp & Tích Hợp Nhánh

1. **Nguồn dữ liệu địa điểm duy nhất:** `public/data/places.json` thuộc quyền biên tập của TV3. TV1 và TV2 không tạo danh mục địa điểm hardcode riêng.
2. **Quản lý phụ thuộc & kiểu dữ liệu:** `package.json`, `package-lock.json` và `src/types/*` do TV1 quản lý. Nếu TV2 hoặc TV3 cần bổ sung dependency hoặc thay đổi interface, phải thông báo để TV1 cập nhật và thông báo toàn nhóm.
3. **Thứ tự tích hợp nhánh vào `main` (chỉ TV1 thực hiện):**
   - Bước 1: Merge nhánh catalog của TV3 (`server/features/catalog/`, `public/data/places.json`).
   - Bước 2: Merge nhánh backend & UI Journey của TV2 (`server/features/journey/`, `src/features/journey/`).
   - Bước 3: Merge nhánh Passport & Quiz của TV3 (`src/features/passport/`, `src/services/storage.ts`).
4. **Kiểm tra bắt buộc ở mỗi cổng merge:**
   - `npm run build`
   - `npm run lint`
   - `node --check server.js`
   - Tuyệt đối không `force-push` lên `main` hoặc ghi đè công việc của thành viên khác.
