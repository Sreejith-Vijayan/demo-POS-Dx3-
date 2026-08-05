"""Middleware package — JWT-ready hooks."""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Lightweight request logger. TODO: structured logging + correlation IDs."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-App"] = "cafe-erp"
        return response
