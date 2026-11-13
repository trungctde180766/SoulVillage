import type { CulturalPlace } from '../types/place';

// Giai đoạn PREP: Cung cấp bộ dữ liệu mẫu cấu trúc chuẩn đại diện cho Cố đô Huế.
// Trong Milestone M2 ngày thi, nhóm sẽ hoàn thiện và thẩm định nguồn đầy đủ 8-12 địa điểm.
export const SAMPLE_CULTURAL_PLACES: CulturalPlace[] = [
  {
    id: 'lang-non-tay-ho',
    name: 'Tay Ho Conical Hat Village',
    vietnameseName: 'Làng Nón Tây Hồ',
    category: 'craft',
    categoryLabel: 'Làng nghề truyền thống',
    location: 'Xã Phú Hồ, Huyện Phú Vang, Thừa Thiên Huế',
    coordinates: {
      lat: 16.4528,
      lng: 107.6521
    },
    shortDescription: 'Cái nôi của nón bài thơ xứ Huế nổi danh khắp bốn phương với kỹ thuật đan lá tỉ mỉ và ẩn hiện bài thơ khi soi dưới ánh mặt trời.',
    story: 'Làng nón Tây Hồ nằm bên dòng sông Như Ý thơ mộng. Nón bài thơ ra đời tại làng từ những năm 1959–1960 khi nghệ nhân làm nón yêu thơ đã sáng tạo lồng câu thơ và hình ảnh chùa Thiên Mụ, cầu Tràng Tiền vào giữa hai lớp lá nón.',
    craftDetails: 'Để làm ra chiếc nón bài thơ hoàn chỉnh đòi hỏi 15 công đoạn công phu: từ chọn lá nón, ủi phẳng, tạo khung chuốt vành, chèn bài thơ cho đến chằm nón bằng sợi cước tơ.',
    historicalSignificance: 'Biểu tượng gắn liền với vẻ đẹp thanh lịch, kín đáo của phụ nữ cố đô Huế suốt hàng trăm năm.',
    localTips: [
      'Nên ghé thăm vào buổi sáng để chứng kiến các mệ, các chị phơi lá nón trắng tinh dọc đường làng.',
      'Bạn có thể tự tay chép một câu thơ ngắn lồng vào chiếc nón kỷ niệm cho riêng mình.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    tags: ['Làng nghề', 'Nón bài thơ', 'Di sản dân gian', 'Trải nghiệm làm nón'],
    estimatedVisitTimeMinutes: 90,
    sources: [
      {
        title: 'Cổng thông tin điện tử tỉnh Thừa Thiên Huế — Làng nghề truyền thống',
        url: 'https://thuathienhue.gov.vn'
      }
    ]
  },
  {
    id: 'lang-huong-thuy-xuan',
    name: 'Thuy Xuan Incense Village',
    vietnameseName: 'Làng Hương Thủy Xuân',
    category: 'craft',
    categoryLabel: 'Làng nghề truyền thống',
    location: 'Đường Huyền Trân Công Chúa, Phường Thủy Xuân, TP. Huế',
    coordinates: {
      lat: 16.4412,
      lng: 107.5684
    },
    shortDescription: 'Không gian rực rỡ sắc màu của những bó hương trầm tỏa hương thơm thảo mộc tự nhiên dưới chân đồi Vọng Cảnh.',
    story: 'Làng hương Thủy Xuân có tuổi đời hơn 700 năm, xưa kia là nơi cung cấp trầm hương và hương thắp cho triều đình phong kiến nhà Nguyễn và các phủ quan lại, đền chùa quanh xứ Huế.',
    craftDetails: 'Hương Thủy Xuân giữ phương pháp bí truyền từ thảo mộc thiên nhiên: bột quế chi, thảo quả, nụ đinh hương, hoa hồi kết hợp keo vỏ cây bời lời, hoàn toàn không hóa chất độc hại.',
    historicalSignificance: 'Di sản làng nghề truyền thống tiêu biểu gắn liền với đời sống tâm linh và văn hóa thờ cúng tổ tiên của người Việt.',
    localTips: [
      'Góc chụp ảnh đẹp nhất là lúc 9h-11h sáng khi các nghệ nhân bung tỏa những đóa hoa hương đón nắng.',
      'Có dịch vụ cho thuê trang phục cổ phục (áo tấc, nhật bình) trải nghiệm trực tiếp se hương.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Làng nghề', 'Hương trầm', 'Cổ phục', 'Check-in văn hóa'],
    estimatedVisitTimeMinutes: 75,
    sources: [
      {
        title: 'Bảo tàng Lịch sử Thừa Thiên Huế',
        url: 'https://baotanglichsuhue.vn'
      }
    ]
  },
  {
    id: 'dai-noi-hue',
    name: 'The Imperial Citadel of Hue',
    vietnameseName: 'Đại Nội Huế — Hoàng Thành Cố Đô',
    category: 'monument',
    categoryLabel: 'Di tích lịch sử',
    location: 'Đường 23/8, Phường Thuận Hòa, TP. Huế',
    coordinates: {
      lat: 16.4697,
      lng: 107.5786
    },
    shortDescription: 'Quần thể di tích Cố đô Huế được UNESCO vinh danh Di sản Văn hóa Thế giới với kiến trúc cung đình đỉnh cao triều Nguyễn.',
    story: 'Khởi công xây dựng dưới triều vua Gia Long từ năm 1804 và hoàn chỉnh dưới triều vua Minh Mạng, Đại Nội là trung tâm chính trị quyền lực của 13 đời vua triều Nguyễn từ 1802 đến 1945.',
    historicalSignificance: 'Di sản Văn hóa Thế giới đầu tiên của Việt Nam được UNESCO công nhận năm 1993.',
    localTips: [
      'Nên dành tối thiểu 2.5 đến 3 giờ để tham quan Ngọ Môn, Điện Thái Hòa và Tử Cấm Thành.',
      'Đừng bỏ lỡ chương trình biểu diễn Nhã nhạc Cung đình Huế tại Duyệt Thị Đường.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    tags: ['UNESCO', 'Hoàng cung', 'Di tích quốc gia', 'Nhã nhạc cung đình'],
    estimatedVisitTimeMinutes: 180,
    sources: [
      {
        title: 'Trung tâm Bảo tồn Di tích Cố đô Huế',
        url: 'https://hueworldheritage.org.vn'
      }
    ]
  },
  {
    id: 'chua-thien-mu',
    name: 'Thien Mu Pagoda',
    vietnameseName: 'Chùa Thiên Mụ — Linh Mụ Tự',
    category: 'spiritual',
    categoryLabel: 'Tâm linh & Cổ tự',
    location: 'Đồi Hà Khê, Phường Kim Long, TP. Huế',
    coordinates: {
      lat: 16.4529,
      lng: 107.5453
    },
    shortDescription: 'Đệ nhất cổ tự xứ Huế bên dòng sông Hương thơ mộng cùng ngọn tháp Phước Duyên 7 tầng sừng sững.',
    story: 'Chùa được chúa Nguyễn Hoàng khởi lập vào năm 1601 sau khi nghe câu chuyện huyền thoại về một bà lão áo đỏ tiên phong báo mộng về long mạch dựng nghiệp ngàn năm.',
    historicalSignificance: 'Cổ tự hơn 400 năm tuổi, biểu tượng tinh thần tâm linh gắn liền với lịch sử mở cõi Đàng Trong.',
    localTips: [
      'Đi thuyền rồng trên sông Hương từ bến Tòa Khâm lên chùa lúc hoàng hôn là trải nghiệm tuyệt đẹp.',
      'Thưởng thức món đậu hũ hoa nhài (tàu hũ cố đô) ngay trước cổng tam quan chùa.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cổ tự', 'Sông Hương', 'Tháp Phước Duyên', 'Tâm linh'],
    estimatedVisitTimeMinutes: 60,
    sources: [
      {
        title: 'Hồ sơ Di sản Quần thể Di tích Cố đô Huế — UNESCO',
        url: 'https://whc.unesco.org/en/list/678'
      }
    ]
  }
];
