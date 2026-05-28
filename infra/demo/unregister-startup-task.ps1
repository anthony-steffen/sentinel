param(
  [string]$TaskName = "SentinelFixedDemoTunnel"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if (-not $task) {
  Write-Host "Task not found: $TaskName" -ForegroundColor Yellow
  exit 0
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Task removed: $TaskName" -ForegroundColor Green
