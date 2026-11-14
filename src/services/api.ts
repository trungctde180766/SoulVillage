import type { CulturalPlace, PlaceFilterOptions } from '../types/place';

/**
 * Danh mục biên khảo mẫu dùng để hiển thị dự phòng trên nhánh TV1 khi API /api/places
 * của TV3 đang trả 501 hoặc mảng rỗng trước thời điểm merge nhánh catalog.
 * Ngay khi GET /api/places trả về dữ liệu thật từ public/data/places.json, hệ thống
 * ưu tiên dùng 100% dữ liệu từ API.
 */
const EDITORIAL_PREVIEW_PLACES: CulturalPlace[] = [
  {
    id: 'lang-gom-phuoc-tich',
    name: 'Phuoc Tich Ancient Pottery Village',
    vietnameseName: 'Làng Cổ & Gốm Phước Tích',
    category: 'craft',
    categoryLabel: 'Làng Nghề Thủ Công',
    location: 'Xã Phong Hòa, Huyện Phong Điền, Thừa Thiên Huế',
    coordinates: { lat: 16.6478, lng: 107.3264 },
    shortDescription:
      'Ngôi làng cổ hơn 500 năm bên dòng Ô Lâu, nổi danh với dòng gốm mộc nung củi đanh chắc từng tiến vua triều Nguyễn.',
    story:
      'Được thành lập từ thế kỷ XV dưới thời vua Lê Thánh Tông, làng cổ Phước Tích sở hữu quần thể hơn hai mươi ngôi nhà rường cổ kính ẩn mình dưới hàng chè tàu xanh mướt bên bờ sông Ô Lâu. Gốm Phước Tích không dùng men màu sặc sỡ mà chinh phục người thưởng ngoạn bằng sắc nâu trầm mặc của đất sét địa phương được nhào luyện kỹ lưỡng và nung liên tục nhiều ngày đêm trong lò sấp, lò ngửa truyền thống.',
    craftDetails:
      'Kỹ thuật chuốt gốm thủ công trên bàn xoay kết hợp nung nhiệt độ cao tạo độ kết khối đanh như sành, gõ vang tiếng chuông ngân. Chiếc om đất Phước Tích từng là vật phẩm tiến cung dùng nấu cơm ngự thiện cho các vị hoàng đế nhà Nguyễn.',
    historicalSignificance:
      'Di tích Quốc gia được công nhận năm 2009 — ngôi làng cổ thứ hai của Việt Nam sau Đường Lâm giữ nguyên vẹn cấu trúc cảnh quan nhà rường - vườn - bến nước.',
    localTips: [
      'Ghé thăm xưởng gốm của nghệ nhân Lương Thanh Hiền để tự tay chuốt đất trên bàn xoay truyền thống.',
      'Đi bộ dọc các ngõ rêu phong buổi sớm để chiêm ngưỡng hàng rào chè tàu cắt tỉa thẳng tắp.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gốm cổ', 'Nhà rường', 'Di tích quốc gia', 'Tiến vua'],
    estimatedVisitTimeMinutes: 120,
    sources: [
      {
        title: 'Cổng thông tin điện tử tỉnh Thừa Thiên Huế — Làng cổ Phước Tích',
        url: 'https://thuathienhue.gov.vn'
      },
      {
        title: 'Sở Du lịch Thừa Thiên Huế — Di sản làng nghề Cố đô',
        url: 'https://visithue.vn'
      }
    ]
  },
  {
    id: 'lang-non-tay-ho',
    name: 'Tay Ho Conical Poem Hat Village',
    vietnameseName: 'Làng Nón Bài Thơ Tây Hồ',
    category: 'craft',
    categoryLabel: 'Làng Nghề Thủ Công',
    location: 'Xã Phú Hồ, Huyện Phú Vang, Thừa Thiên Huế',
    coordinates: { lat: 16.4419, lng: 107.6492 },
    shortDescription:
      'Cái nôi của chiếc nón bài thơ xứ Huế thanh tao, kết tinh từ mười lăm công đoạn thủ công tỉ mỉ bên dòng sông Như Ý.',
    story:
      'Nằm hiền hòa bên bờ sông Như Ý, làng Tây Hồ đã gắn bó với nghề chằm nón từ hàng trăm năm trước. Đầu thập niên 1960, nghệ nhân Bùi QuangBấc đã sáng tạo ra kỹ nghệ lồng những vần thơ lục bát và hình bóng cầu Trường Tiền, chùa Thiên Mụ vào giữa hai lớp lá nón trắng ngần, tạo nên biểu tượng văn hóa duyên dáng đặc trưng của người con gái Huế.',
    craftDetails:
      'Để hoàn thiện một chiếc nón bài thơ đạt chuẩn mỏng nhẹ mà bền chắc, người thợ phải chọn lá bồ quyến non từ rừng Nam Đông, sấy diêm sinh, ủi phẳng bằng lưỡi cày gang ấm rồi khâu từng mũi cước đều tăm tắp qua 16 vành tre vót mảnh như sợi chỉ.',
    historicalSignificance:
      'Biểu tượng thủ công mỹ nghệ tiêu biểu của vùng đất Thuận Hóa — Phú Xuân, được vinh danh tại nhiều kỳ Festival Nghề truyền thống Huế.',
    localTips: [
      'Đưa chiếc nón lên soi dưới ánh nắng ban mai để thưởng thức trọn vẹn nét chữ thơ và họa tiết ẩn hiện trong từng thớ lá.',
      'Trò chuyện cùng các nghệ nhân cao niên để nghe kể giai thoại ra đời chiếc nón bài thơ đầu tiên.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    tags: ['Nón bài thơ', 'Nón lá', 'Thủ công mỹ nghệ', 'Sông Như Ý'],
    estimatedVisitTimeMinutes: 90,
    sources: [
      {
        title: 'Cổng thông tin điện tử Thừa Thiên Huế — Làng nghề Nón lá Tây Hồ',
        url: 'https://thuathienhue.gov.vn'
      }
    ]
  },
  {
    id: 'lang-hoa-giay-thanh-tien',
    name: 'Thanh Tien Paper Flower Village',
    vietnameseName: 'Làng Hoa Giấy Thanh Tiên',
    category: 'craft',
    categoryLabel: 'Làng Nghề Thủ Công',
    location: 'Xã Phú Mậu, Thành phố Huế, Thừa Thiên Huế',
    coordinates: { lat: 16.5061, lng: 107.5882 },
    shortDescription:
      'Nghệ thuật tạo tác hoa sen giấy và hoa thờ tam giáo hơn ba thế kỷ ở vùng hạ lưu sông Hương.',
    story:
      'Trải qua hơn 300 năm lịch sử ở vùng đất ngập lụt hạ lưu sông Hương, người dân làng Thanh Tiên đã sáng tạo ra những cành hoa giấy chịu được độ ẩm mưa dầm xứ Huế để dâng cúng tổ tiên mỗi dịp Tết đến xuân về. Từ những nhành hoa thờ truyền thống mang triết lý Tam Cương - Ngũ Thường, ngày nay làng Thanh Tiên còn nổi tiếng với đóa sen giấy thanh khiết được nhuộm màu hoàn toàn từ thảo mộc tự nhiên.',
    craftDetails:
      'Giấy làm hoa được nhuộm từ nhựa cây dành dành, củ nghệ, lá chàm và vỏ cây vang. Cánh hoa được tạo gân nhỏ li ti bằng dụng cụ gỗ khía rãnh trước khi gắn lên cành tre chẻ mảnh kết hợp nhụy chỉ tơ tinh xảo.',
    historicalSignificance:
      'Nét tín ngưỡng dân gian đặc sắc của cư dân vùng châu thổ sông Hương, kết hợp hài hòa giữa mỹ thuật tạo hình và triết học phương Đông.',
    localTips: [
      'Ghé thăm không gian nghệ thuật của cố nghệ nhân Thân Văn Huy để trải nghiệm tự tay xếp cánh sen giấy.',
      'Thời điểm đẹp nhất là tháng Chạp âm lịch khi cả làng rực rỡ sắc hoa chuẩn bị cho phiên chợ Tết.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    tags: ['Hoa giấy', 'Sen giấy', 'Tín ngưỡng dân gian', 'Phú Mậu'],
    estimatedVisitTimeMinutes: 90,
    sources: [
      {
        title: 'Sở Văn hóa và Thể thao Thừa Thiên Huế — Hoa giấy Thanh Tiên',
        url: 'https://svhtt.thuathienhue.gov.vn'
      }
    ]
  },
  {
    id: 'lang-tranh-lang-sinh',
    name: 'Sinh Village Folk Woodblock Prints',
    vietnameseName: 'Làng Tranh Dân Gian Làng Sình',
    category: 'craft',
    categoryLabel: 'Làng Nghề Thủ Công',
    location: 'Thôn Lại Ân, Xã Phú Mậu, Thành phố Huế',
    coordinates: { lat: 16.5125, lng: 107.5914 },
    shortDescription:
      'Dòng tranh khắc gỗ dân gian hơn 400 năm tuổi phản ánh đời sống tâm linh và lễ hội nông nghiệp xứ Đàng Trong.',
    story:
      'Nằm ngay ngã ba sông Hương và sông Bồ, làng Lại Ân (tục gọi là làng Sình) lưu giữ dòng tranh mộc bản cổ truyền có từ thời các chúa Nguyễn mở cõi phương Nam. Khác với tranh Đông Hồ hay Hàng Trống ở miền Bắc, tranh làng Sình mang đậm dấu ấn tín ngưỡng cầu an của cư dân xứ Huế cùng các đề tài sinh hoạt bình dị như đấu vật, bát âm, rước trống.',
    craftDetails:
      'Giấy dó được quét một lớp hồ điệp nghiền từ vỏ sò điệp tự nhiên tạo ánh kim lấp lánh. Sau khi in nét đen bằng bản khắc gỗ mít và mực tro rơm nếp, nghệ nhân dùng cọ rễ cây dứa dại trực tiếp tô điểm từng mảng màu tự nhiên sống động.',
    historicalSignificance:
      'Bảo tàng sống về mỹ thuật khắc gỗ dân gian miền Trung, gắn liền với lễ hội Vật làng Sình truyền thống vào mùng 10 tháng Giêng.',
    localTips: [
      'Ghé nhà nghệ nhân Kỳ Hữu Phước để tự tay lăn mực trên bản khắc gỗ cổ và mang về một bức tranh kỷ niệm.',
      'Kết hợp tham quan làng hoa giấy Thanh Tiên nằm liền kề trên cùng cung đường ven sông Hương.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    tags: ['Tranh mộc bản', 'Mỹ thuật dân gian', 'Giấy dó điệp', 'Lại Ân'],
    estimatedVisitTimeMinutes: 75,
    sources: [
      {
        title: 'Trung tâm Bảo tồn Di tích Cố đô Huế — Tranh dân gian Làng Sình',
        url: 'https://hueworldheritage.org.vn'
      }
    ]
  },
  {
    id: 'lang-huong-thuy-xuan',
    name: 'Thuy Xuan Imperial Incense Village',
    vietnameseName: 'Làng Hương Trầm Thủy Xuân',
    category: 'craft',
    categoryLabel: 'Làng Nghề Thủ Công',
    location: 'Đường Huyền Trân Công Chúa, Phường Thủy Xuân, Thành phố Huế',
    coordinates: { lat: 16.4358, lng: 107.5683 },
    shortDescription:
      'Không gian ngát hương trầm và sắc màu rực rỡ của những bó chân hương xòe tròn dưới chân đồi Vọng Cảnh.',
    story:
      'Nghề làm hương trầm tại làng Thủy Xuân đã hình thành hơn 700 năm trước, từng là nơi chuyên cung tiến hương thơm hảo hạng cho triều đình nhà Nguyễn và các phủ đệ, cổ tự khắp vùng Thuận Hóa. Đi dọc con đường Huyền Trân Công Chúa rợp bóng thông xanh, du khách dễ dàng bắt gặp những đóa hoa chân hương đủ sắc đỏ, vàng, tím, lục đang phơi mình dưới nắng ấm.',
    craftDetails:
      'Bột hương Thủy Xuân hoàn toàn không dùng hóa chất mà được phối trộn theo tỷ lệ gia truyền từ trầm hương, đàn hương, quế chi, đại hồi, đinh hương, thảo quả cùng chất kết dính tự nhiên từ vỏ cây bời lời.',
    historicalSignificance:
      'Làng nghề truyền thống tiêu biểu nằm trên trục cảnh quan di sản nối liền đàn Nam Giao, lăng Tự Đức và đồi Vọng Cảnh.',
    localTips: [
      'Nên ghé thăm vào buổi sáng nắng đẹp để chiêm ngưỡng những sân phơi chân hương rực rỡ nhất.',
      'Thử tự tay se một nén hương trầm thủ công và thưởng thức trà sen ấm nóng tại hiên nhà nghệ nhân.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    tags: ['Hương trầm', 'Thảo mộc cung đình', 'Đồi Vọng Cảnh', 'Thủy Xuân'],
    estimatedVisitTimeMinutes: 60,
    sources: [
      {
        title: 'Sở Du lịch Thừa Thiên Huế — Làng hương Thủy Xuân',
        url: 'https://visithue.vn'
      }
    ]
  },
  {
    id: 'phuong-duc-hue',
    name: 'Phuong Duc Royal Bronze Casting Village',
    vietnameseName: 'Làng Đúc Đồng Phường Đúc',
    category: 'craft',
    categoryLabel: 'Làng Nghề Thủ Công',
    location: 'Đường Bùi Thị Xuân, Phường Phường Đúc, Thành phố Huế',
    coordinates: { lat: 16.4562, lng: 107.5671 },
    shortDescription:
      'Chiếc nôi của những kiệt tác Cửu Đỉnh, Cửu Vị Thần Công và đại hồng chung vang vọng khắp kinh thành.',
    story:
      'Khởi nguồn từ những người thợ họ Nguyễn văn từ vùng Kinh Bắc vào Thuận Hóa lập nghiệp đầu thế kỷ XVII, làng nghề Phường Đúc bên bờ nam sông Hương từng được các chúa Nguyễn và triều đình nhà Nguyễn quy hoạch thành những Tượng cục đúc đồng quy mô lớn. Chính bàn tay những nghệ nhân nơi đây đã đúc nên Cửu Đỉnh đặt trước Thế Tổ Miếu và đại hồng chung chùa Thiên Mụ.',
    craftDetails:
      'Bí quyết lớn nhất của nghệ nhân Phường Đúc nằm ở khâu làm khuôn đất sét trộn trấu nung già và pha chế hợp kim đồng - thiếc - chì theo tỷ lệ chuẩn xác để tiếng chuông ngân dài, ấm và vang xa hàng dặm.',
    historicalSignificance:
      'Những bản đúc nổi trên Cửu Đỉnh tại Hoàng thành Huế — kiệt tác của thợ đúc đồng Huế — đã được UNESCO ghi danh là Di sản Tư liệu khu vực châu Á - Thái Bình Dương.',
    localTips: [
      'Tham quan các xưởng đúc gia truyền dọc đường Bùi Thị Xuân để quan sát quy trình đắp khuôn đất thủ công.',
      'Tìm hiểu bộ sưu tập đồ đồng pháp lam và chuông đồng thu nhỏ tinh xảo.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    tags: ['Đúc đồng', 'Cửu Đỉnh', 'Kỹ nghệ hoàng cung', 'Bờ nam sông Hương'],
    estimatedVisitTimeMinutes: 90,
    sources: [
      {
        title: 'Trung tâm Bảo tồn Di tích Cố đô Huế — Nghề đúc đồng truyền thống',
        url: 'https://hueworldheritage.org.vn'
      }
    ]
  },
  {
    id: 'dai-noi-kinh-thanh-hue',
    name: 'Hue Imperial Citadel & Forbidden City',
    vietnameseName: 'Đại Nội — Hoàng Thành & Tử Cấm Thành Huế',
    category: 'monument',
    categoryLabel: 'Di Tích Lịch Sử',
    location: 'Đường 23 Tháng 8, Phường Thuận Hòa, Thành phố Huế',
    coordinates: { lat: 16.4698, lng: 107.5784 },
    shortDescription:
      'Trái tim kiến trúc cung đình triều Nguyễn với Ngọ Môn, Điện Thái Hòa và nghệ thuật pháp lam hoàng gia độc bản.',
    story:
      'Được khởi dựng từ năm 1804 dưới triều vua Gia Long và hoàn chỉnh dưới triều vua Minh Mạng, Hoàng thành Huế là đỉnh cao của nghệ thuật quy hoạch kiến trúc cung đình Việt Nam thế kỷ XIX. Mọi công trình từ Ngọ Môn uy nghiêm, Điện Thái Hòa chạm trổ sơn son thếp vàng đến Hiển Lâm Các, Thế Tổ Miếu đều quy tụ tinh hoa của hàng vạn nghệ nhân mộc, nề, chạm cẩn sành sứ và pháp lam từ khắp các làng nghề danh tiếng.',
    craftDetails:
      'Nghệ thuật trang trí cung đình Huế nổi bật với kỹ thuật khảm sành sứ ghép mảnh, họa pháp lam đồng tráng men nhiều màu trên bờ nóc cung điện và lối kiến trúc trùng thiềm điệp ốc chuẩn mực.',
    historicalSignificance:
      'Hạt nhân của Quần thể Di tích Cố đô Huế — Di sản Văn hóa Thế giới đầu tiên của Việt Nam được UNESCO công nhận năm 1993.',
    localTips: [
      'Bắt đầu hành trình từ Ngọ Môn vào sáng sớm khi ánh nắng vừa chiếu rọi xuống hồ Thái Dịch và Điện Thái Hòa.',
      'Dành thời gian chiêm ngưỡng Cửu Đỉnh trước sân Thế Tổ Miếu — bộ bách khoa toàn thư bằng đồng của Việt Nam thế kỷ XIX.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    tags: ['Di sản UNESCO', 'Hoàng thành Huế', 'Kiến trúc cung đình', 'Pháp lam'],
    estimatedVisitTimeMinutes: 150,
    sources: [
      {
        title: 'Trung tâm Bảo tồn Di tích Cố đô Huế — Quần thể Di tích Cố đô Huế',
        url: 'https://hueworldheritage.org.vn'
      }
    ]
  },
  {
    id: 'chua-thien-mu-hue',
    name: 'Thien Mu Ancient Pagoda',
    vietnameseName: 'Chùa Thiên Mụ — Linh Mụ Cổ Tự',
    category: 'spiritual',
    categoryLabel: 'Tâm Linh & Cổ Tự',
    location: 'Đồi Hà Khê, Phường Hương Hòa, Thành phố Huế',
    coordinates: { lat: 16.4534, lng: 107.5451 },
    shortDescription:
      'Đệ nhất cổ tự xứ Huế uy nghiêm trên đồi Hà Khê soi bóng xuống dòng Hương Giang thơ mộng từ năm 1601.',
    story:
      'Được chúa Tiên Nguyễn Hoàng cho dựng lập năm Tân Sửu (1601) trên ngọn đồi Hà Khê tả ngạn sông Hương, chùa Thiên Mụ mở đầu cho lịch sử khai mở vùng đất Thuận Hóa - Phú Xuân. Ngọn tháp Phước Duyên bảy tầng cao 21 mét dựng năm 1844 dưới triều vua Thiệu Trị cùng tiếng chuông Đại Hồng Chung đúc năm 1710 đã đi vào tâm thức thi ca Việt Nam như linh hồn thanh tịnh của đất thần kinh.',
    craftDetails:
      'Trong chùa lưu giữ hai bảo vật quốc gia tiêu biểu cho kỹ nghệ điêu khắc và đúc đồng xứ Huế: Đại Hồng Chung nặng hơn hai tấn và Bia đá Ngự kiến Thiên Mụ Tự đặt trên lưng rùa đá cẩm thạch nguyên khối.',
    historicalSignificance:
      'Di tích lịch sử - văn hóa gắn liền với sự hình thành xứ Đàng Trong và nhiều dấu mốc lịch sử cận hiện đại của dân tộc.',
    localTips: [
      'Ghé thăm vào buổi chiều tà để ngắm hoàng hôn buông xuống mặt sông Hương từ bến thuyền trước tháp Phước Duyên.',
      'Giữ trang phục lịch sự, bước đi nhẹ nhàng trong khuôn viên vườn thông và khu điện Đại Hùng.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cổ tự 1601', 'Tháp Phước Duyên', 'Bảo vật quốc gia', 'Sông Hương'],
    estimatedVisitTimeMinutes: 90,
    sources: [
      {
        title: 'Trung tâm Bảo tồn Di tích Cố đô Huế — Chùa Thiên Mụ',
        url: 'https://hueworldheritage.org.vn'
      }
    ]
  }
];

/**
 * Chuẩn hóa chuỗi tiếng Việt bỏ dấu để tìm kiếm thông minh (diacritic-insensitive search).
 */
export function normalizeVietnameseText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Lọc danh sách địa điểm ở phía client theo category và searchQuery.
 */
export function filterPlacesList(
  places: CulturalPlace[],
  options?: PlaceFilterOptions
): CulturalPlace[] {
  const category = options?.category;
  const rawQuery = options?.searchQuery?.trim() || '';
  const normalizedQuery = rawQuery ? normalizeVietnameseText(rawQuery) : '';

  return places.filter((place) => {
    if (category && category !== 'all' && place.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableFields = [
      place.vietnameseName,
      place.name,
      place.categoryLabel,
      place.location,
      place.shortDescription,
      place.story,
      place.craftDetails || '',
      place.historicalSignificance || '',
      ...place.tags
    ];

    return searchableFields.some((field) =>
      normalizeVietnameseText(field).includes(normalizedQuery)
    );
  });
}

/**
 * Tải danh sách địa điểm văn hóa từ GET /api/places.
 * Quy tắc: Khi category === 'all', tuyệt đối KHÔNG gửi query category=all lên API.
 * Nếu API của TV3 đang trả 501 hoặc mảng rỗng trước khi merge catalog, hàm tự động
 * sử dụng bộ danh mục biên khảo Huế để luồng Explore -> PlaceDetail -> Journey hoạt động xuyên suốt.
 */
export async function fetchCulturalPlaces(
  options?: PlaceFilterOptions,
  signal?: AbortSignal
): Promise<CulturalPlace[]> {
  const params = new URLSearchParams();
  if (options?.category && options.category !== 'all') {
    params.set('category', options.category);
  }
  if (options?.searchQuery && options.searchQuery.trim()) {
    params.set('search', options.searchQuery.trim());
  }

  const queryString = params.toString();
  const url = queryString ? `/api/places?${queryString}` : '/api/places';

  try {
    const response = await fetch(url, { signal });

    if (response.status === 501) {
      return filterPlacesList(EDITORIAL_PREVIEW_PLACES, options);
    }

    if (!response.ok) {
      throw new Error(`Không thể tải danh mục địa điểm di sản (HTTP ${response.status}).`);
    }

    const data: unknown = await response.json();
    let apiPlaces: CulturalPlace[] = [];

    if (Array.isArray(data)) {
      apiPlaces = data as CulturalPlace[];
    } else if (
      data &&
      typeof data === 'object' &&
      'places' in data &&
      Array.isArray((data as { places: unknown }).places)
    ) {
      apiPlaces = (data as { places: CulturalPlace[] }).places;
    }

    // Nếu TV3 đã trả dữ liệu từ public/data/places.json, ưu tiên 100% dữ liệu từ API
    if (apiPlaces.length > 0) {
      return apiPlaces;
    }

    // Nếu API trả mảng rỗng do đang lọc bằng query string thì trả kết quả lọc từ preview nếu toàn bộ danh mục gốc còn rỗng
    if (!queryString) {
      return filterPlacesList(EDITORIAL_PREVIEW_PLACES, options);
    }

    // Kiểm tra xem danh mục gốc có đang rỗng không
    const baseRes = await fetch('/api/places', { signal });
    if (baseRes.ok) {
      const baseData: unknown = await baseRes.json();
      const baseList = Array.isArray(baseData)
        ? baseData
        : baseData && typeof baseData === 'object' && 'places' in baseData && Array.isArray((baseData as { places: unknown }).places)
          ? (baseData as { places: CulturalPlace[] }).places
          : [];
      if (baseList.length === 0) {
        return filterPlacesList(EDITORIAL_PREVIEW_PLACES, options);
      }
    }

    return apiPlaces;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    return filterPlacesList(EDITORIAL_PREVIEW_PLACES, options);
  }
}

/**
 * Tìm một địa điểm văn hóa theo ID phục vụ trang chi tiết PlaceDetailPage.
 */
export async function fetchCulturalPlaceById(
  placeId: string,
  signal?: AbortSignal
): Promise<CulturalPlace | null> {
  const allPlaces = await fetchCulturalPlaces(undefined, signal);
  const found = allPlaces.find((p) => p.id === placeId);
  if (found) return found;

  return EDITORIAL_PREVIEW_PLACES.find((p) => p.id === placeId) || null;
}
