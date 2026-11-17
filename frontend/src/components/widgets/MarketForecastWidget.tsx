import { useEffect, useState } from "react";
import { getMarketForecast, type MarketForecast } from "../../api/client";

const instruments = [
  { symbol: "^NSEI", label: "NIFTY 50" },
  { symbol: "TCS.NS", label: "TCS" },
  { symbol: "INFY.NS", label: "Infosys" },
  { symbol: "HDFCBANK.NS", label: "HDFC Bank" },
  { symbol: "GOLDBEES.NS", label: "Gold ETF" },
  { symbol: "LIQUIDBEES.NS", label: "Liquid ETF" },
];

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export default function MarketForecastWidget() {
  const [symbol, setSymbol] = useState("^NSEI");
  const [forecast, setForecast] = useState<MarketForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMarketForecast(symbol)
      .then((result) => {
        if (active) setForecast(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Forecast is currently unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [symbol]);

  const probabilityRows = forecast
    ? [
        { key: "up" as const, label: "Up", value: forecast.probabilities.up },
        { key: "sideways" as const, label: "Sideways", value: forecast.probabilities.sideways },
        { key: "down" as const, label: "Down", value: forecast.probabilities.down },
      ]
    : [];

  return (
    <section className="market-forecast-panel" aria-labelledby="market-forecast-title">
      <div className="market-forecast-heading">
        <div>
          <span className="eyebrow">QUANTITATIVE RESEARCH · HISTORICAL MODEL</span>
          <h2 id="market-forecast-title">Directional outlook</h2>
          <p>Five-session probability estimate from historical price behaviour and technical features.</p>
        </div>
        <label className="market-forecast-symbol">
          <span>Instrument</span>
          <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
            {instruments.map((item) => <option key={item.symbol} value={item.symbol}>{item.label}</option>)}
          </select>
        </label>
      </div>

      {loading && <div className="market-forecast-state" role="status">Calculating historical model…</div>}
      {!loading && error && <div className="market-forecast-state market-forecast-error" role="alert">{error}</div>}
      {!loading && forecast && (
        <>
          <div className="market-forecast-result">
            <div>
              <span className="market-forecast-kicker">Highest model probability</span>
              <strong className={`market-direction market-direction-${forecast.direction}`}>{forecast.direction.toUpperCase()}</strong>
              <span className="market-forecast-confidence">{percent(forecast.model_confidence)} model score · {forecast.horizon_trading_days} trading sessions</span>
            </div>
            <div className="market-forecast-freshness">
              <span className={forecast.data_status === "stale" ? "market-data-stale" : "market-data-recent"}>
                {forecast.data_status === "stale" ? "Historical data is stale" : "Recent dataset"}
              </span>
              <strong>As of {forecast.latest_observation_date}</strong>
              <small>{forecast.data_age_calendar_days} calendar days old</small>
            </div>
          </div>

          <div className="market-probability-list" aria-label="Model probabilities">
            {probabilityRows.map((row) => (
              <div className="market-probability-row" key={row.key}>
                <span>{row.label}</span>
                <div className="market-probability-track"><span className={`market-probability-fill ${row.key}`} style={{ width: percent(row.value) }} /></div>
                <strong>{percent(row.value)}</strong>
              </div>
            ))}
          </div>

          <div className="market-validation-grid">
            <div><span>Walk-forward holdout</span><strong>{percent(forecast.validation.directional_accuracy)}</strong></div>
            <div><span>Majority baseline</span><strong>{percent(forecast.validation.baseline_accuracy)}</strong></div>
            <div><span>Validation samples</span><strong>{forecast.validation.validation_samples.toLocaleString()}</strong></div>
          </div>
          <p className="market-forecast-disclaimer">
            Research prototype only. Probabilities are uncalibrated model scores, not a live quote, guaranteed forecast or investment recommendation.
            The bundled Yahoo Finance dataset may be delayed or revised; verify all observations independently.
          </p>
        </>
      )}
    </section>
  );
}
