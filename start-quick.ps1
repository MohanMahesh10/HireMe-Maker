# HireMe Maker - Quick Start Script
Write-Host "Starting HireMe Maker..." -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\MOHAN MAHESH\Desktop\MM projects\HireMe Maker\backend'; .\venv\Scripts\Activate.ps1; python main_simple.py"

# Wait a moment
Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\MOHAN MAHESH\Desktop\MM projects\HireMe Maker\frontend'; npm start"

Write-Host ""
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo Job Description: Software Engineer - Python, JavaScript, React, FastAPI, MySQL, AWS" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue" 