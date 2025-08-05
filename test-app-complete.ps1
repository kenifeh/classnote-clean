# ClassNote AI Complete Application Test
# This script tests all components of the ClassNote AI application

Write-Host "🎯 ClassNote AI - Complete Application Test" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Test results tracking
$testResults = @{
    Passed = 0
    Failed = 0
    Total = 0
}

function Write-TestResult {
    param(
        [string]$TestName,
        [bool]$Success,
        [string]$Message = ""
    )
    
    $testResults.Total++
    if ($Success) {
        $testResults.Passed++
        Write-Host "✅ $TestName`: $Message" -ForegroundColor Green
    } else {
        $testResults.Failed++
        Write-Host "❌ $TestName`: $Message" -ForegroundColor Red
    }
}

# Test 1: Check if servers are running
Write-Host "📊 Testing Server Status..." -ForegroundColor Yellow

try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5
    Write-TestResult "Backend Server" $true "Running on port 3001 (Status: $($backendResponse.StatusCode))"
} catch {
    Write-TestResult "Backend Server" $false "Not accessible: $($_.Exception.Message)"
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5
    Write-TestResult "Frontend Server" $true "Running on port 5173 (Status: $($frontendResponse.StatusCode))"
} catch {
    Write-TestResult "Frontend Server" $false "Not accessible: $($_.Exception.Message)"
}

Write-Host ""

# Test 2: Check backend API endpoints
Write-Host "🔧 Testing Backend API Endpoints..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 5
    Write-TestResult "Health Check" $true "Backend is healthy"
} catch {
    Write-TestResult "Health Check" $false "Health check failed"
}

try {
    $summaryResponse = Invoke-WebRequest -Uri "http://localhost:3001/summarize" -Method POST -Body '{"text":"test"}' -ContentType "application/json" -TimeoutSec 10
    Write-TestResult "Summarization API" $true "Summarization endpoint working"
} catch {
    Write-TestResult "Summarization API" $false "Summarization failed: $($_.Exception.Message)"
}

Write-Host ""

# Test 3: Check file structure
Write-Host "📁 Checking Project Structure..." -ForegroundColor Yellow

$requiredFiles = @(
    "backend/index.js",
    "backend/package.json",
    "frontend/index.html",
    "frontend/package.json",
    "frontend/src/main.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-TestResult "File: $file" $true "Exists"
    } else {
        Write-TestResult "File: $file" $false "Missing"
    }
}

Write-Host ""

# Test 4: Check dependencies
Write-Host "📦 Checking Dependencies..." -ForegroundColor Yellow

if (Test-Path "backend/node_modules") {
    Write-TestResult "Backend Dependencies" $true "Installed"
} else {
    Write-TestResult "Backend Dependencies" $false "Not installed"
}

if (Test-Path "frontend/node_modules") {
    Write-TestResult "Frontend Dependencies" $true "Installed"
} else {
    Write-TestResult "Frontend Dependencies" $false "Not installed"
}

Write-Host ""

# Test 5: Check environment configuration
Write-Host "⚙️ Checking Configuration..." -ForegroundColor Yellow

if (Test-Path "backend/.env") {
    Write-TestResult "Environment File" $true "Backend .env exists"
} else {
    Write-TestResult "Environment File" $false "Backend .env missing"
}

Write-Host ""

# Test 6: Check database
Write-Host "🗄️ Checking Database..." -ForegroundColor Yellow

if (Test-Path "backend/classnote.db") {
    Write-TestResult "Database File" $true "SQLite database exists"
} else {
    Write-TestResult "Database File" $false "Database file missing"
}

Write-Host ""

# Test 7: Check uploads directory
Write-Host "📤 Checking Upload Directory..." -ForegroundColor Yellow

if (Test-Path "backend/uploads") {
    Write-TestResult "Uploads Directory" $true "Exists and ready for files"
} else {
    Write-TestResult "Uploads Directory" $false "Missing uploads directory"
}

Write-Host ""

# Summary
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "✅ Passed: $($testResults.Passed)" -ForegroundColor Green
Write-Host "❌ Failed: $($testResults.Failed)" -ForegroundColor Red
Write-Host "📊 Total: $($testResults.Total)" -ForegroundColor White
$successRate = [math]::Round(($testResults.Passed / $testResults.Total) * 100, 1)
Write-Host "🎯 Success Rate: $successRate%" -ForegroundColor Cyan

Write-Host ""

if ($testResults.Failed -eq 0) {
    Write-Host "🎉 All tests passed! Your ClassNote AI application is ready to use!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
    Write-Host "2. Register a new account or login" -ForegroundColor White
    Write-Host "3. Upload an audio file to test transcription and summarization" -ForegroundColor White
    Write-Host "4. View and manage your notes" -ForegroundColor White
} else {
    Write-Host "⚠️ Some tests failed. Please check the errors above and fix them." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Common fixes:" -ForegroundColor Yellow
    Write-Host "1. Start the backend: cd backend; npm start" -ForegroundColor White
    Write-Host "2. Start the frontend: cd frontend; npm run dev" -ForegroundColor White
    Write-Host "3. Install dependencies: npm install (in both backend and frontend)" -ForegroundColor White
    Write-Host "4. Check your .env file configuration" -ForegroundColor White
}

Write-Host ""
Write-Host "📝 Application URLs:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "Test Page: http://localhost:5173/comprehensive-test.html" -ForegroundColor White 