from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine
from app.models.base import Base
from app.api.v1.router import api_router

# Create SQLite database tables on startup (if not already existing)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend service for Unwind student support application",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS middleware origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register master router paths under /api/v1 prefix
app.include_router(api_router, prefix=settings.API_V1_STR)

from app.api.v1.endpoints import ai
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/", tags=["health"])
def health_check():
    """
    Health check status endpoint.
    Used for verifying connection availability.
    """
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "database": "sqlite_connected"
    }
