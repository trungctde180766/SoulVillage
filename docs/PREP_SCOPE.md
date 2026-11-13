# 📋 Báo Cáo Phạm Vi Chuẩn Bị (PREP Scope Report) — Hồn Làng (SoulVillage)

> **Mục đích:** Tài liệu minh bạch hóa phạm vi mã nguồn starter kit phục vụ việc đối chiếu với Ban Tổ Chức và Ban Giám Khảo cuộc thi Hackathon GDG DevFest MienTrung 2026.

---

## A. Những phần đã có trước lần rút gọn này (Đã được gỡ bỏ hoàn toàn)
Trước khi thực hiện rút gọn về bản starter tối giản, repository đã có các chức năng nghiệp vụ sau:
1. **Dữ liệu văn hóa hoàn chỉnh:** 4 địa điểm văn hóa Huế mẫu (Làng nón Tây Hồ, Làng hương Thủy Xuân, Đại Nội Huế, Chùa Thiên Mụ) đi kèm câu chuyện lịch sử, kỹ nghệ làng nghề, mẹo bản xứ và nguồn trích dẫn.
2. **Logic Gemini AI Journey:** Prompt kỹ thuật cao sinh hành trình du lịch, code bóc tách JSON và bộ fallback lịch trình tuyển chọn dựng sẵn.
3. **Logic Cultural Passport & Quiz:** Câu hỏi trắc nghiệm văn hóa làng nón, kiểm tra đáp án đúng/sai, cộng điểm (+50) và tự động mở khóa huy hiệu.
4. **Logic MongoDB Atlas nghiệp vụ:** Endpoint đọc/ghi tiến độ người dùng vào collection `passports`.
5. **Logic lọc & Bản đồ tương tác:** Bộ lọc danh mục theo trạng thái và tọa độ ghim địa điểm dọc sông Hương.

---

## B. Những phần CÒN GIỮ trong Starter Kit hiện tại
Bản starter kit hiện tại chỉ giữ lại bộ khung kỹ thuật (technical skeleton) và giao diện khung:
1. **Bộ khung công nghệ:** React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router (HashRouter).
2. **Cấu hình dự án:** `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`.
3. **Thành phần giao diện dùng chung:**
   - Theme màu sắc bản sắc Việt: Xanh ngọc bích, Kem ấm, Cam đất cố đô.
   - Layout tổng thể: Navbar (gắn nhãn *Prep Skeleton*), Footer, Layout wrapper.
   - Components UI tái sử dụng: `Button`, `Card`, `Badge`.
4. **Các trang ở trạng thái Placeholder (Khung hiển thị):**
   - `ExplorePage`: Khung danh sách địa điểm (rỗng), khung FilterBar và khung CultureMap với nhãn ghi rõ *"Chưa triển khai"*.
   - `PlaceDetailPage`: Trang thông báo chi tiết địa điểm chưa triển khai.
   - `JourneyPage`: Form nhập sở thích; nút kiểm tra gọi API trả về HTTP 501.
   - `PassportPage`: Khung hiển thị hồ sơ cá nhân (0 điểm, 0 huy hiệu); khu vực quiz và huy hiệu ở dạng khung chờ.
5. **Cấu hình Backend & Cloud Run:**
   - Node.js server tối giản (`server.js`) sử dụng Express: phục vụ thư mục `dist/` và endpoint `GET /api/health` trả về HTTP 200.
   - Các route nghiệp vụ `/api/itinerary`, `/api/places`, `/api/passport` trả về **HTTP 501 (Not Implemented)** kèm thông báo JSON rõ ràng.
   - Multi-stage `Dockerfile` và `.dockerignore` chuẩn bị cho Google Cloud Run.
6. **Thư viện phụ thuộc:** Đã cài sẵn SDK `@google/genai`, `mongodb`, `express` để sẵn sàng kết nối trong giờ thi.

---

## C. Những phần PHẢI XÂY DỰNG TRONG GIỜ THI (BUILD MODE - 270 phút)
Toàn bộ giá trị nghiệp vụ của sản phẩm dự thi sẽ được hiện thực trong thời gian thi:
1. **Nghiên cứu & Thẩm định dữ liệu:** Thu thập, kiểm chứng nguồn và nhập dữ liệu 8–12 địa điểm văn hóa Huế thật vào `src/data/places.ts`.
2. **Prompt Engineering & Gemini API:** Thiết kế prompt chuyên sâu cho Gemini 2.5 Flash, tối ưu tham số nhiệt độ (temperature), xây dựng parser JSON an toàn và cơ chế fallback khi nghẽn mạng.
3. **Nghiệp vụ Explore & Bộ lọc:** Viết logic tìm kiếm toàn văn, lọc theo thể loại và tích hợp bản đồ tương tác.
4. **Hệ thống Tri thức & Passport:** Soạn thảo ngân hàng câu hỏi trắc nghiệm văn hóa, logic chấm điểm, quy tắc cấp huy hiệu và giao diện tương tác quiz.
5. **Tích hợp MongoDB Atlas:** Xây dựng schema, logic lưu trữ tiến độ người dùng và đồng bộ dữ liệu.
6. **Triển khai Production Cloud Run:** Build Docker container image, đẩy lên Google Artifact Registry và cấu hình Cloud Run service.

---

## D. Điểm Cần Ban Tổ Chức (BTC) Xác Nhận Về Giới Hạn 30%
1. **Quy định từ slide BTC:** *"Dự án có sẵn chỉ được hoàn thiện tối đa 30%"*.
2. **Thực tế:** Hiện chưa có công thức định lượng chính thức từ BTC về việc tính 30% dựa trên:
   - Số dòng code (LOC)?
   - Số lượng chức năng (Features/Use-cases)?
   - Hay tỷ lệ hoàn thiện giao diện (UI)?
3. **Hành động của nhóm:** Nhóm đã chủ động gỡ bỏ 100% logic nghiệp vụ AI, 100% dữ liệu văn hóa thật, 100% logic tính điểm quiz và đưa toàn bộ API về HTTP 501. Nhóm **không tự khẳng định** bản starter này chắc chắn đạt đúng tỷ lệ 30% mà sẽ chủ động xuất trình tài liệu này cho Ban Giám khảo tại bàn kiểm tra trước giờ thi để xin xác nhận chính thức.
