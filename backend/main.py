"""
TaskManager Pro - Main Application Entry Point
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="TaskManager Pro API",
    description="🚀 O melhor gerenciador de projetos e tarefas - API Backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "🚀 TaskManager Pro API",
        "status": "online",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "docs": "/api/docs"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "online",
            "database": "pending",  # Will be updated when DB is configured
            "cache": "pending"
        }
    }

@app.get("/api/v1/info")
async def api_info():
    """API information and capabilities"""
    return {
        "name": "TaskManager Pro",
        "description": "Plataforma modular que combina ClickUp + Jira + Monday.com",
        "features": [
            "Gestão de Tarefas Hierárquica",
            "Metodologias Ágeis (Scrum/Kanban)",
            "Visualizações Múltiplas",
            "Automações com IA",
            "Integrações Extensivas"
        ],
        "api_version": "v1",
        "developer": "Adriano Lengruber",
        "repository": "https://github.com/Adriano-Lengruber/taskmanager-pro"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
