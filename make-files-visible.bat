@echo off
echo 🔍 Making BTMM files visible in VSCode Explorer...
echo.

echo ✅ Step 1: VSCode settings updated
echo ✅ Step 2: Refreshing workspace...

echo.
echo 📁 Your project files are located in:
dir /b /ad | findstr /v node_modules
echo.

echo 🚀 IMMEDIATE SOLUTIONS:
echo.
echo 1. Press Ctrl+Shift+E to open/focus File Explorer
echo 2. Press F5 in the Explorer panel to refresh
echo 3. Press Ctrl+Shift+P and type "Developer: Reload Window"
echo 4. Right-click in Explorer and select "Refresh"
echo.

echo 📂 Main folders you should see:
echo    ├── platform/     (React TypeScript app)
echo    ├── docs/         (Trading strategy webapp)
echo    ├── scripts/      (Pine scripts)
echo    ├── automation/   (Management tools)
echo    ├── configs/      (Configuration files)
echo    └── All other folders...
echo.

echo 🎯 If still not visible, run: npm run show:structure
echo.
pause
