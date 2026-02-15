@echo off
echo ========================================
echo  PHASE 3: Revenue Automation Setup
echo ========================================
echo.

cd mcp-server

echo [1/3] Installing PDF generation library...
pip install reportlab
echo.

echo [2/3] Installing payment processing library...
pip install razorpay
echo.

echo [3/3] Installing retry mechanism library...
pip install tenacity
echo.

echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Configure Razorpay keys in .env file
echo 2. Test PDF generation
echo 3. Test payment link generation
echo 4. Review PHASE3_IMPLEMENTATION_GUIDE.md
echo.
echo Ready to automate revenue! 🚀
pause
