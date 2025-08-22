<#
Run HireMe Maker locally (no Docker).
Usage:
  powershell -ExecutionPolicy Bypass -File .\run-local.ps1
#>
$ErrorActionPreference = 'Stop'
Write-Host "=== HireMe Maker Local Startup ===" -ForegroundColor Cyan

# Helper function to check if a command exists
function Test-Command {
    param($command)
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# ---- Backend ----
Write-Host "[Backend] Preparing virtual environment..." -ForegroundColor Yellow
Push-Location backend
if (-not (Test-Path venv)) {
  python -m venv venv
}
. .\venv\Scripts\Activate.ps1
# Install deps only if site-packages missing a marker
if (-not (Test-Path venv\.local_setup_done)) {
  Write-Host "[Backend] Installing requirements..." -ForegroundColor Yellow
  pip install --upgrade pip > $null
  pip install -r requirements.txt
  New-Item venv\.local_setup_done -ItemType File -Force | Out-Null
} else {
  Write-Host "[Backend] Dependencies cached." -ForegroundColor DarkGray
}
# Launch backend in new window
Write-Host "[Backend] Starting uvicorn on http://localhost:8000" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `'$PWD`'; . .\venv\Scripts\Activate.ps1; uvicorn main:app --host 0.0.0.0 --port 8000 --reload" | Out-Null
Pop-Location

# ---- Frontend ----
Write-Host "[Frontend] Preparing React app..." -ForegroundColor Yellow
Push-Location frontend
if (-not (Test-Command npm)) { Write-Host "npm not found. Install Node.js." -ForegroundColor Red; exit 1 }
if (-not (Test-Path node_modules)) {
  Write-Host "[Frontend] Installing npm dependencies..." -ForegroundColor Yellow
  npm install
} else {
  Write-Host "[Frontend] Dependencies cached." -ForegroundColor DarkGray
}
Write-Host "[Frontend] Starting dev server on http://localhost:3000" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `'$PWD`'; npm start" | Out-Null
Pop-Location

Start-Sleep 4
Start-Process http://localhost:3000

Write-Host "\nBackend: http://localhost:8000/docs" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "\nClose this window or press Ctrl+C to exit (servers run in their own windows)." -ForegroundColor DarkGray
while ($true) { Start-Sleep -Seconds 3600 }
