#!/bin/bash
# TaskManager Pro - Development Setup Script

echo "🚀 TaskManager Pro - Configuração de Desenvolvimento"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Execute este script na raiz do projeto TaskManager Pro"
    exit 1
fi

# Backend setup
echo "🔧 Configurando Backend..."
cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📋 Criando arquivo .env do backend..."
    cp .env.example .env
fi

# Install Python dependencies
echo "📦 Instalando dependências Python..."
python -m pip install -r ../requirements.txt

# Go back to root
cd ..

# Frontend setup
echo "🎨 Configurando Frontend..."
cd frontend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📋 Criando arquivo .env do frontend..."
    cp .env.example .env
fi

# Install Node dependencies
echo "📦 Instalando dependências Node.js..."
npm install

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  Backend:  npm run dev:backend"
echo "  Frontend: npm run dev:frontend"
echo "  Ambos:    npm run dev"
