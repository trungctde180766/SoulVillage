import { GoogleGenAI } from '@google/genai';
import {
  parseAndValidateGeminiResponse,
  sanitizeStartLocation,
} from './validator.js';

export const DEFAULT_GEMINI_MODEL = 'gemini-4-hydrogen';
export const FALLBACK_GEMINI_MODELS = [
  'gemini-4-hydrogen',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
];
export const DEFAULT_TIMEOUT_MS = 20000;
export const TRANSIT_BUFFER_MINUTES = 20;

const ITINERARY_RESPONSE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    totalEstimatedCostVND: { type: 'string' },
    culturalHighlights: {
      type: 'array',
      items: { type: 'string' },
    },
    stops: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          order: { type: 'integer' },
          placeId: { type: 'string' },
          placeName: { type: 'string' },
          timeSlot: { type: 'string' },
          durationMinutes: { type: 'integer' },
          activityRecommendation: { type: 'string' },
          culturalInsight: { type: 'string' },
          transportTip: { type: 'string' },
        },
        required: [
          'order',
          'placeId',
          'timeSlot',
          'durationMinutes',
          'activityRecommendation',
          'culturalInsight',
        ],
      },
    },
  },
  required: [
    'title',
    'summary',
    'stops',
    'totalEstimatedCostVND',
    'culturalHighlights',
  ],
};

/**
 * Build the cultural itinerary prompt for Google Gemini.
 * @param {{ catalog: Array<object>, preference: object }} params
 * @returns {string}
 */
export function buildPrompt({ catalog, preference }) {
  const catalogContext = catalog.map((p) => ({
    id: p.id,
    name: p.vietnameseName,
    category: p.category,
    location: p.location,
    estimatedMinutes: p.estimatedVisitTimeMinutes,
    highlights: p.shortDescription,
    localTips: p.localTips,
  }));

  const safeStart = sanitizeStartLocation(preference.startLocation);
  const budgetMinutes = preference.durationHours * 60;
  const companion = preference.companion || 'solo';
  const pace = preference.pace || 'moderate';

  const COMPANION_GUIDANCE = {
    solo: 'Du khách một mình: Ưu tiên đàm đạo sâu sắc với nghệ nhân, góc nhìn chiêm nghiệm lịch sử, trải nghiệm chụp ảnh nghệ thuật tĩnh lặng.',
    couple: 'Cặp đôi: Ưu tiên không gian lãng mạn, thơ mộng bên dòng sông Hương/cổ tự, cùng nhau thử làm đồ thủ công kỷ niệm lưu dấu ấn đôi lứa.',
    family: 'Gia đình đa thế hệ: Cân đối hoạt động nhẹ nhàng, dễ tiếp cận cho trẻ nhỏ và người lớn tuổi; ưu tiên làng nghề có trải nghiệm thực hành dễ làm (se hương, vẽ nón), có bóng mát và không gian nghỉ ngơi thoải mái.',
    friends: 'Nhóm bạn: Tăng cường tính tương tác, check-in nghệ thuật độc đáo, khám phá ẩm thực bản địa sôi động và các workshop thủ công tập thể.'
  }[companion] || 'Du khách yêu di sản.';

  const PACE_GUIDANCE = {
    relaxed: 'Thư thả: Tối đa 2 địa điểm, thời gian lưu lại sâu (75-120 phút/điểm), nhịp điệu thong thả không vội vã.',
    moderate: 'Vừa phải: 2-3 địa điểm, cân đối hài hòa giữa trải nghiệm văn hóa và thời gian di chuyển.',
    intensive: 'Khám phá nhiều: Tối đa 3 địa điểm, nhịp điệu nhanh gọn, tận dụng tối đa từng khung giờ.'
  }[pace] || 'Cân bằng, vừa phải.';

  return `Bạn là chuyên gia hướng dẫn du lịch văn hóa Huế cho dự án Hồn Làng (SoulVillage × HoaLang Luxury Editorial).
Nhiệm vụ: Tạo một lịch trình du lịch văn hóa cá nhân hóa dựa trên danh mục địa điểm có sẵn sau đây.

DANH MỤC ĐIỂM ĐẾN HỢP LỆ (BẮT BUỘC CHỈ CHỌN TỪ ĐÂY):
${JSON.stringify(catalogContext, null, 2)}

THÔNG SỐ & CHÂN DUNG ĐOÀN KHÁCH:
- Tổng thời gian: ${preference.durationHours} giờ (${budgetMinutes} phút)
- Sở thích văn hóa: ${preference.interests.join(', ')}
- Điểm xuất phát: "${safeStart}"
- Người đồng hành: "${companion}" -> ĐỊNH HƯỚNG TRẢI NGHIỆM: ${COMPANION_GUIDANCE}
- Nhịp điệu chuyến đi: "${pace}" -> ĐỊNH HƯỚNG NHỊP ĐỘ: ${PACE_GUIDANCE}
${
  preference.selectedPlaceIds?.length
    ? `- BẮT BUỘC ƯU TIÊN CÁC ĐIỂM NÀY: ${preference.selectedPlaceIds.join(', ')}`
    : ''
}

YÊU CẦU ĐẶC BIỆT VỀ CÁ NHÂN HÓA:
- Trong trường "summary" và từng "activityRecommendation": BẮT BUỘC phải nhấn mạnh lý do vì sao hoạt động đó đặc biệt phù hợp với nhóm "${companion}" và nhịp điệu "${pace}".
QUY TẮC BẮT BUỘC:
1. Mọi placeId trong mảng stops BẮT BUỘC phải nằm trong danh mục trên. Tuyệt đối không tự bịa ID hoặc địa điểm ngoài danh mục.
2. Tổng thời gian tham quan (durationMinutes của các stops) + thời gian di chuyển giữa các điểm (15-20 phút/chặng) và khoảng cách giữa khung giờ đầu tới khung giờ cuối KHÔNG ĐƯỢC VƯỢT QUÁ ${budgetMinutes} phút.
3. Các khung giờ timeSlot phải theo định dạng "HH:MM - HH:MM" (ví dụ: "08:30 - 09:45"), nối tiếp hợp lý và tuyệt đối không chồng chéo nhau.
4. Cung cấp góc nhìn văn hóa sâu sắc (culturalInsight) và lời khuyên trải nghiệm (activityRecommendation) thanh lịch, giàu chiều sâu di sản Huế.
5. Trả về đúng cấu trúc JSON sau (không kèm markdown ngoài JSON):
{
  "title": "string",
  "summary": "string",
  "stops": [
    {
      "order": 1,
      "placeId": "string (phải có trong danh mục)",
      "placeName": "string",
      "timeSlot": "08:30 - 09:45",
      "durationMinutes": 75,
      "activityRecommendation": "string",
      "culturalInsight": "string",
      "transportTip": "string"
    }
  ],
  "totalEstimatedCostVND": "150.000 - 250.000 VNĐ",
  "culturalHighlights": ["string"]
}`;
}

/**
 * Default function that calls Google Gemini via @google/genai v3 SDK.
 * @param {{ prompt: string, apiKey: string, modelName?: string, timeoutMs?: number }} params
 * @returns {Promise<string>}
 */
export async function defaultCallGeminiText({
  prompt,
  apiKey,
  modelName = process.env.GEMINI_MODEL,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  const ai = new GoogleGenAI({ apiKey });
  const candidateModels =
    typeof modelName === 'string' && modelName.trim()
      ? [modelName.trim()]
      : FALLBACK_GEMINI_MODELS;

  let lastErr;
  for (const model of candidateModels) {
    const config = {
      responseMimeType: 'application/json',
      responseJsonSchema: ITINERARY_RESPONSE_JSON_SCHEMA,
      abortSignal: AbortSignal.timeout(timeoutMs),
    };

    if (model.startsWith('gemini-4') || model.startsWith('gemini-3.5')) {
      config.thinkingConfig = { thinkingLevel: 'low' };
    } else if (!model.startsWith('gemini-3.')) {
      config.temperature = 0.3;
    }

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      if (response?.text) {
        return response.text;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Empty response from Gemini API');
}

/**
 * Call Gemini and validate the returned itinerary against the catalog and time budget.
 */
export async function callGeminiItinerary({
  catalog,
  preference,
  apiKey = process.env.GEMINI_API_KEY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  callGeminiText = defaultCallGeminiText,
}) {
  if (!apiKey || !String(apiKey).trim()) {
    const err = new Error('Chưa cấu hình GEMINI_API_KEY.');
    err.code = 'AI_NOT_CONFIGURED';
    throw err;
  }

  const prompt = buildPrompt({ catalog, preference });
  const rawText = await callGeminiText({
    prompt,
    apiKey: String(apiKey).trim(),
    timeoutMs,
  });

  return parseAndValidateGeminiResponse(rawText, catalog, preference);
}

function formatClock(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Deterministic local fallback engine when Gemini fails (timeout, 429 quota, or invalid schema).
 * Strictly guarantees total visit + transit time <= preference.durationHours * 60.
 *
 * @param {{ catalog: Array<object>, preference: object }} params
 */
export function generateDeterministicFallback({ catalog, preference }) {
  const budgetMinutes = preference.durationHours * 60;
  const transitBufferMinutes = TRANSIT_BUFFER_MINUTES;

  // 1. Filter places by preference interests
  let matched = catalog.filter((p) =>
    preference.interests.includes(p.category),
  );
  if (matched.length === 0) {
    matched = [...catalog];
  }

  // 2. Prioritize selectedPlaceIds first, then interest-matched places, then remaining catalog
  const prioritized = [];
  if (Array.isArray(preference.selectedPlaceIds)) {
    for (const id of preference.selectedPlaceIds) {
      const p = catalog.find((x) => x.id === id);
      if (p && !prioritized.some((x) => x.id === p.id)) {
        prioritized.push(p);
      }
    }
  }
  for (const p of matched) {
    if (!prioritized.some((x) => x.id === p.id)) {
      prioritized.push(p);
    }
  }
  for (const p of catalog) {
    if (!prioritized.some((x) => x.id === p.id)) {
      prioritized.push(p);
    }
  }

  // 3. Pack stops strictly within budgetMinutes (including transit buffers)
  const stops = [];
  let usedMinutes = 0;
  let cursorMinutes = 8 * 60 + 30; // Start at 08:30

  for (const place of prioritized) {
    const rawDuration =
      typeof place.estimatedVisitTimeMinutes === 'number' &&
      place.estimatedVisitTimeMinutes > 0
        ? Math.round(place.estimatedVisitTimeMinutes)
        : 60;

    const transitNeeded = stops.length > 0 ? transitBufferMinutes : 0;
    const remainingForVisit = budgetMinutes - usedMinutes - transitNeeded;

    if (remainingForVisit < 30) {
      break;
    }

    let duration = rawDuration;
    if (duration > remainingForVisit) {
      if (stops.length === 0) {
        // Clamp first stop so even a large monument fits a tight 2h budget
        duration = remainingForVisit;
      } else {
        // Try next candidate that might have a shorter visit time
        continue;
      }
    }

    if (transitNeeded > 0) {
      cursorMinutes += transitNeeded;
    }

    const stopStart = formatClock(cursorMinutes);
    cursorMinutes += duration;
    const stopEnd = formatClock(cursorMinutes);

    usedMinutes += transitNeeded + duration;

    const storyText =
      typeof place.story === 'string' && place.story.trim()
        ? place.story.trim()
        : `Khám phá nét đẹp di sản tại ${place.vietnameseName}.`;

    const culturalInsight =
      storyText.length > 160 ? `${storyText.slice(0, 157)}...` : storyText;

    const tipText =
      Array.isArray(place.localTips) && place.localTips[0]
        ? ` Gợi ý: ${place.localTips[0]}.`
        : '';

    stops.push({
      order: stops.length + 1,
      placeId: place.id,
      placeName: place.vietnameseName,
      timeSlot: `${stopStart} - ${stopEnd}`,
      durationMinutes: duration,
      activityRecommendation: `Tham quan trải nghiệm và tìm hiểu giá trị văn hóa tại ${place.vietnameseName}.${tipText}`,
      culturalInsight,
      transportTip:
        stops.length === 0
          ? `Khởi hành từ ${sanitizeStartLocation(preference.startLocation)} bằng xe máy hoặc taxi.`
          : 'Khoảng 15-20 phút di chuyển bằng xe máy hoặc taxi giữa các điểm.',
    });
  }

  return {
    id: `itinerary-fallback-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: `Lịch trình khám phá văn hóa Huế (${preference.durationHours} giờ)`,
    summary:
      'Lịch trình được tối ưu cục bộ từ danh mục di sản theo sở thích và thời gian của bạn khi kết nối AI tạm thời gián đoạn.',
    durationHours: preference.durationHours,
    targetInterests: preference.interests,
    stops,
    totalEstimatedCostVND: '100.000 - 300.000 VNĐ (ước tính)',
    culturalHighlights: stops.map((s) => s.placeName),
    isFallback: true,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Orchestrate Gemini call with transparent deterministic fallback on any AI runtime/schema failure.
 */
export async function generateJourney({
  catalog,
  preference,
  apiKey = process.env.GEMINI_API_KEY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  callGeminiText = defaultCallGeminiText,
}) {
  try {
    return await callGeminiItinerary({
      catalog,
      preference,
      apiKey,
      timeoutMs,
      callGeminiText,
    });
  } catch (err) {
    if (err && err.code === 'AI_NOT_CONFIGURED') {
      throw err;
    }
    return generateDeterministicFallback({ catalog, preference });
  }
}
