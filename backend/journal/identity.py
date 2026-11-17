"""Compatibility identity dependency backed by TradeFXBook authentication.

The legacy /api/journal router must use the same verified identity as the
canonical /api/v1/trades router; user IDs supplied by request headers or query
parameters are never authentication credentials.
"""
from __future__ import annotations

from typing import Any

from fastapi import Depends, Request

try:
    from tradefxbook.auth import get_current_user
except ImportError:  # pragma: no cover - package import when running backend directly
    from ..tradefxbook.auth import get_current_user


def get_current_user_id(
    request: Request,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> str:
    user_id = str(current_user["id"])
    device_id = request.headers.get("X-Device-Id", "").strip()
    # Preserve the original legacy journal's per-device demo namespace while
    # using verified demo identity. Registered accounts are not device-suffixed.
    if current_user.get("is_demo") and device_id:
        return f"{user_id}_{device_id}"
    return user_id
