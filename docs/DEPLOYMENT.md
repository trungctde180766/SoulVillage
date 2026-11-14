# Hướng Dẫn & Hồ Sơ Triển Khai Google Cloud Run (`docs/DEPLOYMENT.md`)

## Triển khai bản demo hiện tại (14/11/2026)

Người dùng đã chỉ định project `booca-471111` và xác nhận Billing đã bật.
Script `scripts/deploy-cloud-run.ps1` kiểm tra source, bật các API cần thiết, tạo runtime service account và khóa ký token ngẫu nhiên bằng Secret Manager, deploy từ Dockerfile, rồi kiểm tra health từ xa. Cấu hình demo dùng `asia-southeast1`, CPU 1, RAM 512Mi, min 0, max 1 instance.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-cloud-run.ps1 -ProjectId booca-471111
```

Script yêu cầu Google Cloud CLI đã đăng nhập tài khoản có quyền trên project. Nó hỗ trợ bản CLI portable tại `%LOCALAPPDATA%/SoulVillageTools/google-cloud-sdk/bin/gcloud.cmd`.

**Giới hạn hiện tại (chờ tích hợp TV2 & TV3):** danh mục backend (`/api/places`) và hành trình Gemini (`/api/itinerary`) vẫn là stub trả HTTP 501 (frontend Khám Phá vẫn hiển thị mượt dữ liệu tĩnh từ `public/data/`); Hộ chiếu/Quiz thuộc nhánh của TV3. Tài khoản xác thực hiện lưu trong RAM của instance (`max-instances=1`), token ký bằng khóa bí mật từ Secret Manager (`soulvillage-auth-token-secret`).

Các mục dưới đây là hướng dẫn tích hợp đầy đủ khi các module sẵn sàng; không phải bằng chứng đã triển khai hoặc đã gọi Gemini thành công.

**Dự án:** SoulVillage × HoaLang  
**Người phụ trách triển khai duy nhất:** TV1 (Trưởng nhóm)  
**Cấu hình chuẩn thi đấu:** Region `asia-southeast1` · Memory `512Mi` · CPU `1` · Port `8080` · Min instances `0` · Max instances `2` · Timeout `60s` · Model `gemini-2.5-flash`

---

## 1. Kiểm Tra Trước Khi Triển Khai (Pre-Deploy Gate)

```powershell
git status --short
git branch --show-current
npm run build
npm run lint
node --check server.js
node scripts/integration/verify-integration.mjs
```

---

## 2. Cấu Hình GCP Project, APIs, Service Account & Secret Manager

Thực hiện một lần trên Google Cloud Project của nhóm:

```powershell
$env:SV_PROJECT_ID = "DIEN_GCP_PROJECT_ID"
$env:SV_REGION = "asia-southeast1"
$env:SV_SERVICE_NAME = "soulvillage"
$env:SV_SA_NAME = "soulvillage-runtime-sa"
$env:SV_RUNTIME_SA = "$env:SV_SA_NAME@$env:SV_PROJECT_ID.iam.gserviceaccount.com"

# 1. Đăng nhập và chọn project
gcloud auth list
gcloud config set project $env:SV_PROJECT_ID

# 2. Bật các API bắt buộc
gcloud services enable `
  run.googleapis.com `
  cloudbuild.googleapis.com `
  artifactregistry.googleapis.com `
  secretmanager.googleapis.com `
  --project $env:SV_PROJECT_ID

# 3. Tạo Runtime Service Account riêng
gcloud iam service-accounts create $env:SV_SA_NAME `
  --display-name="SoulVillage Cloud Run Runtime SA" `
  --project $env:SV_PROJECT_ID

# 4. Tạo Secret chứa GEMINI_API_KEY và cấp quyền Secret Accessor
# (Thay YOUR_GEMINI_API_KEY bằng key thật khi chạy trên terminal, tuyệt đối không commit key vào Git)
Write-Output "YOUR_GEMINI_API_KEY" | gcloud secrets create soulvillage-gemini-key `
  --data-file=- `
  --replication-policy="automatic" `
  --project $env:SV_PROJECT_ID

gcloud secrets add-iam-policy-binding soulvillage-gemini-key `
  --member="serviceAccount:$env:SV_RUNTIME_SA" `
  --role="roles/secretmanager.secretAccessor" `
  --project $env:SV_PROJECT_ID
```

---

## 3. Lệnh Triển Khai Google Cloud Run Từ Source (`Dockerfile`)

```powershell
$env:SV_PROJECT_ID = "DIEN_GCP_PROJECT_ID"
$env:SV_RUNTIME_SA = "soulvillage-runtime-sa@$env:SV_PROJECT_ID.iam.gserviceaccount.com"

gcloud run deploy soulvillage `
  --source . `
  --project $env:SV_PROJECT_ID `
  --region asia-southeast1 `
  --service-account $env:SV_RUNTIME_SA `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 2 `
  --concurrency 20 `
  --timeout 60 `
  --set-env-vars "GEMINI_MODEL=gemini-2.5-flash" `
  --set-secrets "GEMINI_API_KEY=soulvillage-gemini-key:latest"

# Lấy URL Production
gcloud run services describe soulvillage `
  --region asia-southeast1 `
  --project $env:SV_PROJECT_ID `
  --format="value(status.url)"
```

---

## 4. Nhật Ký Bản Triển Khai Production (Cập Nhật Khi Deploy)

| Hạng mục | Giá trị ghi nhận |
| :--- | :--- |
| **GCP Project / Region** | `booca-471111` / `asia-southeast1` |
| **START_SHA (Baseline)** | `288ccc2e915a9c4bb4e8ce23642555562b0f8bdf` |
| **Commit nền gần nhất** | `376d08c6de2eacb03ff1a5ff27ece6e4935724b9` (+ bản cập nhật Auth UI & script deploy) |
| **Cloud Run Service URL** | https://soulvillage-nwhb5clvtq-as.a.run.app (và https://soulvillage-279315268039.asia-southeast1.run.app) |
| **Cloud Run Revision** | `soulvillage-00001-nlh` |
| **Kiểm tra `/api/health`** | `200 OK` (`{"status":"ok","service":"soulvillage"}`) |
| **Kiểm tra SPA (`/` & `/auth`)** | `200 OK` |
| **Kiểm tra `/api/places`** | Chờ merge nhánh TV3 (hiện stub `501`, UI dùng fallback tĩnh `public/data/`) |
| **Kiểm tra `POST /api/itinerary` (Gemini thật)** | Chờ merge nhánh TV2 (hiện stub `501`) |
| **Kiểm tra Mobile 390px** | Đạt 15/15 tiêu chí HoaLang UI Rule v1.0 |
