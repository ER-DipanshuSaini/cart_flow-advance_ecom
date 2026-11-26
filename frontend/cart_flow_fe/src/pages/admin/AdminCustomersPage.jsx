import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, ShoppingBag, IndianRupee, UserCheck, X } from 'lucide-react';
import { Button, Input, Select, Table, Badge, Card, MetricCard } from '../../components/ui';
import { loadAdminCustomers, saveAdminCustomers } from '../../data/adminCustomers';
import './AdminConsole.css';

export default function AdminCustomersPage() {
  const navigate = useNavigate();
  const [customers] = useState(loadAdminCustomers);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('spent');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    saveAdminCustomers(customers);
  }, [customers]);

  const uniqueCities = useMemo(() => {
    const set = new Set(customers.map((c) => c.city).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [customers]);

  const hasActiveFilters =
    statusFilter !== 'all' ||
    cityFilter !== 'all' ||
    segmentFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'spent';

  const clearFilters = () => {
    setStatusFilter('all');
    setCityFilter('all');
    setSegmentFilter('all');
    setSortBy('spent');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const metrics = useMemo(() => {
    const activeCount = customers.filter((c) => c.status === 'Active').length;
    const totalOrders = customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);
    const totalSpend = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const repeatBuyers = customers.filter((c) => (c.ordersCount || 0) >= 2).length;
    return { activeCount, totalOrders, totalSpend, repeatBuyers };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const list = customers.filter((c) => {
      if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter) return false;
      if (cityFilter !== 'all' && c.city !== cityFilter) return false;
      if (segmentFilter === 'repeat' && (c.ordersCount || 0) < 2) return false;
      if (segmentFilter === 'first' && (c.ordersCount || 0) !== 1) return false;
      if (segmentFilter === 'high' && (c.totalSpent || 0) < 10000) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
      if (sortBy === 'orders') return (b.ordersCount || 0) - (a.ordersCount || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [customers, statusFilter, cityFilter, segmentFilter, sortBy, searchQuery]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const columns = [
    {
      key: 'srNo',
      label: 'Sr. No.',
      width: '74px',
      render: (_, __, rowIndex) => (
        <span className="cf-admin-inv-sub" style={{ fontWeight: 600 }}>
          {(currentPage - 1) * pageSize + rowIndex + 1}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Customer ID',
      render: (val) => <Badge variant="mono">{val}</Badge>,
    },
    {
      key: 'name',
      label: 'Customer',
      render: (val, row) => (
        <div className="cf-admin-cust-cell">
          <div className="cf-admin-cust-avatar">
            {row.profilePic ? (
              <img src={row.profilePic} alt={val} />
            ) : (
              <span>{val.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--cf-text-main)' }}>{val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--cf-text-dim)' }}>
              Joined {row.joined}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (val) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--cf-text-main)' }}>{val}</span>
      ),
    },
    {
      key: 'city',
      label: 'Location',
      render: (val) => (
        <span style={{ color: 'var(--cf-text-muted)', fontSize: '0.82rem' }}>{val}</span>
      ),
    },
    {
      key: 'ordersCount',
      label: 'Orders',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--cf-text-main)' }}>{val} order(s)</span>
          <div style={{ fontSize: '0.72rem', color: 'var(--cf-text-dim)' }}>
            Last: {row.lastOrderDate}
          </div>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (val) => (
        <span style={{ fontWeight: 800, color: 'var(--cf-text-main)' }}>
          ₹{Number(val).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge dot variant={val === 'Active' ? 'completed' : 'failed'}>
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      {/* Page Header */}
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Customer Directory</h1>
          <p className="cf-bo-page-subtitle">
            Click any customer row to view full profile, orders, addresses, and activity timeline.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="completed" dot>
            {metrics.activeCount} Active
          </Badge>
          <Badge variant="failed" dot>
            {customers.length - metrics.activeCount} Blocked
          </Badge>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Total Customers"
          value={customers.length}
          subtext={`${metrics.repeatBuyers} repeat shoppers`}
          icon={Users}
          highlighted
        />
        <MetricCard
          title="Active Accounts"
          value={metrics.activeCount}
          subtext={`${customers.length - metrics.activeCount} restricted`}
          icon={UserCheck}
        />
        <MetricCard
          title="Orders Placed"
          value={metrics.totalOrders}
          subtext="Across all registered buyers"
          icon={ShoppingBag}
        />
        <MetricCard
          title="Customer Spend"
          value={`₹${metrics.totalSpend.toLocaleString('en-IN')}`}
          subtext="Net lifetime order value"
          icon={IndianRupee}
        />
      </div>

      {/* Directory Table Card */}
      <Card>
        <Card.Header
          title="All Customers"
          subtitle={`${filteredCustomers.length} customer(s) found`}
          action={
            hasActiveFilters && (
              <Button size="sm" variant="outline" icon={X} onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />

        {/* Single-Row Search & Dropdown Filters Bar */}
        <div className="cf-admin-filter-toolbar">
          <div className="cf-admin-search-wrap">
            <Input
              placeholder="Search ID, name, email, city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              icon={Search}
            />
          </div>

          <div className="cf-admin-filter-selects">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'blocked', label: 'Blocked' },
              ]}
            />
            <Select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={uniqueCities.map((city) => ({
                value: city,
                label: city === 'all' ? 'All Cities' : city,
              }))}
            />
            <Select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Buyers' },
                { value: 'repeat', label: 'Repeat Buyers (2+)' },
                { value: 'first', label: 'First-Time Buyers' },
                { value: 'high', label: 'High Spenders (₹10k+)' },
              ]}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'spent', label: 'Sort: Highest Spend' },
                { value: 'orders', label: 'Sort: Most Orders' },
                { value: 'name', label: 'Sort: Name (A–Z)' },
              ]}
            />
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={paginatedCustomers}
            keyField="id"
            onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
            emptyMessage="No customers match your current filters."
            pagination={{
              currentPage,
              pageSize,
              totalItems: filteredCustomers.length,
              pageSizeOptions: [5, 10, 20],
              onPageChange: setCurrentPage,
              onPageSizeChange: (newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              },
            }}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
