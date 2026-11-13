export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // TODO (Hackathon Day): Xây dựng logic chấm điểm, ngân hàng câu hỏi quiz và lưu tiến độ hộ chiếu vào MongoDB Atlas
  return res.status(501).json({
    status: 'not_implemented',
    error: 'Not Implemented',
    message: 'Chức năng Hộ chiếu văn hóa và Quiz chưa triển khai. Sẽ được phát triển trong thời gian thi hackathon.'
  });
}
