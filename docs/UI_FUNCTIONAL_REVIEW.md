# Đánh giá UI, chức năng và khả năng triển khai

Ngày kiểm tra: 14/11/2026. Phạm vi: source hiện tại, bản build production và trình duyệt desktop/mobile 360px, 390px. Workspace có thay đổi đăng nhập và nội dung được thực hiện song song; các thay đổi đó được giữ nguyên.

## Nhận xét giao diện

Màu giấy ấm, nâu đậm, đỏ sơn mài và typography tạo được bản sắc phù hợp chủ đề di sản Huế. Bố cục danh mục có phân cấp rõ, trang chi tiết có câu chuyện, nguồn tham khảo và thời lượng tham quan. Tìm kiếm không dấu `gom` tìm được địa điểm gốm Phước Tích.

Các cải thiện nên ưu tiên:

- Dùng ảnh đúng địa điểm và ghi nguồn ảnh. Ảnh stock hiện tại chỉ mang tính minh họa; không nên khiến người xem hiểu đó là ảnh thực địa.
- Hoàn thiện bản dịch nội dung địa điểm: chế độ EN hiện dịch tên và nhãn UI, nhưng phần mô tả, câu chuyện, lời khuyên và tags vẫn bằng tiếng Việt.
- Tăng độ tương phản của caption, nhãn nhỏ và badge trên ảnh tối; giảm mật độ chữ in hoa trên mobile.
- Giảm chiều cao phần mở đầu trên điện thoại để người dùng thấy địa điểm sớm hơn.
- Thêm nút mở chỉ đường bằng tọa độ và các thông tin thực dụng có nguồn kiểm chứng như giờ mở cửa, giá tham quan.

## Hai lỗi đã sửa trong đợt đánh giá

1. **Menu mobile bị cắt ở 360px.** Thu gọn logo trên mobile, ẩn badge thương hiệu phụ, giữ các nút điều hướng không co và chuyển sang menu mobile trước breakpoint desktop. Kiểm tra VI/EN ở 360px: cạnh phải nút menu là 332px, nằm trong vùng nội dung 352px.
2. **Liên kết trực tiếp mở sai trang.** Trước đây `/journey?placeId=...` đổi URL thành hash sau khi router đã khởi tạo nhưng vẫn hiện trang Khám phá. Chuyển chuẩn hóa URL sang `src/main.tsx`, trước khi mount React. Đã xác nhận trình duyệt mở đúng Hành trình và giữ `placeId`.

## Chức năng hiện tại và điểm còn thiếu

| Hạng mục | Kết quả kiểm tra |
| --- | --- |
| Khám phá, tìm kiếm, lọc, chi tiết | Có UI và dữ liệu dự phòng phía client |
| `GET /api/places` | HTTP 501; `public/data/places.json` vẫn rỗng |
| Hành trình Gemini | API HTTP 501; trang hiển thị trạng thái đang chuẩn bị |
| Hộ chiếu và Quiz | Chưa có module giao diện hoàn chỉnh; `/api/passport` HTTP 501 là trạng thái theo hợp đồng MVP backend |
| Đăng ký, đăng nhập, xác thực token | Bộ kiểm tra tích hợp đã qua, nhưng dữ liệu tài khoản chỉ nằm trong RAM server |
| Chuyển VI/EN | Có; nội dung văn hóa chưa dịch đầy đủ |

Trước khi dùng cho người dùng thật cần xử lý:

- **Mật khẩu dạng rõ trong localStorage:** `src/lib/auth.ts` lưu `passwordPlain` ngay cả sau đăng ký thành công qua API. Cần loại bỏ kho mật khẩu phía client và cơ chế tự đăng ký lại khi server mất dữ liệu.
- **Lưu trữ tài khoản:** các `Map` trong router auth không bền vững khi Cloud Run restart, scale về 0 hoặc chạy nhiều instance. Cần MongoDB/Firestore hoặc nhà cung cấp xác thực phù hợp.
- **Khóa ký token mặc định trong source:** khi deploy phải cung cấp `AUTH_TOKEN_SECRET` ngẫu nhiên bằng Secret Manager; không dùng giá trị mặc định.
- **Dữ liệu dự phòng che lỗi API:** lỗi mạng, HTTP 501 và dữ liệu rỗng có thể đều trả dữ liệu mẫu. Cần phân biệt trạng thái lỗi, chưa có dữ liệu và chế độ xem trước trên UI.
- **Kiểm tra tích hợp chưa chứng minh MVP hoàn thiện:** script hiện chấp nhận 501. Cần thêm cổng kiểm tra production yêu cầu API địa điểm và hành trình trả kết quả đúng sau khi tích hợp các module.

## Xác minh kỹ thuật

- `npm run build`: qua; Vite cảnh báo JavaScript chunk khoảng 607 kB trước gzip. Nên tách trang theo route khi các module hoàn chỉnh.
- `npm run lint`: qua.
- `node --check server.js`: qua.
- `node scripts/integration/verify-integration.mjs`: qua, bao gồm đăng ký, đăng nhập, token, health, malformed JSON, API 404 và SPA.
- Docker engine trên máy chưa chạy; chưa xác minh container local.
- Server hiện lắng nghe `0.0.0.0` và biến `PORT`, có Dockerfile multi-stage: phù hợp mô hình Cloud Run.

Project triển khai người dùng đã chỉ định: `booca-471111`; người dùng xác nhận đã bật Billing. Việc deploy phải được xác nhận bằng revision sẵn sàng, URL dịch vụ và health check từ xa; có Dockerfile hoặc build local thành công chưa có nghĩa đã deploy.
