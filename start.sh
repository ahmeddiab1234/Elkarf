#!/bin/bash
# Quick start script for Linux/Mac

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Personal Website RAG Chatbot Starter   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[!] .env file not found!"
    echo "[*] Creating .env from .env.example..."
    cp .env.example .env
    echo "[+] .env created. Please edit it with your API keys."
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "[*] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[!] npm install failed. Make sure Node.js is installed."
        exit 1
    fi
    echo "[+] Dependencies installed."
    echo ""
fi

# Start the server
echo "[*] Starting server..."
echo ""
npm start
