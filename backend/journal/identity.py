"""Compatibility identity dependency backed by TradeFXBook authentication.

The legacy /api/journal router must use the same verified identity as the
canonical /api/v1/trades router; user IDs supplied by request headers or query
parameters are never authentication credentials.
"""
from __future__ import annotations

from typing import Any

from fastapi import Depends

try:
    from tradefxbook.auth import get_current_user
except ImportError:  # pragma: no cover - package import when running backend directly
    from ..tradefxbook.auth import get_current_user


def get_current_user_id(current_user: dict[str, Any] = Depends(get_current_user)) -> str:
    return str(current_user["id"])
