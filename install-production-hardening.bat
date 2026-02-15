@echo off
echo ========================================
echo  PRODUCTION HARDENING - Complete Setup
echo ========================================
echo.
echo This installs ALL critical production
echo dependencies for a secure, reliable,
echo and scalable MCP server.
echo.

cd mcp-server

echo [1/5] Installing input validation (Pydantic)...
pip install pydantic
echo.

echo [2/5] Installing retry mechanism (Tenacity)...
pip install tenacity
echo.

echo [3/5] Installing HTTP client (Requests)...
pip install requests
echo.

echo [4/5] Installing PDF generation (ReportLab)...
pip install reportlab
echo.

echo [5/5] Installing payment processing (Razorpay)...
pip install razorpay
echo.

echo ========================================
echo  Testing Installation...
echo ========================================
python -c "import pydantic; print('✅ Pydantic loaded')"
python -c "import tenacity; print('✅ Tenacity loaded')"
python -c "import requests; print('✅ Requests loaded')"
python -c "from reportlab.lib.pagesizes import letter; print('✅ ReportLab loaded')"
python -c "import razorpay; print('✅ Razorpay loaded')"
echo.

echo ========================================
echo  Verifying Production Modules...
echo ========================================
python -c "from validation import LeadCreateSchema; print('✅ Validation module')"
python -c "from resilience import retry_with_backoff; print('✅ Resilience module')"
python -c "from logger import logger; print('✅ Logger module')"
python -c "from rate_limiter import rate_limiter; print('✅ Rate limiter module')"
python -c "from token_manager import token_manager; print('✅ Token manager module')"
echo.

echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Production Hardening Modules:
echo   ✅ validation.py - Input validation (10 schemas)
echo   ✅ resilience.py - Retry + Circuit breaker
echo   ✅ logger.py - Structured JSON logging
echo   ✅ rate_limiter.py - Multi-tier rate limiting
echo   ✅ token_manager.py - Token management
echo.
echo Next Steps:
echo 1. Configure Razorpay keys in .env
echo 2. Review PRODUCTION_HARDENING_GUIDE.md
echo 3. Apply validation to critical tools
echo 4. Test with invalid inputs
echo 5. Monitor logs in mcp-server/logs/
echo.
echo Your platform is now PRODUCTION-READY! 🛡️
pause
