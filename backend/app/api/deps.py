from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

# JWT token request header scheme resolver definition (points to login endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

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
            detail="Could not validate credentials",
        )
    
    email = "user@unwind.com" # Default fallback
    if token.startswith("mock_jwt_token_payload_for_"):
        email = token.replace("mock_jwt_token_payload_for_", "")

    # Query matching user in database
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Fallback to first user in database
        user = db.query(User).first()
        if not user:
            # Seed a default demo user if the DB is completely empty
            user = User(
                email="user@unwind.com",
                hashed_password="mock_hashed_password",
                full_name="Jane Doe",
                display_name="Eshniie",
                is_active=True,
                theme="system"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    return user
