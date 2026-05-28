param(
  [string]$ComposeFile = "$PSScriptRoot\..\..\docker-compose.staging.yml",
  [string]$EnvFile = "$PSScriptRoot\..\..\.env.staging",
  [string]$ApiEnvFile = "$PSScriptRoot\..\..\sentinel-fraud-api\.env.staging"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-FileExists {
  param([string]$Path, [string]$Label)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "$Label not found at '$Path'."
  }
}

Assert-FileExists -Path $ComposeFile -Label "Compose file"
Assert-FileExists -Path $EnvFile -Label "Staging env file"
Assert-FileExists -Path $ApiEnvFile -Label "API staging env file"

$resolvedComposeFile = (Resolve-Path -LiteralPath $ComposeFile).Path
$resolvedEnvFile = (Resolve-Path -LiteralPath $EnvFile).Path

Write-Host "Deploying Sentinel staging stack..." -ForegroundColor Cyan
docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile up -d --build

Write-Host ""
Write-Host "Staging containers:" -ForegroundColor Green
docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile ps
