import express from 'express';
import fs from 'fs';

const PLACES_DATA_URL = new URL('../../../public/data/places.json', import.meta.url);

const VALID_CATEGORIES = new Set(['all', 'craft', 'monument', 'cuisine', 'spiritual', 'nature']);

/**
 * Chuẩn hóa chuỗi tiếng Việt không dấu để tìm kiếm thông minh.
 * @param {string} value
 * @returns {string}
 */
function normalizeVietnamese(value) {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Đọc danh sách địa điểm văn hóa đồng bộ từ public/data/places.json.
 * @returns {Array<Record<string, unknown>>}
 */
export function getPlaces() {
  try {
    const raw = fs.readFileSync(PLACES_DATA_URL, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Catalog] Không thể đọc public/data/places.json:', err);
    return [];
  }
}

/**
 * Tạo Express Router cho endpoint /api/places.
 * Hỗ trợ GET /?category=craft&search=... và GET /:id.
 */
export function createCatalogRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    const rawCategory = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
    const rawSearch =
      typeof req.query.search === 'string'
        ? req.query.search.trim()
        : typeof req.query.q === 'string'
          ? req.query.q.trim()
          : '';

    if (rawCategory && !VALID_CATEGORIES.has(rawCategory)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CATEGORY',
          message: `Danh mục '${rawCategory}' không hợp lệ. Các giá trị hỗ trợ: craft, monument, cuisine, spiritual, nature, all.`,
        },
      });
    }

    let places = getPlaces();

    if (rawCategory && rawCategory !== 'all') {
      places = places.filter((place) => place && place.category === rawCategory);
    }

    if (rawSearch) {
      const normalizedQuery = normalizeVietnamese(rawSearch);
      places = places.filter((place) => {
        if (!place || typeof place !== 'object') return false;
        const fields = [
          place.id,
          place.name,
          place.vietnameseName,
          place.categoryLabel,
          place.location,
          place.shortDescription,
          place.story,
          place.craftDetails,
          place.historicalSignificance,
          ...(Array.isArray(place.tags) ? place.tags : []),
        ];
        return fields.some((field) => normalizeVietnamese(String(field || '')).includes(normalizedQuery));
      });
    }

    return res.status(200).json({
      places,
      total: places.length,
    });
  });

  router.get('/:id', (req, res) => {
    const targetId = String(req.params.id || '').trim();
    const places = getPlaces();
    const place = places.find((item) => item && item.id === targetId);

    if (!place) {
      return res.status(404).json({
        error: {
          code: 'PLACE_NOT_FOUND',
          message: `Không tìm thấy địa điểm văn hóa với mã '${targetId}'.`,
        },
      });
    }

    return res.status(200).json({
      ...place,
      place,
    });
  });

  return router;
}
