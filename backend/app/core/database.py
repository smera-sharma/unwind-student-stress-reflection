from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# For SQLite, check_same_thread: False allows multiple requests to share the connection
# Increasing timeout to 30 seconds prevents immediate locks in concurrent dev environments
connect_args = (
    {"check_same_thread": False, "timeout": 30}
    if settings.DATABASE_URL.startswith("sqlite")
    else {}
)

# Initialize SQLAlchemy Engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=True,  # Log executed SQL queries during development
)

# Register listener to force SQLite Write-Ahead Logging (WAL) mode for concurrent access safety
if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()

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

