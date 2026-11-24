import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Card, MetricCard, Table, Badge, Button } from '../../components/ui';
import './AdminConsole.css';

const RECENT_ORDERS = [
  {
    srNo: 1,
    orderId: 'CF-99418',
    customer: 'Vikramaditya Roy',
    items: 'Structured Blazer (1), Riviera Knit (1)',
    payment: 'Prepaid (Razorpay)',
    total: '₹8,198',
    status: 'In Transit',
    date: 'Nov 24, 2026, 12:13 PM',
  },
  {
    srNo: 2,
    orderId: 'CF-99417',
    customer: 'Aarav Singhania',
    items: 'French Linen Overshirt (2)',
    payment: 'Prepaid (UPI)',
    total: '₹4,598',
    status: 'Delivered',
    date: 'Nov 24, 2026, 11:20 AM',
  },
  {
    srNo: 3,
    orderId: 'CF-99416',
    customer: 'Kabir Malhotra',
    items: 'Suede Tassel Loafers (1)',
    payment: 'Cash On Delivery',
    total: '₹4,499',
    status: 'Processing',
    date: 'Nov 23, 2026, 6:45 PM',
  },
  {
    srNo: 4,
    orderId: 'CF-99415',
    customer: 'Rohan Mehra',
    items: 'Gurkha Trousers (1), Crochet Shirt (1)',
    payment: 'Prepaid (UPI)',
    total: '₹4,698',
    status: 'Delivered',
    date: 'Nov 22, 2026, 4:10 PM',
  },
  {
    srNo: 5,
    orderId: 'CF-99414',
    customer: 'Devansh Kapur',
    items: 'Wool Minimalist Overcoat (1)',
    payment: 'Prepaid (Cards)',
    total: '₹6,499',
    status: 'Delivered',
    date: 'Nov 21, 2026, 2:30 PM',
  },
];

export default function AdminOverviewPage() {
  const columns = [
    {
      key: 'srNo',
      label: 'Sr. No.',
      width: '70px',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'orderId',
      label: 'Order Ref',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--bo-text-main)' }}>{val}</span>
          <div style={{ fontSize: '0.72rem', color: 'var(--bo-text-dim)' }}>{row.date}</div>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Purchased Garments',
      render: (val) => <span style={{ color: 'var(--bo-text-muted)' }}>{val}</span>,
    },
    {
      key: 'payment',
      label: 'Payment Mode',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'total',
      label: 'Total Value',
      render: (val) => <span style={{ fontWeight: 800, color: 'var(--bo-text-main)' }}>{val}</span>,
    },
    {
      key: 'status',
      label: 'Fulfillment Status',
      render: (val) => (
        <Badge
          dot
          variant={
            val === 'Delivered'
              ? 'completed'
              : val === 'In Transit'
              ? 'processing'
              : 'warning'
          }
        >
          {val}
        </Badge>
      ),
    },
  ];

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
          <Button
            size="sm"
            variant="outline"
            icon={RefreshCw}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards using UI Kit MetricCard */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Gross Revenue"
          value="₹54,82,000"
          subtext="+14.2% growth this month"
          icon={IndianRupee}
          hasArrow
          highlighted
        />
        <MetricCard
          title="Total Orders"
          value="348"
          subtext="28 in dispatch / 312 delivered"
          icon={ShoppingBag}
        />
        <MetricCard
          title="Active Customers"
          value="437"
          subtext="92 VIP members / 345 standard"
          icon={Users}
        />
        <MetricCard
          title="Average Order Value"
          value="₹3,450"
          subtext="Basket size across collections"
          icon={TrendingUp}
        />
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
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--bo-border)" strokeWidth="8" />
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
              <IndianRupee size={14} className="cf-bo-flower-icon" /> Payment Distribution
            </h4>
          </div>

          <div className="cf-bo-metric-huge">₹54,82,000</div>
          <div className="cf-bo-metric-subtitle">settled transactions</div>

          <div className="cf-bo-progress-track">
            <div className="cf-bo-progress-fill" style={{ width: '84%' }} />
          </div>

          <div className="cf-bo-split-row">
            <div>
              <span className="cf-bo-split-tag">↗ Online Prepaid (UPI/Cards)</span>
              <strong className="cf-bo-split-val">₹46,20,000 (84%)</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="cf-bo-split-tag">↗ Cash On Delivery</span>
              <strong className="cf-bo-split-val">₹8,62,000 (16%)</strong>
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

      {/* 4. Bottom Table: Recent Customer Orders using UI Kit <Table> */}
      <Card>
        <Card.Header
          title="Recent Customer Orders"
          subtitle="Real-time multi-gateway transactions feed"
          action={
            <Button
              size="sm"
              variant="outline"
              iconRight={ArrowUpRight}
              onClick={() => (window.location.href = '/admin/orders')}
            >
              All Orders
            </Button>
          }
        />
        <Card.Body style={{ padding: 0 }}>
          <Table columns={columns} data={RECENT_ORDERS} keyField="orderId" />
        </Card.Body>
      </Card>
    </div>
  );
}
