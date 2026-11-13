# Kế Hoạch 270 Phút Ngày Thi Hackathon — Hồn Làng (SoulVillage)

> **Sự kiện:** GDG DevFest MienTrung Hackathon 2026  
> **Thời lượng:** 4 giờ 30 phút (270 phút)  
> **Mục tiêu:** Xây dựng hoàn chỉnh MVP "Hồn Làng — Bản đồ văn hóa sống của Việt Nam" với Gemini AI cá nhân hóa hành trình và lưu trữ tiến độ qua MongoDB / LocalStorage.

---

## Tổng quan Lộ trình Thời gian (Timeline)

| Milestone | Thời lượng | Mốc thời gian | Mục tiêu chính |
| :--- | :--- | :--- | :--- |
| **M1: Kickoff & Verify** | 10 phút | 00:00 – 00:10 | Kiểm tra starter, môi trường, network, phân công vai trò |
| **M2: Data & Explore** | 60 phút | 00:10 – 01:10 | Nhập dữ liệu 8-12 địa điểm Huế, bộ lọc văn hóa, card grid, map UI |
| **M3: Culture Story** | 45 phút | 01:10 – 01:55 | Trang chi tiết địa điểm, câu chuyện, làng nghề, nguồn trích dẫn |
| **M4: Gemini AI Journey**| 65 phút | 01:55 – 03:00 | Serverless `/api/itinerary`, Gemini AI prompt, JSON parser, fallback |
| **M5: Passport & Quiz** | 35 phút | 03:00 – 03:35 | Quiz văn hóa, hệ thống huy hiệu, lưu tiến độ MongoDB / localStorage |
| **M6: Deploy & Demo** | 55 phút | 03:35 – 04:30 | Deploy Vercel, smoke test production, tập dượt thuyết trình (pitch) |

---

## Chi tiết Từng Milestone

### 🎯 Milestone 1: Khởi Động & Kiểm Tra Môi Trường (00:00 – 00:10 | 10 phút)
- **Công việc cụ thể:**
  1. Họp nhanh 2 phút chốt vai trò: 1 Lead / Frontend, 1 Backend / Gemini AI, 1 Content / QA / Pitch.
  2. Kéo code mới nhất từ GitHub repo, chạy `npm install` và `npm run dev`.
  3. Kiểm tra biến môi trường `.env.local`: `GEMINI_API_KEY` và `MONGODB_URI`.
  4. Thực hiện 1 lệnh ping thử nghiệm tới Google AI Studio và MongoDB Atlas để kiểm tra internet khách sạn có bị chặn/chậm không.
- **File dự kiến cần sửa:** `.env.local`, `docs/API_CHECKLIST.md`.
- **Tiêu chí nghiệm thu:**
  - `npm run dev` khởi động thành công, hiển thị trang chủ starter.
  - Test ping Gemini API trả về HTTP 200.
- **Cách kiểm tra lỗi:**
  - Nếu port 5173 bị xung đột: Chạy `npm run dev -- --port 3000`.
  - Nếu mạng khách sạn chặn Google AI Studio: Bật ngay 4G Hotspot dự phòng.
- **Phương án dự phòng:** Chuyển sang 4G cá nhân nếu wifi chập chờn.
- **Điều kiện dừng:** Hết 10 phút bắt buộc chuyển sang M2, dù mạng chưa xong cũng giao 1 người xử lý mạng, người khác code dữ liệu.

---

### 🎯 Milestone 2: Dữ Liệu Văn Hóa & Trang Explore (00:10 – 01:10 | 60 phút)
- **Công việc cụ thể:**
  1. Tạo file dữ liệu chuẩn `src/data/places.ts` gồm 8–12 địa điểm đặc sắc tại Huế (Đại Nội, Chùa Thiên Mụ, Làng nón Tây Hồ, Làng hương Thủy Xuân, Làng đúc đồng Phường Đúc, v.v.).
  2. Bổ sung trường dữ liệu: ID, tên, loại hình (Làng nghề, Di tích, Ẩm thực, Tâm linh), tọa độ, thời gian tham quan ước tính, mô tả ngắn, hình ảnh, tags.
  3. Hoàn thiện bộ lọc (Category Filter) và thanh tìm kiếm tại `src/features/explore/FilterBar.tsx`.
  4. Hoàn thiện Grid hiển thị danh sách thẻ địa điểm `src/features/explore/PlaceCard.tsx`.
  5. Cập nhật giao diện bản đồ trực quan (Interactive Map hoặc SVG Map tương tác).
- **File dự kiến cần sửa:**
  - `src/data/places.ts`
  - `src/types/place.ts`
  - `src/features/explore/ExplorePage.tsx`
  - `src/features/explore/PlaceCard.tsx`
  - `src/features/explore/FilterBar.tsx`
  - `src/features/explore/CultureMap.tsx`
- **Tiêu chí nghiệm thu:**
  - Danh sách hiển thị đầy đủ các địa điểm với hình ảnh đẹp, typography chuẩn.
  - Lọc theo danh mục hoạt động mượt mà, phản hồi tức thì.
  - Click vào thẻ dẫn đúng sang trang chi tiết địa điểm.
- **Cách kiểm tra lỗi:**
  - Kiểm tra broken images (chuẩn bị ảnh fallback SVG hoặc Unsplash reliable CDN).
  - Kiểm tra layout trên cả màn hình Desktop và Mobile (Responsive).
- **Phương án dự phòng:** Nếu không kịp làm map tương tác phức tạp, dùng SVG minh họa sơ đồ các điểm văn hóa với marker clickable.
- **Điều kiện dừng:** Đúng phút 70 (01:10) chuyển sang M3.

---

### 🎯 Milestone 3: Hoàn Thiện Trang Culture Story (01:10 – 01:55 | 45 phút)
- **Công việc cụ thể:**
  1. Xây dựng trang chi tiết địa điểm `src/features/places/PlaceDetailPage.tsx`.
  2. Hiển thị banner lớn, thông tin tổng quan, thời gian mở cửa, địa chỉ.
  3. Xây dựng Tab "Câu Chuyện Văn Hóa" (Historical context & legends).
  4. Xây dựng Tab "Làng Nghề & Trải Nghiệm" (Hands-on cultural experience).
  5. Thêm phần "Nguồn Tham Khảo & Di Sản" (Nguồn uy tín: Trung tâm Bảo tồn Di tích Cố đô Huế, Cục Di sản Văn hóa).
  6. Thêm nút CTA: "Thêm vào Hành Trình Khám Phá".
- **File dự kiến cần sửa:**
  - `src/features/places/PlaceDetailPage.tsx`
  - `src/features/places/StoryTabs.tsx`
  - `src/features/places/ExperienceInfo.tsx`
- **Tiêu chí nghiệm thu:**
  - Đọc được câu chuyện chi tiết, nội dung sâu sắc, không bịa đặt thông tin lịch sử.
  - Nút thêm vào hành trình lưu ID địa điểm vào state / localStorage.
- **Cách kiểm tra lỗi:**
  - Thử mở URL ID không tồn tại -> Hiển thị trang 404/Empty State thân thiện.
- **Phương án dự phòng:** Dùng accordion nếu tabs gặp vấn đề về render.
- **Điều kiện dừng:** Đúng phút 115 (01:55) chuyển sang M4.

---

### 🎯 Milestone 4: Tích Hợp Gemini AI Journey (01:55 – 03:00 | 65 phút)
> [!IMPORTANT]
> **Đây là tính năng cốt lõi (Core AI) quyết định điểm số sáng tạo và công nghệ Google.**

- **Công việc cụ thể:**
  1. Hoàn thiện Serverless Function `/api/itinerary.ts`:
     - Nhận payload: `{ durationHours, interests, startLocation, budget, companion }`.
     - Sử dụng SDK `@google/genai` gọi model `gemini-2.5-flash` (hoặc `gemini-1.5-flash`).
     - Prompt Engineering kỹ thuật cao: Bắt buộc Gemini trả về cấu trúc JSON chuẩn gồm danh sách các chặng (stops), thời gian từng chặng, lý do gợi ý văn hóa, mẹo trải nghiệm bản địa.
     - Validation: Chỉ chọn các địa điểm nằm trong danh sách kiểm chứng của Hồn Làng, tránh AI hallucination.
  2. Xây dựng bộ Fallback thông minh:
     - Nếu Gemini API bị nghẽn/hết quota/mất kết nối, fallback sang thuật toán heuristic ghép lịch trình mẫu thông minh kèm thông báo tinh tế ("Hành trình văn hóa tuyển chọn").
  3. Giao diện người dùng `src/features/journey/JourneyPage.tsx`:
     - Form chọn thời lượng (Buổi sáng 3h, 1 ngày 8h, 2 ngày), sở thích (Ẩm thực, Nghệ thuật, Lịch sử, Check-in trải nghiệm).
     - Hiệu ứng Loading sinh động mang âm hưởng văn hóa truyền thống.
     - Trình bày lịch trình theo dạng Timeline tương tác dọc trực quan.
- **File dự kiến cần sửa:**
  - `api/itinerary.ts`
  - `api/lib/gemini.ts`
  - `src/services/aiService.ts`
  - `src/features/journey/JourneyPage.tsx`
  - `src/features/journey/JourneyForm.tsx`
  - `src/features/journey/TimelineView.tsx`
- **Tiêu chí nghiệm thu:**
  - Bấm "Tạo Hành Trình" -> Gọi `/api/itinerary` -> Hiển thị lịch trình cá nhân hóa dưới 5 giây.
  - Dữ liệu lịch trình hợp lý về mặt địa lý và thời gian di chuyển tại Huế.
  - Fallback kích hoạt mượt mà nếu ngắt mạng hoặc set sai key.
- **Cách kiểm tra lỗi:**
  - Test case: Thử truyền sở thích "Ẩm thực chay & Làng nghề thủ công" -> Kiểm tra kết quả có chứa Chùa Từ Hiếu và Làng hương Thủy Xuân không.
  - Test case lỗi: Giả lập lỗi API xem UI có bị crash màn hình trắng không.
- **Quy tắc dừng sống còn:** Nếu đến mốc 03:00 (180 phút) mà luồng AI chưa chạy được, **DỪNG VIẾT TÍNH NĂNG MỚI**, chuyển ngay sang kích hoạt Fallback chất lượng cao và làm sạch giao diện để giữ app ổn định 100%!

---

### 🎯 Milestone 5: Quiz Văn Hóa & Cultural Passport (03:00 – 03:35 | 35 phút)
- **Công việc cụ thể:**
  1. Xây dựng mini-quiz văn hóa `src/features/passport/CultureQuiz.tsx`:
     - 3–5 câu hỏi tương tác ngắn về văn hóa, làng nghề Huế (Ví dụ: "Làng nón Tây Hồ nổi tiếng với loại nón đặc sắc nào?" -> Nón bài thơ).
     - Hiệu ứng trả lời đúng/sai và lời giải thích văn hóa bổ ích.
  2. Xây dựng Hộ chiếu văn hóa `src/features/passport/PassportPage.tsx`:
     - Hiển thị các Huy hiệu văn hóa đã đạt được ("Nhà Khám Phá Cố Đô", "Đại Sứ Làng Nghề", "Chuyên Gia Ẩm Thực").
     - Thanh tiến độ hoàn thành các thử thách văn hóa.
  3. Tích hợp MongoDB Atlas:
     - Endpoint `/api/passport.ts`: Lưu thông tin tiến độ, điểm số quiz và danh sách huy hiệu của người dùng.
     - Fallback song song vào `localStorage` để trải nghiệm người dùng luôn tức thì không có độ trễ.
- **File dự kiến cần sửa:**
  - `api/passport.ts`
  - `api/lib/mongodb.ts`
  - `src/features/passport/PassportPage.tsx`
  - `src/features/passport/CultureQuiz.tsx`
  - `src/features/passport/BadgeCard.tsx`
- **Tiêu chí nghiệm thu:**
  - Hoàn thành quiz được cộng điểm và mở khóa huy hiệu mới.
  - Tải lại trang (F5) dữ liệu hộ chiếu vẫn được giữ nguyên.
- **Cách kiểm tra lỗi:**
  - Mở tab ẩn danh (Incognito) để kiểm tra luồng người dùng mới.
- **Phương án dự phòng:** Nếu MongoDB kết nối chậm, tự động ghi nhận trực tiếp vào `localStorage`.

---

### 🎯 Milestone 6: Deploy, Kiểm Thử & Luyện Tập Demo (03:35 – 04:30 | 55 phút)
- **Công việc cụ thể:**
  1. Kiểm tra build: `npm run build` không có lỗi TypeScript hay cú pháp.
  2. Push code lên GitHub repo `trungctde180766/SoulVillage`.
  3. Trigger GitHub Actions CI/CD và Vercel Deploy.
  4. Smoke test toàn diện trên URL Vercel Production (`https://soulvillage.vercel.app` hoặc tương tự):
     - Mở bằng điện thoại thật (Mobile view) và máy chiếu.
     - Kiểm tra tốc độ tải trang, font tiếng Việt, ảnh hiển thị.
     - Thử tạo 1 hành trình thực tế trên môi trường live.
  5. Luyện tập kịch bản Demo (Pitch Rehearsal):
     - 1 phút: Nêu vấn đề (Du khách đến Huế thường chỉ biết Đại Nội, bỏ qua chiều sâu làng nghề và câu chuyện văn hóa).
     - 2 phút: Live Demo website (Explore -> Place Story -> Tạo AI Journey bằng Gemini trong 3 giây -> Mở khóa Hộ chiếu văn hóa).
     - 1 phút: Điểm sáng công nghệ (Gemini API 2.5 Flash, MongoDB Atlas, Vercel Serverless, kiến trúc clean/responsive).
     - 1 phút: Tầm nhìn mở rộng (Đà Nẵng, Quảng Nam, toàn quốc).
- **File dự kiến cần sửa:** `README.md`, metadata hiển thị SEO.
- **Tiêu chí nghiệm thu:**
  - URL live truy cập tốt trên điện thoại ban giám khảo.
  - Nhóm trình bày tự tin, không bị vấp trong luồng demo.

