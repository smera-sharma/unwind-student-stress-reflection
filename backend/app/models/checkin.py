from sqlalchemy import Column, Integer
from app.models.base import Base

class CheckIn(Base):
    """
    Placeholder model for CheckIn objects.
    Logic and additional fields to be implemented in future sprints.
    """
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
