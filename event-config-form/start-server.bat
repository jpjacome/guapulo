@echo off
echo ========================================
echo   Event RSVP Configuration Form Server
echo ========================================
echo.

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP is not installed or not in PATH
    echo.
    echo Please install PHP first:
    echo 1. Download from: https://windows.php.net/download/
    echo 2. Extract to C:\php\
    echo 3. Add C:\php to your Windows PATH
    echo.
    echo Or use XAMPP: https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo ✅ PHP is installed
php --version
echo.

REM Check if saved_configs directory exists
if not exist "saved_configs" (
    echo 📁 Creating saved_configs directory...
    mkdir saved_configs
)

REM Check if we're in the right directory
if not exist "index.php" (
    echo ❌ Error: index.php not found
    echo.
    echo Current directory: %CD%
    echo.
    echo SOLUTION: Navigate to the event-config-form directory first:
    echo.
    echo Method 1 - Using File Explorer:
    echo 1. Open File Explorer
    echo 2. Navigate to: C:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\event-config-form
    echo 3. Double-click start-server.bat from INSIDE that folder
    echo.
    echo Method 2 - Using Command Prompt:
    echo 1. Open Command Prompt
    echo 2. Type: cd "C:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\event-config-form"
    echo 3. Type: start-server.bat
    echo.
    echo Method 3 - Quick Fix (try automatic navigation):
    set /p choice="Try to navigate automatically? (y/n): "
    if /i "%choice%"=="y" (
        if exist "C:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\event-config-form\index.php" (
            echo 🔄 Navigating to correct directory...
            cd /d "C:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\event-config-form"
            goto :continue
        ) else (
            echo ❌ Could not find the project directory
        )
    )
    echo.
    pause
    exit /b 1
)

echo 🚀 Starting PHP development server...
echo.

:continue
echo 📍 Current directory: %CD%
echo 🌐 Server will be available at: http://localhost:8000
echo 📱 On mobile (same network): http://%COMPUTERNAME%.local:8000
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo 🔄 Press Ctrl+R in browser to refresh after changes
echo.

REM Start the PHP server
php -S localhost:8000

echo.
echo 🛑 Server stopped
pause
