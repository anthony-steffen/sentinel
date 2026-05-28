param(
  [string]$TunnelToken = $env:CLOUDFLARED_TUNNEL_TOKEN
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
  throw "Required command not found: 'docker'."
}

if ([string]::IsNullOrWhiteSpace($TunnelToken)) {
  throw @"
Cloudflare tunnel token not found.
Set the env var first:

  `$env:CLOUDFLARED_TUNNEL_TOKEN = '<YOUR_TOKEN>'

Then run again:

  .\infra\demo\open-fixed-link-cloudflare.ps1
"@
}

Write-Host "Starting fixed public URL tunnel via Cloudflare..." -ForegroundColor Cyan
Write-Host "Keep this terminal open while recruiters test the app." -ForegroundColor Yellow
Write-Host ""

docker run --rm `
  cloudflare/cloudflared:latest `
  tunnel --no-autoupdate run --token $TunnelToken
