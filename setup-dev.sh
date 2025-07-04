#!/bin/bash
# Development setup script for TaskManager Pro

echo "🚀 Setting up TaskManager Pro Development Environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Please update .env file with your configuration"
fi

# Setup Backend
echo "🐍 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

# Activate virtual environment and install dependencies
source .venv/bin/activate
pip install -r requirements.txt

echo "✅ Backend setup complete!"

# Setup Frontend
echo "⚛️ Setting up Frontend..."
cd ../frontend

# Install Node.js dependencies
npm install

echo "✅ Frontend setup complete!"

# Return to root directory
cd ..

echo "📊 Creating database..."
cd backend
source .venv/bin/activate
python create_admin.py

echo "🎉 Development environment setup complete!"
echo ""
echo "To start the development servers:"
echo "  Backend:  cd backend && source .venv/bin/activate && uvicorn main:app --reload"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up -d"
