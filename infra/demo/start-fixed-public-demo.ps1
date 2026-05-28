param(
  [string]$TunnelToken = $env:CLOUDFLARED_TUNNEL_TOKEN,
  [int]$WebPort = 8080,
  [int]$ApiPort = 8000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($TunnelToken)) {
  throw @"
Cloudflare tunnel token not found.
Set the env var first:

  `$env:CLOUDFLARED_TUNNEL_TOKEN = '<YOUR_TOKEN>'
"@
}

& "$PSScriptRoot\start-demo.ps1" `
  -WebPort $WebPort `
  -ApiPort $ApiPort

Write-Host ""
Write-Host "Opening fixed public URL tunnel..." -ForegroundColor Cyan

& "$PSScriptRoot\open-fixed-link-cloudflare.ps1" `
  -TunnelToken $TunnelToken
