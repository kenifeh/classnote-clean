# Simple ClassNote AI Startup Script

Write-Host "Starting Enhanced ClassNote AI..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# Wait a moment for frontend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Enhanced ClassNote AI is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "New Features Available:" -ForegroundColor Cyan
Write-Host "  Enhanced Summary Generation" -ForegroundColor White
Write-Host "  ThinkSpace Socratic Chat" -ForegroundColor White
Write-Host "  Summary Archive with Search" -ForegroundColor White
Write-Host "  Audio Playback with Transcript Highlighting" -ForegroundColor White
Write-Host "  Mobile-First UI with Bottom Tab Navigation" -ForegroundColor White
Write-Host "  Voice Input/Output in ThinkSpace" -ForegroundColor White
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Yellow
Write-Host "  Enhanced Web App: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "To stop servers, close the PowerShell windows or press Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Open the enhanced frontend in browser
Start-Sleep -Seconds 5
Write-Host "Opening enhanced frontend in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Enhanced ClassNote AI is ready!" -ForegroundColor Green
Write-Host "Enjoy the new Socratic learning experience!" -ForegroundColor Cyan 