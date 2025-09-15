@echo off
echo ========================================
echo   Event RSVP Configuration Form Server
echo ========================================
echo   Smart Start - Works from anywhere!
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
php --version | findstr /C:"PHP"
echo.

REM Try to find the project directory
set PROJECT_DIR=
set CURRENT_DIR=%CD%

echo 🔍 Looking for project directory...

REM Check current directory first
if exist "index.php" (
    set PROJECT_DIR=%CD%
    echo ✅ Found project in current directory
    goto :found
)

REM Check if we're in a parent directory
if exist "event-config-form\index.php" (
    set PROJECT_DIR=%CD%\event-config-form
    echo ✅ Found project in subdirectory: event-config-form
    goto :found
)

REM Try the full path from user's documents
set FULL_PATH=C:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\event-config-form
if exist "%FULL_PATH%\index.php" (
    set PROJECT_DIR=%FULL_PATH%
    echo ✅ Found project at: %FULL_PATH%
    goto :found
)

REM Try alternative common locations
for %%D in (
    "C:\Users\%USERNAME%\Documents\event-config-form"
    "C:\Users\%USERNAME%\Desktop\event-config-form"
    "C:\event-config-form"
    "D:\event-config-form"
    "%USERPROFILE%\Downloads\event-config-form"
) do (
    if exist "%%D\index.php" (
        set PROJECT_DIR=%%D
        echo ✅ Found project at: %%D
        goto :found
    )
)

REM Project not found
echo.
echo ❌ Could not find the event-config-form project
echo.
echo 📍 Current directory: %CD%
echo.
echo SOLUTIONS:
echo.
echo 1. Make sure you extracted/downloaded the project files
echo 2. Navigate to the project directory manually:
echo    - Open File Explorer
echo    - Go to the folder containing index.php
echo    - Double-click start-server.bat from there
echo.
echo 3. Or use Command Prompt:
echo    cd "path\to\event-config-form"
echo    start-server.bat
echo.
echo 4. Expected files in project directory:
echo    - index.php
echo    - style.css
echo    - script.js
echo    - README.md
echo.
pause
exit /b 1

:found
echo.
echo 📁 Project directory: %PROJECT_DIR%

REM Navigate to project directory
cd /d "%PROJECT_DIR%"

REM Check if saved_configs directory exists
if not exist "saved_configs" (
    echo 📁 Creating saved_configs directory...
    mkdir saved_configs
)

echo.
echo 🚀 Starting PHP development server...
echo.
echo 📍 Server directory: %CD%
echo 🌐 Server URL: http://localhost:8000
echo 📱 Mobile access: http://%COMPUTERNAME%.local:8000
echo.
echo 💡 Tips:
echo    - Press Ctrl+C to stop the server
echo    - Press Ctrl+R in browser to refresh
echo    - The form auto-saves your progress
echo.

REM Try to open browser
start http://localhost:8000 2>nul

REM Start the PHP server
php -S localhost:8000

echo.
echo 🛑 Server stopped
echo.
pause
