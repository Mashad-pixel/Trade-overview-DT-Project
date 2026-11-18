"""Registration-time legal consent and existing-database migration tests."""
import sqlite3
import uuid
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from tradefxbook.database import init_db
from tradefxbook.legal import TERMS_VERSION, PRIVACY_POLICY_VERSION

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def payload(**overrides):
    data = {
        "name": "Consent Tester",
        "email": f"consent_{uuid.uuid4().hex[:8]}@example.com",
        "password": "Password123!",
        "terms_version": TERMS_VERSION,
        "privacy_version": PRIVACY_POLICY_VERSION,
        "accepted_terms": True,
        "accepted_privacy": True,
    }
    data.update(overrides)
    return data

def test_registration_requires_consent_fields(client):
    data = payload()
    for key in ("terms_version", "privacy_version", "accepted_terms", "accepted_privacy"):
        incomplete = dict(data)
        incomplete.pop(key)
        assert client.post("/api/v1/auth/register", json=incomplete).status_code == 422

@pytest.mark.parametrize("field", ["accepted_terms", "accepted_privacy"])
def test_registration_requires_both_checks(client, field):
    assert client.post("/api/v1/auth/register", json=payload(**{field: False})).status_code == 422

def test_registration_rejects_outdated_versions(client):
    response = client.post("/api/v1/auth/register", json=payload(terms_version="1999-01-01"))
    assert response.status_code == 400
    assert "have changed" in response.json()["detail"]
    response = client.post("/api/v1/auth/register", json=payload(privacy_version="1999-01-01"))
    assert response.status_code == 400

def test_accepted_versions_and_timestamp_are_saved(client):
    response = client.post("/api/v1/auth/register", json=payload())
    assert response.status_code == 201
    user = response.json()["user"]
    assert user["terms_version"] == TERMS_VERSION
    assert user["privacy_version"] == PRIVACY_POLICY_VERSION
    assert user["terms_accepted_at"]
    assert user["privacy_accepted_at"] == user["terms_accepted_at"]
    assert "password_hash" not in user
    profile = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {response.json()['token']}"})
    assert profile.json()["terms_version"] == TERMS_VERSION

def test_existing_users_table_gets_consent_columns_without_data_loss(tmp_path):
    path = tmp_path / "old.db"
    conn = sqlite3.connect(path)
    conn.execute("""
      CREATE TABLE users (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL, starting_balance REAL NOT NULL DEFAULT 50000.0,
        currency TEXT NOT NULL DEFAULT 'USD', timezone TEXT NOT NULL DEFAULT 'UTC',
        is_demo INTEGER NOT NULL DEFAULT 0, profile_description TEXT DEFAULT '',
        created_at TEXT NOT NULL
      )
    """)
    conn.execute("INSERT INTO users (id,name,email,password_hash,created_at) VALUES ('old','Old','old@example.com','x','2026-01-01')")
    conn.commit()
    conn.close()
    init_db(path)
    conn = sqlite3.connect(path)
    cols = {row[1] for row in conn.execute("PRAGMA table_info(users)")}
    name = conn.execute("SELECT name FROM users WHERE id='old'").fetchone()[0]
    conn.close()
    assert {"terms_version","terms_accepted_at","privacy_version","privacy_accepted_at"} <= cols
    assert name == "Old"
