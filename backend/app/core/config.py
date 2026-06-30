from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Unwind"
    API_V1_STR: str = "/api/v1"
    
    # SQLite Database Connection URL
    DATABASE_URL: str = "sqlite:///./unwind.db"
    
    # JWT security stubs configuration (skeletons for future sprints)
    JWT_SECRET_KEY: str = "your_super_secret_jwt_key_placeholder_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings to allow frontend communication
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Look for .env file at the workspace root or backend root
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
