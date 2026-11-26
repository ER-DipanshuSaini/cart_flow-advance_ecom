import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Eye,
  EyeOff,
  Boxes,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  MetricCard,
  Select,
  Table,
} from '../../components/ui';
import {
  loadCatalogs,
  loadInventoryProducts,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

const FALLBACK_CATALOG_IMG =
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop';

export default function AdminCatalogPage() {
  const navigate = useNavigate();
  const [catalogs] = useState(loadCatalogs);
  const [products] = useState(loadInventoryProducts);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const productStatsByCatalog = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const key = String(p.category || '').toLowerCase();
      if (!map[key]) map[key] = { total: 0, active: 0 };
      map[key].total += 1;
      if (p.status === 'Active') map[key].active += 1;
    });
    return map;
  }, [products]);

  const metrics = useMemo(() => {
    const activeCount = catalogs.filter((c) => c.status !== 'Hidden').length;
    const activeSkus = products.filter((p) => p.status === 'Active').length;
    return {
      total: catalogs.length,
      activeCount,
      hiddenCount: catalogs.length - activeCount,
      mappedProducts: products.length,
      activeSkus,
    };
  }, [catalogs, products]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'all' || sortBy !== 'default';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  const filteredCatalogs = useMemo(() => {
    const list = catalogs.filter((c) => {
      if (statusFilter === 'Active' && c.status === 'Hidden') return false;
      if (statusFilter === 'Hidden' && c.status !== 'Hidden') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === 'products-desc') {
      return [...list].sort(
        (a, b) =>
          (productStatsByCatalog[b.name.toLowerCase()]?.total || 0) -
          (productStatsByCatalog[a.name.toLowerCase()]?.total || 0)
      );
    }
    if (sortBy === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [catalogs, searchQuery, statusFilter, sortBy, productStatsByCatalog]);

  const paginatedCatalogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCatalogs.slice(start, start + pageSize);
  }, [filteredCatalogs, currentPage, pageSize]);

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
      key: 'name',
      label: 'Catalog',
      render: (val, row) => (
        <div className="cf-admin-inv-prod-cell">
          <img
            src={row.image || FALLBACK_CATALOG_IMG}
            alt={val}
            className="cf-admin-inv-thumb"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_CATALOG_IMG;
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div className="cf-admin-inv-title">{val}</div>
            <div
              className="cf-admin-inv-sub"
              style={{
                maxWidth: '420px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'productsCount',
      label: 'Products',
      render: (_, row) => {
        const stat = productStatsByCatalog[row.name.toLowerCase()] || { total: 0, active: 0 };
        return (
          <div className="cf-admin-inv-price-col">
            <strong>{stat.total} SKU(s)</strong>
            <span className="cf-admin-inv-reviews">{stat.active} active</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge dot variant={val === 'Hidden' ? 'neutral' : 'completed'}>
          {val || 'Active'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          {row.status !== 'Hidden' && (
            <button
              type="button"
              className="cf-admin-icon-action-btn"
              onClick={() => window.open('/catalog', '_blank')}
              title="View on Storefront"
              aria-label={`View ${row.name} on storefront`}
            >
              <ExternalLink size={14} />
            </button>
          )}
          <button
            type="button"
            className="cf-admin-icon-action-btn"
            onClick={() => navigate(`/admin/catalog/${row.id}`)}
            title="Edit Catalog"
            aria-label={`Edit ${row.name}`}
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Catalog Management</h1>
          <p className="cf-bo-page-subtitle">
            Organize storefront collections, cover visuals, visibility, and default product tag suggestions.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/admin/catalog/new')}
        >
          Add Catalog
        </Button>
      </div>

      {/* 4 Clean Catalog KPI Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Total Catalogs"
          value={metrics.total}
          subtext="Storefront collections"
          icon={FolderKanban}
          highlighted
        />
        <MetricCard
          title="Active on Store"
          value={metrics.activeCount}
          subtext="Visible to shoppers"
          icon={Eye}
        />
        <MetricCard
          title="Hidden Catalogs"
          value={metrics.hiddenCount}
          subtext="Admin-only visibility"
          icon={EyeOff}
        />
        <MetricCard
          title="Cataloged SKUs"
          value={metrics.mappedProducts}
          subtext={`${metrics.activeSkus} active across catalogs`}
          icon={Boxes}
        />
      </div>

      {/* Catalogs Table Card */}
      <Card>
        <Card.Header
          title="All Catalogs"
          subtitle={`${filteredCatalogs.length} catalog(s) shown • Click any row to open & edit`}
          action={
            hasActiveFilters && (
              <Button size="sm" variant="outline" icon={X} onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />

        <div className="cf-admin-filter-toolbar">
          <div className="cf-admin-search-wrap">
            <Input
              placeholder="Search catalog name or description..."
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
                { value: 'Active', label: 'Active' },
                { value: 'Hidden', label: 'Hidden' },
              ]}
            />
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'default', label: 'Sort: Default Order' },
                { value: 'products-desc', label: 'Sort: Most Products' },
                { value: 'name-asc', label: 'Sort: Name A → Z' },
              ]}
            />
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={paginatedCatalogs}
            keyField="id"
            onRowClick={(row) => navigate(`/admin/catalog/${row.id}`)}
            emptyMessage="No catalogs match your current filters."
            pagination={{
              currentPage,
              pageSize,
              totalItems: filteredCatalogs.length,
              onPageChange: setCurrentPage,
              onPageSizeChange: (nextSize) => {
                setPageSize(nextSize);
                setCurrentPage(1);
              },
              pageSizeOptions: [6, 10, 20],
            }}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
