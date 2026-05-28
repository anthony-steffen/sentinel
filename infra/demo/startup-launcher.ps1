param(
  [string]$TunnelToken = $env:CLOUDFLARED_TUNNEL_TOKEN,
  [int]$WebPort = 8080,
  [int]$ApiPort = 8000,
  [int]$MaxWaitSeconds = 180
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$logDir = Join-Path $PSScriptRoot "logs"
if (-not (Test-Path -LiteralPath $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
}

$logFile = Join-Path $logDir "startup.log"

function Write-Log {
  param([string]$Message)

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "$timestamp $Message" | Out-File -FilePath $logFile -Append -Encoding utf8
}

if ([string]::IsNullOrWhiteSpace($TunnelToken)) {
  Write-Log "ERROR CLOUDFLARED_TUNNEL_TOKEN not found."
  throw "CLOUDFLARED_TUNNEL_TOKEN not found."
}

Write-Log "Startup launcher started."
Write-Log "Waiting Docker daemon up to $MaxWaitSeconds seconds..."

$dockerReady = $false
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

while ($stopwatch.Elapsed.TotalSeconds -lt $MaxWaitSeconds) {
  try {
    docker info | Out-Null
    $dockerReady = $true
    break
  } catch {
    Start-Sleep -Seconds 5
  }
}

if (-not $dockerReady) {
  Write-Log "ERROR Docker daemon was not ready before timeout."
  throw "Docker daemon not ready."
}

Write-Log "Docker daemon is ready. Starting fixed public demo..."

try {
  & "$PSScriptRoot\start-fixed-public-demo.ps1" `
    -TunnelToken $TunnelToken `
    -WebPort $WebPort `
    -ApiPort $ApiPort
} catch {
  Write-Log "ERROR $($_.Exception.Message)"
  throw
}
