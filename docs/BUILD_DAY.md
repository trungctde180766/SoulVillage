# Kế Hoạch 270 Phút Ngày Thi Hackathon — Hồn Làng (SoulVillage)

> **Sự kiện:** GDG DevFest MienTrung Hackathon 2026  
> **Địa điểm:** Grand Tourane Hotel, Đà Nẵng | Ngày thi: 14/11/2026  
> **Thời lượng:** 4 giờ 30 phút (270 phút)  
> **Mục tiêu:** Phát triển hoàn chỉnh tính năng cốt lõi trên nền Starter Kit tối giản, tích hợp Google Gemini API và triển khai lên Google Cloud Run.

---

## 1. Nguyên Tắc Cốt Lõi Từ Ban Tổ Chức
1. **Giới hạn 30%:** Starter kit chỉ giữ khung sườn kỹ thuật và placeholder; toàn bộ nghiệp vụ thực tế (nội dung, prompt AI, logic điểm, dữ liệu) bắt buộc xây dựng trong 270 phút này.
2. **Yêu cầu Google bắt buộc:** Tối thiểu phải gọi **Google Gemini API** và triển khai trên **Google Cloud Run**.
3. **Commit liên tục:** Push tiến độ liên tục lên GitHub để Ban Giám khảo theo dõi lịch sử commit trong giờ thi.

---

## 2. Lộ Trình 270 Phút Chi Tiết (Milestones M1 – M6)

| Milestone | Thời lượng | Mốc thời gian | Mục tiêu chính |
| :--- | :--- | :--- | :--- |
| **M1: Khởi Động & Xác Nhận BTC** | 10 phút | 00:00 – 00:10 | Xuất trình [PREP_SCOPE.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/PREP_SCOPE.md) xin xác nhận starter kit, kiểm tra mạng, phân vai |
| **M2: Nhập Dữ Liệu & Hoàn Thiện Explore** | 60 phút | 00:10 – 01:10 | Nhập 8-12 địa điểm văn hóa Huế, hoàn thiện FilterBar và hiển thị danh sách |
| **M3: Trang Chi Tiết & Câu Chuyện Văn Hóa** | 45 phút | 01:10 – 01:55 | Lập trình PlaceDetailPage, câu chuyện làng nghề, đối chiếu nguồn lịch sử |
| **M4: Tích Hợp Google Gemini API** | 65 phút | 01:55 – 03:00 | Viết Prompt Engineering, gọi Gemini 2.5 Flash, xử lý timeline và fallback |
| **M5: Hộ Chiếu Văn Hóa, Quiz & MongoDB** | 35 phút | 03:00 – 03:35 | Xây dựng ngân hàng câu hỏi quiz, chấm điểm, cấp huy hiệu, lưu vào MongoDB |
| **M6: Deploy Cloud Run & Luyện Tập Demo** | 55 phút | 03:35 – 04:30 | Build container, deploy Google Cloud Run, smoke test live và tập dượt pitch |

---

## 3. Nội Dung Từng Milestone & Tiêu Chí Nghiệm Thu

### 🎯 Milestone 1: Khởi Động & Xác Nhận Starter Kit (00:00 – 00:10 | 10 phút)
* **Việc cần làm:**
  1. Gặp đại diện BTC / Ban Giám khảo trình bày tài liệu `docs/PREP_SCOPE.md` để xác nhận starter kit hợp lệ trước khi bắt đầu.
  2. Tạo nhánh làm việc: `git checkout -b feature/hackathon-build`.
  3. Kiểm tra biến môi trường `.env.local` (`GEMINI_API_KEY`, `MONGODB_URI`).
* **Tiêu chí nghiệm thu:** Nhánh làm việc sẵn sàng, BTC phê duyệt starter kit.

---

### 🎯 Milestone 2: Dữ Liệu Văn Hóa & Trang Explore (00:10 – 01:10 | 60 phút)
* **Việc cần làm:**
  1. Nhập danh mục 8–12 địa điểm văn hóa Huế có nguồn kiểm chứng vào `src/data/places.ts`.
  2. Viết logic tìm kiếm và lọc danh mục trong `src/features/explore/FilterBar.tsx`.
  3. Render danh sách thẻ địa điểm thực tế trên `src/features/explore/ExplorePage.tsx`.
* **Tiêu chí nghiệm thu:** Tìm kiếm và lọc theo danh mục hoạt động mượt mà với dữ liệu thật.

---

### 🎯 Milestone 3: Trang Chi Tiết & Câu Chuyện Văn Hóa (01:10 – 01:55 | 45 phút)
* **Việc cần làm:**
  1. Xây dựng trang chi tiết `src/features/places/PlaceDetailPage.tsx`.
  2. Trình bày nội dung câu chuyện lịch sử, quy trình làng nghề thủ công, các mẹo bản xứ.
  3. Bổ sung mục nguồn trích dẫn lịch sử minh bạch.
* **Tiêu chí nghiệm thu:** Bấm vào thẻ địa điểm chuyển hướng đúng và hiển thị chi tiết câu chuyện.

---

### 🎯 Milestone 4: Tích Hợp Google Gemini API Cốt Lõi (01:55 – 03:00 | 65 phút)
> [!IMPORTANT]
> **Yêu cầu Google cốt lõi:** Tính năng cá nhân hóa hành trình bằng Google Gemini API.

* **Việc cần làm:**
  1. Hoàn thiện serverless / backend endpoint `/api/itinerary`:
     - Nhận các tham số sở thích, thời gian và điểm xuất phát.
     - Sử dụng SDK `@google/genai` gọi model `gemini-2.5-flash`.
     - Prompt Engineering: Yêu cầu Gemini trả về cấu trúc JSON chặng dừng, lời khuyên văn hóa và ước tính thời gian.
     - Xử lý parser JSON và cơ chế fallback an toàn phòng trường hợp mạng yếu hoặc hết quota.
  2. Hiển thị timeline lịch trình sinh ra trên `src/features/journey/JourneyPage.tsx`.
* **Tiêu chí nghiệm thu:** Bấm tạo hành trình nhận được lịch trình văn hóa cá nhân hóa hợp lý từ Gemini API dưới 5 giây.
* **Quy tắc dừng sống còn:** Nếu tới phút 03:00 mà kết nối API chưa ổn định, kích hoạt ngay fallback thông minh và chuyển sang M5, không sa đà làm trễ hạn nộp.

---

### 🎯 Milestone 5: Hộ Chiếu Văn Hóa, Quiz & MongoDB (03:00 – 03:35 | 35 phút)
* **Việc cần làm:**
  1. Xây dựng ngân hàng câu hỏi mini quiz về di sản Huế trong `src/features/passport/PassportPage.tsx`.
  2. Viết logic kiểm tra đáp án, cộng điểm thưởng (+50 điểm) và cấp huy hiệu.
  3. Kết nối MongoDB Atlas (hoặc localStorage) để lưu tiến độ người dùng qua `/api/passport`.
* **Tiêu chí nghiệm thu:** Trả lời đúng quiz được cộng điểm và hiển thị huy hiệu mở khóa.

---

### 🎯 Milestone 6: Triển Khai Google Cloud Run & Luyện Tập Demo (03:35 – 04:30 | 55 phút)
> [!IMPORTANT]
> **Yêu cầu Google bắt buộc:** Triển khai sản phẩm lên Google Cloud Run.

* **Việc cần làm:**
  1. Build Docker image và deploy lên Google Cloud Run:
     ```bash
     gcloud run deploy soulvillage --source . --region asia-southeast1 --allow-unauthenticated
     ```
  2. Smoke test toàn diện trên URL Cloud Run trực tiếp (điện thoại và máy chiếu).
  3. Kiểm tra endpoint `GET /api/health` trả về HTTP 200.
  4. Luyện tập kịch bản thuyết trình (Pitch) 3-5 phút:
     - 1 phút: Vấn đề bảo tồn văn hóa & làng nghề.
     - 2 phút: Live Demo (Explore -> Gemini AI Journey -> Hộ chiếu di sản).
     - 1 phút: Kiến trúc công nghệ Google (Gemini API 2.5 Flash + Google Cloud Run).
     - 1 phút: Hỏi đáp với Ban Giám khảo.
