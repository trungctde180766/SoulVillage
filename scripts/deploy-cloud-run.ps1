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

  # Helper to upsert a Secret Manager secret without BOM or trailing newline, never printing its value.
  $svAllSecrets = @(Invoke-SvGcloud secrets list "--project=$ProjectId" '--format=value(name)')
  function Set-SvSecret {
    param(
      [string]$SecretName,
      [string]$SecretValue,
      [bool]$AddVersionIfExisting = $true
    )
    $exists = $svAllSecrets | Where-Object { $_ -match "(^|/)$([Regex]::Escape($SecretName))$" }
    $tmpSecretFile = [System.IO.Path]::GetTempFileName()
    try {
      [System.IO.File]::WriteAllText($tmpSecretFile, $SecretValue, [System.Text.UTF8Encoding]::new($false))
      if (-not $exists) {
        Invoke-SvGcloud secrets create $SecretName "--data-file=$tmpSecretFile" --replication-policy=automatic "--project=$ProjectId" --quiet
      } elseif ($AddVersionIfExisting) {
        Invoke-SvGcloud secrets versions add $SecretName "--data-file=$tmpSecretFile" "--project=$ProjectId" --quiet
      }
    } finally {
      if (Test-Path -LiteralPath $tmpSecretFile) {
        Remove-Item -LiteralPath $tmpSecretFile -Force -ErrorAction SilentlyContinue
      }
    }
    Invoke-SvGcloud secrets add-iam-policy-binding $SecretName "--member=serviceAccount:$svRuntimeSa" --role=roles/secretmanager.secretAccessor "--project=$ProjectId" --quiet '--format=none'
  }

  # 1. Auth token signing secret (create once if not present)
  $svAuthSecretName = 'soulvillage-auth-token-secret'
  $svExistingAuthSecret = $svAllSecrets | Where-Object { $_ -match "(^|/)$([Regex]::Escape($svAuthSecretName))$" }
  if (-not $svExistingAuthSecret) {
    $svRandomBytes = New-Object byte[] 48
    $svRandom = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $svRandom.GetBytes($svRandomBytes) } finally { $svRandom.Dispose() }
    $svRandomSecret = [Convert]::ToBase64String($svRandomBytes)
    Set-SvSecret -SecretName $svAuthSecretName -SecretValue $svRandomSecret -AddVersionIfExisting $false
    $svRandomSecret = $null
    [Array]::Clear($svRandomBytes, 0, $svRandomBytes.Length)
  } else {
    Invoke-SvGcloud secrets add-iam-policy-binding $svAuthSecretName "--member=serviceAccount:$svRuntimeSa" --role=roles/secretmanager.secretAccessor "--project=$ProjectId" --quiet '--format=none'
  }

  # 2. Load optional local .env.local to sync updated runtime env vars & secrets safely
  $svLocalEnvMap = @{}
  $svEnvLocalPath = Join-Path $svSourceRoot '.env.local'
  if (Test-Path -LiteralPath $svEnvLocalPath) {
    foreach ($line in Get-Content -LiteralPath $svEnvLocalPath) {
      if ($line -match '^\s*#' -or $line -notmatch '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$') { continue }
      $envKey = $Matches[1]
      $envVal = $Matches[2].Trim()
      if ($envVal.Length -ge 2 -and (($envVal.StartsWith('"') -and $envVal.EndsWith('"')) -or ($envVal.StartsWith("'") -and $envVal.EndsWith("'")))) {
        $envVal = $envVal.Substring(1, $envVal.Length - 2)
      }
      if ($envVal.Length -gt 0) {
        $svLocalEnvMap[$envKey] = $envVal
      }
    }
  }

  $svSecretBindings = @("AUTH_TOKEN_SECRET=${svAuthSecretName}:latest")
  if ($svLocalEnvMap.ContainsKey('GEMINI_API_KEY')) {
    Set-SvSecret -SecretName 'soulvillage-gemini-key' -SecretValue $svLocalEnvMap['GEMINI_API_KEY'] -AddVersionIfExisting $true
    $svSecretBindings += 'GEMINI_API_KEY=soulvillage-gemini-key:latest'
  }
  if ($svLocalEnvMap.ContainsKey('MONGODB_URI')) {
    Set-SvSecret -SecretName 'soulvillage-mongodb-uri' -SecretValue $svLocalEnvMap['MONGODB_URI'] -AddVersionIfExisting $true
    $svSecretBindings += 'MONGODB_URI=soulvillage-mongodb-uri:latest'
  }

  $svEnvPairs = @('NODE_ENV=production')
  foreach ($nonSecretKey in @('GEMINI_MODEL', 'MONGODB_DB', 'ALLOW_FIXTURE_CATALOG')) {
    if ($svLocalEnvMap.ContainsKey($nonSecretKey)) {
      $svEnvPairs += "$nonSecretKey=$($svLocalEnvMap[$nonSecretKey])"
    }
  }
  $svLocalEnvMap.Clear()

  $svEnvArg = "--update-env-vars=$($svEnvPairs -join ',')"
  $svSecretArg = "--update-secrets=$($svSecretBindings -join ',')"

  Invoke-SvGcloud run deploy $ServiceName --source=. "--project=$ProjectId" "--region=$Region" "--service-account=$svRuntimeSa" "--build-service-account=projects/$ProjectId/serviceAccounts/$svBuildSa" --allow-unauthenticated --port=8080 --memory=512Mi --cpu=1 --min-instances=0 --max-instances=1 --concurrency=20 --timeout=60 $svEnvArg $svSecretArg --quiet

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
