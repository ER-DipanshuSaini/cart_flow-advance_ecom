import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Truck, Check, Eye, Download } from 'lucide-react';
import { Button, Input, Dropdown } from '../../components/ui';
import './AdminConsole.css';

const INITIAL_ORDERS = [
  {
    id: 'ORD-99418',
    customer: 'Vikramaditya Roy',
    items: 'Structured Blazer (1), Riviera Knit (1)',
    total: '$329.00',
    payment: 'Paid (Razorpay)',
    status: 'In Transit',
    courier: 'BlueDart Air',
    date: 'Nov 23, 2026, 4:15 PM',
  },
  {
    id: 'ORD-99417',
    customer: 'Aarav Singhania',
    items: 'French Linen Overshirt (2)',
    total: '$190.00',
    payment: 'Paid (Stripe)',
    status: 'Processing',
    courier: 'Delhivery Surface',
    date: 'Nov 23, 2026, 2:30 PM',
  },
  {
    id: 'ORD-99416',
    customer: 'Kabir Malhotra',
    items: 'Suede Tassel Loafers (1)',
    total: '$180.00',
    payment: 'Cash On Delivery',
    status: 'Confirmed',
    courier: 'Pending Assignment',
    date: 'Nov 23, 2026, 11:20 AM',
  },
  {
    id: 'ORD-99415',
    customer: 'Rohan Mehra',
    items: 'Gurkha Trousers (1), Crochet Shirt (1)',
    total: '$195.00',
    payment: 'Paid (UPI)',
    status: 'Delivered',
    courier: 'Delhivery Express',
    date: 'Nov 21, 2026, 6:00 PM',
  },
  {
    id: 'ORD-99414',
    customer: 'Devansh Kapur',
    items: 'Wool Minimalist Overcoat (1)',
    total: '$260.00',
    payment: 'Paid (Stripe)',
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

  return (
    <div>
      <div className="cf-overview-header">
        <h1 className="cf-overview-title">Orders & Order Fulfillment</h1>
        <p className="cf-overview-subtitle">Manage customer orders, packing slips, and dispatch logistics.</p>
      </div>

      <div className="cf-admin-table-card">
        {/* Controls Bar */}
        <div className="cf-table-card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Filter Status:</span>
            {['All', 'Confirmed', 'Processing', 'In Transit', 'Delivered'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st.toLowerCase())}
                style={{
                  background: statusFilter === st.toLowerCase() ? '#003f7f' : '#141b27',
                  border: '1px solid #243042',
                  color: statusFilter === st.toLowerCase() ? '#ffffff' : '#94a3b8',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="Search order ID, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '220px' }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="cf-admin-data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Purchased Garments</th>
                <th>Total Value</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th>Courier Partner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td className="cf-td-mono">{o.id}</td>
                  <td className="cf-td-product-title">{o.customer}</td>
                  <td>{o.items}</td>
                  <td style={{ fontWeight: 800, color: '#ffffff' }}>{o.total}</td>
                  <td className="cf-td-mono">{o.payment}</td>
                  <td>
                    <span
                      className={`cf-status-chip ${
                        o.status === 'Delivered'
                          ? 'is-completed'
                          : o.status === 'In Transit'
                          ? 'is-processing'
                          : 'is-quota'
                      }`}
                    >
                      • {o.status}
                    </span>
                  </td>
                  <td className="cf-td-mono">{o.courier}</td>
                  <td>
                    {o.status === 'Processing' || o.status === 'Confirmed' ? (
                      <button
                        type="button"
                        onClick={() => markShipped(o.id)}
                        style={{
                          backgroundColor: '#003f7f',
                          border: 'none',
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Dispatch
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Dispatched</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
