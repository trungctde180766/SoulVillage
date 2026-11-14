import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAuthRouter } from './server/features/auth/router.js';
import { getPlaces, createCatalogRouter } from './server/features/catalog/router.js';
import { createJourneyRouter } from './server/features/journey/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// Middleware xử lý lỗi cú pháp JSON payload gửi lên (trả về JSON 400 thay vì HTML stack trace)
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Dữ liệu JSON gửi lên không hợp lệ.'
      }
    });
  }
  next(err);
});

// 1. Health check endpoint for Google Cloud Run
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'soulvillage',
    timestamp: new Date().toISOString()
  });
});

// 2. Mount modular feature routers (Contract v1 + Authentication)
app.use('/api/auth', createAuthRouter());
app.use('/api/places', createCatalogRouter());
app.use('/api/itinerary', createJourneyRouter({ getPlaces }));

// 3. Unimplemented / out-of-MVP-backend routes (Trả về HTTP 501 theo hợp đồng v1)
app.all('/api/passport', (_req, res) => {
  res.status(501).json({
    status: 'not_implemented',
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Chức năng Hộ chiếu văn hóa và Quiz lưu trữ cục bộ trên thiết bị trong phạm vi MVP.'
    }
  });
});

// Bất kỳ route /api nào chưa được định nghĩa đều trả về JSON 404, không rơi vào SPA HTML fallback
app.use('/api', (_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'API Endpoint Not Found'
    }
  });
});

// 4. Serve static built frontend từ thư mục dist và dữ liệu tĩnh từ public
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');
app.use(express.static(distPath));
app.use(express.static(publicPath));

// 5. SPA Fallback chỉ phục vụ các yêu cầu trang HTML hợp lệ (GET / HEAD)
app.use((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource Not Found'
      }
    });
  }

  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res
        .status(500)
        .send(
          'Frontend bundle chưa được build. Vui lòng chạy npm run build trước khi khởi động production server.'
        );
    }
  });
});

// Khởi động server lắng nghe trên 0.0.0.0
app.listen(PORT, HOST, () => {
  console.log(`[SoulVillage] Server running at http://${HOST}:${PORT}`);
});
