# Hướng dẫn Thiết Lập Môi Trường (Setup Guide) — Hồn Làng (SoulVillage)

Dự án **Hồn Làng** được xây dựng với kiến trúc hiện đại, gọn nhẹ và tối ưu hóa cho Hackathon 270 phút:
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Lucide Icons + React Router
- **Backend:** Vercel Serverless Functions (`/api`)
- **Database:** MongoDB Atlas (native official `mongodb` driver với connection pooling)
- **AI Core:** Google Gemini API (`@google/genai` official SDK)
- **CI/CD:** GitHub Actions -> Vercel Deployment

---

## 1. Yêu cầu Hệ Thống
- **Node.js:** v20+ hoặc v22+ LTS (khuyến nghị v22.x)
- **npm:** v10+
- **Git:** v2.40+
- **Tài khoản cần có:**
  - GitHub (repo: `https://github.com/trungctde180766/SoulVillage.git`)
  - Vercel (kết nối với repo GitHub)
  - Google AI Studio (lấy `GEMINI_API_KEY`)
  - MongoDB Atlas (lấy `MONGODB_URI`)

---

## 2. Cài Đặt Ban Đầu (Local Development)

```bash
# 1. Clone repository (nếu chưa clone)
git clone https://github.com/trungctde180766/SoulVillage.git
cd SoulVillage

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Tạo file cấu hình môi trường cục bộ
cp .env.example .env.local
```

---

## 3. Cấu hình Biến Môi Trường (.env.local)

Điền các giá trị thực tế vào file `.env.local` (file này đã nằm trong `.gitignore`):

```ini
# Gemini API Key từ Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY="AIzaSyYourSecretGeminiApiKeyHere"

# MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="soulvillage"

# Node Environment
NODE_ENV="development"
```

> [!WARNING]
> **Tuyệt đối không sử dụng tiền tố `VITE_` cho các API key bí mật!**
> Các biến có tiền tố `VITE_` sẽ bị Vite bundle trực tiếp vào mã nguồn JavaScript gửi tới trình duyệt người dùng, làm lộ key ra ngoài. Mọi lệnh gọi Gemini và MongoDB chỉ được thực hiện trong thư mục `/api` phía serverless function.

---

## 4. Chạy Dự Án Cục Bộ

```bash
# Khởi động Vite frontend dev server
npm run dev

# Mở trình duyệt tại: http://localhost:5173
```

Để kiểm tra đồng thời cả Serverless API `/api` và Vite frontend bằng Vercel CLI:
```bash
# Cài Vercel CLI (nếu chưa có)
npm i -g vercel

# Chạy dev server mô phỏng môi trường Vercel đầy đủ
vercel dev
```

---

## 5. Kiểm tra Build & Typecheck

```bash
# Kiểm tra TypeScript typecheck và build production
npm run build

# Kiểm tra linting
npm run lint
```

---

## 6. Cấu hình Vercel & Deploy

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
2. Chọn **"Add New..."** -> **"Project"**.
3. Import repository `trungctde180766/SoulVillage`.
4. Tại mục **Environment Variables**, thêm 2 biến bắt buộc:
   - `GEMINI_API_KEY`: Key từ Google AI Studio
   - `MONGODB_URI`: Connection string từ MongoDB Atlas
   - `MONGODB_DB`: `soulvillage`
5. Nhấn **Deploy**.

