export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // TODO (Hackathon Day): Xây dựng API lọc và truy vấn danh sách địa điểm văn hóa trong thời gian thi
  return res.status(501).json({
    status: 'not_implemented',
    error: 'Not Implemented',
    message: 'Chức năng API địa điểm văn hóa chưa triển khai. Sẽ được phát triển trong thời gian thi hackathon.'
  });
}
