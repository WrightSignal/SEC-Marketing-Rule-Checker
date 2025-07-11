@echo off
echo 🚀 Starting SEC Marketing Rule Checker Frontend...
echo 📍 Frontend will be available at: http://localhost:3000
echo ====================================================

cd frontend

if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo 🎯 Starting development server...
npm start

pause 