"""Application settings and configuration."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "Cafe ERP & POS System"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://cafe_user:cafe_pass@localhost:5432/cafe_erp"
    # SQLite fallback for local demo without Postgres
    DATABASE_URL_SQLITE: str = "sqlite:///./cafe_erp.db"
    USE_SQLITE: bool = True

    # JWT (ready for future auth implementation)
    JWT_SECRET_KEY: str = "change-me-in-production-cafe-erp-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://frontend:5173",
    ]

    # Demo role header (simulates JWT role claim)
    ROLE_HEADER: str = "X-User-Role"


@lru_cache
def get_settings() -> Settings:
    """Cached settings dependency."""
    return Settings()
