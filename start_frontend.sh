#!/bin/bash

echo "🚀 Starting SEC Marketing Rule Checker Frontend..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo "===================================================="

cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "🎯 Starting development server..."
npm start 