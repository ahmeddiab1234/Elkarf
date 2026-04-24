@echo off
REM Quick start script for Windows

echo.
echo ╔══════════════════════════════════════════╗
echo ║   Personal Website RAG Chatbot Starter   ║
echo ╚══════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist .env (
    echo [!] .env file not found!
    echo [*] Creating .env from .env.example...
    copy .env.example .env
    echo [+] .env created. Please edit it with your API keys.
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo [*] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [!] npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
    echo [+] Dependencies installed.
    echo.
)

REM Start the server
echo [*] Starting server...
echo.
call npm start

pause
