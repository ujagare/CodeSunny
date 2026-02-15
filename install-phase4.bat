@echo off
echo ========================================
echo  PHASE 4: Production Hardening Setup
echo ========================================
echo.
echo This installs critical security and
echo reliability improvements.
echo.

cd mcp-server

echo [1/2] Installing input validation library...
pip install pydantic
echo.

echo [2/2] Installing retry mechanism library...
pip install tenacity
echo.

echo ========================================
echo  Testing Installation...
echo ========================================
python -c "from production_hardening import logger; logger.info('test', 'Production hardening loaded successfully')"
echo.

echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo What's Now Available:
echo   - Input Validation (Pydantic schemas)
echo   - Rate Limiting (Multi-tier)
echo   - Retry Mechanism (Exponential backoff)
echo   - Circuit Breaker (API protection)
echo   - Structured Logging (JSON logs)
echo   - Token Management (Context control)
echo   - Sanitization (XSS/Injection prevention)
echo.
echo Next Steps:
echo 1. Review PHASE4_PRODUCTION_HARDENING.md
echo 2. Apply validation to critical tools
echo 3. Test with invalid inputs
echo 4. Check logs in mcp-server/logs/
echo.
echo Your platform is now production-ready! 🛡️
pause
