param(
  [string]$ComposeFile = "$PSScriptRoot\..\..\docker-compose.staging.yml",
  [string]$EnvFile = "$PSScriptRoot\..\..\.env.staging"
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
Assert-FileExists -Path $EnvFile -Label "Root env file"

$resolvedComposeFile = (Resolve-Path -LiteralPath $ComposeFile).Path
$resolvedEnvFile = (Resolve-Path -LiteralPath $EnvFile).Path

Write-Host "Stopping Sentinel demo stack..." -ForegroundColor Cyan
docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile down

Write-Host "Demo stack stopped." -ForegroundColor Green
