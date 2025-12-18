@echo off
echo =====================================
echo GeoPhoto - Setup Script
echo =====================================
echo.

echo [1/3] Setting up Backend...
cd backend
if not exist "uploads" mkdir uploads
echo Created uploads directory
cd ..
echo.

echo [2/3] Setting up Frontend...
cd frontend
echo Installing npm dependencies...
call npm install
cd ..
echo.

echo [3/3] Setup Complete!
echo.
echo =====================================
echo Next Steps:
echo =====================================
echo 1. Start Backend:
echo    cd backend
echo    mvn spring-boot:run
echo.
echo 2. Start Frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5173
echo.
echo =====================================
pause

