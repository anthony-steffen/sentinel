param(
  [int]$WebPort = 8080
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command "ssh" -ErrorAction SilentlyContinue)) {
  throw "Required command not found: 'ssh'."
}

Write-Host "Opening public tunnel for http://localhost:$WebPort ..." -ForegroundColor Cyan
Write-Host "Keep this terminal open while recruiters test the app." -ForegroundColor Yellow
Write-Host "The generated public URL will appear below." -ForegroundColor Yellow
Write-Host ""

ssh `
  -o ServerAliveInterval=60 `
  -o StrictHostKeyChecking=accept-new `
  -R 80:localhost:$WebPort `
  nokey@localhost.run
