# Checklist Kết Nối & Kiểm Tra API — Hồn Làng (SoulVillage)

Tài liệu này cung cấp các bước kiểm tra, chẩn đoán và khắc phục sự cố đối với **Google Gemini API** và **MongoDB Atlas**.

---

## 1. Google Gemini API Checklist

### A. Lấy API Key
1. Truy cập [Google AI Studio](https://aistudio.google.com/api-keys).
2. Đăng nhập tài khoản Google.
3. Nhấn **"Create API key"** -> Chọn Google Cloud Project tương ứng.
4. Sao chép API Key và lưu vào nơi an toàn (không gửi lên public chat hay git).

### B. Kiểm tra Key & Quota bằng cURL / PowerShell
Chạy lệnh kiểm tra kết nối độc lập từ PowerShell:
```powershell
$apiKey = "YOUR_GEMINI_API_KEY"
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey"
$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Chào bạn, hãy giới thiệu ngắn về làng nón Tây Hồ Huế trong 1 câu." }
            )
        }
    )
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json; charset=utf-8" -Body $body
$response.candidates[0].content.parts[0].text
```

### C. Các mã lỗi thường gặp & Xử lý
| Mã lỗi | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `400 INVALID_ARGUMENT` | Payload JSON sai định dạng | Kiểm tra cấu trúc `contents[].parts[].text` |
| `403 PERMISSION_DENIED` | API key sai hoặc chưa kích hoạt API | Tạo lại key mới trên AI Studio |
| `429 RESOURCE_EXHAUSTED` | Vượt giới hạn RPM/TPM hoặc hết quota | Chuyển sang key tài khoản phụ của thành viên khác trong nhóm |
| `500 INTERNAL_ERROR` | Lỗi phía máy chủ Google | Kích hoạt bộ Fallback tự động trong hệ thống |

---

## 2. MongoDB Atlas Checklist

### A. Thiết lập Cluster miễn phí (M0 Sandbox)
1. Đăng nhập [MongoDB Atlas](https://cloud.mongodb.com/).
2. Tạo Free Cluster (M0 Sandbox) tại region gần nhất (Singapore: `ap-southeast-1`).
3. **Database Access:** Tạo Database User (ví dụ: `souladmin`), mật khẩu an toàn.
4. **Network Access (Cực kỳ quan trọng):**
   - Thêm IP: `0.0.0.0/0` (Allow Access from Anywhere) để Vercel Serverless Functions có thể kết nối từ mọi vùng IP của Vercel.
5. Lấy Connection String (chọn Driver: Node.js):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### B. Kiểm tra kết nối từ Node.js
Trong `api/lib/mongodb.ts`, hệ thống đã cấu hình connection caching:
- Lưu trữ `cachedClient` và `cachedDb` trên biến toàn cục `global._mongoClientPromise`.
- Ngăn ngừa cạn kiệt Connection Pool khi serverless function chạy nhiều lần.
- Tự động fallback sang In-Memory / LocalStorage nếu MongoDB URI chưa được cung cấp.

---

## 3. Vercel Environment Variables Checklist

Khi deploy lên Vercel:
1. Vào **Project Settings** -> **Environment Variables**.
2. Thêm các biến sau (chọn cho cả **Production**, **Preview**, và **Development**):
   - `GEMINI_API_KEY`: Key từ Google AI Studio
   - `MONGODB_URI`: URI từ MongoDB Atlas
   - `MONGODB_DB`: `soulvillage`
3. Sau khi thêm biến, nhấn **Redeploy** bản build gần nhất để áp dụng biến môi trường.
