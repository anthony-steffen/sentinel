param(
  [string]$ComposeFile = "$PSScriptRoot\..\..\docker-compose.staging.yml",
  [string]$EnvFile = "$PSScriptRoot\..\..\.env.staging",
  [string]$ApiBaseUrl = "http://127.0.0.1:8000",
  [string]$DemoPassword = "SentinelDemo@2026"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-CommandExists {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: '$Name'."
  }
}

function Assert-FileExists {
  param([string]$Path, [string]$Label)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "$Label not found at '$Path'."
  }
}

Assert-CommandExists -Name "docker"
Assert-FileExists -Path $ComposeFile -Label "Compose file"
Assert-FileExists -Path $EnvFile -Label "Env file"

$resolvedComposeFile = (Resolve-Path -LiteralPath $ComposeFile).Path
$resolvedEnvFile = (Resolve-Path -LiteralPath $EnvFile).Path

$demoUsers = @(
  @{
    email = "demo.admin@sentinel-demo.com"
    full_name = "Demo Admin"
    role = "ADMIN"
  },
  @{
    email = "demo.analyst@sentinel-demo.com"
    full_name = "Demo Analyst"
    role = "ANALYST"
  },
  @{
    email = "demo.operator@sentinel-demo.com"
    full_name = "Demo Operator"
    role = "OPERATOR"
  }
)

$passwordHash = docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile exec -T api `
  python -c "from src.core.security.password import hash_password; print(hash_password('$DemoPassword'))"

$passwordHash = $passwordHash.Trim()

foreach ($user in $demoUsers) {
  $registerBody = @{
    email = $user.email
    password = $DemoPassword
    full_name = $user.full_name
  } | ConvertTo-Json

  try {
    Invoke-RestMethod `
      -Uri "$ApiBaseUrl/auth/register" `
      -Method Post `
      -ContentType "application/json" `
      -Body $registerBody | Out-Null
  } catch {
    $errorBody = $_.ErrorDetails.Message
    if (-not $errorBody -or $errorBody -notmatch "User already exists") {
      throw
    }
  }

  $updateRoleSql = @"
UPDATE users
SET
  role = '$($user.role)',
  status = 'ACTIVE',
  password_hash = '$passwordHash'
WHERE email = '$($user.email)';
"@

  docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile exec -T postgres `
    psql -U postgres -d sentinel -c $updateRoleSql | Out-Null
}

$auditSql = @"
SELECT email, role, status
FROM users
WHERE email IN (
  'demo.admin@sentinel-demo.com',
  'demo.analyst@sentinel-demo.com',
  'demo.operator@sentinel-demo.com'
)
ORDER BY email;
"@

Write-Host "Demo users ready:" -ForegroundColor Green
docker compose --env-file $resolvedEnvFile -f $resolvedComposeFile exec -T postgres `
  psql -U postgres -d sentinel -c $auditSql
