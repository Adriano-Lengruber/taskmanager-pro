"""
Configuration settings for TaskManager Pro
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = "TaskManager Pro"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    # Database
    database_url: Optional[str] = None
    mongodb_url: Optional[str] = None
    redis_url: Optional[str] = None
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    backend_cors_origins: list = ["http://localhost:3000", "http://localhost:8080"]
    
    # External APIs
    openai_api_key: Optional[str] = None
    slack_webhook_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()
