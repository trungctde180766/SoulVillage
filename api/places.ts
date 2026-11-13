export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sample verified data for Hue starter kit
  const places = [
    {
      id: 'lang-non-tay-ho',
      name: 'Tay Ho Conical Hat Village',
      vietnameseName: 'Làng Nón Tây Hồ',
      category: 'craft',
      categoryLabel: 'Làng nghề truyền thống',
      location: 'Phú Vang, Thừa Thiên Huế',
      shortDescription: 'Cái nôi của nón bài thơ xứ Huế lừng danh với kỹ thuật khâu chằm tinh tế.',
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      estimatedVisitTimeMinutes: 90
    },
    {
      id: 'lang-huong-thuy-xuan',
      name: 'Thuy Xuan Incense Village',
      vietnameseName: 'Làng Hương Thủy Xuân',
      category: 'craft',
      categoryLabel: 'Làng nghề truyền thống',
      location: 'Thủy Xuân, TP. Huế',
      shortDescription: 'Làng nghề hương trầm hơn 700 năm tuổi rực rỡ sắc màu thảo mộc.',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      estimatedVisitTimeMinutes: 75
    },
    {
      id: 'dai-noi-hue',
      name: 'The Imperial Citadel of Hue',
      vietnameseName: 'Đại Nội Huế',
      category: 'monument',
      categoryLabel: 'Di tích lịch sử',
      location: 'Thuận Hòa, TP. Huế',
      shortDescription: 'Quần thể hoàng thành Cố đô triều Nguyễn, Di sản Văn hóa Thế giới UNESCO.',
      imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
      estimatedVisitTimeMinutes: 180
    },
    {
      id: 'chua-thien-mu',
      name: 'Thien Mu Pagoda',
      vietnameseName: 'Chùa Thiên Mụ',
      category: 'spiritual',
      categoryLabel: 'Tâm linh & Cổ tự',
      location: 'Kim Long, TP. Huế',
      shortDescription: 'Đệ nhất cổ tự xứ Huế bên bờ sông Hương gắn liền với tháp Phước Duyên.',
      imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      estimatedVisitTimeMinutes: 60
    }
  ];

  const { category, search } = req.query || {};

  let filtered = places;
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(p => 
      p.vietnameseName.toLowerCase().includes(s) || 
      p.name.toLowerCase().includes(s) ||
      p.shortDescription.toLowerCase().includes(s)
    );
  }

  return res.status(200).json({
    total: filtered.length,
    places: filtered
  });
}

