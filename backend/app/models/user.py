from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.models.base import Base

class User(Base):
    """
    SQLAlchemy User database model mapping table users.
    Used as foundation for JWT authentications.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # Profile & settings customization extensions
    display_name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    theme = Column(String, default="system")
    daily_reminder = Column(Boolean, default=False)
    reminder_time = Column(String, default="20:00")
    timezone = Column(String, default="UTC")
    preferred_pronouns = Column(String, nullable=True)
    notifications_enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
