# HireMe Maker - Quick Start Script (No Docker)
Write-Host "HireMe Maker - Quick Start" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Function to check if a command exists
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

# Start backend
Write-Host "`n[1/2] Starting backend server..." -ForegroundColor Yellow
Push-Location backend
if (-not (Test-Path venv)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

Write-Host "Activating virtual environment and installing dependencies..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Backend Server' -ForegroundColor Cyan; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt; Write-Host 'Starting FastAPI server...' -ForegroundColor Green; python main.py"
Pop-Location

# Give the backend a moment to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "`n[2/2] Starting frontend server..." -ForegroundColor Yellow
Push-Location frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm install; Write-Host 'Starting React development server...' -ForegroundColor Green; npm start"
Pop-Location

Write-Host "`n✓ Application is starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Blue
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Blue

Start-Sleep -Seconds 5
Write-Host "`nOpening application in browser..."
Start-Process "http://localhost:3000"
