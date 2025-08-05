# Set terminal colors for better visibility
Write-Host "Setting terminal colors..." -ForegroundColor Yellow

# Set console colors
$Host.UI.RawUI.BackgroundColor = "DarkBlue"
$Host.UI.RawUI.ForegroundColor = "White"
Clear-Host

Write-Host "Terminal colors updated!" -ForegroundColor Green
Write-Host "Background: Dark Blue" -ForegroundColor Blue
Write-Host "Text: White" -ForegroundColor White
Write-Host ""

# Run the API test with new colors
Write-Host "Running API tests..." -ForegroundColor Yellow
& ".\test-api.ps1" 