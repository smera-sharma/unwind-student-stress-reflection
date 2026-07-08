from fastapi import FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect
import logging
import os
import sys

from app.core.config import settings
from app.core.database import engine, SessionLocal
from app.models.base import Base
from app.api.v1.router import api_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger("unwind.backend")

# Validate environment variables on startup
def validate_environment():
    from dotenv import load_dotenv
    load_dotenv()
    load_dotenv("../.env")
    
    missing = []
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        missing.append("GEMINI_API_KEY")
        
    secret_key = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET_KEY") or settings.JWT_SECRET_KEY
    if not secret_key or secret_key == "your_super_secret_jwt_key_placeholder_change_in_production":
        missing.append("SECRET_KEY (or JWT_SECRET_KEY settings is placeholder)")
        
    database_url = os.getenv("DATABASE_URL") or settings.DATABASE_URL
    if not database_url:
        missing.append("DATABASE_URL")
        
    if missing:
        error_msg = f"CRITICAL: Environment validation failed. Missing configuration keys: {', '.join(missing)}"
        logger.error("=" * 60)
        logger.error(error_msg)
        logger.error("=" * 60)
        raise RuntimeError(error_msg)
    else:
        logger.info("Environment validation completed successfully.")

validate_environment()

# Reset SQLite database if schema mismatch (missing display_name column) safely using SQLAlchemy reflection
try:
    inspector = inspect(engine)
    if inspector.has_table("users"):
        columns = [col["name"] for col in inspector.get_columns("users")]
        if "display_name" not in columns:
            logger.warning("Database schema mismatch detected (missing display_name column). Resetting database...")
            Base.metadata.drop_all(bind=engine)
            logger.info("Database dropped successfully.")
except Exception as e:
    logger.error(f"Database schema check failed/skipped: {e}")

# Create SQLite database tables on startup (if not already existing)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend service for Unwind student support application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

def get_cors_headers(request):
    origin = request.headers.get("origin")
    if origin:
        allowed_origins = [str(o) for o in settings.BACKEND_CORS_ORIGINS]
        is_allowed = origin in allowed_origins or any(p in origin for p in ["localhost", "127.0.0.1", "vercel.app"])
        if is_allowed:
            return {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            }
    return {}

# Exception handler for FastAPI HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    # Map status codes to specific error codes
    error_code = "HTTP_EXCEPTION"
    if exc.status_code == 401:
        error_code = "UNAUTHORIZED"
    elif exc.status_code == 403:
        error_code = "FORBIDDEN"
    elif exc.status_code == 404:
        error_code = "NOT_FOUND"
    elif exc.status_code == 400:
        error_code = "BAD_REQUEST"

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error_code": error_code
        },
        headers=get_cors_headers(request)
    )

# Exception handler for Pydantic Request Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    logger.warning(f"Request validation failed: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": "Request validation failed. Invalid request format.",
            "error_code": "VALIDATION_ERROR",
            "details": exc.errors()
        },
        headers=get_cors_headers(request)
    )

# Catch-all Exception handler for unexpected errors (never expose stack traces)
@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    logger.exception(f"Unhandled server exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Unable to process your request.",
            "error_code": "INTERNAL_SERVER_ERROR"
        },
        headers=get_cors_headers(request)
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

from app.api.v1.endpoints import ai, profile, insights
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(insights.router, prefix="/api/ai", tags=["ai"])

@app.get("/api/health", tags=["health"])
def health_check():
    """
    Production health check status endpoint.
    Used for verifying database connection and Gemini configurations.
    """
    # 1. Database Connection check
    db_status = "connected"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception as e:
        logger.error(f"Health check database connection failed: {e}")
        db_status = "disconnected"

    # 2. Gemini check
    gemini_key = os.getenv("GEMINI_API_KEY")
    gemini_status = "configured" if gemini_key and gemini_key != "mock_api_key_placeholder" else "unconfigured"

    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "database": db_status,
        "gemini": gemini_status,
        "version": "1.0.0"
    }

@app.get("/", tags=["health"])
def health_check_legacy():
    # Keep legacy '/' check compatible with existing pingers
    return health_check()
