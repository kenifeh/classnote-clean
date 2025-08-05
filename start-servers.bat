@echo off
echo Starting ClassNote AI Servers...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" "C:\Program Files\nodejs\node.exe" index.js
cd ..

echo.
echo Starting Frontend Server...
cd frontend
start "Frontend Server" "C:\Program Files\nodejs\npm.cmd" run dev
cd ..

echo.
echo Servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause 