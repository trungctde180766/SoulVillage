import express from 'express';

/**
 * Đọc danh sách địa điểm văn hóa đồng bộ từ public/data/places.json.
 * Sẽ do TV3 hoàn thiện sau tín hiệu READY.
 */
export function getPlaces() {
  return [];
}

/**
 * Tạo Express Router cho endpoint /api/places.
 * Sẽ do TV3 hoàn thiện sau tín hiệu READY.
 */
export function createCatalogRouter() {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.status(501).json({
      status: 'not_implemented',
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Chức năng API địa điểm văn hóa chưa triển khai. Sẽ do TV3 phát triển sau tín hiệu READY.'
      }
    });
  });

  return router;
}
