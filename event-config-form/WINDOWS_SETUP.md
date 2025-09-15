# Windows PHP Server Setup Guide

## 🚀 Quick Start Options

### Option 1: Use the Batch File (Easiest)
1. Double-click `start-server.bat` 
2. The server will start automatically
3. Open your browser to: http://localhost:8000

### Option 2: Command Line
1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```cmd
   cd "C:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\event-config-form"
   ```
3. Start the PHP server:
   ```cmd
   php -S localhost:8000
   ```
4. Open browser to: http://localhost:8000

## 📋 Prerequisites

### Check if PHP is Installed
Open Command Prompt and run:
```cmd
php --version
```

If you see PHP version information, you're ready to go!

### If PHP is NOT Installed:

#### Method 1: Download PHP Directly
1. Go to: https://windows.php.net/download/
2. Download "Thread Safe" ZIP file for your system (x64 or x86)
3. Extract to `C:\php\` 
4. Add `C:\php\` to your Windows PATH:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"
   - Under "System variables", find "Path", click "Edit"
   - Click "New", add `C:\php`
   - Click "OK" on all windows
5. Restart Command Prompt

#### Method 2: Use XAMPP (Includes Apache + MySQL)
1. Download from: https://www.apachefriends.org/
2. Install XAMPP
3. Use XAMPP Control Panel to start Apache
4. Place project folder in `C:\xampp\htdocs\`
5. Access via: http://localhost/event-config-form/

#### Method 3: Use Windows Package Manager
```powershell
# In PowerShell as Administrator
winget install PHP.PHP
```

## 🔧 Troubleshooting

### "php is not recognized as internal or external command"
- PHP is not installed or not in PATH
- Follow installation steps above

### "Address already in use" error
- Another service is using port 8000
- Try a different port:
  ```cmd
  php -S localhost:8001
  ```

### Permission errors with saved_configs folder
- Right-click the folder → Properties → Security
- Give "Full Control" to your user account

### Form not saving configurations
- Check that `saved_configs/` folder exists and is writable
- Ensure PHP has file write permissions

## 🌐 Alternative Local Servers

### Using Python (if PHP not available)
```cmd
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
*Note: This only serves static files, PHP functionality won't work*

### Using Node.js (if available)
```cmd
npx http-server -p 8000
```

## 🔒 Security Notes

- This is a development server only
- Do not use for production
- Only accessible from your local machine
- Automatically stops when you close the terminal

## 📱 Accessing from Mobile/Other Devices

To test on mobile devices on the same network:
1. Find your computer's IP address:
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your network adapter

2. Start server binding to all interfaces:
   ```cmd
   php -S 0.0.0.0:8000
   ```

3. Access from mobile: http://[YOUR-IP]:8000
   Example: http://192.168.1.100:8000

---

## ✅ Success Indicators

When the server starts successfully, you should see:
```
PHP 8.x.x Development Server (http://localhost:8000) started
```

The form should load in your browser showing:
- "🎉 Event RSVP Website Configuration" header
- Interactive form with all sections
- Progress bar at the top of the page

---

**Need Help?** 
- Check the troubleshooting section above
- Ensure all prerequisites are met
- Try the batch file for automatic setup
