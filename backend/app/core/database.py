from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# For SQLite, check_same_thread: False allows multiple requests to share the connection
connect_args = (
    {"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {}
)

# Initialize SQLAlchemy Engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=True,  # Log executed SQL queries during development
)

# Session factory instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session for each request.
    Cleans up and closes the connection context upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

