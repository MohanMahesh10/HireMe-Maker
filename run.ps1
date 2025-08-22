<#
Run the full HireMe Maker stack with ONE command.
Usage (PowerShell):
  powershell -ExecutionPolicy Bypass -File .\run.ps1
#>

$ErrorActionPreference = 'Stop'
Write-Host "=== HireMe Maker - Unified Startup ===" -ForegroundColor Cyan

function Test-Command($name) { Get-Command $name -ErrorAction SilentlyContinue | ForEach-Object { return $true }; return $false }

$UseDocker = $false
if (Test-Command docker -and Test-Command docker-compose) {
    try { docker info | Out-Null; $UseDocker = $true } catch { $UseDocker = $false }
}

if ($UseDocker) {
    Write-Host "Docker detected. Starting with docker-compose (development hot reload)..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml up --build
    exit $LASTEXITCODE
}

Write-Host "Docker not available. Falling back to local environment startup." -ForegroundColor Yellow

# --- Backend ---
Push-Location backend
if (-not (Test-Path venv)) {
    Write-Host "Creating Python venv..." -ForegroundColor Green
    python -m venv venv
}
Write-Host "Activating venv & installing backend dependencies (if needed)..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1
pip install --upgrade pip > $null
pip install -r requirements.txt > $null

# Start backend (non-blocking)
Write-Host "Starting FastAPI backend on http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `'$PWD`'; . .\venv\Scripts\Activate.ps1; uvicorn main:app --host 0.0.0.0 --port 8000" | Out-Null
Pop-Location

# --- Frontend ---
Push-Location frontend
if (-not (Test-Command npm)) { Write-Host "npm not found. Install Node.js first." -ForegroundColor Red; exit 1 }
Write-Host "Installing frontend dependencies (if needed)..." -ForegroundColor Green
if (-not (Test-Path node_modules)) { npm install } else { Write-Host "node_modules exists - skipping full install" -ForegroundColor DarkGray }
Write-Host "Starting React dev server on http://localhost:3000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `'$PWD`'; npm start" | Out-Null
Pop-Location

Write-Host "\nAll services launching in separate windows:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend : http://localhost:8000/docs" -ForegroundColor White
Write-Host "\nPress Ctrl+C here to stop watcher (servers keep running in their windows)." -ForegroundColor DarkGray

# Keep main script alive so user sees status
while ($true) { Start-Sleep -Seconds 3600 }
