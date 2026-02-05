#!/bin/bash

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    wait
    echo "Servers stopped."
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
