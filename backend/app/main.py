"""Cafe ERP & POS — FastAPI application entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.router import api_router
from backend.app.config import get_settings
from backend.app.database import SessionLocal, init_db
from backend.app.middleware import RequestLoggingMiddleware
from backend.app.schemas import HealthResponse
from backend.app.seeds import seed_all


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Startup: create tables and seed demo data."""
    init_db()
    db = SessionLocal()
    try:
        seed_all(db)
    finally:
        db.close()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)

    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/health", response_model=HealthResponse, tags=["health"])
    async def health():
        return HealthResponse(
            status="ok",
            app=settings.APP_NAME,
            version=settings.APP_VERSION,
        )

    return app


app = create_app()
