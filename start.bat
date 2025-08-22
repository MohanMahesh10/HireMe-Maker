@echo off
echo Starting Smart Resume Optimizer...

echo.
echo Starting Backend (FastAPI)...
cd backend
start cmd /k "python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python main.py"

echo.
echo Starting Frontend (React)...
cd ..\frontend
start cmd /k "npm install && npm start"

echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo.
pause 