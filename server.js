import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';

app.use(express.json());

// 1. Health check endpoint for Google Cloud Run
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'soulvillage',
    timestamp: new Date().toISOString()
  });
});

// 2. Unimplemented business API routes (Trả về HTTP 501 theo quy tắc starter kit)
app.all('/api/itinerary', (req, res) => {
  res.status(501).json({
    status: 'not_implemented',
    error: 'Not Implemented',
    message: 'Chức năng tạo hành trình AI bằng Gemini chưa triển khai. Sẽ được phát triển trong thời gian thi hackathon.'
  });
});

app.all('/api/places', (req, res) => {
  res.status(501).json({
    status: 'not_implemented',
    error: 'Not Implemented',
    message: 'Chức năng API địa điểm văn hóa chưa triển khai. Sẽ được phát triển trong thời gian thi hackathon.'
  });
});

app.all('/api/passport', (req, res) => {
  res.status(501).json({
    status: 'not_implemented',
    error: 'Not Implemented',
    message: 'Chức năng Hộ chiếu văn hóa và Quiz chưa triển khai. Sẽ được phát triển trong thời gian thi hackathon.'
  });
});

// Bất kỳ route /api nào chưa được định nghĩa đều trả về JSON 404, không rơi vào SPA HTML fallback
app.use('/api', (req, res) => {
  res.status(404).json({
    status: 'not_found',
    error: 'API Endpoint Not Found'
  });
});

// 3. Serve static built frontend từ thư mục dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 4. SPA Fallback cho các router phía frontend
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Khởi động server lắng nghe trên 0.0.0.0
app.listen(PORT, HOST, () => {
  console.log(`[SoulVillage Starter] Server running at http://${HOST}:${PORT}`);
});
