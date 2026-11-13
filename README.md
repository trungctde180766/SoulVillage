# 🇻🇳 Hồn Làng (SoulVillage) — Bản Đồ Văn Hóa Sống Việt Nam

> **Sự kiện:** GDG DevFest MienTrung Hackathon 2026  
> **Địa điểm:** Grand Tourane Hotel, Đà Nẵng | Ngày thi: 14/11/2026  
> **Repository:** [https://github.com/trungctde180766/SoulVillage.git](https://github.com/trungctde180766/SoulVillage.git)  
> **Trạng thái:** 🟢 PREP MODE (Starter Kit & Skeleton Ready — Sẵn sàng cho 270 phút Hackathon)

---

## 🌟 Giới Thiệu Dự Án

**Hồn Làng (SoulVillage)** là nền tảng ứng dụng trí tuệ nhân tạo **Google Gemini API** nhằm bảo tồn, tôn vinh và cá nhân hóa trải nghiệm khám phá các làng nghề truyền thống, di sản cung đình và văn hóa dân gian Việt Nam.

Khác với các ứng dụng du lịch thương mại thuần túy, **Hồn Làng** tập trung vào **chiều sâu văn hóa**, sự kết nối với nghệ nhân bản địa và những huyền tích ngàn năm bị lãng quên. MVP đầu tiên khởi động tại **Cố đô Huế** với các địa điểm nổi tiếng: Làng nón Tây Hồ, Làng hương Thủy Xuân, Đại Nội Hoàng Thành, Chùa Thiên Mụ...

---

## 🚀 Bộ Công Nghệ (Tech Stack)

| Lớp (Layer) | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS | UI tốc độ cao, responsive, tối ưu hóa thời gian phát triển |
| **Icons & Router** | Lucide React + React Router (HashRouter) | Icon văn hóa hiện đại, điều hướng SPA không lỗi 404 |
| **AI Engine** | Google Gemini API 2.5 Flash (`@google/genai`) | Cá nhân hóa hành trình theo thời gian, sở thích và vị trí |
| **Backend** | Vercel Serverless Functions (`/api`) | Giữ bí mật API key, xử lý logic & validation server-side |
| **Database** | MongoDB Atlas (Native `mongodb` Driver) | Lưu trữ tiến độ Cultural Passport, Quiz, Huy hiệu & Lịch trình |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`) | Tự động hóa kiểm tra build, linting và typecheck |
| **Hosting** | Vercel | Deploy toàn cầu, serverless CDN tốc độ cao |

---

## 📁 Cấu Trúc Thư Mục Chuẩn Modular

```text
SoulVillage/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline (Typecheck & Build)
├── api/                         # Vercel Serverless Backend Functions
│   ├── lib/
│   │   ├── gemini.ts            # Khởi tạo Gemini SDK (@google/genai)
│   │   └── mongodb.ts           # Connection pooling & caching cho MongoDB Atlas
│   ├── itinerary.ts             # API tạo hành trình AI bằng Gemini + Fallback
│   ├── passport.ts              # API quản lý Hộ chiếu văn hóa & Quiz (MongoDB)
│   └── places.ts                # API danh mục địa điểm văn hóa
├── docs/                        # Tài liệu hướng dẫn thi đấu & kỹ thuật
│   ├── COMPETITION_RULES.md     # Quy định đạo đức thi & phân định PREP/BUILD
│   ├── SETUP.md                 # Hướng dẫn thiết lập máy tính & cài đặt
│   ├── BUILD_DAY.md             # Kế hoạch tác chiến 270 phút chi tiết (M1 -> M6)
│   └── API_CHECKLIST.md         # Hướng dẫn test Gemini API & MongoDB Atlas
├── public/                      # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, Layout
│   │   └── ui/                  # Button, Badge, Card tái sử dụng
│   ├── data/                    # Dữ liệu khảo sát ban đầu về Cố đô Huế
│   ├── features/
│   │   ├── explore/             # Khám phá di sản, FilterBar, PlaceCard, Mini-map
│   │   ├── places/              # Trang chi tiết câu chuyện di sản & nguồn
│   │   ├── journey/             # Lập hành trình cá nhân hóa với Gemini AI
│   │   └── passport/            # Hộ chiếu văn hóa, Huy hiệu & Mini Quiz
│   ├── lib/                     # Utilities & formatting
│   ├── services/                # API client & localStorage fallback
│   ├── types/                   # TypeScript interfaces (Place, Journey, Passport)
│   ├── App.tsx                  # Root Routing
│   ├── main.tsx                 # Entry Point
│   └── index.css                # Tailwind directives & theme
├── .env.example                 # Mẫu biến môi trường an toàn (Không chứa Secret)
├── vercel.json                  # Cấu hình routing & serverless cho Vercel
├── tailwind.config.js           # Bảng màu văn hóa: Xanh ngọc, Kem ấm, Cam đất
└── package.json
```

---

## ⚡ Cài Đặt Nhanh (Quick Start)

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Thiết lập Biến Môi Trường
Sao chép `.env.example` thành `.env.local` và điền key của bạn:
```bash
cp .env.example .env.local
```

Nội dung `.env.local`:
```ini
GEMINI_API_KEY="AIzaSy..."
MONGODB_URI="mongodb+srv://<user>:<pwd>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="soulvillage"
```

### 3. Khởi động môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173`

---

## 🛡️ Bảo Mật & Quy Định API

- **Bảo vệ Secret:** Toàn bộ lệnh gọi Gemini API và MongoDB Atlas đều chạy thông qua backend Serverless `/api`. 
- **Không dùng tiền tố `VITE_`:** Tuyệt đối không đặt `VITE_GEMINI_API_KEY` để tránh lộ key trên mã nguồn frontend.
- **Tự động Fallback:** Hệ thống tích hợp sẵn fallback dữ liệu lịch trình chất lượng cao phòng khi mạng khách sạn yếu hoặc hết hạn ngạch Gemini.

---

## ⏱️ Kế Hoạch 270 Phút Ngày Thi (Hackathon Timeline)

Chi tiết đầy đủ trong [BUILD_DAY.md](file:///c:/Users/THANH%20TRUNG/Desktop/SoulVillage/docs/BUILD_DAY.md):
- **M1 (00:00–00:10):** Kiểm tra starter, môi trường, network, phân công vai trò.
- **M2 (00:10–01:10):** Nhập dữ liệu 8–12 địa điểm Huế, bộ lọc văn hóa, card grid.
- **M3 (01:10–01:55):** Hoàn thiện trang Culture Story & nguồn trích dẫn lịch sử.
- **M4 (01:55–03:00):** Tích hợp Gemini AI Journey, prompt tuning, JSON validator.
- **M5 (03:00–03:35):** Quiz văn hóa, hệ thống huy hiệu, lưu tiến độ MongoDB.
- **M6 (03:35–04:30):** Deploy Vercel Production, smoke test, luyện tập thuyết trình (Pitch).
