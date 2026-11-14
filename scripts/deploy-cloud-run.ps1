param(
  [string]$ProjectId = 'booca-471111',
  [string]$Region = 'asia-southeast1',
  [string]$ServiceName = 'soulvillage',
  [switch]$SkipChecks
)

$ErrorActionPreference = 'Stop'
$svSourceRoot = Split-Path -Parent $PSScriptRoot
$svPortableGcloud = Join-Path $env:LOCALAPPDATA 'SoulVillageTools/google-cloud-sdk/bin/gcloud.cmd'
$svInstalledGcloud = Get-Command gcloud.cmd -ErrorAction SilentlyContinue
if ($svInstalledGcloud) {
  $script:SvGcloud = $svInstalledGcloud.Source
} elseif (Test-Path -LiteralPath $svPortableGcloud) {
  $script:SvGcloud = $svPortableGcloud
} else {
  throw 'Google Cloud CLI is not installed. See https://cloud.google.com/sdk/docs/install'
}

$svBundledPython = Join-Path (Split-Path -Parent (Split-Path -Parent $script:SvGcloud)) 'platform/bundledpython/python.exe'
if (Test-Path -LiteralPath $svBundledPython) {
  $env:CLOUDSDK_PYTHON = $svBundledPython
}

function Invoke-SvGcloud {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GcloudArgs)
  & $script:SvGcloud @GcloudArgs
  if ($LASTEXITCODE -ne 0) {
    throw "gcloud failed: $($GcloudArgs[0]) $($GcloudArgs[1])"
  }
}

$svAccount = Invoke-SvGcloud auth list '--filter=status:ACTIVE' '--format=value(account)'
if (-not $svAccount) {
  throw "Sign in first: & '$script:SvGcloud' auth login --project=$ProjectId"
}

Push-Location $svSourceRoot
try {
  if (-not $SkipChecks) {
    foreach ($svNpmTask in @('build', 'lint')) {
      & npm.cmd run $svNpmTask
      if ($LASTEXITCODE -ne 0) { throw "npm run $svNpmTask failed" }
    }
    & node --check server.js
    if ($LASTEXITCODE -ne 0) { throw 'Server syntax check failed' }
    & node scripts/integration/verify-integration.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Integration checks failed' }
  }

  Invoke-SvGcloud projects describe $ProjectId "--project=$ProjectId" '--format=value(projectId)'
  $svPrevEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $svBillingOutput = (& $script:SvGcloud billing projects describe $ProjectId '--format=value(billingEnabled)' 2>&1 | Out-String).Trim()
  $svBillingExit = $LASTEXITCODE
  $ErrorActionPreference = $svPrevEap
  if ($svBillingExit -eq 0) {
    if ($svBillingOutput -ne 'True' -and $svBillingOutput -ne 'true') { throw 'Project billing is not enabled' }
  } elseif ($svBillingOutput -notmatch 'RATE_LIMIT_EXCEEDED|429') {
    throw "gcloud billing check failed: $svBillingOutput"
  }

  Invoke-SvGcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com "--project=$ProjectId" --quiet

  $svSaName = 'soulvillage-runtime-sa'
  $svRuntimeSa = "$svSaName@$ProjectId.iam.gserviceaccount.com"
  $svExistingSa = Invoke-SvGcloud iam service-accounts list "--project=$ProjectId" "--filter=email:$svRuntimeSa" '--format=value(email)'
  if (-not $svExistingSa) {
    Invoke-SvGcloud iam service-accounts create $svSaName '--display-name=SoulVillage Cloud Run Runtime' "--project=$ProjectId" --quiet
  }

  $svBuildSaName = 'soulvillage-build-sa'
  $svBuildSa = "$svBuildSaName@$ProjectId.iam.gserviceaccount.com"
  $svExistingBuildSa = Invoke-SvGcloud iam service-accounts list "--project=$ProjectId" "--filter=email:$svBuildSa" '--format=value(email)'
  if (-not $svExistingBuildSa) {
    Invoke-SvGcloud iam service-accounts create $svBuildSaName '--display-name=SoulVillage Source Build' "--project=$ProjectId" --quiet
  }
  Invoke-SvGcloud projects add-iam-policy-binding $ProjectId "--member=serviceAccount:$svBuildSa" --role=roles/run.builder --condition=None --quiet '--format=none'
  Invoke-SvGcloud projects add-iam-policy-binding $ProjectId "--member=serviceAccount:$svBuildSa" --role=roles/storage.objectViewer --condition=None --quiet '--format=none'

  # Create the signing key once. Never print the value or store it in source.
  $svSecretName = 'soulvillage-auth-token-secret'
  $svAllSecrets = Invoke-SvGcloud secrets list "--project=$ProjectId" '--format=value(name)'
  $svExistingSecret = $svAllSecrets | Where-Object { $_ -match "(^|/)$([Regex]::Escape($svSecretName))$" }
  if (-not $svExistingSecret) {
    $svRandomBytes = New-Object byte[] 48
    $svRandom = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $svRandom.GetBytes($svRandomBytes) } finally { $svRandom.Dispose() }
    $svSecretValue = [Convert]::ToBase64String($svRandomBytes)
    $svSecretValue | & $script:SvGcloud secrets create $svSecretName --data-file=- --replication-policy=automatic "--project=$ProjectId" --quiet
    if ($LASTEXITCODE -ne 0) { throw 'Could not create auth signing secret' }
    $svSecretValue = $null
    [Array]::Clear($svRandomBytes, 0, $svRandomBytes.Length)
  }
  Invoke-SvGcloud secrets add-iam-policy-binding $svSecretName "--member=serviceAccount:$svRuntimeSa" --role=roles/secretmanager.secretAccessor "--project=$ProjectId" --quiet '--format=none'

  # Deploy the current demo. Gemini/catalog/passport stubs are still incomplete.
  # One instance reduces resource use; it does not make in-memory accounts durable.
  Invoke-SvGcloud run deploy $ServiceName --source=. "--project=$ProjectId" "--region=$Region" "--service-account=$svRuntimeSa" "--build-service-account=projects/$ProjectId/serviceAccounts/$svBuildSa" --allow-unauthenticated --port=8080 --memory=512Mi --cpu=1 --min-instances=0 --max-instances=1 --concurrency=20 --timeout=60 '--update-env-vars=NODE_ENV=production' "--update-secrets=AUTH_TOKEN_SECRET=${svSecretName}:latest" --quiet

  $svUrl = Invoke-SvGcloud run services describe $ServiceName "--project=$ProjectId" "--region=$Region" '--format=value(status.url)'
  $svRevision = Invoke-SvGcloud run services describe $ServiceName "--project=$ProjectId" "--region=$Region" '--format=value(status.latestReadyRevisionName)'
  $svHealth = Invoke-RestMethod -Uri "$svUrl/api/health" -TimeoutSec 30
  if ($svHealth.status -ne 'ok') { throw 'Remote health check failed' }
  Write-Output "Deployed URL: $svUrl"
  Write-Output "Ready revision: $svRevision"
  Write-Output "Remote health: $($svHealth.status)"
} finally {
  Pop-Location
}
