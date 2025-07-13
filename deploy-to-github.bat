@echo off
REM GitHub Setup and Deployment Script for Parrillazo Guapulense RSVP Website
REM Run this script to initialize Git repository and push to GitHub

echo.
echo =========================================
echo  Parrillazo Guapulense - GitHub Setup
echo =========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Initialize Git repository if not already done
if not exist ".git" (
    echo [1/6] Initializing Git repository...
    git init
    echo.
) else (
    echo [1/6] Git repository already exists, skipping initialization...
    echo.
)

REM Create .gitignore file
echo [2/6] Creating .gitignore file...
(
echo # Dependencies
echo node_modules/
echo.
echo # Build outputs
echo dist/
echo build/
echo.
echo # Environment files
echo .env
echo .env.local
echo .env.production
echo .env.development
echo.
echo # Editor files
echo .vscode/launch.json
echo .vscode/tasks.json
echo .DS_Store
echo Thumbs.db
echo.
echo # Netlify
echo .netlify/
echo.
echo # Logs
echo *.log
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # Cache
echo .cache/
echo.
echo # Temporary files
echo *.tmp
echo *.temp
echo.
echo # Debug directories
echo .chrome-debug/
) > .gitignore
echo.

REM Add all files to Git
echo [3/6] Adding files to Git...
git add .
echo.

REM Create initial commit
echo [4/6] Creating initial commit...
git commit -m "Initial commit: Parrillazo Guapulense RSVP website

- Complete event website with 8-bit robot theme
- Professional corporate color scheme
- Netlify Forms integration for RSVP
- Netlify CMS for content management
- Responsive design with countdown timer
- Event details: July 18, 2025 - BBQ in Guápulo, Quito
- Hosted by JP"
echo.

REM Set main branch
echo [5/6] Setting main branch...
git branch -M main
echo.

REM Prompt for GitHub repository
echo [6/6] Setting up GitHub remote...
echo.
echo Please create a new repository on GitHub with these details:
echo   Repository name: guapulo
echo   Owner: jpjacome
echo   Description: Parrillazo Guapulense 2025 - Event RSVP Website
echo   Public/Private: Your choice
echo   Don't initialize with README (we already have one)
echo.
echo GitHub URL should be: https://github.com/jpjacome/guapulo
echo.

set /p confirm="Have you created the GitHub repository? (y/n): "
if /i "%confirm%" neq "y" (
    echo.
    echo Please create the repository first, then run this script again.
    echo.
    pause
    exit /b 0
)

REM Add GitHub remote
echo.
echo Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/jpjacome/guapulo.git
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub
    echo This might be due to:
    echo   1. Repository doesn't exist
    echo   2. Authentication issues
    echo   3. Network connectivity
    echo.
    echo Please check:
    echo   1. Repository exists at: https://github.com/jpjacome/guapulo
    echo   2. You're logged into Git (run: git config --list)
    echo   3. You have push permissions
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! Website pushed to GitHub
echo ========================================
echo.
echo Your repository: https://github.com/jpjacome/guapulo
echo.
echo NEXT STEPS:
echo.
echo 1. DEPLOY TO NETLIFY:
echo    - Go to: https://app.netlify.com/
echo    - Click "New site from Git"
echo    - Connect GitHub and select 'jpjacome/guapulo'
echo    - Deploy with default settings
echo.
echo 2. ENABLE NETLIFY FEATURES:
echo    - Forms: Automatically enabled
echo    - Identity: Enable in Site Settings ^> Identity
echo    - CMS: Access at your-site.netlify.app/admin
echo.
echo 3. SHARE YOUR WEBSITE:
echo    - Get the Netlify URL after deployment
echo    - Share with your event guests
echo    - Start collecting RSVPs!
echo.
echo 4. CONTENT MANAGEMENT:
echo    - Edit content via CMS: your-site.netlify.app/admin
echo    - Or edit JSON files in _data/ folder
echo.
echo ========================================
echo  ¡Que disfrutes tu Parrillazo! 🤖🔥
echo ========================================
echo.
pause
