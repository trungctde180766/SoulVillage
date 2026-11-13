# 🏛️ Tài Liệu Đặc Tả & Mã Nguồn Giao Diện Web (Web Component Blueprints)
**Dự Án: Hồn Làng (SoulVillage) — GDG DevFest MienTrung 2026 Hackathon**

> **Mục đích:** Lưu trữ toàn bộ mã nguồn tham khảo, giao diện mẫu, cấu trúc dữ liệu và prompt AI phục vụ cho 3 thành viên lập trình từ đầu trong 270 phút thi đấu chính thức. Mã nguồn này đã được gỡ bỏ khỏi repository để giữ repository ở trạng thái **Starter Template tối giản (0% business code)**.

---

## MỤC LỤC
1. [Phân công & Trách nhiệm 3 thành viên](#1-phân-công--trách-nhiệm-3-thành-viên)
2. [Hợp đồng kết nối & Data Contracts](#2-hợp-đồng-kết-nối--data-contracts)
3. [Mã nguồn TV1: Explore, Detail & Layout](#3-mã-nguồn-tv1-explore-detail--layout)
4. [Mã nguồn TV2: Gemini AI Journey & Backend](#4-mã-nguồn-tv2-gemini-ai-journey--backend)
5. [Mã nguồn TV3: Catalog Data, Passport & Quiz](#5-mã-nguồn-tv3-catalog-data-passport--quiz)

---

## 1. Phân Công & Trách Nhiệm 3 Thành Viên

| Thành viên | Trách nhiệm chính | Phạm vi file được sửa |
| :--- | :--- | :--- |
| **TV1 (Trưởng nhóm)** | Quản lý main, Cloud Run, Explore UI, Chi tiết địa điểm, Layout | `src/components/layout/`, `src/features/explore/`, `src/features/places/`, `src/services/api.ts`, `server.js`, `Dockerfile` |
| **TV2** | Prompt Engineering Gemini 2.5 Flash, API tạo hành trình, Timeline UI | `src/features/journey/`, `src/services/journeyApi.ts`, `src/services/journeyStorage.ts`, `server/features/journey/` |
| **TV3** | Khảo sát 8-12 địa điểm Huế, Hộ chiếu văn hóa, Quiz di sản | `public/data/places.json`, `server/features/catalog/`, `src/features/passport/`, `src/services/storage.ts` |

---

## 2. Hợp Đồng Kết Nối & Data Contracts

### A. Định dạng địa điểm (`CulturalPlace`)
```typescript
export interface CulturalPlace {
  id: string;
  name: string;
  vietnameseName: string;
  category: 'craft' | 'monument' | 'cuisine' | 'spiritual';
  categoryLabel: string;
  location: string;
  coordinates: { lat: number; lng: number };
  shortDescription: string;
  story: string;
  craftDetails?: string;
  localTips: string[];
  imageUrl: string;
  tags: string[];
  estimatedVisitTimeMinutes: number;
  sources: { title: string; url?: string }[];
}
```

### B. Định dạng hành trình (`JourneyItinerary`)
```typescript
export interface JourneyItinerary {
  id: string;
  title: string;
  summary: string;
  durationHours: number;
  targetInterests: string[];
  totalEstimatedCostVND: string;
  culturalHighlights: string[];
  stops: {
    order: number;
    placeId: string;
    placeName: string;
    timeSlot: string;
    durationMinutes: number;
    activityRecommendation: string;
    culturalInsight: string;
    transportTip?: string;
  }[];
  isFallback?: boolean;
  generatedAt: string;
}
```

### C. Khóa LocalStorage đã chốt
- Key hành trình đã lưu (TV2): `soulvillage.itineraries.v1`
- Key hộ chiếu và quiz (TV3): `soulvillage.passport.v1`

---

## 3. Mã Nguồn TV1: Explore, Detail & Layout

### A. Layout & Navbar (`src/components/layout/Navbar.tsx`)
```tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Award, Landmark } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Khám Phá Di Sản', icon: Compass },
    { to: '/journey', label: 'Hành Trình AI', icon: Sparkles, highlight: true },
    { to: '/passport', label: 'Hộ Chiếu Văn Hóa', icon: Award },
  ];
  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary-900 flex items-center justify-center text-ivory-100 shadow-md">
            <Landmark className="w-5 h-5 text-ochre-400" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-primary-950">Hồn Làng</span>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">Bản đồ văn hóa sống Việt Nam</p>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                  active ? 'bg-primary-900 text-ivory-100' : link.highlight ? 'text-terracotta-600 hover:bg-terracotta-50' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
```

### B. FilterBar (`src/features/explore/FilterBar.tsx`)
```tsx
import React from 'react';
import type { CulturalCategory } from '../../types/place';
import { Search, Sparkles, Hammer, Landmark, Utensils, Mountain } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CulturalCategory | 'all';
  onSelectCategory: (category: CulturalCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories = [
    { id: 'all', label: 'Tất cả di sản', icon: Sparkles },
    { id: 'craft', label: 'Làng nghề', icon: Hammer },
    { id: 'monument', label: 'Di tích', icon: Landmark },
    { id: 'cuisine', label: 'Ẩm thực', icon: Utensils },
    { id: 'spiritual', label: 'Tâm linh', icon: Mountain },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm nón bài thơ, làng hương Thủy Xuân, Đại Nội..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-stone-200 shadow-sm text-sm"
        />
      </div>
      <div className="flex items-center justify-center overflow-x-auto gap-2 px-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isSelected ? 'bg-primary-900 text-white' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
```

---

## 4. Mã Nguồn TV2: Gemini AI Journey & Backend

### A. Router Backend Gemini (`server/features/journey/router.js`)
```javascript
import express from 'express';
import { GoogleGenAI } from '@google/genai';

export function createJourneyRouter({ getPlaces }) {
  const router = express.Router();
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  router.post('/', async (req, res) => {
    const { durationHours = 4, interests = ['craft'], startLocation = 'Trung tâm TP. Huế', companion = 'solo', placeId } = req.body || {};
    const validPlaces = getPlaces();

    const fallbackItinerary = {
      id: `itin-${Date.now()}`,
      title: 'Hành Trình Di Sản Cố Đô Tuyển Chọn',
      summary: `Hành trình văn hóa ${durationHours} giờ tối ưu theo sở thích ${interests.join(', ')}.`,
      durationHours,
      targetInterests: interests,
      isFallback: true,
      totalEstimatedCostVND: '150.000 - 300.000 VNĐ / người',
      culturalHighlights: ['Khám phá kỹ nghệ truyền thống', 'Thưởng lãm di sản triều Nguyễn'],
      stops: validPlaces.slice(0, 3).map((p, idx) => ({
        order: idx + 1,
        placeId: p.id,
        placeName: p.vietnameseName,
        timeSlot: `${8 + idx * 2}:00 - ${9 + idx * 2}:30`,
        durationMinutes: p.estimatedVisitTimeMinutes || 75,
        activityRecommendation: `Trải nghiệm văn hóa tại ${p.vietnameseName}`,
        culturalInsight: p.shortDescription || 'Di sản văn hóa đặc sắc',
        transportTip: 'Thuận tiện di chuyển bằng xe máy hoặc taxi.'
      })),
      generatedAt: new Date().toISOString()
    };

    if (!ai) return res.status(200).json(fallbackItinerary);

    try {
      const placesCatalogSummary = validPlaces.map(p => `- ${p.id}: ${p.vietnameseName} (${p.categoryLabel}, vị trí: ${p.location})`).join('\n');
      const prompt = `
Bạn là chuyên gia tư vấn văn hóa Cố đô Huế thuộc dự án Hồn Làng.
Hãy tạo một hành trình khám phá văn hóa cá nhân hóa:
- Thời lượng: ${durationHours} giờ
- Sở thích: ${interests.join(', ')}
- Điểm xuất phát: ${startLocation}
- Đối tượng: ${companion}
${placeId ? `- Ưu tiên bao gồm địa điểm có ID: ${placeId}` : ''}

Danh mục địa điểm hợp lệ tại Huế:
${placesCatalogSummary}

QUY ĐỊNH BẮT BUỘC:
1. Chỉ chọn các địa điểm có trong danh mục trên.
2. Trả về DUY NHẤT một chuỗi JSON hợp lệ không bọc markdown:
{
  "title": "string",
  "summary": "string",
  "totalEstimatedCostVND": "string",
  "culturalHighlights": ["string"],
  "stops": [
    {
      "order": 1,
      "placeId": "string",
      "placeName": "string",
      "timeSlot": "HH:MM - HH:MM",
      "durationMinutes": 60,
      "activityRecommendation": "string",
      "culturalInsight": "string",
      "transportTip": "string"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = (response.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);

      return res.status(200).json({
        id: `itin-${Date.now()}`,
        durationHours,
        targetInterests: interests,
        isFallback: false,
        generatedAt: new Date().toISOString(),
        ...parsed
      });
    } catch (err) {
      console.error('Gemini call failed:', err);
      return res.status(200).json(fallbackItinerary);
    }
  });

  return router;
}
```

---

## 5. Mã Nguồn TV3: Catalog Data, Passport & Quiz

### A. Dữ Liệu Địa Điểm Chuẩn (`public/data/places.json`)
```json
[
  {
    "id": "lang-non-tay-ho",
    "name": "Tay Ho Conical Hat Village",
    "vietnameseName": "Làng Nón Tây Hồ",
    "category": "craft",
    "categoryLabel": "Làng nghề truyền thống",
    "location": "Xã Phú Hồ, Huyện Phú Vang, Thừa Thiên Huế",
    "coordinates": { "lat": 16.4528, "lng": 107.6521 },
    "shortDescription": "Cái nôi của nón bài thơ xứ Huế nổi danh khắp bốn phương với kỹ thuật đan lá tỉ mỉ và ẩn hiện câu thơ dưới nắng.",
    "story": "Làng nón Tây Hồ nằm bên dòng sông Như Ý thơ mộng. Nón bài thơ ra đời tại làng từ những năm 1959–1960 khi nghệ nhân làm nón yêu thơ đã sáng tạo lồng câu thơ và hình ảnh chùa Thiên Mụ vào giữa hai lớp lá nón.",
    "craftDetails": "Đòi hỏi 15 công đoạn công phu: từ chọn lá nón, ủi phẳng, tạo khung chuốt vành, chèn bài thơ cho đến chằm nón bằng sợi cước tơ.",
    "localTips": ["Nên ghé thăm vào buổi sáng để chứng kiến các mệ, các chị phơi lá nón trắng tinh dọc đường làng."],
    "imageUrl": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    "tags": ["Làng nghề", "Nón bài thơ", "Di sản"],
    "estimatedVisitTimeMinutes": 90,
    "sources": [{ "title": "Cổng thông tin điện tử tỉnh Thừa Thiên Huế", "url": "https://thuathienhue.gov.vn" }]
  },
  {
    "id": "lang-huong-thuy-xuan",
    "name": "Thuy Xuan Incense Village",
    "vietnameseName": "Làng Hương Thủy Xuân",
    "category": "craft",
    "categoryLabel": "Làng nghề truyền thống",
    "location": "Đường Huyền Trân Công Chúa, Phường Thủy Xuân, TP. Huế",
    "coordinates": { "lat": 16.4412, "lng": 107.5684 },
    "shortDescription": "Không gian rực rỡ sắc màu của những bó hương trầm tỏa hương thơm thảo mộc tự nhiên dưới chân đồi Vọng Cảnh.",
    "story": "Làng hương Thủy Xuân có tuổi đời hơn 700 năm, xưa kia là nơi cung cấp trầm hương và hương thắp cho triều đình phong kiến nhà Nguyễn.",
    "craftDetails": "Giữ phương pháp bí truyền từ thảo mộc: bột quế chi, thảo quả, nụ đinh hương, hoa hồi kết hợp keo vỏ cây bời lời thiên nhiên.",
    "localTips": ["Góc chụp ảnh đẹp nhất lúc 9h-11h sáng khi các nghệ nhân bung tỏa những đóa hoa hương đón nắng."],
    "imageUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    "tags": ["Làng nghề", "Hương trầm", "Cổ phục"],
    "estimatedVisitTimeMinutes": 75,
    "sources": [{ "title": "Bảo tàng Lịch sử Thừa Thiên Huế", "url": "https://baotanglichsuhue.vn" }]
  },
  {
    "id": "dai-noi-hue",
    "name": "The Imperial Citadel of Hue",
    "vietnameseName": "Đại Nội Huế",
    "category": "monument",
    "categoryLabel": "Di tích lịch sử",
    "location": "Đường 23/8, Phường Thuận Hòa, TP. Huế",
    "coordinates": { "lat": 16.4697, "lng": 107.5786 },
    "shortDescription": "Quần thể di tích Cố đô Huế được UNESCO vinh danh Di sản Văn hóa Thế giới với kiến trúc cung đình đỉnh cao triều Nguyễn.",
    "story": "Khởi công xây dựng dưới triều vua Gia Long từ năm 1804 và hoàn chỉnh dưới triều vua Minh Mạng, trung tâm quyền lực của 13 đời vua Nguyễn.",
    "craftDetails": "Nghệ thuật kiến trúc gỗ lim cung đình, pháp lam Huế và nghệ thuật khảm sành sứ đỉnh cao.",
    "localTips": ["Nên dành tối thiểu 2.5 đến 3 giờ để tham quan Ngọ Môn, Điện Thái Hòa và Tử Cấm Thành."],
    "imageUrl": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    "tags": ["UNESCO", "Hoàng thành", "Di tích quốc gia"],
    "estimatedVisitTimeMinutes": 180,
    "sources": [{ "title": "Trung tâm Bảo tồn Di tích Cố đô Huế", "url": "https://hueworldheritage.org.vn" }]
  },
  {
    "id": "chua-thien-mu",
    "name": "Thien Mu Pagoda",
    "vietnameseName": "Chùa Thiên Mụ",
    "category": "spiritual",
    "categoryLabel": "Tâm linh & Cổ tự",
    "location": "Đồi Hà Khê, Phường Kim Long, TP. Huế",
    "coordinates": { "lat": 16.4529, "lng": 107.5453 },
    "shortDescription": "Đệ nhất cổ tự xứ Huế bên dòng sông Hương thơ mộng cùng ngọn tháp Phước Duyên 7 tầng sừng sững.",
    "story": "Chùa được chúa Nguyễn Hoàng khởi lập vào năm 1601 sau câu chuyện huyền thoại về bà lão áo đỏ báo mộng long mạch phương Nam.",
    "craftDetails": "Kiến trúc tháp bát giác Phước Duyên cao 21m và Đại Hồng Chung đúc năm 1710 nặng hơn 2 tấn.",
    "localTips": ["Đi thuyền rồng ngắm hoàng hôn sông Hương trước cổng tam quan chùa."],
    "imageUrl": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    "tags": ["Cổ tự", "Sông Hương", "Tâm linh"],
    "estimatedVisitTimeMinutes": 60,
    "sources": [{ "title": "Hồ sơ Di sản Quần thể Cố đô Huế — UNESCO", "url": "https://whc.unesco.org/en/list/678" }]
  }
]
```

### B. Catalog Router (`server/features/catalog/router.js`)
```javascript
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../../../public/data/places.json');

export function getPlaces() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading places.json:', err);
    return [];
  }
}

export function createCatalogRouter() {
  const router = express.Router();
  router.get('/', (req, res) => {
    const { category, search } = req.query;
    let list = getPlaces();
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(p => p.vietnameseName.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }
    res.json({ places: list, total: list.length });
  });
  return router;
}
```

### C. Ngân Hàng Câu Hỏi Quiz (`src/features/passport/data/questions.ts`)
```typescript
import type { QuizQuestion } from '../../../types/passport';

export const CULTURAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    placeId: 'lang-non-tay-ho',
    question: 'Chiếc nón bài thơ trứ danh của Làng nón Tây Hồ có điểm gì đặc sắc nhất khi soi dưới ánh nắng mặt trời?',
    options: [
      'Có phủ một lớp vàng mỏng theo phong cách cung đình',
      'Hiện rõ câu thơ đối và hình ảnh danh thắng xứ Huế ẩn giữa hai lớp lá',
      'Phát ra âm thanh tiếng đàn du dương theo ngọn gió',
      'Đổi sang màu đỏ thắm theo nhiệt độ buổi trưa'
    ],
    correctOptionIndex: 1,
    explanation: 'Nón bài thơ ra đời khoảng năm 1959-1960. Nghệ nhân đã khéo léo chèn các câu thơ ca ngợi vẻ đẹp xứ Huế vào giữa hai lớp lá nón, khi soi dưới nắng mới nhìn thấy.',
    culturalFunFact: 'Để hoàn thành chiếc nón bài thơ cần trải qua 15 công đoạn tỉ mỉ.'
  },
  {
    id: 'quiz-2',
    placeId: 'lang-huong-thuy-xuan',
    question: 'Nguyên liệu kết dính tự nhiên truyền thống dùng trong se hương Thủy Xuân là gì?',
    options: [
      'Keo hóa học tổng hợp',
      'Vỏ cây bời lời thiên nhiên',
      'Nhựa thông rừng ngập mặn',
      'Mật mía cô đặc'
    ],
    correctOptionIndex: 1,
    explanation: 'Nghệ nhân Thủy Xuân sử dụng keo từ vỏ cây bời lời để kết dính các loại bột thảo mộc tự nhiên mà không cần hóa chất độc hại.',
    culturalFunFact: 'Hương Thủy Xuân từng cung cấp hương cho triều đình nhà Nguyễn suốt hàng trăm năm.'
  }
];
```
