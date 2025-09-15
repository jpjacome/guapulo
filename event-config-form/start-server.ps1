# PowerShell script for starting the Event RSVP Configuration Form server
# Run this script in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Event RSVP Configuration Form Server" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PHP is installed
try {
    $phpVersion = php --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PHP is installed" -ForegroundColor Green
        Write-Host ($phpVersion -split "`n")[0] -ForegroundColor Gray
    } else {
        throw "PHP not found"
    }
} catch {
    Write-Host "❌ PHP is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PHP first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://windows.php.net/download/" -ForegroundColor White
    Write-Host "2. Extract to C:\php\" -ForegroundColor White
    Write-Host "3. Add C:\php to your Windows PATH" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use XAMPP: https://www.apachefriends.org/" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if saved_configs directory exists
if (!(Test-Path "saved_configs")) {
    Write-Host "📁 Creating saved_configs directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Name "saved_configs"
}

# Check if we're in the right directory
if (!(Test-Path "index.php")) {
    Write-Host "❌ Error: index.php not found" -ForegroundColor Red
    Write-Host "Please run this script from the event-config-form directory" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "🚀 Starting PHP development server..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Server will be available at: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host "📱 On mobile (same network): " -NoNewline -ForegroundColor White
Write-Host "http://$env:COMPUTERNAME.local:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "🔄 Press Ctrl+R in browser to refresh after changes" -ForegroundColor Yellow
Write-Host ""

# Open browser automatically
Start-Process "http://localhost:8000"

# Start the PHP server
try {
    php -S localhost:8000
} catch {
    Write-Host ""
    Write-Host "❌ Server failed to start" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🛑 Server stopped" -ForegroundColor Red
Read-Host "Press Enter to exit"
