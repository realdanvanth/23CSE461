#!/bin/bash

# Shape Builder - Start Script
echo "🧩 Starting Shape Builder App..."

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the dev server
echo "🚀 Launching dev server at http://localhost:5173"
npm run dev -- --port 5173
