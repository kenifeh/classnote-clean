Write-Host "Testing Frontend Accessibility..." -ForegroundColor Magenta
Write-Host ""

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET
    Write-Host "✅ Frontend is accessible!" -ForegroundColor Green
    Write-Host "Status: $($frontendResponse.StatusCode)" -ForegroundColor Blue
    Write-Host "Content Length: $($frontendResponse.Content.Length) characters" -ForegroundColor Blue
    
    if ($frontendResponse.Content -match "ClassNote AI") {
        Write-Host "✅ Frontend contains 'ClassNote AI' title" -ForegroundColor Green
    }
    
    if ($frontendResponse.Content -match "Upload Audio File") {
        Write-Host "✅ Frontend contains upload functionality" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎉 Frontend test passed! You can now:" -ForegroundColor Green
    Write-Host "- Open http://localhost:5173 in your browser" -ForegroundColor Blue
    Write-Host "- Test the audio upload and processing functionality" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
} 