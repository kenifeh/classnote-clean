# Manual Database Initialization Script
# Run this if the main startup script fails

Write-Host "🗄️ Manual Database Initialization..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Change to backend directory
Set-Location backend

Write-Host "📁 Changed to backend directory: $(Get-Location)" -ForegroundColor Cyan

# Check if init-database.js exists
if (-not (Test-Path "init-database.js")) {
    Write-Host "❌ init-database.js not found in backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found init-database.js" -ForegroundColor Green

# Try running the database initialization
Write-Host "🔧 Initializing database..." -ForegroundColor Yellow
node init-database.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database initialized successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Database initialization failed" -ForegroundColor Red
    exit 1
}

# Check if database file was created
if (Test-Path "classnote.db") {
    Write-Host "✅ Database file created: classnote.db" -ForegroundColor Green
    $dbSize = (Get-Item "classnote.db").Length
    Write-Host "📊 Database size: $dbSize bytes" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ Database file not found after initialization" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Database initialization complete!" -ForegroundColor Green
Write-Host "You can now run the main startup script: .\start-enhanced.ps1" -ForegroundColor Cyan 