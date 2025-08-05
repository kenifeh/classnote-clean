# Simple ClassNote AI Firewall Fix
Write-Host "🔧 Adding Windows Firewall rules for ClassNote AI..." -ForegroundColor Yellow

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "❌ This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Red
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Press Win + X" -ForegroundColor White
    Write-Host "2. Select 'Windows PowerShell (Admin)' or 'Terminal (Admin)'" -ForegroundColor White
    Write-Host "3. Navigate to this directory" -ForegroundColor White
    Write-Host "4. Run: .\fix-firewall-simple.ps1" -ForegroundColor White
    exit 1
}

Write-Host "📥 Adding inbound rule for port 3001..." -ForegroundColor Green
netsh advfirewall firewall add rule name="ClassNote AI Backend" dir=in action=allow protocol=TCP localport=3001

Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Now try your Android app again!" -ForegroundColor Yellow
Write-Host "The backend should be accessible from your phone at: http://192.168.1.154:3001" -ForegroundColor Cyan 