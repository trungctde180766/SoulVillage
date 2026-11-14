import express from 'express';

/**
 * Tạo Express Router cho endpoint /api/itinerary.
 * Nhận hàm getPlaces được inject từ server.js.
 * Sẽ do TV2 hoàn thiện sau tín hiệu READY.
 */
export function createJourneyRouter({ getPlaces }) {
  const router = express.Router();

  router.post('/', (_req, res) => {
    void getPlaces;
    res.status(501).json({
      status: 'not_implemented',
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Chức năng tạo hành trình AI bằng Gemini chưa triển khai. Sẽ do TV2 phát triển sau tín hiệu READY.'
      }
    });
  });

  return router;
}
