from fastapi import APIRouter, Depends
from app.schemas.user import UserOut
from app.models.user import User
from app.api import deps

router = APIRouter()

@router.get("/me", response_model=UserOut)
def read_user_me(current_user: User = Depends(deps.get_current_user)):
    """
    Get profile details of the currently authenticated user.
    Resolves automatically from JWT bearer header tokens.
    """
    return current_user
