@echo off
echo Starting ClassNote AI Frontend Server...
echo.
cd /d "C:\Users\kenif\Documents\classnote-clean\frontend"
echo Current directory: %CD%
echo.
echo Starting HTTP server on port 5173...
echo.
echo Your app will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.
node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); http.createServer((req, res) => { let filePath = req.url === '/' ? './index.html' : '.' + req.url; fs.readFile(filePath, (err, data) => { if (err) { res.writeHead(404); res.end('File not found: ' + filePath); } else { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); } }); }).listen(5173, () => console.log('Server running on http://localhost:5173'));"
pause 