# Set console colors for better visibility
$Host.UI.RawUI.BackgroundColor = "Black"
$Host.UI.RawUI.ForegroundColor = "White"
Clear-Host

Write-Host "Testing ClassNote AI API..." -ForegroundColor Magenta
Write-Host ""

# Test 1: Health check
Write-Host "1. Testing health check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/" -Method GET
    Write-Host "✅ Health check passed: $($healthResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Summarization endpoint
Write-Host ""
Write-Host "2. Testing summarization endpoint..." -ForegroundColor Yellow
try {
    $testText = "This is a test lecture about artificial intelligence and machine learning. We will cover neural networks, deep learning, and their applications in modern technology."
    $body = @{
        text = $testText
    } | ConvertTo-Json

    $summaryResponse = Invoke-WebRequest -Uri "http://localhost:3001/summarize" -Method POST -Body $body -ContentType "application/json"
    $summaryData = $summaryResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Summarization test passed" -ForegroundColor Green
    Write-Host "Summary: $($summaryData.summary)" -ForegroundColor Blue
} catch {
    Write-Host "❌ Summarization test failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "🎉 All API tests passed! The application is working correctly." -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor White
Write-Host "- Open http://localhost:5173 in your browser" -ForegroundColor Blue
Write-Host "- Upload an audio file to test the full functionality" -ForegroundColor Blue
Write-Host "- The app will work in demo mode without an OpenAI API key" -ForegroundColor Blue 