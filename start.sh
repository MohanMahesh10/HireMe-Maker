#!/bin/bash

echo "Starting Smart Resume Optimizer..."

echo ""
echo "Setting up Backend (FastAPI)..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "Setting up Frontend (React)..."
cd ../frontend
npm install

echo ""
echo "Starting services..."

# Start backend in background
cd ../backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Start frontend in background
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "Services started!"
echo "Backend PID: $BACKEND_PID (http://localhost:8000)"
echo "Frontend PID: $FRONTEND_PID (http://localhost:3000)"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 