import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Truck, Check, Eye, Download } from 'lucide-react';
import { Button, Input, Table, Badge, Card } from '../../components/ui';
import './AdminConsole.css';

const INITIAL_ORDERS = [
  {
    id: 'ORD-99418',
    customer: 'Vikramaditya Roy',
    items: 'Structured Blazer (1), Riviera Knit (1)',
    total: '₹8,198',
    payment: 'Paid (Razorpay)',
    status: 'In Transit',
    courier: 'BlueDart Air',
    date: 'Nov 23, 2026, 4:15 PM',
  },
  {
    id: 'ORD-99417',
    customer: 'Aarav Singhania',
    items: 'French Linen Overshirt (2)',
    total: '₹4,598',
    payment: 'Paid (UPI)',
    status: 'Processing',
    courier: 'Delhivery Surface',
    date: 'Nov 23, 2026, 2:30 PM',
  },
  {
    id: 'ORD-99416',
    customer: 'Kabir Malhotra',
    items: 'Suede Tassel Loafers (1)',
    total: '₹4,499',
    payment: 'Cash On Delivery',
    status: 'Confirmed',
    courier: 'Pending Assignment',
    date: 'Nov 23, 2026, 11:20 AM',
  },
  {
    id: 'ORD-99415',
    customer: 'Rohan Mehra',
    items: 'Gurkha Trousers (1), Crochet Shirt (1)',
    total: '₹4,698',
    payment: 'Paid (UPI)',
    status: 'Delivered',
    courier: 'Delhivery Express',
    date: 'Nov 21, 2026, 6:00 PM',
  },
  {
    id: 'ORD-99414',
    customer: 'Devansh Kapur',
    items: 'Wool Minimalist Overcoat (1)',
    total: '₹6,499',
    payment: 'Paid (Razorpay)',
    status: 'Delivered',
    courier: 'BlueDart Express',
    date: 'Nov 20, 2026, 1:10 PM',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const markShipped = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'In Transit', courier: 'BlueDart Air (Assigned)' } : o))
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'customer',
      label: 'Client Name',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--cf-text-main)' }}>{val}</span>
          <div style={{ fontSize: '0.72rem', color: 'var(--cf-text-dim)' }}>{row.date}</div>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Purchased Garments',
      render: (val) => <span style={{ color: 'var(--cf-text-muted)' }}>{val}</span>,
    },
    {
      key: 'total',
      label: 'Total Value',
      render: (val) => <span style={{ fontWeight: 800, color: 'var(--cf-text-main)' }}>{val}</span>,
    },
    {
      key: 'payment',
      label: 'Payment',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
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
              : val === 'Processing'
              ? 'warning'
              : 'neutral'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'courier',
      label: 'Courier Partner',
      render: (val) => <span style={{ fontSize: '0.78rem', color: 'var(--cf-text-muted)' }}>{val}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="sm"
          variant={row.status === 'In Transit' ? 'outline' : 'primary'}
          disabled={row.status === 'In Transit' || row.status === 'Delivered'}
          onClick={() => markShipped(row.id)}
        >
          {row.status === 'In Transit' ? 'Dispatched' : row.status === 'Delivered' ? 'Completed' : 'Dispatch'}
        </Button>
      ),
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Orders & Order Fulfillment</h1>
          <p className="cf-bo-page-subtitle">Manage customer orders, packing slips, and dispatch logistics.</p>
        </div>
      </div>

      <Card>
        <Card.Header
          title="Live Customer Orders"
          subtitle={`${filteredOrders.length} orders shown`}
          action={
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Input
                placeholder="Search order ID, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '240px' }}
                icon={Search}
              />
            </div>
          }
        />

        {/* Filter Toolbar */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--cf-border-subtle)',
            backgroundColor: 'var(--cf-bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--cf-text-dim)', marginRight: '4px' }}>
              Filter Status:
            </span>
            {['All', 'Confirmed', 'Processing', 'In Transit', 'Delivered'].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st.toLowerCase() ? 'primary' : 'ghost'}
                onClick={() => setStatusFilter(st.toLowerCase())}
                style={{ height: '28px', fontSize: '0.72rem', padding: '0 10px' }}
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Table columns={columns} data={filteredOrders} keyField="id" />
        </Card.Body>
      </Card>
    </div>
  );
}
