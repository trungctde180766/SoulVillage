# Hướng Dẫn Thiết Lập Môi Trường (Setup Guide) — Hồn Làng (SoulVillage)

Tài liệu này hướng dẫn cài đặt và chạy thử nghiệm bản Starter Kit trên máy cá nhân và môi trường Google Cloud Run.

---

## 1. Phân Định Quy Định BTC và Lựa Chọn Của Đội

### A. Quy định chính thức từ Ban Tổ Chức (Hình ảnh thể lệ)
* **Giới hạn code chuẩn bị:** Dự án có sẵn chỉ được hoàn thiện **tối đa 30%**.
* **Công nghệ Google bắt buộc:** Tối thiểu phải gọi **Google Gemini API** và triển khai trên **Google Cloud Run**.
* **Quy trình nộp bài:** Dùng Git, push tiến độ liên tục và nộp mã nguồn qua GitHub repository.
* **Tiêu chí phát triển:** Ưu tiên phát triển các tính năng cốt lõi.

### B. Lựa chọn kỹ thuật nội bộ của đội
* **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS.
* **Backend Runner:** Node.js Express Server (`server.js`) phục vụ SPA build và REST endpoints.
* **Database:** MongoDB Atlas (tùy chọn lưu trữ cho Cultural Passport).
* **Container:** Docker Multi-stage build phục vụ Google Cloud Run.

---

## 2. Yêu Cầu Môi Trường Cục Bộ
* **Node.js:** v20.x hoặc v22.x LTS (đã kiểm tra trên máy: v22.23.2).
* **npm:** v10.x.
* **Git:** v2.40+.
* **Docker Desktop:** Khuyến nghị cài đặt để test container trước khi deploy Cloud Run.
* **Google Cloud SDK (`gcloud` CLI):** Chuẩn bị sẵn để deploy lên Google Cloud Run trong ngày thi.

---

## 3. Cài Đặt Ban Đầu (Local Development)

```bash
# 1. Cài đặt các gói phụ thuộc
npm ci

# 2. Tạo file cấu hình môi trường cục bộ
cp .env.example .env.local
```

File `.env.local` (nằm trong `.gitignore`, không commit lên git):
```ini
GEMINI_API_KEY="AIzaSyYourSecretKeyHere"
MONGODB_URI="mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="soulvillage"
PORT=8080
```

---

## 4. Các Chế Độ Chạy (Execution Modes)

### Chế độ 1: Frontend Development Server (Vite HMR)
```bash
npm run dev
# Mở trình duyệt tại: http://localhost:5173
```

### Chế độ 2: Kiểm tra Production Server (Node.js Server phục vụ Cloud Run)
```bash
# 1. Build frontend
npm run build

# 2. Chạy server Node.js lắng nghe trên PORT=8080
npm start
# Mở trình duyệt tại: http://localhost:8080
# Kiểm tra endpoint sức khỏe: http://localhost:8080/api/health
```

### Chế độ 3: Chạy thử qua Docker Container (Mô phỏng Cloud Run)
```bash
# 1. Build container image
docker build -t soulvillage:latest .

# 2. Chạy container
docker run -p 8080:8080 -e PORT=8080 -e GEMINI_API_KEY="YOUR_KEY" soulvillage:latest
```

---

## 5. Hướng Dẫn Triển Khai Lên Google Cloud Run (Thực hiện trong giờ thi)

> [!NOTE]
> Trong giai đoạn PREP, nhóm **chưa** tạo tài nguyên đám mây hay triển khai lên tài khoản Google Cloud. Các lệnh dưới đây được chuẩn bị để thực hiện trong Milestone 6 ngày thi:

```bash
# 1. Đăng nhập Google Cloud
gcloud auth login

# 2. Chọn dự án
gcloud config set project <YOUR_GCP_PROJECT_ID>

# 3. Build & Deploy trực tiếp lên Cloud Run
gcloud run deploy soulvillage \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="<KEY>",MONGODB_URI="<URI>"
```
