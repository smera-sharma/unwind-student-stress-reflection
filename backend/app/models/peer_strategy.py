from sqlalchemy import Column, Integer
from app.models.base import Base

class PeerStrategy(Base):
    """
    Placeholder model for PeerStrategy objects.
    Logic and additional fields to be implemented in future sprints.
    """
    __tablename__ = "peer_strategies"

    id = Column(Integer, primary_key=True, index=True)
