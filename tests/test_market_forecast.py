from __future__ import annotations

import math

import pytest

from backend.market_forecast import _features, _softmax, build_forecast


def test_softmax_returns_normalized_probabilities() -> None:
    probabilities = _softmax([0.5, -0.25, 1.2])
    assert len(probabilities) == 3
    assert all(0 <= value <= 1 for value in probabilities)
    assert sum(probabilities) == pytest.approx(1.0)


def test_features_require_fifty_prior_observations() -> None:
    assert _features([float(index + 1) for index in range(50)], 49) is None
    values = _features([float(index + 1) for index in range(60)], 50)
    assert values is not None
    assert len(values) == 7
    assert all(math.isfinite(value) for value in values)


def test_forecast_uses_chronological_holdout_and_exposes_freshness() -> None:
    result = build_forecast("^NSEI")
    assert result["symbol"] == "^NSEI"
    assert result["direction"] in {"down", "sideways", "up"}
    assert set(result["probabilities"]) == {"down", "sideways", "up"}
    assert sum(result["probabilities"].values()) == pytest.approx(1.0, abs=0.002)
    assert result["validation"]["training_samples"] > result["validation"]["validation_samples"] > 0
    assert "chronological" in result["validation"]["method"]
    assert result["data_status"] in {"recent", "stale"}
    assert result["latest_observation_date"]


def test_forecast_rejects_unknown_symbols() -> None:
    with pytest.raises(ValueError, match="No historical price series"):
        build_forecast("NOT_A_REAL_SYMBOL")
