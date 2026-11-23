import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './MetricCard.css';

export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  hasArrow = false,
  highlighted = false,
}) {
  return (
    <div className={`cf-metric-card ${highlighted ? 'is-highlighted' : ''}`}>
      <div className="cf-metric-top">
        <span className="cf-metric-title">{title}</span>
        {Icon && <Icon size={18} className="cf-metric-icon" />}
      </div>

      <div className="cf-metric-body">
        <div className="cf-metric-value">{value}</div>
        {hasArrow && (
          <div className="cf-metric-corner-arrow">
            <ArrowUpRight size={16} />
          </div>
        )}
      </div>

      <div className="cf-metric-subtext">{subtext}</div>

      {highlighted && <div className="cf-metric-gradient-bar" />}
    </div>
  );
}
