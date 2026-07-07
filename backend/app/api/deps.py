from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

# JWT token request header scheme resolver definition (points to login endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from app.core.config import settings
import logging
logger = logging.getLogger("unwind.backend")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Decodes the subject email from the auth token, queries the SQLite database,
    and returns the active User object with fully persistent profile records.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing or invalid",
        )
    
    email = None
    
    # 1. Attempt to decode as genuine JWT first
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email = payload.get("sub")
        logger.info(f"[Auth] JWT token validated successfully. Subject/Email: {email}")
    except ExpiredSignatureError:
        logger.warning("[Auth] JWT validation failed: Token signature expired.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
        )
    except InvalidTokenError as e:
        # 2. Fallback to mock prefix for development/offline testing compatibility
        if token.startswith("mock_jwt_token_payload_for_"):
            email = token.replace("mock_jwt_token_payload_for_", "")
            logger.info(f"[Auth] Mock validation fallback. Subject/Email: {email}")
        elif token == "mock_jwt_token_payload":
            email = "user@unwind.com"
            logger.info(f"[Auth] Mock validation fallback. Subject/Email: {email}")
        else:
            logger.warning(f"[Auth] Token validation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )

    if not email:
        logger.warning("[Auth] Token validation failed: Subject/Email not found in payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    # Query matching user in database
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create a new user for this email on the fly to support offline/mock credentials isolation
        display_name = email.split('@')[0].capitalize()
        user = User(
            email=email,
            hashed_password="mock_hashed_password",
            full_name=display_name,
            display_name=display_name,
            is_active=True,
            theme="system"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
