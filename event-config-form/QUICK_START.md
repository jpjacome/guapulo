# Quick Start Instructions

## 🚀 Easiest Way to Start

**For Windows users:**

1. **Double-click** `start-server.bat` 
2. The server will start automatically
3. Your browser will open to: http://localhost:8000

## ❓ If PHP is Not Installed

### Quick Install Options:

**Option 1: Download PHP (Recommended)**
- Go to: https://windows.php.net/download/
- Download "Thread Safe" ZIP for your system
- Extract to `C:\php\`
- Add `C:\php\` to Windows PATH

**Option 2: Use XAMPP (Full Package)**
- Download: https://www.apachefriends.org/
- Install and start Apache from XAMPP Control Panel
- Move this folder to `C:\xampp\htdocs\`
- Access via: http://localhost/event-config-form/

**Option 3: Use Package Manager**
```powershell
# In PowerShell as Administrator
winget install PHP.PHP
```

## 📋 Manual Start (Command Line)

**Command Prompt:**
```cmd
cd "path\to\event-config-form"
php -S localhost:8000
```

**PowerShell:**
```powershell
cd "path\to\event-config-form"
php -S localhost:8000
```

## ✅ Success Signs

When working correctly, you should see:
- Server message: "PHP Development Server started"
- Form loads with purple header
- Progress bar appears at top
- All form sections are visible and interactive

## 🔧 Common Issues

**"php is not recognized"**
→ PHP not installed or not in PATH

**"Permission denied"**
→ Run as Administrator or check folder permissions

**"Address already in use"**
→ Try different port: `php -S localhost:8001`

---

**Need help?** Check `WINDOWS_SETUP.md` for detailed instructions.
