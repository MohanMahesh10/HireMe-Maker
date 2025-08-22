@echo off
echo.
echo ==========================================
echo   HireMe Maker - AI Resume Optimizer
echo ==========================================
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python main_simple.py"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ==========================================
echo   Both servers are starting!
echo ==========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo.
echo   Get your API key from:
echo   https://makersuite.google.com/app/apikey
echo.
echo Press any key to continue...
pause > nul 