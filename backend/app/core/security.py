from datetime import datetime, timedelta
from typing import Any, Union

def get_password_hash(password: str) -> str:
    """
    Password hashing skeleton.
    Future sprints: return pwd_context.hash(password) using passlib.
    """
    return f"mock_hashed_{password}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Password verification skeleton.
    Future sprints: return pwd_context.verify(plain_password, hashed_password).
    """
    return hashed_password == f"mock_hashed_{plain_password}"

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    JWT token generation skeleton.
    Future sprints: return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    """
    # Returns a mock token matching frontend storage expectations
    return f"mock_jwt_token_payload_for_{subject}"
