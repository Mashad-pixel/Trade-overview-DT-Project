"""Transparent, research-grade prototype forecast from the bundled daily OHLC dataset.

This module intentionally does not fetch or fabricate live prices. It trains a small
multiclass logistic model on chronological historical features and reports the age of
the newest observation so callers can decide whether the output is too stale to use.
"""
from __future__ import annotations

import csv
import math
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any

DATASET_PATH = Path(__file__).resolve().parents[1] / "f06_historical_dataset" / "historical_prices.csv"
HORIZON_DAYS = 5
CLASSES = ("down", "sideways", "up")
FEATURE_NAMES = ("return_1d", "return_5d", "return_20d", "volatility_20d", "rsi_14", "price_vs_sma20", "price_vs_sma50")


def _mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _std(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    avg = _mean(values)
    return math.sqrt(sum((value - avg) ** 2 for value in values) / (len(values) - 1))


def _features(prices: list[float], index: int) -> list[float] | None:
    if index < 50:
        return None
    current = prices[index]
    if current <= 0:
        return None
    returns = [(prices[i] / prices[i - 1]) - 1 for i in range(1, len(prices))]
    window = returns[index - 20:index]
    if len(window) != 20:
        return None
    gains = [max(value, 0.0) for value in returns[index - 14:index]]
    losses = [abs(min(value, 0.0)) for value in returns[index - 14:index]]
    avg_gain, avg_loss = _mean(gains), _mean(losses)
    rsi = 50.0 if avg_gain == 0 and avg_loss == 0 else (100.0 if avg_loss == 0 else 100 - (100 / (1 + avg_gain / avg_loss)))
    return [
        returns[index - 1],
        (current / prices[index - 5]) - 1,
        (current / prices[index - 20]) - 1,
        _std(window) * math.sqrt(252),
        rsi / 100,
        (current / _mean(prices[index - 19:index + 1])) - 1,
        (current / _mean(prices[index - 49:index + 1])) - 1,
    ]


def _softmax(scores: list[float]) -> list[float]:
    peak = max(scores)
    exps = [math.exp(max(-40.0, min(40.0, score - peak))) for score in scores]
    total = sum(exps) or 1.0
    return [value / total for value in exps]


def _train(train_x: list[list[float]], train_y: list[int]) -> tuple[list[float], list[list[float]], list[float], list[float]]:
    width = len(FEATURE_NAMES)
    means = [_mean([row[j] for row in train_x]) for j in range(width)]
    scales = [_std([row[j] for row in train_x]) or 1.0 for j in range(width)]
    normalized = [[(row[j] - means[j]) / scales[j] for j in range(width)] for row in train_x]
    weights = [[0.0] * (width + 1) for _ in CLASSES]
    learning_rate = 0.035
    # Deterministic full-batch gradient descent; no random seed or external dependency.
    for epoch in range(260):
        gradients = [[0.0] * (width + 1) for _ in CLASSES]
        for row, label in zip(normalized, train_y):
            probs = _softmax([sum(w[j] * row[j] for j in range(width)) + w[-1] for w in weights])
            for cls in range(len(CLASSES)):
                error = probs[cls] - (1.0 if cls == label else 0.0)
                for j, value in enumerate(row):
                    gradients[cls][j] += error * value
                gradients[cls][-1] += error
        rate = learning_rate / max(len(normalized), 1)
        for cls in range(len(CLASSES)):
            for j in range(width + 1):
                regularizer = 0.002 * weights[cls][j] if j < width else 0.0
                weights[cls][j] -= rate * (gradients[cls][j] + regularizer)
    return means, weights, scales, [float(len(train_x))]


def _predict(features: list[float], means: list[float], weights: list[list[float]], scales: list[float]) -> list[float]:
    row = [(features[j] - means[j]) / scales[j] for j in range(len(FEATURE_NAMES))]
    return _softmax([sum(w[j] * row[j] for j in range(len(row))) + w[-1] for w in weights])


def _load_prices(path: Path) -> dict[str, list[tuple[str, float]]]:
    grouped: dict[str, list[tuple[str, float]]] = defaultdict(list)
    with path.open("r", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            ticker = (row.get("ticker") or "").strip().upper()
            raw_price = row.get("adjusted_close") or row.get("close")
            try:
                price = float(raw_price or "")
            except (TypeError, ValueError):
                continue
            if ticker and math.isfinite(price) and price > 0:
                grouped[ticker].append((row["date"], price))
    for ticker in grouped:
        grouped[ticker].sort(key=lambda item: item[0])
    return grouped


def build_forecast(symbol: str = "^NSEI", dataset_path: Path | None = None) -> dict[str, Any]:
    """Train and validate a directional classifier using only observations before the forecast date."""
    requested = symbol.strip().upper()
    data = _load_prices(dataset_path or DATASET_PATH)
    if requested not in data:
        raise ValueError(f"No historical price series found for {requested}.")
    rows = data[requested]
    dates = [row[0] for row in rows]
    prices = [row[1] for row in rows]
    if len(prices) < 100:
        raise ValueError(f"At least 100 valid observations are required for {requested}.")

    samples: list[tuple[str, list[float], int]] = []
    for index in range(50, len(prices) - HORIZON_DAYS):
        features = _features(prices, index)
        if features is None:
            continue
        forward_return = prices[index + HORIZON_DAYS] / prices[index] - 1
        label = 0 if forward_return < -0.01 else (2 if forward_return > 0.01 else 1)
        samples.append((dates[index], features, label))
    if len(samples) < 80:
        raise ValueError("Not enough clean samples for chronological training and validation.")

    split = max(50, int(len(samples) * 0.8))
    train = samples[:split]
    validation = samples[split:]
    means, weights, scales, _ = _train([item[1] for item in train], [item[2] for item in train])
    correct = 0
    brier = 0.0
    for _, features, label in validation:
        probs = _predict(features, means, weights, scales)
        correct += int(probs.index(max(probs)) == label)
        brier += sum((probs[i] - (1.0 if i == label else 0.0)) ** 2 for i in range(3))
    validation_accuracy = correct / len(validation)
    brier_score = brier / len(validation)

    # Refit on all labelled observations before producing the current estimate.
    means, weights, scales, _ = _train([item[1] for item in samples], [item[2] for item in samples])
    latest_features = _features(prices, len(prices) - 1)
    if latest_features is None:
        raise ValueError("Latest observation does not have enough preceding history.")
    probabilities = _predict(latest_features, means, weights, scales)
    latest_date = date.fromisoformat(dates[-1])
    age_days = (date.today() - latest_date).days
    direction = CLASSES[probabilities.index(max(probabilities))]
    return {
        "symbol": requested,
        "direction": direction,
        "probabilities": {name: round(probabilities[i], 4) for i, name in enumerate(CLASSES)},
        "model_confidence": round(max(probabilities), 4),
        "horizon_trading_days": HORIZON_DAYS,
        "latest_observation_date": dates[-1],
        "data_age_calendar_days": age_days,
        "data_status": "stale" if age_days > 5 else "recent",
        "validation": {
            "method": "chronological 80/20 holdout; no random shuffle",
            "samples": len(samples),
            "training_samples": len(train),
            "validation_samples": len(validation),
            "directional_accuracy": round(validation_accuracy, 4),
            "multiclass_brier_score": round(brier_score, 4),
            "baseline_accuracy": round(max(sum(1 for item in validation if item[2] == cls) for cls in range(3)) / len(validation), 4),
        },
        "features": {name: round(value, 6) for name, value in zip(FEATURE_NAMES, latest_features)},
        "limitations": [
            "Historical prototype dataset only; no live quote is fetched by this endpoint.",
            "Probabilities are uncalibrated model scores and are not investment advice.",
            "The target is a greater-than-1%, within-1%, or less-than-1% move over five observed trading sessions.",
            "The source dataset is Yahoo Finance chart data and should be independently verified before financial use.",
        ],
    }
