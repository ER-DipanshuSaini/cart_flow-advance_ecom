import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Truck,
  RefreshCw
} from 'lucide-react';
import './AdminConsole.css';

const RECENT_ORDERS = [
  {
    srNo: 1,
    orderId: 'CF-99418',
    customer: 'Vikramaditya Roy',
    items: 'Structured Blazer (1), Riviera Knit (1)',
    payment: 'Prepaid (Razorpay)',
    total: '$329.00',
    status: 'In Transit',
    statusClass: 'is-processing',
    date: 'Nov 24, 2026, 12:13 PM',
  },
  {
    srNo: 2,
    orderId: 'CF-99417',
    customer: 'Aarav Singhania',
    items: 'French Linen Overshirt (2)',
    payment: 'Prepaid (Stripe)',
    total: '$190.00',
    status: 'Delivered',
    statusClass: 'is-completed',
    date: 'Nov 24, 2026, 11:20 AM',
  },
  {
    srNo: 3,
    orderId: 'CF-99416',
    customer: 'Kabir Malhotra',
    items: 'Suede Tassel Loafers (1)',
    payment: 'Cash On Delivery',
    total: '$180.00',
    status: 'Processing',
    statusClass: 'is-quota',
    date: 'Nov 23, 2026, 6:45 PM',
  },
  {
    srNo: 4,
    orderId: 'CF-99415',
    customer: 'Rohan Mehra',
    items: 'Gurkha Trousers (1), Crochet Shirt (1)',
    payment: 'Prepaid (UPI)',
    total: '$195.00',
    status: 'Delivered',
    statusClass: 'is-completed',
    date: 'Nov 22, 2026, 4:10 PM',
  },
  {
    srNo: 5,
    orderId: 'CF-99414',
    customer: 'Devansh Kapur',
    items: 'Wool Minimalist Overcoat (1)',
    payment: 'Prepaid (Cards)',
    total: '$260.00',
    status: 'Delivered',
    statusClass: 'is-completed',
    date: 'Nov 21, 2026, 2:30 PM',
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="cf-admin-content-inner">
      {/* 1. Header Row */}
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Operations Overview</h1>
          <p className="cf-bo-page-subtitle">Your storefront sales, orders, and fulfillment pipeline in focus.</p>
        </div>

        <div className="cf-bo-header-right">
          <div className="cf-bo-perf-tag">
            <span className="cf-bo-perf-icon">⚡</span> All-time performance
          </div>
          <button
            type="button"
            className="cf-bo-refresh-btn"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div className="cf-bo-kpi-grid">
        {/* Card 1: Gross Sales */}
        <div className="cf-bo-kpi-card is-primary-kpi">
          <div className="cf-bo-kpi-top">
            <span className="cf-bo-kpi-title">Gross Revenue</span>
            <div className="cf-bo-kpi-icons">
              <DollarSign size={18} className="cf-bo-kpi-icon" />
              <ArrowUpRight size={14} className="cf-bo-kpi-arrow" />
            </div>
          </div>
          <div className="cf-bo-kpi-value">$54,820</div>
          <div className="cf-bo-kpi-sub">+14.2% growth this month</div>
          <div className="cf-bo-rainbow-bar" />
        </div>

        {/* Card 2: Total Orders */}
        <div className="cf-bo-kpi-card">
          <div className="cf-bo-kpi-top">
            <span className="cf-bo-kpi-title">Total Orders</span>
            <ShoppingBag size={18} className="cf-bo-kpi-icon" />
          </div>
          <div className="cf-bo-kpi-value">348</div>
          <div className="cf-bo-kpi-sub">28 in dispatch / 312 delivered</div>
        </div>

        {/* Card 3: Customers */}
        <div className="cf-bo-kpi-card">
          <div className="cf-bo-kpi-top">
            <span className="cf-bo-kpi-title">Active Customers</span>
            <Users size={18} className="cf-bo-kpi-icon" />
          </div>
          <div className="cf-bo-kpi-value">437</div>
          <div className="cf-bo-kpi-sub">92 VIP members / 345 standard</div>
        </div>

        {/* Card 4: Average Order Value (AOV) */}
        <div className="cf-bo-kpi-card">
          <div className="cf-bo-kpi-top">
            <span className="cf-bo-kpi-title">Average Order Value</span>
            <TrendingUp size={18} className="cf-bo-kpi-icon" />
          </div>
          <div className="cf-bo-kpi-value">$157.50</div>
          <div className="cf-bo-kpi-sub">Basket size across collections</div>
        </div>
      </div>

      {/* 3. Middle 3 Insight Cards */}
      <div className="cf-bo-insights-grid">
        {/* Box 1: Fulfillment Outcomes */}
        <div className="cf-bo-insight-card">
          <div className="cf-bo-card-top">
            <h4 className="cf-bo-card-heading">
              <CheckCircle2 size={14} className="cf-bo-icon-check" /> Fulfillment Rate
            </h4>
            <span className="cf-bo-card-meta">348 orders</span>
          </div>

          <div className="cf-bo-donut-content">
            <div className="cf-bo-donut-svg-wrap">
              <svg width="105" height="105" viewBox="0 0 100 100" className="cf-bo-donut-svg">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--bo-border)" strokeWidth="8" />
                {/* Delivered (88%) Green Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray="238.7"
                  strokeDashoffset="28.6"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="cf-bo-donut-center">
                <span className="cf-bo-donut-percent">88%</span>
                <span className="cf-bo-donut-label">delivered</span>
              </div>
            </div>

            <div className="cf-bo-legend-list">
              <div className="cf-bo-legend-row">
                <span className="cf-bo-legend-name">
                  <span className="cf-bo-dot is-green" /> Delivered
                </span>
                <span className="cf-bo-legend-num">306</span>
              </div>
              <div className="cf-bo-legend-row">
                <span className="cf-bo-legend-name">
                  <span className="cf-bo-dot is-blue" /> In Transit
                </span>
                <span className="cf-bo-legend-num">28</span>
              </div>
              <div className="cf-bo-legend-row">
                <span className="cf-bo-legend-name">
                  <span className="cf-bo-dot is-amber" /> Processing
                </span>
                <span className="cf-bo-legend-num">12</span>
              </div>
              <div className="cf-bo-legend-row">
                <span className="cf-bo-legend-name">
                  <span className="cf-bo-dot is-red" /> Returns
                </span>
                <span className="cf-bo-legend-num">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Payment Distribution */}
        <div className="cf-bo-insight-card">
          <div className="cf-bo-card-top">
            <h4 className="cf-bo-card-heading">
              <DollarSign size={14} className="cf-bo-flower-icon" /> Payment Distribution
            </h4>
          </div>

          <div className="cf-bo-metric-huge">$54,820</div>
          <div className="cf-bo-metric-subtitle">settled transactions</div>

          <div className="cf-bo-progress-track">
            <div className="cf-bo-progress-fill" style={{ width: '84%' }} />
          </div>

          <div className="cf-bo-split-row">
            <div>
              <span className="cf-bo-split-tag">↗ Online Prepaid</span>
              <strong className="cf-bo-split-val">$46,200 (84%)</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="cf-bo-split-tag">↗ Cash On Delivery</span>
              <strong className="cf-bo-split-val">$8,620 (16%)</strong>
            </div>
          </div>
        </div>

        {/* Box 3: Customer Retention */}
        <div className="cf-bo-insight-card">
          <div className="cf-bo-card-top">
            <h4 className="cf-bo-card-heading">
              <Users size={14} className="cf-bo-kpi-icon" /> Customer Retention
            </h4>
            <ArrowUpRight size={14} className="cf-bo-card-meta" />
          </div>

          <div className="cf-bo-metric-huge">78%</div>
          <div className="cf-bo-metric-subtitle">repeat shopper rate</div>

          <div className="cf-bo-progress-track">
            <div className="cf-bo-progress-fill" style={{ width: '78%' }} />
          </div>

          <div className="cf-bo-split-row">
            <div>
              <span className="cf-bo-split-tag">Repeat VIPs</span>
              <strong className="cf-bo-split-val">341</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="cf-bo-split-tag">New Shoppers</span>
              <strong className="cf-bo-split-val">96</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Table: Recent Customer Orders */}
      <div className="cf-bo-table-card">
        <div className="cf-bo-table-header">
          <h3 className="cf-bo-table-title">Recent Customer Orders</h3>
          <a href="/admin/orders" className="cf-bo-table-all-link">
            All orders <ArrowUpRight size={13} />
          </a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cf-bo-data-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Purchased Garments</th>
                <th>Payment Mode</th>
                <th>Total Value</th>
                <th>Fulfillment</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((row) => (
                <tr key={row.orderId}>
                  <td className="cf-bo-td-num">{row.srNo}</td>
                  <td className="cf-bo-td-mono">{row.orderId}</td>
                  <td className="cf-bo-td-title">{row.customer}</td>
                  <td>{row.items}</td>
                  <td className="cf-bo-td-mono">{row.payment}</td>
                  <td style={{ color: 'var(--bo-text-main)', fontWeight: 800 }}>{row.total}</td>
                  <td>
                    <span className={`cf-bo-chip ${row.statusClass}`}>
                      <span className="cf-bo-chip-dot" /> {row.status}
                    </span>
                  </td>
                  <td className="cf-bo-td-date">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Right Badge */}
      <div className="cf-bo-netlify-pill">
        <span className="cf-bo-netlify-icon">❖</span>
        <span>CartFlow <strong>Operations Core</strong></span>
      </div>
    </div>
  );
}
