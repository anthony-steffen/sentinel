param(
  [int]$WebPort = 8080,
  [int]$ApiPort = 8000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

& "$PSScriptRoot\start-demo.ps1" `
  -WebPort $WebPort `
  -ApiPort $ApiPort

Write-Host ""
Write-Host "Opening temporary public URL..." -ForegroundColor Cyan

& "$PSScriptRoot\open-public-link.ps1" `
  -WebPort $WebPort
