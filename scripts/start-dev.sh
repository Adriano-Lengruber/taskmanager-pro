#!/bin/bash
# TaskManager Pro - Start Development Environment

echo "🚀 Iniciando TaskManager Pro - Ambiente de Desenvolvimento"

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM EXIT

# Start backend
echo "🔧 Iniciando Backend (FastAPI)..."
cd backend
source ../.venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Iniciando Frontend (React)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Serviços iniciados:"
echo "  Backend:  http://localhost:8000 (PID: $BACKEND_PID)"
echo "  Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo "  API Docs: http://localhost:8000/api/docs"
echo ""
echo "Pressione Ctrl+C para parar todos os serviços"

# Wait for processes
wait
