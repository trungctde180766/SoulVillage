# Hướng Dẫn & Hồ Sơ Triển Khai Google Cloud Run (`docs/DEPLOYMENT.md`)

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
| **START_SHA (Baseline)** | `288ccc2e915a9c4bb4e8ce23642555562b0f8bdf` |
| **Commit SHA triển khai** | *(Cập nhật sau khi chạy lệnh deploy)* |
| **Cloud Run Service URL** | *(Cập nhật `status.url` sau khi deploy)* |
| **Cloud Run Revision** | *(Cập nhật tên revision)* |
| **Kiểm tra `/api/health`** | `200 OK` |
| **Kiểm tra `/api/places`** | `200 OK` (sau khi merge TV3) |
| **Kiểm tra `POST /api/itinerary` (Gemini thật)** | `200 OK` (`isFallback: false`) |
| **Kiểm tra Mobile 390px** | Đạt 15/15 tiêu chí HoaLang UI Rule v1.0 |
