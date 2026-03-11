@echo off
REM SSD Delhi Platform - Setup Script (Windows)
REM This script helps you set up the complete platform

echo.
echo ==========================================
echo   Samta Sainik Dal Delhi Platform - Setup
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo      Version: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [OK] npm found
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo      Version: %NPM_VERSION%

REM Install dependencies
echo.
echo [INFO] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed

REM Check for .env.local
if not exist .env.local (
    echo.
    echo [WARNING] .env.local file not found!
    echo.
    echo You need to set up environment variables:
    echo.
    echo 1. Run: npx convex dev
    echo    - This will create your Convex account and backend
    echo    - Follow the prompts to log in/create account
    echo.
    echo 2. Set up Clerk authentication:
    echo    - Visit: https://clerk.com
    echo    - Create an account and new application
    echo    - Copy your API keys to .env.local
    echo.
    echo 3. ^(Optional^) Set up Anthropic API for AI features:
    echo    - Visit: https://console.anthropic.com
    echo    - Get your API key
    echo.
    echo See SETUP.md for detailed instructions
    echo.
) else (
    echo [OK] .env.local found
)

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. If you haven't set up Convex yet, run: npx convex dev
echo 2. Add your Clerk API keys to .env.local
echo 3. Start the development server: npm run dev
echo.
echo Full documentation: SETUP.md
echo.
pause
