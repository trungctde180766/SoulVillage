# Quy Định Cuộc Thi GDG DevFest MienTrung 2026 & Hướng Dẫn Starter Kit

Tài liệu này tổng hợp các quy định từ Ban Tổ Chức (đối chiếu theo hình ảnh thể lệ chính thức) và hướng dẫn tuân thủ cho nhóm.

---

## 1. Yêu Cầu Chính Thức Từ Ban Tổ Chức (Hình ảnh thể lệ)
1. **Giới hạn mã nguồn có sẵn:**
   - Dự án chuẩn bị trước chỉ được hoàn thiện **tối đa 30%**.
   - Không được mang theo mã nguồn tính năng nghiệp vụ hoàn chỉnh vào phòng thi.
2. **Yêu cầu công nghệ Google cốt lõi:**
   - Tối thiểu phải gọi **Google Gemini API**.
   - Bắt buộc phải triển khai ứng dụng lên **Google Cloud Run**.
3. **Quy trình làm việc & nộp bài:**
   - Bắt buộc dùng Git, commit và push tiến độ liên tục trong suốt 270 phút thi đấu.
   - Nộp toàn bộ mã nguồn qua đường dẫn GitHub repository.
4. **Định hướng phát triển:**
   - Tập trung ưu tiên các tính năng chính (Core MVP).

---

## 2. Chiến Lược Thực Hiện Của Đội Trong Giai Đoạn PREP
Để đảm bảo an toàn tuyệt đối và tôn trọng thể lệ thi đấu:
- Đội đã chủ động đưa mã nguồn về trạng thái **Starter Skeleton Tối Giản**.
- **Đã gỡ bỏ 100%:** Dữ liệu văn hóa thật, prompt AI hoàn chỉnh, thuật toán sinh lịch trình, ngân hàng câu hỏi quiz, logic cộng điểm và cấp huy hiệu.
- **Toàn bộ API nghiệp vụ:** Trả về mã lỗi **HTTP 501 (Not Implemented)** kèm thông báo rõ ràng, không sử dụng mock dữ liệu giả thành công.
- **Minh bạch hóa:** Tạo file `docs/PREP_SCOPE.md` để trình bày rõ ràng với Ban Giám khảo tại bàn kiểm tra trước khi tính giờ thi.
