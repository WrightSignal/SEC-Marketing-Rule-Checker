@echo off
REM Railway Deployment Script for SEC Marketing Rule Checker

echo 🚀 Deploying SEC Marketing Rule Checker to Railway...
echo ==================================================

REM Check if Railway CLI is installed
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed
    echo 📦 Installing Railway CLI...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Railway CLI
        pause
        exit /b 1
    )
)

REM Check if logged in
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Railway first:
    railway login
    if %errorlevel% neq 0 (
        echo ❌ Failed to login
        pause
        exit /b 1
    )
)

REM Check if project is linked
railway status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Linking to Railway project...
    railway link -p c84d545a-ee8a-4ccd-99c6-8641cd9168eb
    if %errorlevel% neq 0 (
        echo ❌ Failed to link project
        pause
        exit /b 1
    )
)

echo 📊 Current project status:
railway status

echo.
echo 🚀 Starting deployment...
echo ==========================

REM Deploy all services
railway up
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed!
echo 📋 Next steps:
echo    1. Check deployment status: railway status
echo    2. View logs: railway logs
echo    3. Open project dashboard: railway open
echo    4. Update environment variables if needed
echo.
echo 🔧 Important: Make sure to set the following environment variables:
echo    Backend: CORS_ORIGINS (comma-separated frontend URLs)
echo    Frontend: REACT_APP_API_URL (backend service URL)

pause 