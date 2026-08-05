"""Utility helpers."""

from datetime import datetime, timezone


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def generate_code(prefix: str, seq: int) -> str:
    return f"{prefix}-{seq:05d}"
