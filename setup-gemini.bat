@echo off
echo ========================================
echo   Gemini CLI Setup for CodeSunny
echo ========================================
echo.

cd mcp-server

echo [1/3] Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)
echo.

echo [2/3] Installing Google Gemini AI package...
pip install google-generativeai pillow
if errorlevel 1 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)
echo.

echo [3/3] Testing Gemini CLI...
python gemini_cli.py help
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Get your Gemini API key from:
echo    https://makersuite.google.com/app/apikey
echo.
echo 2. Add it to mcp-server/.env file:
echo    GEMINI_API_KEY=your_api_key_here
echo.
echo 3. Run Gemini CLI:
echo    cd mcp-server
echo    python gemini_cli.py chat
echo.
pause
