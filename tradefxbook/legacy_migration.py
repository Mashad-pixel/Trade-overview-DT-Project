"""Idempotent migration from the original journal SQLite store into TradeFXBook.

The migration is additive: it never deletes or modifies source rows. A source
trade gets a deterministic destination ID, so rerunning startup cannot duplicate
an already migrated record.
"""
from __future__ import annotations

import json
import os
import sqlite3
from pathlib import Path
from typing import Any

from tradefxbook.config import settings
from tradefxbook.repository import create_trade, get_user_by_id

DEFAULT_SOURCE = Path(__file__).resolve().parents[1] / "backend" / "trading_journal.sqlite3"
MIGRATION_BATCH = "legacy_journal_migration_v1"


def migrate_legacy_journal(source_path: str | Path | None = None) -> dict[str, Any]:
    source = Path(source_path or os.getenv("TRADING_JOURNAL_DB_PATH", str(DEFAULT_SOURCE))).expanduser()
    if not source.is_file():
        return {"status": "SOURCE_NOT_FOUND", "source": str(source), "migrated": 0, "skipped": 0}

    connection = sqlite3.connect(str(source))
    connection.row_factory = sqlite3.Row
    try:
        exists = connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='journal_trades'"
        ).fetchone()
        if not exists:
            return {"status": "NO_LEGACY_TABLE", "source": str(source), "migrated": 0, "skipped": 0}
        rows = connection.execute("SELECT * FROM journal_trades ORDER BY created_at, id").fetchall()
    finally:
        connection.close()

    migrated = 0
    skipped = 0
    for row in rows:
        trade = dict(row)
        raw_user_id = str(trade.get("user_id") or "").strip()
        # The old journal's anonymous demo bucket is mapped to the first
        # explicitly seeded demo persona. Existing registered IDs are retained.
        user_id = "demo_trader_01" if raw_user_id == "demo" or raw_user_id.startswith("demo_") else raw_user_id
        user = get_user_by_id(user_id)
        if not user:
            skipped += 1
            continue

        source_id = str(trade["id"])
        destination_id = f"legacy_journal_{source_id}"
        try:
            tags = trade.get("tags") or "[]"
            parsed_tags = json.loads(tags) if isinstance(tags, str) else tags
            if not isinstance(parsed_tags, list):
                parsed_tags = [str(parsed_tags)]
            status = "CLOSED" if trade.get("closed_at") is not None and trade.get("exit_price") is not None else "OPEN"
            created = {
                "id": destination_id,
                "symbol": str(trade["symbol"]).strip().upper(),
                "asset_class": "Unknown",
                "direction": "LONG" if str(trade.get("side", "long")).lower() == "long" else "SHORT",
                "status": status,
                "is_demo": bool(user.get("is_demo")),
                "entry_time": trade["opened_at"],
                "exit_time": trade.get("closed_at") if status == "CLOSED" else None,
                "entry_price": float(trade["entry_price"]),
                "exit_price": float(trade["exit_price"]) if status == "CLOSED" else None,
                "quantity": float(trade["quantity"]),
                # Original journal metrics used price difference × quantity.
                "contract_size": 1.0,
                "account_currency": user.get("currency", "USD"),
                "stop_loss_price": trade.get("stop_loss"),
                "commission": 0.0,
                "other_fees": float(trade.get("fees") or 0),
                "signed_swap_adjustment": 0.0,
                "strategy_or_setup": " / ".join(filter(None, [trade.get("strategy"), trade.get("setup")])) or "Legacy journal",
                "trading_session": "Unspecified",
                "tags": ",".join(str(tag) for tag in parsed_tags),
                "notes": trade.get("notes") or "",
                "emotional_state": "Unspecified",
                "plan_followed": True,
                "mistakes_or_lessons": "",
                "seed_batch": MIGRATION_BATCH,
                "device_id": None,
                "created_at": trade.get("created_at"),
            }
            create_trade(user_id=user_id, trade_data=created, device_id=None)
            migrated += 1
        except sqlite3.IntegrityError:
            # A deterministic ID already exists: the row has been migrated.
            skipped += 1
        except Exception:
            # Preserve the source row and continue; caller can inspect counts.
            skipped += 1

    return {
        "status": "COMPLETED",
        "source": str(source),
        "source_rows": len(rows),
        "migrated": migrated,
        "skipped": skipped,
        "migration_batch": MIGRATION_BATCH,
    }
