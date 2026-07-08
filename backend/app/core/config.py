from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Unwind"
    API_V1_STR: str = "/api/v1"
    
    # SQLite Database Connection URL
    DATABASE_URL: str = "sqlite:///./unwind.db"
    
    # JWT security stubs configuration (skeletons for future sprints)
    SECRET_KEY: str = "your_super_secret_jwt_key_placeholder_change_in_production"
    JWT_SECRET_KEY: str = "your_super_secret_jwt_key_placeholder_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "https://unwind-student-stress-reflection.vercel.app",
    ]

    # Look for .env file at the workspace root or backend root
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def __init__(self, **values):
        super().__init__(**values)
        if self.JWT_SECRET_KEY == "your_super_secret_jwt_key_placeholder_change_in_production":
            if self.SECRET_KEY and self.SECRET_KEY != "your_super_secret_jwt_key_placeholder_change_in_production":
                self.JWT_SECRET_KEY = self.SECRET_KEY

settings = Settings()
