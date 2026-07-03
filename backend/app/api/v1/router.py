from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, ai

api_router = APIRouter()

# Grouping endpoint routers under /api/v1 prefix
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
