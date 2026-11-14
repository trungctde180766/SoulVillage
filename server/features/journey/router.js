import express from 'express';
import fs from 'fs';
import { validateJourneyPreference } from './validator.js';
import { generateJourney } from './service.js';
/**
 * Tạo Express Router cho endpoint POST /api/itinerary (Contract v1 — TV2).
 * Nhận hàm đồng bộ getPlaces được inject từ server.js.
 *
 * @param {{
 *   getPlaces: () => Array<object>,
 *   callGeminiText?: (opts: object) => Promise<string>,
 *   timeoutMs?: number
 * }} deps
 */
export function createJourneyRouter({
  getPlaces,
  callGeminiText,
  timeoutMs,
} = {}) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    // 1. Validate request structure and scalar constraints first
    const basicCheck = validateJourneyPreference(req.body, null);
    if (!basicCheck.ok) {
      return res.status(400).json({ error: basicCheck.error });
    }

    // 2. Load catalog synchronously from TV3's getPlaces()
    let places;
    try {
      places = typeof getPlaces === 'function' ? getPlaces() : null;
    } catch {
      places = null;
    }
    // If enabled for local dev preview, fall back to preview catalog when TV3 catalog is still empty
    if ((!Array.isArray(places) || places.length === 0) && process.env.ALLOW_FIXTURE_CATALOG === 'true') {
      try {
        const previewUrl = new URL('./test/previewCatalog.json', import.meta.url);
        places = JSON.parse(fs.readFileSync(previewUrl, 'utf8'));
      } catch {
        // ignore
      }
    }

    if (!Array.isArray(places) || places.length === 0) {
      return res.status(503).json({
        error: {
          code: 'DATA_NOT_READY',
          message:
            'Dữ liệu di sản đang chuẩn bị, vui lòng thử lại sau giây lát.',
        },
      });
    }

    // 3. Validate selectedPlaceIds membership against loaded catalog
    const fullCheck = validateJourneyPreference(req.body, places);
    if (!fullCheck.ok) {
      return res.status(400).json({ error: fullCheck.error });
    }

    // 4. Verify GEMINI_API_KEY configuration
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !String(apiKey).trim()) {
      return res.status(503).json({
        error: {
          code: 'AI_NOT_CONFIGURED',
          message: 'Hệ thống trí tuệ nhân tạo đang bảo trì (thiếu cấu hình khóa API).',
        },
      });
    }

    // 5. Call Gemini with 20s timeout and transparent local fallback on AI error
    const itinerary = await generateJourney({
      catalog: places,
      preference: fullCheck.value,
      apiKey: String(apiKey).trim(),
      timeoutMs,
      callGeminiText,
    });

    return res.status(200).json(itinerary);
  });

  return router;
}
