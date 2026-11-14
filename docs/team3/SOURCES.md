# Hồ Sơ Nghiên Cứu & Trích Dẫn Nguồn Dữ Liệu Văn Hóa Huế (TV3)

**Dự án:** Hồn Làng (`SoulVillage × HoaLang`)  
**Thành viên phụ trách:** Thành Viên 03 (Danh mục Văn hóa, Hộ chiếu & Quiz)  
**Nguồn dữ liệu chuẩn (Single Source of Truth):** [`public/data/places.json`](../../public/data/places.json)  
**Quy chuẩn áp dụng:** Hợp đồng Dữ liệu `Contract v1` & `HoaLang UI Rule v1.0`

---

## 1. Tổng Quan Danh Mục Địa Điểm Di Sản

Danh mục bao gồm **11 địa điểm văn hóa, làng nghề truyền thống và di tích tiêu biểu tại Cố đô Huế**, phủ đầy đủ 5 phân nhóm danh mục trong `CulturalCategory` (`craft`, `monument`, `spiritual`, `cuisine`, `nature`) nhằm phục vụ đồng thời trang **Khám Phá Di Sản (TV1)**, bộ máy gợi ý hành trình **Google Gemini 2.5 Flash (TV2)** và hệ thống **Thử Thách Quiz Hộ Chiếu (TV3)**.

| STT | Mã định danh (`id`) | Tên tiếng Việt (`vietnameseName`) | Danh mục (`category`) | Tọa độ (`lat, lng`) | Thời lượng |
| :-- | :--- | :--- | :--- | :--- | :--- |
| 01 | `lang-non-tay-ho` | Làng Nón Tây Hồ | `craft` | `16.4419, 107.6492` | 90 phút |
| 02 | `lang-huong-thuy-xuan` | Làng Hương Thủy Xuân | `craft` | `16.4358, 107.5683` | 75 phút |
| 03 | `lang-gom-phuoc-tich` | Làng Cổ & Gốm Phước Tích | `craft` | `16.6524, 107.3091` | 120 phút |
| 04 | `hoa-giay-thanh-tien` | Làng Hoa Giấy Thanh Tiên | `craft` | `16.5067, 107.5931` | 75 phút |
| 05 | `duc-dong-phuong-duc` | Làng Đúc Đồng Phường Đúc | `craft` | `16.4561, 107.5648` | 75 phút |
| 06 | `tranh-lang-sinh` | Làng Tranh Dân Gian Làng Sình | `craft` | `16.5189, 107.6014` | 60 phút |
| 07 | `dem-bang-pho-trach` | Làng Đệm Bàng Phò Trạch | `craft` | `16.6285, 107.3342` | 60 phút |
| 08 | `dai-noi-hue` | Đại Nội Kinh Thành Huế | `monument` | `16.4697, 107.5786` | 180 phút |
| 09 | `chua-thien-mu` | Chùa Thiên Mụ (Linh Mụ Tự) | `spiritual` | `16.4529, 107.5453` | 60 phút |
| 10 | `khong-gian-am-thuc-vy-da` | Không Gian Ẩm Thực & Trà Thất Vỹ Dạ | `cuisine` | `16.4782, 107.6012` | 90 phút |
| 11 | `doi-vong-canh` | Đồi Vọng Cảnh & Khúc Quanh Sông Hương | `nature` | `16.4275, 107.5594` | 60 phút |

---

## 2. Chi Tiết Nguồn Sử Liệu & Kiểm Chứng Văn Hóa Từng Địa Điểm

### 2.1. Làng Nón Tây Hồ (`lang-non-tay-ho`)
- **Vị trí:** Xã Phú Hồ, Huyện Phú Vang, Thừa Thiên Huế (bên bờ sông Như Ý).
- **Giá trị cốt lõi:** Cái nôi của dòng **nón bài thơ xứ Huế** ra đời vào khoảng năm 1959–1960 do nghệ nhân Bùi Quang Bặc khởi xướng. Quy trình chế tác gồm 15 công đoạn thủ công từ chọn lá nón rừng Nam Đông, sấy, phơi sương, ủi phẳng, chuốt 16 vành tre đến lồng thơ và chằm cước.
- **Nguồn đối chiếu chính thống:**
  - Cổng thông tin điện tử tỉnh Thừa Thiên Huế: https://thuathienhue.gov.vn
  - Sở Du lịch Thừa Thiên Huế (Cẩm nang Làng nghề): https://visithue.vn

### 2.2. Làng Hương Thủy Xuân (`lang-huong-thuy-xuan`)
- **Vị trí:** Đường Huyền Trân Công Chúa, Phường Thủy Xuân, TP. Huế.
- **Giá trị cốt lõi:** Làng nghề hơn 700 năm tuổi hình thành từ thời các chúa Nguyễn, chuyên cung tiến hương trầm cho triều đình và cổ tự. Sử dụng thảo mộc tự nhiên (trầm hương, quế chi, thảo quả, đại hồi, đinh hương) kết dính bằng **bột keo vỏ cây bời lời**.
- **Nguồn đối chiếu chính thống:**
  - Sở Du lịch Thừa Thiên Huế: https://visithue.vn
  - Cục Di sản Văn hóa — Bộ VHTTDL: http://dsvh.gov.vn

### 2.3. Làng Cổ & Gốm Phước Tích (`lang-gom-phuoc-tich`)
- **Vị trí:** Xã Phong Hòa, Huyện Phong Điền, Thừa Thiên Huế (ven sông Ô Lâu).
- **Giá trị cốt lõi:** Thành lập năm 1470 dưới triều vua Lê Thánh Tông, là ngôi làng cổ thứ hai của Việt Nam được công nhận Di tích Quốc gia. Nổi danh với dòng gốm mộc không tráng men hóa học, nung củi nhiệt độ cao đanh chắc như sành và từng là đồ ngự dụng ("om Phước Tích") tiến vua triều Nguyễn.
- **Nguồn đối chiếu chính thống:**
  - Cục Di sản Văn hóa — Hồ sơ Di tích Quốc gia Làng cổ Phước Tích: http://dsvh.gov.vn
  - Cổng thông tin điện tử tỉnh Thừa Thiên Huế: https://thuathienhue.gov.vn

### 2.4. Làng Hoa Giấy Thanh Tiên (`hoa-giay-thanh-tien`)
- **Vị trí:** Xã Phú Mậu, Thành phố Huế, Thừa Thiên Huế.
- **Giá trị cốt lõi:** Làng nghề hơn 300 năm tuổi bên hạ lưu sông Hương. Chế tác hoa giấy thờ cúng theo triết lý Nho học (3 bông chính tượng trưng Tam Cương, 5 bông phụ tượng trưng Ngũ Thường) và hoa sen giấy thanh khiết nhuộm màu thực vật tự nhiên.
- **Nguồn đối chiếu chính thống:**
  - Trung tâm Bảo tồn Di tích Cố đô Huế: https://hueworldheritage.org.vn
  - Sở Du lịch Thừa Thiên Huế: https://visithue.vn

### 2.5. Làng Đúc Đồng Phường Đúc (`duc-dong-phuong-duc`)
- **Vị trí:** Đường Bùi Thị Xuân, Phường Phường Đúc, TP. Huế.
- **Giá trị cốt lõi:** Hình thành từ đầu thế kỷ XVII bởi dòng họ Nguyễn Văn gốc Kinh Bắc. Là công xưởng đúc nên các Bảo vật Quốc gia và Di sản Tư liệu Thế giới như **Đại Hồng Chung chùa Thiên Mụ (1710)**, **Cửu Vị Thần Công (1803)** và **Cửu Đỉnh (1835–1837)**.
- **Nguồn đối chiếu chính thống:**
  - Trung tâm Bảo tồn Di tích Cố đô Huế: https://hueworldheritage.org.vn
  - Cổng thông tin điện tử tỉnh Thừa Thiên Huế: https://thuathienhue.gov.vn

### 2.6. Làng Tranh Dân Gian Làng Sình (`tranh-lang-sinh`)
- **Vị trí:** Thôn Lại Ân, Xã Phú Mậu, Thành phố Huế.
- **Giá trị cốt lõi:** Dòng tranh mộc bản dân gian hơn 450 năm tuổi in từ ván khắc gỗ mít trên nền giấy dó quét điệp (vỏ sò điệp giã nhuyễn trộn hồ nếp) và điểm màu tự nhiên bằng cọ rễ cây dứa dại.
- **Nguồn đối chiếu chính thống:**
  - Cổng thông tin điện tử tỉnh Thừa Thiên Huế: https://thuathienhue.gov.vn
  - Sở Du lịch Thừa Thiên Huế: https://visithue.vn

### 2.7. Làng Đệm Bàng Phò Trạch (`dem-bang-pho-trach`)
- **Vị trí:** Xã Phong Bình, Huyện Phong Điền, Thừa Thiên Huế.
- **Giá trị cốt lõi:** Làng nghề đan lát cỏ bàng hơn 500 năm tuổi tận dụng cây cỏ bàng vùng trũng ngập nước ven sông Ô Lâu, phơi nắng giòn và giã dập bằng chày gỗ trước khi đan thủ công thành đệm và sản phẩm mỹ nghệ sinh thái.
- **Nguồn đối chiếu chính thống:**
  - Cổng thông tin điện tử tỉnh Thừa Thiên Huế: https://thuathienhue.gov.vn
  - Sở Du lịch Thừa Thiên Huế: https://visithue.vn

### 2.8. Đại Nội Kinh Thành Huế (`dai-noi-hue`)
- **Vị trí:** Đường 23/8, Phường Thuận Hòa, Thành phố Huế.
- **Giá trị cốt lõi:** Trung tâm của Quần thể Di tích Cố đô Huế được UNESCO ghi danh Di sản Văn hóa Thế giới năm 1993. Hội tụ đỉnh cao kiến trúc gỗ lim sơn son thếp vàng, kỹ nghệ Pháp lam và khảm sành sứ cung đình triều Nguyễn (1802–1945).
- **Nguồn đối chiếu chính thống:**
  - Trung tâm Bảo tồn Di tích Cố đô Huế: https://hueworldheritage.org.vn
  - UNESCO World Heritage Centre (List #678): https://whc.unesco.org/en/list/678

### 2.9. Chùa Thiên Mụ — Linh Mụ Tự (`chua-thien-mu`)
- **Vị trí:** Đồi Hà Khê, Phường Kim Long, Thành phố Huế.
- **Giá trị cốt lõi:** Khởi lập năm 1601 dưới thời chúa Nguyễn Hoàng, nổi bật với tháp bát giác Phước Duyên 7 tầng cao 21m (xây năm 1844 thời vua Thiệu Trị) và Đại Hồng Chung nặng hơn 2 tấn.
- **Nguồn đối chiếu chính thống:**
  - Trung tâm Bảo tồn Di tích Cố đô Huế: https://hueworldheritage.org.vn
  - UNESCO World Heritage Centre: https://whc.unesco.org/en/list/678

### 2.10. Không Gian Ẩm Thực & Trà Thất Vỹ Dạ (`khong-gian-am-thuc-vy-da`)
- **Vị trí:** Đường Nguyễn Sinh Cung, Phường Vỹ Dạ, Thành phố Huế.
- **Giá trị cốt lõi:** Đại diện cho di sản ẩm thực cung đình và bánh trái dân gian xứ Huế kết hợp văn hóa thưởng trà sen Bách Diệp trong không gian nhà vườn truyền thống Vỹ Dạ.
- **Nguồn đối chiếu chính thống:**
  - Sở Du lịch Thừa Thiên Huế: https://visithue.vn
  - Cổng thông tin điện tử tỉnh Thừa Thiên Huế: https://thuathienhue.gov.vn

### 2.11. Đồi Vọng Cảnh & Khúc Quanh Sông Hương (`doi-vong-canh`)
- **Vị trí:** Đường Huyền Trân Công Chúa, Phường Thủy Biều, Thành phố Huế.
- **Giá trị cốt lõi:** Thắng cảnh sinh thái rừng thông cao 43m ôm trọn khúc uốn lượn thơ mộng của thượng nguồn sông Hương, kết nối trực tiếp trục di sản Làng hương Thủy Xuân – Lăng Tự Đức – nhà vườn Thủy Biều.
- **Nguồn đối chiếu chính thống:**
  - Sở Du lịch Thừa Thiên Huế: https://visithue.vn
  - Trung tâm Bảo tồn Di tích Cố đô Huế: https://hueworldheritage.org.vn

---

## 3. Quy Tắc Hình Ảnh Bản Địa & Dự Phòng Kỹ Thuật (`HoaLang Image Rules`)

- Toàn bộ 11 địa điểm trong `public/data/places.json` sử dụng bộ ảnh chụp làng nghề và di tích Huế thực tế từ Wikimedia Commons (giấy phép Creative Commons / Public Domain), được lưu trực tiếp nội bộ tại `public/images/places/<id>.jpg` để tải tức thì, đúng chủ đề văn hóa Việt Nam 100% và không phụ thuộc mạng ngoài khi demo.
- Ảnh dự phòng nội bộ được lưu tại [`public/images/places/fallback-place.svg`](../../public/images/places/fallback-place.svg) (và xuất hằng số `FALLBACK_PLACE_IMAGE_URL` trong [`src/data/places.ts`](../../src/data/places.ts)) nhằm đảm bảo giao diện luôn giữ vẻ sang trọng chuẩn HoaLang trong mọi tình huống.
