import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  AlertCircle,
  Plus,
  Search,
  Eye,
  Lock,
  X,
  Star,
  ShoppingBag,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  MetricCard,
  Table,
} from '../../components/ui';
import {
  loadCatalogs,
  loadInventoryProducts,
  getStockStatus,
  getTotalVariantStock,
  getProductStatusMeta,
  getColorLabel,
  PRODUCT_STATUSES,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

export default function AdminInventoryPage() {
  const navigate = useNavigate();
  const [products] = useState(loadInventoryProducts);
  const catalogs = useMemo(() => loadCatalogs(), []);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Active' | 'Private' | 'Closed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'healthy' | 'low' | 'out'
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const metrics = useMemo(() => {
    const activeCount = products.filter((p) => p.status === 'Active').length;
    const draftCount = products.filter((p) => p.status === 'Draft').length;
    const privateCount = products.filter((p) => p.status === 'Private').length;
    const closedCount = products.filter((p) => p.status === 'Closed').length;
    const alertCount = products.filter(
      (p) => p.status === 'Active' && getStockStatus(p).key !== 'healthy'
    ).length;

    return {
      total: products.length,
      activeCount,
      draftCount,
      privateCount,
      closedCount,
      alertCount,
    };
  }, [products]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    stockFilter !== 'all' ||
    sortBy !== 'newest';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setStockFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      const stockKey = getStockStatus(p).key;
      if (stockFilter !== 'all' && stockKey !== stockFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.supplier || '').toLowerCase().includes(q)
        );
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'orders-desc') return Number(b.orderCount || 0) - Number(a.orderCount || 0);
      if (sortBy === 'rating-desc') return Number(b.rating || 0) - Number(a.rating || 0);
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'stock-asc') return getTotalVariantStock(a) - getTotalVariantStock(b);
      return Number(b.id) - Number(a.id);
    });
  }, [products, searchQuery, statusFilter, categoryFilter, stockFilter, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      render: (val) => <Badge variant="mono">{val}</Badge>,
    },
    {
      key: 'title',
      label: 'Product',
      render: (val, row) => (
        <div className="cf-admin-inv-prod-cell">
          <img src={row.imageUrl} alt={val} className="cf-admin-inv-thumb" />
          <div style={{ minWidth: 0 }}>
            <div className="cf-admin-inv-title">{val}</div>
            <div className="cf-admin-inv-sub">
              {row.supplier || 'CartFlow Atelier'}
              {row.badge ? ` • ${row.badge}` : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => <span className="cf-admin-inv-cat">{val}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (val, row) => (
        <div className="cf-admin-inv-price-col">
          <strong>₹{Number(val).toLocaleString('en-IN')}</strong>
          {row.originalPrice && row.originalPrice > val && (
            <span className="cf-admin-inv-mrp">
              ₹{Number(row.originalPrice).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'variants',
      label: 'Variants & Stock',
      render: (_, row) => {
        const totalStock = getTotalVariantStock(row);
        const st = getStockStatus(row);
        const sizeCount = (row.sizes || []).length;
        const colors = row.colors || [];

        return (
          <div className="cf-admin-inv-variant-cell">
            <div className="cf-admin-inv-variant-top">
              <strong>{totalStock} units</strong>
              <Badge dot size="sm" variant={st.variant}>
                {st.label}
              </Badge>
            </div>
            <div className="cf-admin-inv-variant-meta">
              <span>{sizeCount} size(s)</span>
              <span>•</span>
              <span className="cf-admin-inv-swatch-list">
                {colors.slice(0, 4).map((hex, i) => (
                  <span
                    key={`${hex}-${i}`}
                    className="cf-admin-inv-swatch-dot"
                    style={{ backgroundColor: hex }}
                    title={getColorLabel(hex)}
                  />
                ))}
                {colors.length > 4 && <span>+{colors.length - 4}</span>}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'orderCount',
      label: 'Orders',
      render: (val) => (
        <div className="cf-admin-inv-orders">
          <ShoppingBag size={13} />
          <strong>{Number(val || 0).toLocaleString('en-IN')}</strong>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (val, row) => (
        <div className="cf-admin-inv-rating">
          <Star size={13} className="cf-admin-inv-star-icon" />
          <strong>{Number(val || 0).toFixed(1)}</strong>
          <span className="cf-admin-inv-reviews">({row.reviewCount || 0})</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const meta = getProductStatusMeta(val || 'Active');
        return (
          <Badge dot variant={meta.variant}>
            {meta.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Inventory Management</h1>
          <p className="cf-bo-page-subtitle">
            Review product catalog performance, variant stock levels, ratings, orders, and product lifecycle status.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/admin/inventory/new')}
        >
          Add Product
        </Button>
      </div>

      {/* 4 Clean Inventory Metric Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Total Products"
          value={metrics.total}
          subtext="Catalog SKUs tracked"
          icon={Boxes}
          highlighted
        />
        <MetricCard
          title="Active on Store"
          value={metrics.activeCount}
          subtext="Live for shoppers"
          icon={Eye}
        />
        <MetricCard
          title="Draft & Private"
          value={metrics.draftCount + metrics.privateCount}
          subtext={`${metrics.draftCount} draft • ${metrics.privateCount} private • ${metrics.closedCount} closed`}
          icon={Lock}
        />
        <MetricCard
          title="Stock Alerts"
          value={metrics.alertCount}
          subtext="Low or out-of-stock active SKUs"
          icon={AlertCircle}
        />
      </div>

      {/* Inventory Table Card */}
      <Card>
        <Card.Header
          title="All Products"
          subtitle={`${filteredProducts.length} product(s) shown • Click any row to open product details & edit`}
          action={
            hasActiveFilters && (
              <Button size="sm" variant="outline" icon={X} onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />

        {/* Single-Row Search & Filter Bar */}
        <div className="cf-admin-filter-toolbar">
          <div className="cf-admin-search-wrap">
            <Input
              placeholder="Search SKU, title, category, supplier..."
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
                { value: 'all', label: 'All Statuses' },
                ...PRODUCT_STATUSES.map((s) => ({ value: s.value, label: s.label })),
              ]}
            />
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Catalogs' },
                ...catalogs.map((c) => ({ value: c.name, label: c.name })),
              ]}
            />
            <Select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Stock' },
                { value: 'healthy', label: 'In Stock' },
                { value: 'low', label: 'Low Stock' },
                { value: 'out', label: 'Out of Stock' },
              ]}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'newest', label: 'Sort: Newest' },
                { value: 'orders-desc', label: 'Orders: Highest First' },
                { value: 'rating-desc', label: 'Rating: Highest First' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'stock-asc', label: 'Stock: Lowest First' },
              ]}
            />
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={paginatedProducts}
            keyField="id"
            onRowClick={(row) => navigate(`/admin/inventory/${row.id}`)}
            emptyMessage="No products match your filters."
            pagination={{
              currentPage,
              pageSize,
              totalItems: filteredProducts.length,
              pageSizeOptions: [6, 12, 24],
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
