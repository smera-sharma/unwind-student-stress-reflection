from sqlalchemy import Column, Integer
from app.models.base import Base

class AISummary(Base):
    """
    Placeholder model for AISummary objects.
    Logic and additional fields to be implemented in future sprints.
    """
    __tablename__ = "ai_summaries"

    id = Column(Integer, primary_key=True, index=True)
