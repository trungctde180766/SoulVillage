# Quy định Hackathon GDG DevFest MienTrung 2026 & Hướng dẫn PREP Code

## 1. Thông tin chung
- **Sự kiện:** GDG DevFest MienTrung Hackathon 2026
- **Địa điểm:** Grand Tourane Hotel, Đà Nẵng
- **Thời gian diễn ra:** 14/11/2026 (Thời lượng thi thực tế: 4 giờ 30 phút = 270 phút)
- **Dự án:** Hồn Làng (SoulVillage) — Bản đồ văn hóa sống của Việt Nam

---

## 2. Nguyên tắc An toàn trong Giai đoạn PREP (Chuẩn bị trước giờ thi)

> [!IMPORTANT]
> **Quy định đạo đức thi đấu & Thể lệ Hackathon:**
> Tuyệt đối không tự suy đoán rằng Ban tổ chức cho phép sử dụng mã nguồn tính năng nghiệp vụ đã được viết trước. 
> Toàn bộ logic chính, nội dung AI, quiz và dữ liệu địa điểm văn hóa phải được hiện thực TRONG 270 phút thi đấu chính thức.

### ✅ Những nội dung ĐƯỢC PHÉP chuẩn bị trước:
1. **Môi trường & Công cụ:**
   - Cài đặt Node.js LTS, Git, IDE (Antigravity), terminal sẵn sàng.
   - Kiểm tra tài khoản GitHub, Vercel, Google AI Studio (Gemini API key), MongoDB Atlas.
2. **Kiến trúc & Khung sườn (Skeleton Starter):**
   - Cấu trúc thư mục chuẩn modular (`components`, `features`, `services`, `types`, `api`).
   - Cấu hình dự án: `package.json`, `tsconfig.json`, `tailwind.config.js`, `vite.config.ts`.
   - CI/CD workflow trên GitHub Actions (`.github/workflows/ci.yml`) để kiểm tra build và lint.
   - Cấu hình serverless deployment trên Vercel (`vercel.json`).
   - Cấu trúc kết nối cơ sở dữ liệu MongoDB Atlas (connection pooling & caching pattern cho serverless).
   - Khung giao diện UI tĩnh với các vị trí placeholder, layout, theme màu sắc văn hóa (Navbar, Footer, Layout).
3. **Kế hoạch & Tài liệu:**
   - `SETUP.md`: Hướng dẫn thiết lập môi trường cho toàn đội.
   - `BUILD_DAY.md`: Lộ trình chi tiết 270 phút theo từng Milestone (M1 -> M6).
   - `API_CHECKLIST.md`: Hướng dẫn kiểm tra Gemini API và MongoDB an toàn.
   - `COMPETITION_RULES.md`: Tài liệu này.

---

### ❌ Những nội dung TUYỆT ĐỐI KHÔNG làm trước (Phải thực hiện trong giờ thi):
1. **Không tạo sẵn nội dung AI hoàn chỉnh:**
   - Không code trước prompt hoàn chỉnh sinh hành trình văn hóa.
   - Không lưu trữ sẵn kết quả sinh của Gemini để giả mạo real-time.
2. **Không code sẵn hệ thống dữ liệu văn hóa thật:**
   - Không nạp sẵn cơ sở dữ liệu hoàn chỉnh 8–12 địa điểm văn hóa Huế trước khi bắt đầu.
3. **Không hoàn thiện trước tính năng Cultural Passport & Quiz:**
   - Logic chấm điểm, câu hỏi quiz và cấp huy hiệu phải được code trong giờ thi.
4. **Không mock API rồi giả mạo là AI thật:**
   - Dự án phải tích hợp Gemini SDK chính thống và gọi trực tiếp (kèm fallback an toàn phòng khi mất mạng hoặc hết quota).
5. **Không hardcode bất kỳ API Key hay Secret nào:**
   - Toàn bộ secret (`GEMINI_API_KEY`, `MONGODB_URI`) phải nạp qua biến môi trường bí mật.

---

## 3. Checklist Tuân thủ Thể lệ
- [x] Đã cô lập repository độc lập trên GitHub (`SoulVillage.git`).
- [x] Đã cấu hình `.gitignore` loại trừ `.env`, `.env.local`, `node_modules/`.
- [x] Đã thiết lập cấu trúc serverless `/api` gọi Gemini & MongoDB từ backend, không lộ key ra frontend.
- [x] Toàn bộ thành viên nắm rõ mốc thời gian và nhiệm vụ từng milestone.
