import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

import {
  validateJourneyPreference,
  parseAndValidateGeminiResponse,
} from '../validator.js';
import {
  generateDeterministicFallback,
  generateJourney,
} from '../service.js';
import { createJourneyRouter } from '../router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtures = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures.json'), 'utf8'),
);

function parseTimeSlotMinutes(slot) {
  const match = /^(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})$/.exec(slot.trim());
  assert.ok(match, `Invalid timeSlot format: ${slot}`);
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  return { start, end };
}

async function postJson(app, body) {
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return { status: res.status, body: json };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

describe('TV2 Journey Validator — Input Validation', () => {
  it('accepts valid preference and normalizes optional fields', () => {
    const result = validateJourneyPreference(
      {
        durationHours: 4,
        interests: ['craft', 'monument', 'craft'],
        startLocation: 'Khách sạn Morin Huế',
        pace: 'relaxed',
        companion: 'couple',
        selectedPlaceIds: ['lang-non-tay-ho'],
      },
      fixtures,
    );

    assert.equal(result.ok, true);
    assert.deepEqual(result.value, {
      durationHours: 4,
      interests: ['craft', 'monument'],
      startLocation: 'Khách sạn Morin Huế',
      pace: 'relaxed',
      companion: 'couple',
      selectedPlaceIds: ['lang-non-tay-ho'],
    });
  });

  it('rejects non-integer, negative, string, or out-of-range durationHours', () => {
    for (const bad of [0, 1, 9, -4, 3.5, '4', null, undefined, NaN]) {
      const res = validateJourneyPreference(
        { durationHours: bad, interests: ['craft'], startLocation: 'Huế' },
        fixtures,
      );
      assert.equal(res.ok, false, `Expected durationHours=${String(bad)} to fail`);
      assert.equal(res.error.code, 'INVALID_REQUEST');
    }
  });

  it('rejects empty or unknown interests categories', () => {
    assert.equal(
      validateJourneyPreference({ durationHours: 4, interests: [] }, fixtures).ok,
      false,
    );
    assert.equal(
      validateJourneyPreference(
        { durationHours: 4, interests: ['craft', 'nightlife'] },
        fixtures,
      ).ok,
      false,
    );
  });

  it('rejects startLocation exceeding 200 characters or non-string', () => {
    const tooLong = 'A'.repeat(201);
    const res = validateJourneyPreference(
      { durationHours: 4, interests: ['craft'], startLocation: tooLong },
      fixtures,
    );
    assert.equal(res.ok, false);
    assert.equal(res.error.code, 'INVALID_REQUEST');
  });

  it('rejects invalid pace or companion values', () => {
    assert.equal(
      validateJourneyPreference(
        { durationHours: 4, interests: ['craft'], pace: 'turbo' },
        fixtures,
      ).ok,
      false,
    );
    assert.equal(
      validateJourneyPreference(
        { durationHours: 4, interests: ['craft'], companion: 'tour-bus' },
        fixtures,
      ).ok,
      false,
    );
  });

  it('rejects more than 3 selectedPlaceIds or foreign place IDs', () => {
    const tooMany = validateJourneyPreference(
      {
        durationHours: 6,
        interests: ['craft'],
        selectedPlaceIds: [
          'lang-non-tay-ho',
          'lang-huong-thuy-xuan',
          'dai-noi-hue',
          'chua-thien-mu',
        ],
      },
      fixtures,
    );
    assert.equal(tooMany.ok, false);

    const foreign = validateJourneyPreference(
      {
        durationHours: 4,
        interests: ['craft'],
        selectedPlaceIds: ['dia-diem-khong-ton-tai'],
      },
      fixtures,
    );
    assert.equal(foreign.ok, false);
    assert.equal(foreign.error.code, 'INVALID_REQUEST');
  });
});

describe('TV2 Journey Validator — Gemini Output Schema & Guardrails', () => {
  const basePref = {
    durationHours: 4,
    interests: ['craft', 'monument'],
    startLocation: 'Trung tâm TP. Huế',
    pace: 'moderate',
    companion: 'solo',
  };

  it('parses markdown-fenced JSON, overwrites placeName from catalog, and enforces system fields', () => {
    const raw = `\`\`\`json
{
  "id": "spoofed-ai-id",
  "isFallback": true,
  "generatedAt": "1999-01-01T00:00:00.000Z",
  "title": "Hành Trình Chạm Hồn Nghề Huế",
  "summary": "Một buổi sáng lắng đọng giữa nón bài thơ và sắc hương Thủy Xuân.",
  "totalEstimatedCostVND": "150.000 - 250.000 VNĐ",
  "culturalHighlights": ["Chằm nón bài thơ", "Se hương trầm cổ truyền"],
  "stops": [
    {
      "order": 99,
      "placeId": "lang-non-tay-ho",
      "placeName": "Tên AI tự sửa sai",
      "timeSlot": "08:30 - 09:45",
      "durationMinutes": 75,
      "activityRecommendation": "Xem nghệ nhân lồng thơ dưới lớp lá nón.",
      "culturalInsight": "Di sản trăm năm bên sông Như Ý.",
      "transportTip": "Xe máy khoảng 20 phút từ trung tâm."
    },
    {
      "order": 100,
      "placeId": "lang-huong-thuy-xuan",
      "placeName": "Tên sai 2",
      "timeSlot": "10:15 - 11:15",
      "durationMinutes": 60,
      "activityRecommendation": "Tự tay se hương trầm.",
      "culturalInsight": "Nghề hương 700 năm phục vụ triều Nguyễn."
    }
  ]
}
\`\`\``;

    const itinerary = parseAndValidateGeminiResponse(raw, fixtures, basePref);
    assert.notEqual(itinerary.id, 'spoofed-ai-id');
    assert.equal(itinerary.isFallback, false);
    assert.notEqual(itinerary.generatedAt, '1999-01-01T00:00:00.000Z');
    assert.equal(itinerary.stops[0].order, 1);
    assert.equal(itinerary.stops[0].placeName, 'Làng nón Tây Hồ');
    assert.equal(itinerary.stops[1].order, 2);
    assert.equal(itinerary.stops[1].placeName, 'Làng hương Thủy Xuân');
  });

  it('rejects hallucinated placeId not in catalog', () => {
    const raw = JSON.stringify({
      title: 'Lộ trình lỗi',
      summary: 'Có địa điểm ảo',
      totalEstimatedCostVND: '100.000 VNĐ',
      culturalHighlights: ['Ảo'],
      stops: [
        {
          order: 1,
          placeId: 'lang-ao-khong-co-that',
          timeSlot: '08:30 - 09:30',
          durationMinutes: 60,
          activityRecommendation: 'Tham quan',
          culturalInsight: 'Văn hóa',
        },
      ],
    });

    assert.throws(
      () => parseAndValidateGeminiResponse(raw, fixtures, basePref),
      /placeId/i,
    );
  });

  it('rejects overlapping timeSlots across stops', () => {
    const raw = JSON.stringify({
      title: 'Trùng giờ',
      summary: 'Chồng chéo thời gian',
      totalEstimatedCostVND: '100.000 VNĐ',
      culturalHighlights: ['Test'],
      stops: [
        {
          order: 1,
          placeId: 'lang-non-tay-ho',
          timeSlot: '08:30 - 10:00',
          durationMinutes: 90,
          activityRecommendation: 'A',
          culturalInsight: 'B',
        },
        {
          order: 2,
          placeId: 'lang-huong-thuy-xuan',
          timeSlot: '09:30 - 10:30',
          durationMinutes: 60,
          activityRecommendation: 'C',
          culturalInsight: 'D',
        },
      ],
    });

    assert.throws(
      () => parseAndValidateGeminiResponse(raw, fixtures, basePref),
      /overlap|timeSlot/i,
    );
  });

  it('rejects stops exceeding total durationHours time budget', () => {
    const pref2h = { ...basePref, durationHours: 2 };
    const raw = JSON.stringify({
      title: 'Vượt ngân sách 2h',
      summary: 'Quá dài',
      totalEstimatedCostVND: '200.000 VNĐ',
      culturalHighlights: ['Test'],
      stops: [
        {
          order: 1,
          placeId: 'dai-noi-hue',
          timeSlot: '08:00 - 10:00',
          durationMinutes: 120,
          activityRecommendation: 'A',
          culturalInsight: 'B',
        },
        {
          order: 2,
          placeId: 'lang-huong-thuy-xuan',
          timeSlot: '10:20 - 11:20',
          durationMinutes: 60,
          activityRecommendation: 'C',
          culturalInsight: 'D',
        },
      ],
    });

    assert.throws(
      () => parseAndValidateGeminiResponse(raw, fixtures, pref2h),
      /budget|duration/i,
    );
  });
});

describe('TV2 Deterministic Fallback Engine', () => {
  it('never exceeds tight 2-hour time budget including transit buffer', () => {
    const fallback = generateDeterministicFallback({
      catalog: fixtures,
      preference: {
        durationHours: 2,
        interests: ['craft', 'monument'],
        startLocation: 'Huế',
        pace: 'moderate',
        companion: 'solo',
        selectedPlaceIds: ['dai-noi-hue', 'lang-non-tay-ho'],
      },
    });

    assert.equal(fallback.isFallback, true);
    assert.ok(fallback.stops.length >= 1);

    const transitTotal = (fallback.stops.length - 1) * 20;
    const visitTotal = fallback.stops.reduce((sum, s) => sum + s.durationMinutes, 0);
    assert.ok(
      visitTotal + transitTotal <= 120,
      `Expected ${visitTotal + transitTotal} <= 120 minutes`,
    );

    let prevEnd = -1;
    for (const stop of fallback.stops) {
      assert.ok(fixtures.some((p) => p.id === stop.placeId));
      const { start, end } = parseTimeSlotMinutes(stop.timeSlot);
      assert.ok(end > start);
      assert.ok(start >= prevEnd, 'Fallback timeSlots must not overlap');
      prevEnd = end;
    }
  });

  it('prioritizes selectedPlaceIds and packs multiple stops within 5-hour budget', () => {
    const fallback = generateDeterministicFallback({
      catalog: fixtures,
      preference: {
        durationHours: 5,
        interests: ['craft'],
        startLocation: 'Cầu Trường Tiền',
        pace: 'moderate',
        companion: 'friends',
        selectedPlaceIds: ['chua-thien-mu'],
      },
    });

    assert.equal(fallback.isFallback, true);
    assert.equal(fallback.stops[0].placeId, 'chua-thien-mu');
    assert.equal(fallback.stops[0].placeName, 'Chùa Thiên Mụ');
    assert.ok(fallback.stops.length >= 2);

    const firstStart = parseTimeSlotMinutes(fallback.stops[0].timeSlot).start;
    const lastEnd = parseTimeSlotMinutes(
      fallback.stops[fallback.stops.length - 1].timeSlot,
    ).end;
    assert.ok(lastEnd - firstStart <= 5 * 60);
  });
});

describe('TV2 Express Router — POST /api/itinerary HTTP Contract v1', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  before(() => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';
  });

  after(() => {
    if (originalKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  it('returns 400 INVALID_REQUEST on invalid payload', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/itinerary', createJourneyRouter({ getPlaces: () => fixtures }));

    const res = await postJson(app, { durationHours: 12, interests: [] });
    assert.equal(res.status, 400);
    assert.equal(res.body.error?.code, 'INVALID_REQUEST');
  });

  it('returns 503 DATA_NOT_READY when catalog is empty or throws', async () => {
    const appEmpty = express();
    appEmpty.use(express.json());
    appEmpty.use('/api/itinerary', createJourneyRouter({ getPlaces: () => [] }));

    const resEmpty = await postJson(appEmpty, {
      durationHours: 4,
      interests: ['craft'],
      startLocation: 'Huế',
      pace: 'moderate',
      companion: 'solo',
    });
    assert.equal(resEmpty.status, 503);
    assert.equal(resEmpty.body.error?.code, 'DATA_NOT_READY');

    const appThrow = express();
    appThrow.use(express.json());
    appThrow.use(
      '/api/itinerary',
      createJourneyRouter({
        getPlaces: () => {
          throw new Error('ENOENT');
        },
      }),
    );

    const resThrow = await postJson(appThrow, {
      durationHours: 4,
      interests: ['craft'],
      startLocation: 'Huế',
      pace: 'moderate',
      companion: 'solo',
    });
    assert.equal(resThrow.status, 503);
    assert.equal(resThrow.body.error?.code, 'DATA_NOT_READY');
  });

  it('returns 503 AI_NOT_CONFIGURED when GEMINI_API_KEY is missing', async () => {
    const saved = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const app = express();
      app.use(express.json());
      app.use('/api/itinerary', createJourneyRouter({ getPlaces: () => fixtures }));

      const res = await postJson(app, {
        durationHours: 4,
        interests: ['craft'],
        startLocation: 'Huế',
        pace: 'moderate',
        companion: 'solo',
      });
      assert.equal(res.status, 503);
      assert.equal(res.body.error?.code, 'AI_NOT_CONFIGURED');
    } finally {
      process.env.GEMINI_API_KEY = saved;
    }
  });

  it('returns 200 direct JourneyItinerary (isFallback: false) when Gemini succeeds', async () => {
    const mockRawText = JSON.stringify({
      title: 'Hành Trình Nón Thơ & Sắc Hương',
      summary: 'Khám phá hai làng nghề tiêu biểu xứ Huế.',
      totalEstimatedCostVND: '120.000 - 200.000 VNĐ',
      culturalHighlights: ['Nón bài thơ Tây Hồ', 'Hương trầm Thủy Xuân'],
      stops: [
        {
          order: 1,
          placeId: 'lang-non-tay-ho',
          placeName: 'Ignored',
          timeSlot: '08:30 - 09:45',
          durationMinutes: 75,
          activityRecommendation: 'Xem chằm nón bài thơ.',
          culturalInsight: 'Tinh hoa thủ công bên sông Như Ý.',
          transportTip: 'Xe máy 20 phút.',
        },
      ],
    });

    const app = express();
    app.use(express.json());
    app.use(
      '/api/itinerary',
      createJourneyRouter({
        getPlaces: () => fixtures,
        callGeminiText: async () => mockRawText,
      }),
    );

    const res = await postJson(app, {
      durationHours: 3,
      interests: ['craft'],
      startLocation: 'Trung tâm TP. Huế',
      pace: 'moderate',
      companion: 'solo',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.data, undefined, 'Must not wrap in { data }');
    assert.equal(res.body.isFallback, false);
    assert.equal(res.body.stops[0].placeName, 'Làng nón Tây Hồ');
  });

  it('falls back gracefully with 200 (isFallback: true) when Gemini times out or returns 429/hallucination', async () => {
    const app = express();
    app.use(express.json());
    app.use(
      '/api/itinerary',
      createJourneyRouter({
        getPlaces: () => fixtures,
        callGeminiText: async () => {
          const err = new Error('Quota exceeded');
          err.status = 429;
          throw err;
        },
      }),
    );

    const res = await postJson(app, {
      durationHours: 4,
      interests: ['craft'],
      startLocation: 'Huế',
      pace: 'moderate',
      companion: 'couple',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.isFallback, true);
    assert.ok(Array.isArray(res.body.stops) && res.body.stops.length > 0);
  });

  it('generateJourney also falls back when Gemini output fails validation', async () => {
    const result = await generateJourney({
      catalog: fixtures,
      preference: {
        durationHours: 3,
        interests: ['craft'],
        startLocation: 'Huế',
        pace: 'moderate',
        companion: 'solo',
      },
      apiKey: 'test-key',
      callGeminiText: async () => '{"broken_json": ',
    });

    assert.equal(result.isFallback, true);
    assert.ok(result.stops.length >= 1);
  });
});
