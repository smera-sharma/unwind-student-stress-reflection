from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserOut
from app.core import security

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    JWT OAuth2 login route skeleton.
    Validates input parameters structure and issues a mock token configuration.
    """
    # Simple validation fallback
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password required"
        )
    
    mock_token = security.create_access_token(subject=form_data.username)
    return {"access_token": mock_token, "token_type": "bearer"}

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate):
    """
    User registration route skeleton.
    Returns a mock user configuration matching client data structures.
    """
    return UserOut(
        id=1,
        email=user_in.email,
        full_name=user_in.full_name,
        is_active=True
    )
