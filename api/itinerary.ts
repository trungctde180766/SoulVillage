import { getGeminiClient, GEMINI_MODEL } from './lib/gemini';

interface ItineraryRequest {
  durationHours?: number;
  interests?: string[];
  startLocation?: string;
  companion?: string;
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const {
    durationHours = 4,
    interests = ['craft', 'monument'],
    startLocation = 'Trung tâm TP. Huế',
    companion = 'solo'
  }: ItineraryRequest = req.body || {};

  const genAI = getGeminiClient();

  // 1. FALLBACK ITINERARY (Dùng khi chưa có API key hoặc API gặp sự cố)
  const fallbackItinerary = {
    id: `itin-${Date.now()}`,
    title: 'Hành Trình Di Sản Cố Đô & Làng Nghề Tuyển Chọn',
    summary: `Lịch trình trải nghiệm văn hóa Huế kéo dài ${durationHours} giờ, kết hợp giữa tinh hoa làng nghề và quần thể di sản triều Nguyễn dành cho ${companion}.`,
    durationHours,
    targetInterests: interests,
    isFallback: !genAI,
    totalEstimatedCostVND: '150.000 - 300.000 VNĐ / người',
    culturalHighlights: [
      'Tự tay làm nón bài thơ cùng nghệ nhân',
      'Thưởng lãm hương trầm thảo mộc Thủy Xuân',
      'Chiêm ngưỡng kiến trúc cung đình triều Nguyễn'
    ],
    stops: [
      {
        order: 1,
        placeId: 'lang-huong-thuy-xuan',
        placeName: 'Làng Hương Thủy Xuân',
        timeSlot: '08:00 - 09:30',
        durationMinutes: 90,
        activityRecommendation: 'Tìm hiểu quy trình se hương thảo mộc thủ công từ bột quế và vỏ bời lời, thử trang phục cổ phục Huế.',
        culturalInsight: 'Hương trầm Thủy Xuân là sợi dây kết nối tâm linh hơn 700 năm của người dân xứ cố đô.',
        transportTip: 'Cách trung tâm Huế khoảng 7km về phía Tây Nam, thuận tiện đi bằng xe máy hoặc taxi.'
      },
      {
        order: 2,
        placeId: 'chua-thien-mu',
        placeName: 'Chùa Thiên Mụ — Linh Mụ Tự',
        timeSlot: '10:00 - 11:15',
        durationMinutes: 75,
        activityRecommendation: 'Thăm tháp Phước Duyên 7 tầng và chuông Đại Hồng Chung, ngắm dòng sông Hương êm đềm.',
        culturalInsight: 'Ngôi chùa cổ kính hơn 400 năm tuổi, gắn liền với huyền tích chúa Nguyễn Hoàng dựng nghiệp phương Nam.',
        transportTip: 'Đi dọc đường Huyền Trân Công Chúa rồi rẽ sang bờ sông Hương khoảng 10 phút.'
      },
      {
        order: 3,
        placeId: 'dai-noi-hue',
        placeName: 'Đại Nội Huế',
        timeSlot: '11:45 - 13:45',
        durationMinutes: 120,
        activityRecommendation: 'Chiêm ngưỡng Ngọ Môn, Điện Thái Hòa và tìm hiểu lịch sử 13 đời vua nhà Nguyễn.',
        culturalInsight: 'Đỉnh cao của nghệ thuật kiến trúc cung đình và mỹ thuật phong thủy phương Đông.',
        transportTip: 'Nằm ngay trung tâm thành phố, có bãi đỗ xe rộng rãi tại quảng trường Ngọ Môn.'
      }
    ],
    generatedAt: new Date().toISOString()
  };

  // 2. NẾU KHÔNG CÓ GEMINI API KEY -> TRẢ VỀ FALLBACK NGAY
  if (!genAI) {
    return res.status(200).json({
      ...fallbackItinerary,
      note: 'Dự án đang dùng fallback hành trình mẫu (Chưa cấu hình GEMINI_API_KEY).'
    });
  }

  // 3. GỌI GEMINI API
  try {
    const prompt = `
Bạn là chuyên gia cố vấn văn hóa du lịch bản địa của dự án "Hồn Làng" tại Cố đô Huế, Việt Nam.
Hãy lập một lịch trình khám phá văn hóa cá nhân hóa với các thông tin sau:
- Thời lượng: ${durationHours} giờ
- Sở thích: ${interests.join(', ')}
- Điểm xuất phát: ${startLocation}
- Đối tượng: ${companion}

QUY ĐỊNH BẮT BUỘC:
1. Chỉ ưu tiên các địa điểm văn hóa, làng nghề, ẩm thực di sản có thật và nổi tiếng tại Huế (như Làng nón Tây Hồ, Làng hương Thủy Xuân, Đại Nội Huế, Chùa Thiên Mụ, Làng đúc đồng Phường Đúc, v.v.).
2. Sắp xếp thứ tự các điểm dừng (stops) hợp lý về mặt địa lý để tối ưu thời gian di chuyển.
3. Trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm markdown code block, không giải thích ngoài JSON) theo đúng cấu trúc sau:
{
  "title": "string",
  "summary": "string",
  "totalEstimatedCostVND": "string",
  "culturalHighlights": ["string", "string"],
  "stops": [
    {
      "order": 1,
      "placeId": "string",
      "placeName": "string",
      "timeSlot": "HH:MM - HH:MM",
      "durationMinutes": 60,
      "activityRecommendation": "string",
      "culturalInsight": "string",
      "transportTip": "string"
    }
  ]
}
`;

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const responseText = response.text || '';
    
    // Clean potential markdown blocks
    const cleanedJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    return res.status(200).json({
      id: `itin-${Date.now()}`,
      durationHours,
      targetInterests: interests,
      isFallback: false,
      generatedAt: new Date().toISOString(),
      ...parsedData
    });
  } catch (error: any) {
    console.error('Error generating itinerary with Gemini:', error);
    // Graceful fallback if Gemini quota is exceeded or error occurs
    return res.status(200).json({
      ...fallbackItinerary,
      isFallback: true,
      errorInfo: error.message || 'Gemini API call failed, fallback used.'
    });
  }
}
