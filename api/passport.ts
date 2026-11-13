import { getMongoDb } from './lib/mongodb';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getMongoDb();

  // GET: Lấy thông tin Hộ Chiếu Văn Hóa của người dùng
  if (req.method === 'GET') {
    const userId = req.query.userId || 'demo-user-1';

    if (!db) {
      // Khi chưa có MongoDB URI, trả về profile mock để client lưu localStorage
      return res.status(200).json({
        userId,
        displayName: 'Người Khám Phá Di Sản',
        points: 120,
        visitedPlaceIds: ['lang-non-tay-ho', 'dai-noi-hue'],
        completedQuizIds: ['quiz-tay-ho-1'],
        badges: [
          {
            id: 'badge-explorer-hue',
            name: 'Người Con Xứ Huế',
            description: 'Bắt đầu hành trình khám phá di sản Cố Đô.',
            icon: '🏛️',
            category: 'explorer',
            unlockedAt: new Date().toISOString()
          }
        ],
        storageSource: 'mock-local'
      });
    }

    try {
      const collection = db.collection('passports');
      let profile = await collection.findOne({ userId });

      if (!profile) {
        // Tạo profile mới nếu chưa tồn tại
        const newProfile = {
          userId,
          displayName: 'Người Khám Phá Di Sản',
          points: 100,
          visitedPlaceIds: ['lang-non-tay-ho'],
          completedQuizIds: [],
          badges: [
            {
              id: 'badge-explorer-hue',
              name: 'Người Con Xứ Huế',
              description: 'Bắt đầu hành trình khám phá di sản Cố Đô.',
              icon: '🏛️',
              category: 'explorer',
              unlockedAt: new Date().toISOString()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await collection.insertOne(newProfile);
        profile = newProfile;
      }

      return res.status(200).json({ ...profile, storageSource: 'mongodb' });
    } catch (error: any) {
      console.error('MongoDB read error:', error);
      return res.status(500).json({ error: 'Failed to read passport profile' });
    }
  }

  // POST: Cập nhật điểm, hoàn thành quiz, hoặc mở khóa huy hiệu
  if (req.method === 'POST') {
    const { userId = 'demo-user-1', pointsToAdd = 0, placeId, quizId, newBadge } = req.body || {};

    if (!db) {
      return res.status(200).json({
        success: true,
        message: 'Saved to local session (MongoDB not configured)',
        storageSource: 'local-fallback'
      });
    }

    try {
      const collection = db.collection('passports');
      const updateDoc: any = {
        $inc: { points: pointsToAdd },
        $set: { updatedAt: new Date() }
      };

      if (placeId) {
        updateDoc.$addToSet = { ...(updateDoc.$addToSet || {}), visitedPlaceIds: placeId };
      }
      if (quizId) {
        updateDoc.$addToSet = { ...(updateDoc.$addToSet || {}), completedQuizIds: quizId };
      }
      if (newBadge) {
        updateDoc.$addToSet = { ...(updateDoc.$addToSet || {}), badges: newBadge };
      }

      await collection.updateOne({ userId }, updateDoc, { upsert: true });

      const updatedProfile = await collection.findOne({ userId });
      return res.status(200).json({
        success: true,
        profile: updatedProfile,
        storageSource: 'mongodb'
      });
    } catch (error: any) {
      console.error('MongoDB update error:', error);
      return res.status(500).json({ error: 'Failed to update passport profile' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
