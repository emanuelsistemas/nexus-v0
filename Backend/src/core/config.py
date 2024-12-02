from pydantic import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "NexusIA"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Configuração do PostgreSQL
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "nexus")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "nexus")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "db")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "nexus")
    DATABASE_URL: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    
    # Configuração JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
