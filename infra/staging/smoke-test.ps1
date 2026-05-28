param(
  [string]$WebUrl = "http://localhost:8080",
  [string]$ApiHealthUrl = "http://localhost:8000/health"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-HealthyEndpoint {
  param([string]$Name, [string]$Url)

  try {
    $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 10
  } catch {
    throw "$Name endpoint check failed at '$Url': $($_.Exception.Message)"
  }

  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 300) {
    throw "$Name endpoint returned status code $($response.StatusCode) at '$Url'."
  }

  Write-Host "$Name endpoint is healthy ($Url)." -ForegroundColor Green
}

Assert-HealthyEndpoint -Name "Web" -Url $WebUrl
Assert-HealthyEndpoint -Name "API" -Url $ApiHealthUrl

Write-Host "Smoke test finished successfully." -ForegroundColor Cyan
