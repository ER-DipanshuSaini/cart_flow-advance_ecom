import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowUpRight as ArrowTopRight } from 'lucide-react';
import './AnalyticsCards.css';

export function OutcomesCard({ attempts = 56, percentage = 71 }) {
  // SVG Donut calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="cf-analytics-card">
      <div className="cf-card-header-row">
        <div className="cf-card-title-group">
          <span className="cf-check-icon">✓</span>
          <span className="cf-analytics-title">Generation outcomes</span>
        </div>
        <span className="cf-analytics-attempts">{attempts} attempts</span>
      </div>

      <div className="cf-outcomes-content">
        {/* Circular Donut */}
        <div className="cf-donut-wrapper">
          <svg className="cf-donut-svg" viewBox="0 0 100 100">
            <circle
              className="cf-donut-bg"
              cx="50"
              cy="50"
              r={radius}
            />
            <circle
              className="cf-donut-progress"
              cx="50"
              cy="50"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="cf-donut-center">
            <span className="cf-donut-percent">{percentage}%</span>
            <span className="cf-donut-sub">completed</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="cf-outcomes-legend">
          <div className="cf-legend-item">
            <div className="cf-legend-label">
              <span className="cf-dot is-green" />
              <span>Completed</span>
            </div>
            <span className="cf-legend-val">40</span>
          </div>

          <div className="cf-legend-item">
            <div className="cf-legend-label">
              <span className="cf-dot is-blue" />
              <span>Processing</span>
            </div>
            <span className="cf-legend-val">0</span>
          </div>

          <div className="cf-legend-item">
            <div className="cf-legend-label">
              <span className="cf-dot is-red" />
              <span>Failed</span>
            </div>
            <span className="cf-legend-val">3</span>
          </div>

          <div className="cf-legend-item">
            <div className="cf-legend-label">
              <span className="cf-dot is-amber" />
              <span>Quota exceeded</span>
            </div>
            <span className="cf-legend-val">13</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TokensCard({ total = '102,840', inputTokens = '51,219', outputTokens = '51,621' }) {
  return (
    <div className="cf-analytics-card">
      <div className="cf-card-header-row">
        <div className="cf-card-title-group">
          <span className="cf-gear-icon">⚙</span>
          <span className="cf-analytics-title">Token distribution</span>
        </div>
      </div>

      <div className="cf-distribution-body">
        <div className="cf-token-main-val">{total}</div>
        <div className="cf-token-subtext">total tokens</div>

        <div className="cf-split-progress-bar">
          <div className="cf-split-fill" style={{ width: '50%' }} />
        </div>

        <div className="cf-split-meta-row">
          <div className="cf-meta-item">
            <div className="cf-meta-label">
              <ArrowDownLeft size={13} className="cf-meta-arrow" />
              <span>Input</span>
            </div>
            <span className="cf-meta-val">{inputTokens}</span>
          </div>

          <div className="cf-meta-item is-right">
            <div className="cf-meta-label">
              <span>Output</span>
              <ArrowUpRight size={13} className="cf-meta-arrow" />
            </div>
            <span className="cf-meta-val">{outputTokens}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerMixCard({ signedInPct = 2, signedInCount = 9, guestCount = 428 }) {
  return (
    <div className="cf-analytics-card">
      <div className="cf-card-header-row">
        <div className="cf-card-title-group">
          <span className="cf-users-icon">👥</span>
          <span className="cf-analytics-title">Customer mix</span>
        </div>
        <ArrowTopRight size={15} className="cf-corner-top-arrow" />
      </div>

      <div className="cf-distribution-body">
        <div className="cf-token-main-val">{signedInPct}%</div>
        <div className="cf-token-subtext">signed-in customers</div>

        <div className="cf-split-progress-bar">
          <div className="cf-split-fill" style={{ width: '5%' }} />
        </div>

        <div className="cf-split-meta-row">
          <div className="cf-meta-item">
            <div className="cf-meta-label">
              <span>Signed in</span>
            </div>
            <span className="cf-meta-val">{signedInCount}</span>
          </div>

          <div className="cf-meta-item is-right">
            <div className="cf-meta-label">
              <span>Guests</span>
            </div>
            <span className="cf-meta-val">{guestCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
