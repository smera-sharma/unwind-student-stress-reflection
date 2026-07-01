from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserOut
from app.core import security

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> User:
    """
    Register a new user in the database.
    Checks if email already exists, hashes the password using security stubs,
    creates the SQLAlchemy user object, and persists the record.
    """
    # Query database to check if email already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Hash password using security stubs helper
    hashed_password = security.get_password_hash(user_in.password)
    
    # Create SQLAlchemy User object
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        is_active=user_in.is_active,
    )
    
    # Save user
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
) -> dict:
    """
    Log in user using OAuth2 standard password flow.
    Queries the database, validates password hash verify stubs, and issues JWT payload access token.
    """
    # Query user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Verify password and throw 401 on failure
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token using security stubs
    access_token = security.create_access_token(subject=user.email)
    
    return {"access_token": access_token, "token_type": "bearer"}
