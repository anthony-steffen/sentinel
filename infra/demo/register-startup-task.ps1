param(
  [string]$TaskName = "SentinelFixedDemoTunnel",
  [string]$TunnelToken = $env:CLOUDFLARED_TUNNEL_TOKEN
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($TunnelToken)) {
  throw @"
CLOUDFLARED_TUNNEL_TOKEN not found.
Set it before registering the task:

  setx CLOUDFLARED_TUNNEL_TOKEN "<SEU_TOKEN>"
"@
}

$launcherPath = (Resolve-Path -LiteralPath "$PSScriptRoot\startup-launcher.ps1").Path
$workingDirectory = (Resolve-Path -LiteralPath "$PSScriptRoot\..\..").Path

$envValueEscaped = $TunnelToken.Replace("'", "''")
$launcherEscaped = $launcherPath.Replace("'", "''")

$taskCommand = @"
`$env:CLOUDFLARED_TUNNEL_TOKEN='$envValueEscaped';
Set-Location '$workingDirectory';
& '$launcherEscaped'
"@

$bytes = [System.Text.Encoding]::Unicode.GetBytes($taskCommand)
$encodedCommand = [Convert]::ToBase64String($bytes)

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -EncodedCommand $encodedCommand"

$scheduledUser = "$env:USERDOMAIN\$env:USERNAME"
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $scheduledUser

$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Start Sentinel fixed recruiter demo tunnel at logon." `
  -Force | Out-Null

Write-Host "Task registered: $TaskName" -ForegroundColor Green
Write-Host "Run now (optional): Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Check status: Get-ScheduledTask -TaskName '$TaskName'"
