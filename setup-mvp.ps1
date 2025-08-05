# ClassNote AI MVP Setup Script
Write-Host "🚀 Setting up ClassNote AI MVP..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Initialize database
Write-Host "🗄️ Initializing database..." -ForegroundColor Yellow
npm run init-db

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to initialize database" -ForegroundColor Red
    exit 1
}

# Update storage limits for existing users
Write-Host "🔄 Updating storage limits..." -ForegroundColor Yellow
npm run update-storage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to update storage limits" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Copy new frontend file
Write-Host "📁 Setting up new frontend..." -ForegroundColor Yellow
if (Test-Path "index-new.html") {
    Copy-Item "index-new.html" "index.html" -Force
    Write-Host "✅ New frontend copied" -ForegroundColor Green
}

Set-Location ..

# Check if ports are available
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow

$backendPort = 3001
$frontendPort = 5173

# Check backend port
try {
    $backendTest = Test-NetConnection -ComputerName localhost -Port $backendPort -InformationLevel Quiet
    if ($backendTest) {
        Write-Host "⚠️ Backend port $backendPort is in use. Stopping existing process..." -ForegroundColor Yellow
        Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -like "*backend*"} | Stop-Process -Force
        Start-Sleep -Seconds 2
    }
} catch {
    # Port is available
}

# Check frontend port
try {
    $frontendTest = Test-NetConnection -ComputerName localhost -Port $frontendPort -InformationLevel Quiet
    if ($frontendTest) {
        Write-Host "⚠️ Frontend port $frontendPort is in use. Stopping existing process..." -ForegroundColor Yellow
        Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -like "*vite*"} | Stop-Process -Force
        Start-Sleep -Seconds 2
    }
} catch {
    # Port is available
}

# Start backend server
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🚀 Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# Wait for servers to start
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test backend
Write-Host "🧪 Testing backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:$backendPort" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend is running: $($backendResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend test failed. Please check the backend console for errors." -ForegroundColor Red
}

# Test frontend
Write-Host "🧪 Testing frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:$frontendPort" -Method Get -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend test failed. Please check the frontend console for errors." -ForegroundColor Red
}

# Open application in browser
Write-Host "🌐 Opening application in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:$frontendPort"

Write-Host ""
Write-Host "🎉 ClassNote AI MVP is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:$frontendPort" -ForegroundColor White
Write-Host "   Backend:  http://localhost:$backendPort" -ForegroundColor White
Write-Host ""
Write-Host "🔑 New Features Added:" -ForegroundColor Cyan
Write-Host "   ✅ User Authentication (Register/Login)" -ForegroundColor White
Write-Host "   ✅ Database Storage (SQLite)" -ForegroundColor White
Write-Host "   ✅ Note History & Management" -ForegroundColor White
Write-Host "   ✅ Search Functionality" -ForegroundColor White
Write-Host "   ✅ Category Organization" -ForegroundColor White
Write-Host "   ✅ Persistent Data Storage" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Register a new account" -ForegroundColor White
Write-Host "   2. Upload an audio file" -ForegroundColor White
Write-Host "   3. View your saved notes" -ForegroundColor White
Write-Host "   4. Search through your notes" -ForegroundColor White
Write-Host ""
Write-Host "💡 To stop the servers, close the PowerShell windows or press Ctrl+C" -ForegroundColor Yellow 