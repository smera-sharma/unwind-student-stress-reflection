from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_db
from app.models.user import User

# JWT token request header scheme resolver definition (points to login endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")



def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Current user resolution skeleton.
    Future sprints: verify signature, decode JWT token claim payload, 
    and query the user entity from the DB.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    # Returns a mock user representation matching the frontend context session expectation
    return User(
        id=1,
        email="user@unwind.com",
        full_name="Jane Doe",
        is_active=True
    )
