import React, { useMemo, useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Eye,
  Boxes,
  Upload,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  MetricCard,
  Modal,
  Select,
  Table,
  Textarea,
  ToastContainer,
} from '../../components/ui';
import { useToasts } from '../../hooks/useToasts';
import {
  loadCatalogs,
  saveCatalogs,
  loadInventoryProducts,
  readFilesAsDataUrls,
  saveInventoryProducts,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

const FALLBACK_CATALOG_IMG =
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop';

export default function AdminCatalogPage() {
  const [catalogs, setCatalogs] = useState(loadCatalogs);
  const [products, setProducts] = useState(loadInventoryProducts);
  const { toasts, addToast, removeToast } = useToasts(3000);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
    tagsText: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    saveCatalogs(catalogs);
  }, [catalogs]);

  const productCountsByCatalog = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const key = String(p.category || '').toLowerCase();
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [products]);

  const metrics = useMemo(() => {
    const activeCount = catalogs.filter((c) => c.status !== 'Hidden').length;
    return {
      total: catalogs.length,
      activeCount,
      hiddenCount: catalogs.length - activeCount,
      mappedProducts: products.length,
    };
  }, [catalogs, products]);

  const filteredCatalogs = useMemo(() => {
    return catalogs.filter((c) => {
      if (statusFilter === 'Active' && c.status === 'Hidden') return false;
      if (statusFilter === 'Hidden' && c.status !== 'Hidden') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q) ||
          (c.suggestedTags || []).some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [catalogs, searchQuery, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      image: '',
      status: 'Active',
      tagsText: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (catalog) => {
    setEditingId(catalog.id);
    setForm({
      name: catalog.name || '',
      description: catalog.description || '',
      image: catalog.image || '',
      status: catalog.status || 'Active',
      tagsText: (catalog.suggestedTags || []).join(', '),
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const input = e.target;
    const [dataUrl] = await readFilesAsDataUrls(input.files);
    input.value = '';
    if (dataUrl) setForm((prev) => ({ ...prev, image: dataUrl }));
  };

  const handleSaveCatalog = (e) => {
    e.preventDefault();
    const cleanName = form.name.trim();
    if (!cleanName) {
      setFormError('Catalog name is required.');
      return;
    }

    const duplicate = catalogs.some(
      (c) => c.id !== editingId && c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setFormError('A catalog with this name already exists.');
      return;
    }

    const parsedTags = Array.from(
      new Set(
        form.tagsText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      )
    ).slice(0, 10);

    if (editingId) {
      const previous = catalogs.find((c) => c.id === editingId);
      setCatalogs((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: cleanName,
                description: form.description.trim(),
                image: form.image.trim() || c.image || FALLBACK_CATALOG_IMG,
                status: form.status,
                suggestedTags: parsedTags,
              }
            : c
        )
      );

      // Keep product categories synced if catalog was renamed
      if (previous && previous.name !== cleanName) {
        const nextProducts = products.map((p) =>
          p.category === previous.name ? { ...p, category: cleanName } : p
        );
        setProducts(nextProducts);
        saveInventoryProducts(nextProducts);
      }

      addToast('success', 'Catalog Updated', `${cleanName} updated cleanly.`);
    } else {
      const newCatalog = {
        id: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`,
        name: cleanName,
        description:
          form.description.trim() ||
          `Curated ${cleanName} collection for the modern wardrobe.`,
        image: form.image.trim() || FALLBACK_CATALOG_IMG,
        fallback: FALLBACK_CATALOG_IMG,
        status: form.status,
        suggestedTags: parsedTags,
      };
      setCatalogs((prev) => [newCatalog, ...prev]);
      addToast('success', 'Catalog Added', `${cleanName} is ready to organize products.`);
    }

    setModalOpen(false);
  };

  const columns = [
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
            <div className="cf-admin-inv-sub" style={{ maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
        const count = productCountsByCatalog[row.name.toLowerCase()] || 0;
        return <strong>{count} SKU(s)</strong>;
      },
    },
    {
      key: 'suggestedTags',
      label: 'Relevant Tags (Suggestions)',
      render: (val) => (
        <div className="cf-shopify-tags-wrap" style={{ marginTop: 0 }}>
          {(val || []).slice(0, 4).map((tag) => (
            <span key={tag} className="cf-shopify-tag-pill">
              {tag}
            </span>
          ))}
          {(val || []).length > 4 && (
            <span className="cf-admin-inv-reviews">+{(val || []).length - 4} more</span>
          )}
        </div>
      ),
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
      label: 'Edit',
      align: 'right',
      render: (_, row) => (
        <div
          style={{ display: 'flex', justifyContent: 'flex-end' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="cf-admin-icon-action-btn"
            onClick={() => openEditModal(row)}
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
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Catalog Management</h1>
          <p className="cf-bo-page-subtitle">
            Create and organize store catalogs, cover visuals, and default relevant tags for product tagging.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={Plus} onClick={openAddModal}>
          Add Catalog
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Total Catalogs"
          value={metrics.total}
          subtext="Storefront collections"
          icon={FolderKanban}
          highlighted
        />
        <MetricCard
          title="Active Catalogs"
          value={metrics.activeCount}
          subtext={`${metrics.hiddenCount} hidden from store`}
          icon={Eye}
        />
        <MetricCard
          title="Cataloged SKUs"
          value={metrics.mappedProducts}
          subtext="Products assigned to catalogs"
          icon={Boxes}
        />
      </div>

      <Card>
        <Card.Header
          title="All Catalogs"
          subtitle={`${filteredCatalogs.length} catalog(s) • Click any catalog row to edit`}
          action={
            (searchQuery || statusFilter !== 'all') && (
              <Button
                size="sm"
                variant="outline"
                icon={X}
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )
          }
        />

        <div className="cf-admin-filter-toolbar">
          <div className="cf-admin-search-wrap">
            <Input
              placeholder="Search catalog name, description, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="cf-admin-filter-selects">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Hidden', label: 'Hidden' },
              ]}
            />
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={filteredCatalogs}
            keyField="id"
            onRowClick={openEditModal}
            emptyMessage="No catalogs found."
          />
        </Card.Body>
      </Card>

      {/* Add / Edit Catalog Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={FolderKanban}
        title={editingId ? 'Edit Catalog' : 'Add New Catalog'}
        subtitle="Changes sync directly to product Catalog dropdowns and storefront Catalogs."
        maxWidth="540px"
      >
        <form onSubmit={handleSaveCatalog} className="cf-admin-form-stack">
          <Input
            label="Catalog Name"
            required
            placeholder="e.g., Winter Tailoring"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (formError) setFormError('');
            }}
            error={formError}
          />

          <Select
            label="Visibility Status"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'Active', label: 'Active (Visible on Store)' },
              { value: 'Hidden', label: 'Hidden (Admin Only)' },
            ]}
          />

          <div className="cf-shopify-url-bar" style={{ marginBottom: 0 }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Cover Image URL"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              />
            </div>
            <label className="cf-admin-upload-label" style={{ marginTop: '22px' }}>
              <Upload size={15} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                className="cf-admin-hidden-file-input"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <Textarea
            label="Description"
            rows={3}
            placeholder="Editorial summary shown on the Catalogs page..."
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />

          <Textarea
            label="Relevant Tag Suggestions (Comma-separated, up to 10)"
            rows={2}
            placeholder="cotton, linen, summer, tailored, breathable..."
            value={form.tagsText}
            onChange={(e) => setForm((prev) => ({ ...prev, tagsText: e.target.value }))}
            helperText="Up to 10 relevant tags appear as quick suggestions when adding products to this catalog."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.25rem' }}>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Update Catalog' : 'Create Catalog'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
