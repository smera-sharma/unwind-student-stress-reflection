from sqlalchemy import Column, Integer
from app.models.base import Base

class AcademicEvent(Base):
    """
    Placeholder model for AcademicEvent objects.
    Logic and additional fields to be implemented in future sprints.
    """
    __tablename__ = "academic_events"

    id = Column(Integer, primary_key=True, index=True)
