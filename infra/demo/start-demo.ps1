param(
  [string]$ComposeFile = "$PSScriptRoot\..\..\docker-compose.staging.yml",
  [string]$EnvFile = "$PSScriptRoot\..\..\.env.staging",
  [string]$EnvTemplateFile = "$PSScriptRoot\..\..\.env.staging.example",
  [string]$ApiEnvFile = "$PSScriptRoot\..\..\sentinel-fraud-api\.env.staging",
  [string]$ApiEnvTemplateFile = "$PSScriptRoot\..\..\sentinel-fraud-api\.env.staging.example",
  [int]$WebPort = 8080,
  [int]$ApiPort = 8000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-CommandExists {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: '$Name'."
  }
}

function Ensure-FileFromTemplate {
  param(
    [string]$Path,
    [string]$TemplatePath,
    [string]$Label
  )

  if (Test-Path -LiteralPath $Path) {
    return
  }

  if (-not (Test-Path -LiteralPath $TemplatePath)) {
    throw "$Label template not found at '$TemplatePath'."
  }

  Copy-Item -LiteralPath $TemplatePath -Destination $Path
  Write-Host "$Label created from template: $Path" -ForegroundColor Yellow
}

function Assert-FileExists {
  param([string]$Path, [string]$Label)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "$Label not found at '$Path'."
  }
}

Assert-CommandExists -Name "docker"

Ensure-FileFromTemplate -Path $EnvFile -TemplatePath $EnvTemplateFile -Label "Root env file"
Ensure-FileFromTemplate -Path $ApiEnvFile -TemplatePath $ApiEnvTemplateFile -Label "API env file"

Assert-FileExists -Path $ComposeFile -Label "Compose file"
Assert-FileExists -Path $EnvFile -Label "Root env file"
Assert-FileExists -Path $ApiEnvFile -Label "API env file"

$resolvedComposeFile = (Resolve-Path -LiteralPath $ComposeFile).Path
$resolvedEnvFile = (Resolve-Path -LiteralPath $EnvFile).Path

Write-Host "Starting Sentinel demo stack..." -ForegroundColor Cyan
docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile up -d --build

Write-Host ""
Write-Host "Running health checks..." -ForegroundColor Cyan

& "$PSScriptRoot\smoke-test.ps1" `
  -WebUrl "http://localhost:$WebPort" `
  -ApiHealthUrl "http://localhost:$ApiPort/health"

Write-Host ""
Write-Host "Demo stack ready." -ForegroundColor Green
Write-Host "Open local app: http://localhost:$WebPort"
Write-Host "To publish temporary URL run: .\infra\demo\open-public-link.ps1"
