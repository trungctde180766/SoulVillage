import type { QuizQuestion } from '../../../types/passport';
import type { SupportedLocale } from '../../../lib/i18n';

export type CraftSceneType =
  | 'poem-hat'
  | 'incense-bloom'
  | 'kiln-pottery'
  | 'paper-lotus'
  | 'bronze-urn'
  | 'woodblock-print';

export interface QuizSceneMeta {
  sceneType: CraftSceneType;
  storyHook: string;
  interactiveActionLabel: string;
  interactiveActiveLabel: string;
  interactiveCaption: string;
}

/**
 * Ngân hàng câu hỏi Thử thách Di sản (Cultural Heritage Quiz).
 * Giữ nguyên interface QuizQuestion và tên trường correctOptionIndex theo Contract v1.
 */
export const CULTURAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-non-tay-ho',
    placeId: 'lang-non-tay-ho',
    question:
      'Khi bạn cầm chiếc nón bài thơ Tây Hồ đưa lên hướng về phía ánh nắng mặt trời, điều kỳ diệu gì sẽ hiện ra?',
    options: [
      'Lớp sơn mài ánh vàng rực lên trên bề mặt lá nón',
      'Những câu thơ lục bát và bóng dáng cầu Trường Tiền, chùa Thiên Mụ ẩn hiện giữa hai lớp lá',
      'Màu lá nón chuyển dần sang sắc tím Huế theo hơi ấm',
      'Mười sáu bài thơ khắc chìm phát sáng dọc theo vành tre',
    ],
    correctOptionIndex: 1,
    explanation:
      'Ra đời khoảng năm 1959–1960 bởi nghệ nhân Bùi Quang Bặc, nón bài thơ Tây Hồ được lồng khéo léo những vần thơ và hình cắt giấy danh thắng xứ Huế vào giữa hai lớp lá nón mỏng, chỉ khi soi dưới nắng mới nhìn thấy rõ.',
    culturalFunFact:
      'Để hoàn thiện một chiếc nón bài thơ vừa thanh mảnh vừa bền chắc, người thợ Tây Hồ phải tỉ mỉ thực hiện đủ 15 công đoạn thủ công trên khung 16 vành tre chuốt tròn như sợi tơ.',
  },
  {
    id: 'quiz-huong-thuy-xuan',
    placeId: 'lang-huong-thuy-xuan',
    question:
      'Không dùng hóa chất kết dính, người thợ Làng hương Thủy Xuân đã dùng nguyên liệu tự nhiên nào để se bột trầm, quế, hồi bám chắc quanh tâm tre?',
    options: [
      'Nhựa thông tươi lấy từ rừng thông đồi Vọng Cảnh',
      'Bột keo tự nhiên xay từ vỏ cây bời lời',
      'Sáp ong rừng nấu chảy cùng đường phèn',
      'Hồ bột gạo nếp dẻo quánh phơi sương sớm',
    ],
    correctOptionIndex: 1,
    explanation:
      'Vỏ cây bời lời sấy khô xay mịn khi nhào với nước sẽ tạo thành chất keo thực vật dẻo dai tự nhiên, giúp giữ trọn mùi thơm thanh khiết của trầm hương, quế chi, thảo quả và đinh hương.',
    culturalFunFact:
      'Làng hương Thủy Xuân đã đỏ lửa hơn 700 năm dưới chân đồi Vọng Cảnh, xưa kia chuyên làm hương trầm thượng hạng cung tiến cho triều đình nhà Nguyễn.',
  },
  {
    id: 'quiz-gom-phuoc-tich',
    placeId: 'lang-gom-phuoc-tich',
    question:
      'Vì sao chiếc nồi đất ("om đất") mộc mạc không tráng men của Làng cổ Phước Tích lại từng được chọn để nấu cơm dâng Vua triều Nguyễn?',
    options: [
      'Vì bên trong lòng nồi được dát một lớp bạc mỏng giữ nhiệt',
      'Vì đất sét sông Ô Lâu nung củi nhiều ngày liền kết khối đanh chắc như sành, giữ nhiệt lâu và làm hạt cơm dẻo thơm đặc biệt',
      'Vì nồi tự tỏa ra mùi hương lá sen khi gặp nước sôi',
      'Vì gốm được phơi nắng 100 ngày không cần qua lửa lò nung',
    ],
    correctOptionIndex: 1,
    explanation:
      'Gốm Phước Tích được chuốt tay từ đất sét mịn sông Ô Lâu và nung ròng rã bằng củi rừng ở nhiệt độ cao không dùng men hóa học, khiến cốt gốm đanh vang như tiếng chuông đồng và giữ trọn vị ngọt của hạt gạo.',
    culturalFunFact:
      'Tương truyền mỗi tuần làng Phước Tích đều gánh những chiếc om đất mới tinh tiến cung để nấu cơm ngự thiện cho nhà Vua, và mỗi chiếc om chỉ dùng đúng một lần.',
  },
  {
    id: 'quiz-hoa-giay-thanh-tien',
    placeId: 'hoa-giay-thanh-tien',
    question:
      'Trên một cành hoa giấy thờ cúng cổ truyền của Làng Thanh Tiên luôn có đúng 3 bông lớn ở giữa và 5 bông nhỏ xung quanh. Con số 3 và 5 ấy gửi gắm ý nghĩa gì?',
    options: [
      'Đạo lý Tam Cương (Quân – Sư – Phụ) và Ngũ Thường (Nhân – Lễ – Nghĩa – Trí – Tín)',
      'Ba mùa mưa nắng và năm ngọn núi che chở kinh thành Huế',
      'Ba con sông lớn và năm làng nghề lâu đời nhất đất Thuận Hóa',
      'Ba tầng mây trời và năm cánh cổng chính của Hoàng thành',
    ],
    correctOptionIndex: 0,
    explanation:
      'Giữa tiết trời mưa lạnh cuối năm ở Huế khiến hoa tươi khó nở đúng Tết, người dân Thanh Tiên làm hoa giấy nhuộm màu lá cây, củ nghệ và gửi gắm lời răn dạy con cháu về đạo làm người qua 3 bông chính (Tam Cương) và 5 bông phụ (Ngũ Thường).',
    culturalFunFact:
      'Không dùng máy dập công nghiệp, nghệ nhân Thanh Tiên dùng đục gỗ và sống lá dừa khô khía từng chút một để tạo ra hàng trăm đường gân nhỏ li ti trên mỗi cánh hoa giấy.',
  },
  {
    id: 'quiz-duc-dong-phuong-duc',
    placeId: 'duc-dong-phuong-duc',
    question:
      'Đôi bàn tay của các hiệp thợ Làng đúc đồng Phường Đúc đã đúc nên Bảo vật Quốc gia đồ sộ nào đang đặt trang nghiêm trước sân Thế Miếu (Đại Nội Huế)?',
    options: [
      'Cửu Đỉnh — chín chiếc đỉnh đồng chạm nổi 162 hình tượng núi sông, sản vật và biển đảo Việt Nam',
      'Tháp Phước Duyên 7 tầng cao vút bên bờ sông Hương',
      'Cầu ngói Thanh Toàn cổ kính ở làng Thủy Thanh',
      'Cổng Ngọ Môn năm lối đi dẫn vào Hoàng thành',
    ],
    correctOptionIndex: 0,
    explanation:
      'Đúc từ năm 1835 đến 1837 dưới thời vua Minh Mạng bởi những người thợ tài hoa Phường Đúc, Cửu Đỉnh được ví như bộ "bách khoa toàn thư bằng đồng" khắc họa toàn cảnh non sông đất nước Việt Nam.',
    culturalFunFact:
      'Năm 2024, những mảng chạm đúc nổi trên Cửu Đỉnh Huế đã được UNESCO chính thức vinh danh là Di sản Tư liệu khu vực châu Á – Thái Bình Dương.',
  },
  {
    id: 'quiz-tranh-lang-sinh',
    placeId: 'tranh-lang-sinh',
    question:
      'Trước khi in ván khắc gỗ mít lên giấy dó, người thợ Tranh Làng Sình quét thêm một lớp chất liệu tự nhiên gì để mặt tranh có ánh trắng lấp lánh như xà cừ?',
    options: [
      'Bột vỏ sò điệp giã nhuyễn trộn cùng hồ nếp (gọi là giấy dó quét điệp)',
      'Bột phấn đá vôi trắng trộn dầu trẩu phơi sương',
      'Phấn hoa sen trắng hòa tan trong nước mưa đầu thu',
      'Bụi sứ trắng nghiền mịn từ các lò gốm cổ',
    ],
    correctOptionIndex: 0,
    explanation:
      'Vỏ sò điệp tự nhiên giã mịn trộn hồ nếp quét lên giấy dó tạo nên lớp nền vừa bền dai vừa óng ánh xà cừ dịu nhẹ, làm nổi bật nét in đen từ tro rơm nếp và sắc màu từ hoa hòe, hạt mồng tơi, gỗ vang.',
    culturalFunFact:
      'Chiếc cọ vẽ truyền thống của nghệ nhân Làng Sình không làm từ lông thú mà được đập dập khéo léo từ đoạn rễ cây dứa dại mọc ven sông Hương.',
  },
];

const SCENE_META_VI: Record<string, QuizSceneMeta> = {
  'quiz-non-tay-ho': {
    sceneType: 'poem-hat',
    storyHook:
      'Nhìn thoáng qua chỉ là chiếc nón lá trắng mộc mạc, nhưng người thợ Tây Hồ đã khéo giấu một bất ngờ chỉ ánh nắng mới đánh thức được...',
    interactiveActionLabel: 'Thử soi nón dưới nắng',
    interactiveActiveLabel: 'Đang soi dưới ánh nắng',
    interactiveCaption: 'Ánh nắng xuyên qua hai lớp lá non làm lộ rõ bóng cầu Trường Tiền và vần thơ Huế.',
  },
  'quiz-huong-thuy-xuan': {
    sceneType: 'incense-bloom',
    storyHook:
      'Dọc con đường Huyền Trân Công Chúa, hàng ngàn bó chân hương xòe tròn rực rỡ tỏa hương thảo mộc dịu ngọt mà chẳng cần một giọt hương liệu nhân tạo nào...',
    interactiveActionLabel: 'Thử bung xòe đóa hương',
    interactiveActiveLabel: 'Hương trầm đang tỏa ngát',
    interactiveCaption: 'Chân hương nhuộm sắc đỏ son, vàng nghệ xòe tròn đón nắng cùng làn hương thảo mộc.',
  },
  'quiz-gom-phuoc-tich': {
    sceneType: 'kiln-pottery',
    storyHook:
      'Chẳng cần lớp men bóng bẩy nhiều màu, thứ đất sét ven sông Ô Lâu sau nhiều ngày đêm rực lửa củi lại làm nên vật phẩm tiến cung trứ danh...',
    interactiveActionLabel: 'Thử gõ tiếng gốm ngân',
    interactiveActiveLabel: 'Tiếng gốm ngân vang như chuông',
    interactiveCaption: 'Lửa củi nung già giúp cốt gốm Phước Tích kết khối đanh chắc, gõ nhẹ vang thanh như đồng.',
  },
  'quiz-hoa-giay-thanh-tien': {
    sceneType: 'paper-lotus',
    storyHook:
      'Mỗi độ mưa phùn xứ Huế cuối đông, những cánh hoa bằng giấy nhuộm màu củ nghệ, lá cây lại nở bừng trang trọng theo một quy tắc bất di bất dịch...',
    interactiveActionLabel: 'Thử mở cánh hoa giấy',
    interactiveActiveLabel: 'Cành hoa 3 chính – 5 phụ bung nở',
    interactiveCaption: '3 bông lớn ở tâm (Tam Cương) và 5 bông nhỏ vây quanh (Ngũ Thường) nở hài hòa.',
  },
  'quiz-duc-dong-phuong-duc': {
    sceneType: 'bronze-urn',
    storyHook:
      'Từ những lò đồng đỏ rực trên 1.200°C bên bờ nam sông Hương, dòng đồng nóng chảy đã kết tinh thành kiệt tác trường tồn gần hai thế kỷ...',
    interactiveActionLabel: 'Thử soi họa tiết đúc nổi',
    interactiveActiveLabel: 'Hiện rõ bản đúc núi sông Việt Nam',
    interactiveCaption: 'Ánh đồng vàng rực lên đường nét chạm nổi sông Hương, biển Đông trên thân đỉnh đồng.',
  },
  'quiz-tranh-lang-sinh': {
    sceneType: 'woodblock-print',
    storyHook:
      'Nơi ngã ba sông Hương – sông Bồ, những tấm ván khắc gỗ mít trăm năm vẫn đều đặn in dấu lên mặt giấy dó lấp lánh ánh vỏ sò...',
    interactiveActionLabel: 'Thử in ván khắc lên giấy dó',
    interactiveActiveLabel: 'Đã in mộc bản trên nền giấy điệp',
    interactiveCaption: 'Bản khắc gỗ mít in nét mực tro rơm nếp sắc sảo trên nền giấy dó ánh vỏ sò điệp.',
  },
};

const SCENE_META_EN: Record<string, QuizSceneMeta> = {
  'quiz-non-tay-ho': {
    sceneType: 'poem-hat',
    storyHook:
      'At first glance it looks like a simple palm hat, yet Tay Ho artisans hid a poetic secret inside that only sunlight can awaken...',
    interactiveActionLabel: 'Hold hat up to sunlight',
    interactiveActiveLabel: 'Backlit by golden sunlight',
    interactiveCaption: 'Sunlight reveals hidden verses and the Truong Tien Bridge silhouette between two palm layers.',
  },
  'quiz-huong-thuy-xuan': {
    sceneType: 'incense-bloom',
    storyHook:
      'Along Huyen Tran Cong Chua street, thousands of crimson and golden incense bundles bloom in the sun without a single drop of synthetic perfume...',
    interactiveActionLabel: 'Fan out incense bouquet',
    interactiveActiveLabel: 'Herbal aroma rising gently',
    interactiveCaption: 'Hand-dyed bamboo incense sticks fan into a blossom while pure herbal smoke rises.',
  },
  'quiz-gom-phuoc-tich': {
    sceneType: 'kiln-pottery',
    storyHook:
      'Without any glossy chemical glaze, humble clay from the O Lau River emerged from roaring wood kilns worthy of the Emperor’s table...',
    interactiveActionLabel: 'Tap clay pot for chime',
    interactiveActiveLabel: 'Resonating like a bronze bell',
    interactiveCaption: 'Days of wood firing vitrify Phuoc Tich clay so a gentle tap rings clear like bronze.',
  },
  'quiz-hoa-giay-thanh-tien': {
    sceneType: 'paper-lotus',
    storyHook:
      'During Hue’s chilly winter rains when fresh blossoms struggled to bloom, botanical-dyed paper flowers blossomed following a timeless rule...',
    interactiveActionLabel: 'Bloom paper flower branch',
    interactiveActiveLabel: '3 central & 5 outer blossoms open',
    interactiveCaption: '3 major blossoms (Three Bonds) and 5 smaller blossoms (Five Virtues) unfold in harmony.',
  },
  'quiz-duc-dong-phuong-duc': {
    sceneType: 'bronze-urn',
    storyHook:
      'From 1,200°C furnaces along the southern bank of the Perfume River, molten bronze was cast into a national treasure standing for nearly two centuries...',
    interactiveActionLabel: 'Illuminate cast relief',
    interactiveActiveLabel: 'Bas-relief of mountains & seas revealed',
    interactiveCaption: 'Warm bronze light highlights the cast reliefs of Vietnam’s peaks and rivers.',
  },
  'quiz-tranh-lang-sinh': {
    sceneType: 'woodblock-print',
    storyHook:
      'Where the Perfume and Bo rivers meet, century-old jackfruit woodblocks still press folk tales onto shimmering shell-coated paper...',
    interactiveActionLabel: 'Press woodblock onto Do paper',
    interactiveActiveLabel: 'Stamped on pearlescent Do paper',
    interactiveCaption: 'Jackfruit woodblock ink meets scallop-shell coated Do bark paper with a subtle sheen.',
  },
};

const ENGLISH_QUIZ_TRANSLATIONS: Record<
  string,
  Pick<QuizQuestion, 'question' | 'options' | 'explanation' | 'culturalFunFact'>
> = {
  'quiz-non-tay-ho': {
    question:
      'When you hold a Tay Ho "poem conical hat" (Nón bài thơ) up toward the sunlight, what magical detail appears?',
    options: [
      'A royal gold-leaf lacquer glaze shines across the outer palm surface',
      'Poetic verses and silhouettes of Truong Tien Bridge & Thien Mu Pagoda appear between two palm layers',
      'The palm leaves shift into imperial purple in the warm breeze',
      'Sixteen carved poems glow along the outer bamboo rims',
    ],
    explanation:
      'Created around 1959–1960 by master artisan Bui Quang Bac, Tay Ho poem hats feature paper-cut verses and Hue landmarks pressed delicately between two thin palm leaf layers, visible only when backlit by sunlight.',
    culturalFunFact:
      'Crafting a single authentic Tay Ho poem hat requires 15 meticulous hand-worked stages over a frame of 16 finely shaved bamboo rings.',
  },
  'quiz-huong-thuy-xuan': {
    question:
      'Without using synthetic glue, which natural plant ingredient do Thuy Xuan artisans use to bind cinnamon, agarwood, and star anise powder onto bamboo sticks?',
    options: [
      'Fresh pine resin collected from Vong Canh Hill',
      'Natural adhesive powder ground from Litsea (Bời lời) tree bark',
      'Wild beeswax melted with rock sugar',
      'Morning-dew glutinous rice starch paste',
    ],
    explanation:
      'Ground Litsea bark (vỏ cây bời lời) forms a supple, 100% natural plant binder when mixed with water, preserving the pure aroma of agarwood, cinnamon, cardamom, and clove.',
    culturalFunFact:
      'Thuy Xuan Incense Village has thrived for over 700 years beneath Vong Canh Hill and once supplied ceremonial incense directly to the Nguyen Imperial Court.',
  },
  'quiz-gom-phuoc-tich': {
    question:
      'Why were the unglazed clay pots ("om đất") of Phuoc Tich Ancient Village chosen to cook royal meals for Nguyen Emperors?',
    options: [
      'Because the interior was lined with thin heat-retaining silver leaf',
      'Because O Lau River clay wood-fired for days vitrifies like stoneware, locking in heat and sweet rice aroma',
      'Because the clay naturally releases lotus fragrance when boiling',
      'Because the pots were sun-cured for 100 days without a kiln',
    ],
    explanation:
      'Hand-thrown from fine O Lau River clay and wood-fired continuously at high heat without chemical glazes, Phuoc Tich pottery achieves bell-like resonance and extraordinary heat retention.',
    culturalFunFact:
      'Tradition holds that Phuoc Tich villagers delivered brand-new clay pots to the Imperial Palace every week, and each royal cooking pot was used only once.',
  },
  'quiz-hoa-giay-thanh-tien': {
    question:
      'A traditional Thanh Tien ceremonial paper flower branch always features 3 large central blossoms and 5 smaller blossoms around them. What do 3 and 5 symbolize?',
    options: [
      'The Three Bonds (Tam Cương) and Five Constant Virtues (Ngũ Thường) of moral harmony',
      'Three monsoon months and the five mountains guarding Hue',
      'Three major rivers and the five oldest craft villages of Thuan Hoa',
      'Three cloud tiers and the five gates of the Imperial Citadel',
    ],
    explanation:
      'Dyed with leaves, bark, and turmeric to endure Hue’s wet winter weather, each Thanh Tien branch teaches moral virtues through 3 primary blossoms (Tam Cương) and 5 surrounding blossoms (Ngũ Thường).',
    culturalFunFact:
      'Instead of industrial molds, Thanh Tien artisans use wooden chisels and dried coconut leaf ribs to press hundreds of tiny veins into each paper petal.',
  },
  'quiz-duc-dong-phuong-duc': {
    question:
      'Master bronze casters of Phuong Duc Village created which monumental National Treasure standing before The Mieu Temple inside the Hue Imperial Citadel?',
    options: [
      'The Nine Dynastic Urns (Cửu Đỉnh) embossed with 162 reliefs of Vietnam’s mountains, rivers, and seas',
      'The seven-story Phuoc Duyen Pagoda Tower by the Perfume River',
      'The historic Thanh Toan Tile-Roofed Bridge',
      'The five-portal Ngo Mon Imperial Gate',
    ],
    explanation:
      'Cast between 1835 and 1837 under Emperor Minh Mang by Phuong Duc artisans, the Nine Dynastic Urns form a monumental bronze encyclopedia of Vietnam’s landscape and heritage.',
    culturalFunFact:
      'In 2024, UNESCO inscribed the cast bas-reliefs on the Nine Bronze Urns of Hue into the Memory of the World Asia-Pacific Register.',
  },
  'quiz-tranh-lang-sinh': {
    question:
      'Before printing with jackfruit woodblocks, what natural coating do Sinh Village artisans brush onto Do paper to give it a luminous pearlescent sheen?',
    options: [
      'Crushed scallop shells mixed with glutinous rice paste (known as Điệp-coated Do paper)',
      'White limestone powder blended with tung oil',
      'White lotus pollen dissolved in autumn rainwater',
      'Finely ground white porcelain dust from ancient kilns',
    ],
    explanation:
      'Crushed natural scallop shells (điệp) mixed with rice paste create a durable, softly shimmering mother-of-pearl surface that brings rice-straw ash outlines and plant pigments to life.',
    culturalFunFact:
      'Traditional Sinh Village painting brushes are crafted not from animal hair, but from pounded wild pandanus roots gathered along the Perfume River.',
  },
};

/**
 * Trả về danh sách câu hỏi Quiz theo ngôn ngữ hiện hành (mặc định Tiếng Việt chuẩn Contract v1).
 */
export function getLocalizedQuestions(locale: SupportedLocale = 'vi'): QuizQuestion[] {
  if (locale === 'vi') {
    return CULTURAL_QUESTIONS;
  }
  return CULTURAL_QUESTIONS.map((item) => {
    const translated = ENGLISH_QUIZ_TRANSLATIONS[item.id];
    if (!translated) return item;
    return {
      ...item,
      question: translated.question,
      options: translated.options,
      explanation: translated.explanation,
      culturalFunFact: translated.culturalFunFact,
    };
  });
}

/**
 * Trả về metadata câu chuyện dẫn nhập & mô phỏng tương tác thủ công cho từng câu hỏi.
 */
export function getQuizSceneMeta(questionId: string, locale: SupportedLocale = 'vi'): QuizSceneMeta {
  const dict = locale === 'en' ? SCENE_META_EN : SCENE_META_VI;
  return (
    dict[questionId] ??
    SCENE_META_VI['quiz-non-tay-ho']
  );
}

export default CULTURAL_QUESTIONS;
