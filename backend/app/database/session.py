"""Database engine, session, and base model."""

from typing import Generator

# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from backend.app.config import get_settings


class Base(DeclarativeBase):
    """SQLAlchemy declarative base."""

    pass


def _build_engine():
    settings = get_settings()
    if settings.USE_SQLITE:
        return create_engine(
            settings.DATABASE_URL_SQLITE,
            connect_args={"check_same_thread": False},
            echo=settings.DEBUG,
        )
    return create_engine(settings.DATABASE_URL, pool_pre_ping=True, echo=settings.DEBUG)


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables. Used at startup / seed time."""
    # Import models so metadata is registered
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
