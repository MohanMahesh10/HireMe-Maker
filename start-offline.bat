@echo off
echo.
echo ==========================================
echo   HireMe Maker - OFFLINE DEMO MODE
echo ==========================================
echo.

echo Starting Offline Backend Server...
start "Backend-Offline" cmd /k "cd backend && venv\Scripts\activate && python main_offline.py"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ==========================================
echo   OFFLINE DEMO IS STARTING!
echo ==========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo.
echo   API Key: Use "demo123" or any text
echo   No internet required for AI features!
echo.
echo   Features:
echo   - Real ATS scoring
echo   - Keyword analysis  
echo   - Algorithmic resume optimization
echo   - Full application flow
echo.
echo Press any key to continue...
pause > nul 