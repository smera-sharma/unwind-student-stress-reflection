from sqlalchemy import Boolean, Column, Integer, String
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
