import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Table, Badge } from '../../components/ui';
import './StorePages.css';

const DEMO_ORDERS = [
  { id: 'ORD-94821', product: 'The Minimalist Wool Overcoat', status: 'Delivered', total: '$245.00', date: 'Nov 18, 2026' },
  { id: 'ORD-94103', product: 'Structured Boxy Blazer', status: 'In Transit', total: '$185.00', date: 'Nov 21, 2026' },
  { id: 'ORD-93049', product: 'Italian Calfskin Derby Shoes', status: 'Processing', total: '$295.00', date: 'Nov 23, 2026' },
];

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const orderColumns = [
    { label: 'Order ID', key: 'id', cellClassName: 'cf-table-cell-mono' },
    { label: 'Garment / Item', key: 'product' },
    {
      label: 'Fulfillment Status',
      key: 'status',
      render: (status) => (
        <Badge
          variant={status === 'Delivered' ? 'completed' : status === 'In Transit' ? 'processing' : 'warning'}
          dot={true}
        >
          {status}
        </Badge>
      ),
    },
    { label: 'Total', key: 'total' },
    { label: 'Order Date', key: 'date', cellClassName: 'cf-table-cell-muted' },
  ];

  return (
    <div className="cf-store-container cf-account-page-wrap">
      {/* Account Profile Header */}
      <div className="cf-account-header-card">
        <div className="cf-account-user-meta">
          <div className="cf-account-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="cf-account-name">{user?.name || 'Valued Client'}</h1>
              <Badge variant="completed">VERIFIED</Badge>
            </div>
            <p className="cf-account-email">{user?.email || 'client@cartflow.com'}</p>
          </div>
        </div>

        <Button variant="outline" size="sm" icon={LogOut} onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      {/* Orders Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 className="cf-section-headline" style={{ marginBottom: '1.25rem' }}>
          Order History & Tracking
        </h3>
        <Table
          columns={orderColumns}
          data={DEMO_ORDERS}
          keyField="id"
        />
      </div>
    </div>
  );
}
