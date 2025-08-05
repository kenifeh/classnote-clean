# Create Test User Script
# This script creates a test user for accessing the ClassNote AI app

Write-Host "Creating test user for ClassNote AI..." -ForegroundColor Green
Write-Host ""

# Test user credentials
$testUser = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
}

Write-Host "Test User Credentials:" -ForegroundColor Cyan
Write-Host "Username: $($testUser.username)" -ForegroundColor White
Write-Host "Email: $($testUser.email)" -ForegroundColor White
Write-Host "Password: $($testUser.password)" -ForegroundColor White
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 5
    Write-Host "Backend is running" -ForegroundColor Green
} catch {
    Write-Host "Backend is not running. Please start the app first with: .\start-app.ps1" -ForegroundColor Red
    exit 1
}

# Create test user
Write-Host "Creating test user..." -ForegroundColor Yellow
try {
    $body = $testUser | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Test user created successfully!" -ForegroundColor Green
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*409*" -or $errorMessage -like "*already exists*") {
        Write-Host "Test user already exists" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to create test user: $errorMessage" -ForegroundColor Red
        exit 1
    }
}

# Test login
Write-Host "Testing login..." -ForegroundColor Yellow
try {
    $loginData = @{
        username = $testUser.username
        password = $testUser.password
    }
    $body = $loginData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token received: $($response.token.Substring(0, 20))..." -ForegroundColor Cyan
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Test user setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now login to the app with:" -ForegroundColor Cyan
Write-Host "Username: $($testUser.username)" -ForegroundColor White
Write-Host "Password: $($testUser.password)" -ForegroundColor White
Write-Host ""
Write-Host "Access the app at: http://localhost:5173" -ForegroundColor Yellow 