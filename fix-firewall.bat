@echo off
echo 🔧 Adding Windows Firewall rules for ClassNote AI...
echo.

netsh advfirewall firewall add rule name="ClassNote AI Backend" dir=in action=allow protocol=TCP localport=3001

if %errorlevel% equ 0 (
    echo ✅ Firewall rule added successfully!
    echo.
    echo 🎯 Now try your Android app again!
    echo The backend should be accessible from your phone at: http://192.168.1.154:3001
) else (
    echo ❌ Failed to add firewall rule. Please run as Administrator.
    echo.
    echo To run as Administrator:
    echo 1. Right-click on this file
    echo 2. Select "Run as administrator"
)

pause 