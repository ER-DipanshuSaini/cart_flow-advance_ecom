import React, { useState } from 'react';
import { Layers, Users, Cpu, Clock, RefreshCcw, Activity, Zap } from 'lucide-react';
import MetricCard from './components/MetricCard';
import { OutcomesCard, TokensCard, CustomerMixCard } from './components/AnalyticsCards';
import ActivityTable from './components/ActivityTable';
import './OverviewPage.css';

export default function OverviewPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="cf-overview-page">
      {/* Page Header */}
      <div className="cf-overview-header">
        <div>
          <h1 className="cf-overview-title">Overview</h1>
          <p className="cf-overview-subtitle">Your fitting room, in focus.</p>
        </div>

        <div className="cf-overview-header-actions">
          <div className="cf-perf-badge">
            <Activity size={15} className="cf-perf-icon" />
            <span>All-time performance</span>
          </div>

          <button
            className={`cf-refresh-btn ${isRefreshing ? 'is-spinning' : ''}`}
            onClick={handleRefresh}
            title="Refresh metrics"
          >
            <RefreshCcw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="cf-metrics-grid">
        <MetricCard
          title="Try-on processes"
          value="56"
          subtext="40 completed generations"
          icon={Layers}
          hasArrow={true}
          highlighted={true}
        />
        <MetricCard
          title="Customers"
          value="437"
          subtext="9 signed in / 428 guests"
          icon={Users}
        />
        <MetricCard
          title="AI tokens consumed"
          value="102,840"
          subtext="Across all recorded generations"
          icon={Cpu}
        />
        <MetricCard
          title="Average processing"
          value="17.53 s"
          subtext="Completed process step duration"
          icon={Clock}
        />
      </div>

      {/* Analytics Breakdown Row */}
      <div className="cf-analytics-grid">
        <OutcomesCard attempts={56} percentage={71} />
        <TokensCard total="102,840" inputTokens="51,219" outputTokens="51,621" />
        <CustomerMixCard signedInPct={2} signedInCount={9} guestCount={428} />
      </div>

      {/* Recent Try-On Activity Table */}
      <ActivityTable />

      {/* Footer Branding Badge */}
      <div className="cf-console-footer">
        <div className="cf-powered-badge">
          <Zap size={14} className="cf-powered-icon" />
          <span>Powered by <strong>CartFlow & FastAPI</strong></span>
        </div>
      </div>
    </div>
  );
}
