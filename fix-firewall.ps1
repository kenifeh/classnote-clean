# ClassNote AI Firewall Fix Script
# This script adds Windows Firewall rules to allow connections to the backend

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
    Write-Host "4. Run: .\fix-firewall.ps1" -ForegroundColor White
    exit 1
}

try {
    # Add inbound rule for port 3001
    Write-Host "📥 Adding inbound rule for port 3001..." -ForegroundColor Green
    netsh advfirewall firewall add rule name="ClassNote AI Backend (Inbound)" dir=in action=allow protocol=TCP localport=3001
    
    # Add outbound rule for port 3001
    Write-Host "📤 Adding outbound rule for port 3001..." -ForegroundColor Green
    netsh advfirewall firewall add rule name="ClassNote AI Backend (Outbound)" dir=out action=allow protocol=TCP localport=3001
    
    Write-Host "✅ Firewall rules added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Now try your Android app again!" -ForegroundColor Yellow
    Write-Host "The backend should be accessible from your phone at: http://192.168.1.154:3001" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error adding firewall rules: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Alternative manual fix:" -ForegroundColor Yellow
    Write-Host "1. Press Win + R, type 'wf.msc', press Enter" -ForegroundColor White
    Write-Host "2. Click 'Inbound Rules' in the left panel" -ForegroundColor White
    Write-Host "3. Click 'New Rule...' in the right panel" -ForegroundColor White
    Write-Host "4. Select 'Port' and click Next" -ForegroundColor White
    Write-Host "5. Select 'TCP' and enter '3001' for specific local ports" -ForegroundColor White
    Write-Host "6. Select 'Allow the connection' and click Next" -ForegroundColor White
    Write-Host "7. Select all profiles (Domain, Private, Public) and click Next" -ForegroundColor White
    Write-Host "8. Name it 'ClassNote AI Backend' and click Finish" -ForegroundColor White
} 