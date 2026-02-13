@echo off
echo Starting CodeSunny Development Environment...
echo.

REM Start MCP Server
echo [1/3] Starting MCP Server (port 8001)...
start "MCP Server" cmd /k "cd mcp-server && python server.py"
timeout /t 3 /nobreak >nul

REM Start Backend
echo [2/3] Starting Backend (port 5000)...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Frontend (port 5174/5175)...
start "Frontend" cmd /k "npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo All servers started successfully!
echo ========================================
echo.
echo MCP Server:    http://localhost:8001
echo Backend:       http://localhost:5000
echo Frontend:      http://localhost:5174
echo.
echo Press any key to exit this window...
pause >nul
