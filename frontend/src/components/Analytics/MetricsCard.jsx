import React from "react";
import "./Analytics.css";

const MetricsCard = ({ title, value, icon, trend }) => {
  const formatTrend = (trend) => {
    if (!trend) return null;
    const isPositive = trend > 0;
    return (
      <div className={`metrics-trend ${isPositive ? "positive" : "negative"}`}>
        <span className="trend-arrow">{isPositive ? "↑" : "↓"}</span>
        <span className="trend-value">{Math.abs(trend)}%</span>
        <span className="trend-label">
          {isPositive ? " Increase" : " Decrease"}
        </span>
      </div>
    );
  };

  return (
    <div className="metrics-card">
      <div className="metrics-header">
        <span className="metrics-title">{title}</span>
        {icon && <span className="metrics-icon">{icon}</span>}
      </div>
      <div className="metrics-value">{value}</div>
      {trend !== undefined && formatTrend(trend)}
    </div>
  );
};

export default MetricsCard;
