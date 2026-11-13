export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // TODO (Hackathon Day): Xây dựng prompt kỹ thuật cao và gọi Google Gemini API tạo lịch trình cá nhân hóa
  return res.status(501).json({
    status: 'not_implemented',
    error: 'Not Implemented',
    message: 'Chức năng tạo hành trình AI bằng Gemini chưa triển khai. Sẽ được phát triển trong thời gian thi hackathon.'
  });
}
