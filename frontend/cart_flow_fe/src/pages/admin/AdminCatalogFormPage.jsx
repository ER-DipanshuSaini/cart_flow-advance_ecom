import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Plus,
  X,
  Upload,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Modal,
  Select,
  Table,
  Textarea,
  ToastContainer,
} from '../../components/ui';
import { useToasts } from '../../hooks/useToasts';
import {
  STOREFRONT_IMAGE_ACCEPT,
  getProductStatusMeta,
  getStockStatus,
  getTotalVariantStock,
  loadCatalogs,
  loadInventoryProducts,
  saveCatalogs,
  saveInventoryProducts,
  validateStorefrontImageFiles,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

const MAX_CATALOG_NAME_CHARS = 60;
const MAX_CATALOG_DESC_CHARS = 240;
const MAX_MEDIA_FILE_MB = 5;

const FALLBACK_CATALOG_IMG =
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop';

const CATALOG_STATUSES = [
  {
    value: 'Active',
    label: 'Active',
    variant: 'completed',
    description: 'Visible on storefront',
  },
  {
    value: 'Hidden',
    label: 'Hidden',
    variant: 'neutral',
    description: 'Admin only',
  },
];

function buildInitialCatalogForm(existingCatalog) {
  if (existingCatalog) {
    return {
      name: existingCatalog.name || '',
      description: existingCatalog.description || '',
      image: existingCatalog.image || '',
      status: existingCatalog.status === 'Hidden' ? 'Hidden' : 'Active',
    };
  }
  return {
    name: '',
    description: '',
    image: '',
    status: 'Active',
  };
}

export default function AdminCatalogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToasts(3200);

  const [catalogs, setCatalogs] = useState(loadCatalogs);
  const [allProducts, setAllProducts] = useState(loadInventoryProducts);
  const isEditMode = Boolean(id);
  const existingCatalog = useMemo(
    () => (isEditMode ? catalogs.find((c) => String(c.id) === String(id)) : null),
    [catalogs, id, isEditMode]
  );

  const [form, setForm] = useState(() => buildInitialCatalogForm(existingCatalog));
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Hide-catalog guard modal (when catalog has mapped products)
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [shiftTargetCatalog, setShiftTargetCatalog] = useState('');

  useEffect(() => {
    setForm(buildInitialCatalogForm(existingCatalog));
    setErrors({});
    setCurrentPage(1);
    setHideModalOpen(false);
    setShiftTargetCatalog('');
  }, [id, existingCatalog]);

  const productsInCatalog = useMemo(() => {
    if (!existingCatalog) return [];
    const targetName = existingCatalog.name.toLowerCase();
    return allProducts.filter((p) => String(p.category || '').toLowerCase() === targetName);
  }, [allProducts, existingCatalog]);

  const otherActiveCatalogs = useMemo(
    () =>
      catalogs.filter(
        (c) =>
          (!existingCatalog || String(c.id) !== String(existingCatalog.id)) &&
          c.status !== 'Hidden'
      ),
    [catalogs, existingCatalog]
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return productsInCatalog.slice(start, start + pageSize);
  }, [productsInCatalog, currentPage, pageSize]);

  if (isEditMode && !existingCatalog) {
    return (
      <div className="cf-admin-content-inner">
        <Card>
          <Card.Header title="Catalog Not Found" subtitle={`No catalog matches ID "${id}".`} />
          <Card.Body>
            <Button variant="primary" onClick={() => navigate('/admin/catalog')}>
              Back to Catalogs
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleCoverUpload = async (e) => {
    const input = e.target;
    const rawFiles = Array.from(input.files || []);
    input.value = '';
    if (rawFiles.length === 0) return;

    const { validUrls, invalidTypeCount, oversizedCount, invalidRatioCount } =
      await validateStorefrontImageFiles(rawFiles.slice(0, 1), {
        maxFileMb: MAX_MEDIA_FILE_MB,
      });

    if (invalidTypeCount > 0) {
      addToast('warning', 'Unsupported Format', 'Only JPG, JPEG, PNG, and WEBP images are supported.');
      return;
    }
    if (oversizedCount > 0) {
      addToast('warning', 'File Too Large', `Cover image must be ${MAX_MEDIA_FILE_MB}MB or smaller.`);
      return;
    }
    if (invalidRatioCount > 0) {
      addToast(
        'warning',
        'Invalid Aspect Ratio',
        'Storefront catalog cards require a 5:6 ratio image (e.g. 1000×1200 px).'
      );
      return;
    }

    if (validUrls[0]) {
      updateField('image', validUrls[0]);
    }
  };

  const handleVisibilityChange = (nextStatus) => {
    if (nextStatus === form.status) return;
    if (nextStatus === 'Hidden') {
      if (isEditMode && productsInCatalog.length > 0) {
        setShiftTargetCatalog(otherActiveCatalogs[0]?.name || '');
        setHideModalOpen(true);
        return;
      }
      updateField('status', 'Hidden');
      addToast(
        'warning',
        'Catalog Set to Hidden',
        'This catalog and any products assigned to it will be hidden from the storefront.'
      );
      return;
    }

    updateField('status', 'Active');
    addToast(
      'info',
      'Catalog Set to Active',
      'This catalog will be visible to shoppers on the storefront.'
    );
  };

  const handleShiftAndHide = () => {
    if (!shiftTargetCatalog || !existingCatalog) return;
    const oldName = existingCatalog.name.toLowerCase();
    const nextProducts = allProducts.map((p) =>
      String(p.category || '').toLowerCase() === oldName
        ? { ...p, category: shiftTargetCatalog }
        : p
    );
    const nextCatalogs = catalogs.map((c) =>
      String(c.id) === String(existingCatalog.id) ? { ...c, status: 'Hidden' } : c
    );
    setAllProducts(nextProducts);
    setCatalogs(nextCatalogs);
    saveInventoryProducts(nextProducts);
    saveCatalogs(nextCatalogs);
    updateField('status', 'Hidden');
    setHideModalOpen(false);
    addToast(
      'success',
      'Products Shifted & Catalog Hidden',
      `Moved ${productsInCatalog.length} product(s) to ${shiftTargetCatalog} and hid ${existingCatalog.name}.`
    );
  };

  const handleHideCatalogAndProducts = () => {
    if (!existingCatalog) return;
    const oldName = existingCatalog.name.toLowerCase();
    const nextProducts = allProducts.map((p) =>
      String(p.category || '').toLowerCase() === oldName && p.status === 'Active'
        ? { ...p, status: 'Private', inStock: false }
        : p
    );
    const nextCatalogs = catalogs.map((c) =>
      String(c.id) === String(existingCatalog.id) ? { ...c, status: 'Hidden' } : c
    );
    setAllProducts(nextProducts);
    setCatalogs(nextCatalogs);
    saveInventoryProducts(nextProducts);
    saveCatalogs(nextCatalogs);
    updateField('status', 'Hidden');
    setHideModalOpen(false);
    addToast(
      'warning',
      'Catalog & Products Hidden',
      `${existingCatalog.name} and its mapped products are now hidden from the storefront.`
    );
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const cleanName = form.name.trim();
    const nextErrors = {};

    if (!cleanName) {
      nextErrors.name = 'Catalog name is required.';
    } else {
      const duplicate = catalogs.some(
        (c) =>
          (!isEditMode || String(c.id) !== String(existingCatalog.id)) &&
          c.name.toLowerCase() === cleanName.toLowerCase()
      );
      if (duplicate) {
        nextErrors.name = 'A catalog with this name already exists.';
      }
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Add a short description for this catalog.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast('error', 'Required Fields Missing', 'Please complete the highlighted catalog fields.');
      return;
    }

    const coverImage = form.image || FALLBACK_CATALOG_IMG;

    if (isEditMode) {
      const updatedCatalog = {
        ...existingCatalog,
        name: cleanName,
        description: form.description.trim(),
        image: coverImage,
        status: form.status,
      };
      const nextCatalogs = catalogs.map((c) =>
        String(c.id) === String(existingCatalog.id) ? updatedCatalog : c
      );
      setCatalogs(nextCatalogs);
      saveCatalogs(nextCatalogs);

      if (existingCatalog.name !== cleanName) {
        const nextProducts = allProducts.map((p) =>
          p.category === existingCatalog.name ? { ...p, category: cleanName } : p
        );
        setAllProducts(nextProducts);
        saveInventoryProducts(nextProducts);
      }

      addToast('success', 'Catalog Updated', `${cleanName} updated cleanly.`);
      setTimeout(() => navigate('/admin/catalog'), 550);
    } else {
      const baseSlug =
        cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
        `cat-${Date.now()}`;
      const uniqueId = catalogs.some((c) => c.id === baseSlug)
        ? `${baseSlug}-${Date.now().toString().slice(-4)}`
        : baseSlug;

      const newCatalog = {
        id: uniqueId,
        name: cleanName,
        description: form.description.trim(),
        image: coverImage,
        fallback: FALLBACK_CATALOG_IMG,
        status: form.status,
        suggestedTags: [],
      };

      const nextCatalogs = [newCatalog, ...catalogs];
      setCatalogs(nextCatalogs);
      saveCatalogs(nextCatalogs);
      addToast('success', 'Catalog Created', `${cleanName} added to your store catalogs.`);
      setTimeout(() => navigate(`/admin/catalog/${newCatalog.id}`), 550);
    }
  };

  const activeStatusMeta =
    CATALOG_STATUSES.find((s) => s.value === form.status) || CATALOG_STATUSES[0];

  return (
    <div className="cf-admin-content-inner">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Topbar */}
      <div className="cf-shopify-topbar">
        <div className="cf-shopify-topbar-left">
          <button
            type="button"
            className="cf-admin-back-chevron-btn"
            onClick={() => navigate('/admin/catalog')}
            title="Back to Catalogs"
            aria-label="Back to Catalogs"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="cf-shopify-title-block">
            <div className="cf-shopify-title-row">
              <h1 className="cf-shopify-page-title">
                {isEditMode ? existingCatalog.name : 'Add New Catalog'}
              </h1>
              <Badge dot variant={activeStatusMeta.variant}>
                {activeStatusMeta.label}
              </Badge>
            </div>
            <p className="cf-bo-page-subtitle">
              {isEditMode
                ? `${productsInCatalog.length} product(s) mapped to this catalog`
                : 'Upload a 5:6 cover photo, enter name, description, and visibility'}
            </p>
          </div>
        </div>

        <div className="cf-shopify-topbar-actions">
          {isEditMode && form.status === 'Active' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={() => window.open('/catalog', '_blank')}
            >
              View on Store
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/catalog')}
          >
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" icon={Save} onClick={handleSubmit}>
            {isEditMode ? 'Save Changes' : 'Create Catalog'}
          </Button>
        </div>
      </div>

      {/* Single Clean Catalog Editor Card: Left = Cover Photo, Right = Name + Desc + Visibility */}
      <form onSubmit={handleSubmit} className="cf-admin-form-stack">
        <Card>
          <Card.Header
            title="Catalog Details"
            subtitle={`Cover photo requires 5:6 ratio • JPG, PNG, or WEBP up to ${MAX_MEDIA_FILE_MB}MB`}
          />
          <Card.Body>
            <div className="cf-catalog-editor-grid">
              {/* Left: Photo Upload / Replace only */}
              <div className="cf-catalog-photo-col">
                <div className="cf-shopify-media-primary">
                  {form.image ? (
                    <>
                      <img
                        src={form.image}
                        alt={form.name || 'Catalog cover'}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CATALOG_IMG;
                        }}
                      />
                      <span className="cf-shopify-cover-badge">Cover</span>
                      <button
                        type="button"
                        className="cf-shopify-media-del"
                        onClick={() => updateField('image', '')}
                        title="Remove cover image"
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <label className="cf-shopify-upload-dropzone is-primary cf-catalog-dropzone">
                      <Upload size={22} />
                      <span>Upload 5:6 Cover</span>
                      <small>JPG, PNG, WEBP • Max {MAX_MEDIA_FILE_MB}MB</small>
                      <input
                        type="file"
                        accept={STOREFRONT_IMAGE_ACCEPT}
                        className="cf-admin-hidden-file-input"
                        onChange={handleCoverUpload}
                      />
                    </label>
                  )}
                </div>

                {form.image && (
                  <label className="cf-admin-upload-label cf-catalog-replace-btn">
                    <RefreshCw size={13} />
                    <span>Replace Photo</span>
                    <input
                      type="file"
                      accept={STOREFRONT_IMAGE_ACCEPT}
                      className="cf-admin-hidden-file-input"
                      onChange={handleCoverUpload}
                    />
                  </label>
                )}
              </div>

              {/* Right: Name + Description + Visibility */}
              <div className="cf-admin-form-stack">
                <div className="cf-ui-form-group">
                  <div className="cf-shopify-tag-header-row">
                    <label className="cf-ui-label">
                      Catalog Name <span style={{ color: 'var(--cf-accent-danger)' }}>*</span>
                    </label>
                    <span
                      className={`cf-shopify-tag-counter ${
                        form.name.length >= MAX_CATALOG_NAME_CHARS ? 'is-limit' : ''
                      }`}
                    >
                      {form.name.length} / {MAX_CATALOG_NAME_CHARS} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={MAX_CATALOG_NAME_CHARS}
                    placeholder="e.g., Winter Tailoring, Resort Linen"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`cf-ui-input ${errors.name ? 'is-error' : ''}`}
                  />
                  {errors.name && <span className="cf-ui-input-error">{errors.name}</span>}
                </div>

                <div className="cf-ui-form-group">
                  <div className="cf-shopify-tag-header-row">
                    <label className="cf-ui-label">
                      Description <span style={{ color: 'var(--cf-accent-danger)' }}>*</span>
                    </label>
                    <span
                      className={`cf-shopify-tag-counter ${
                        form.description.length >= MAX_CATALOG_DESC_CHARS ? 'is-limit' : ''
                      }`}
                    >
                      {form.description.length} / {MAX_CATALOG_DESC_CHARS} chars
                    </span>
                  </div>
                  <Textarea
                    rows={3}
                    maxLength={MAX_CATALOG_DESC_CHARS}
                    placeholder="Short editorial description shown to storefront visitors..."
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    error={errors.description}
                  />
                </div>

                <div className="cf-ui-form-group">
                  <label className="cf-ui-label">Visibility</label>
                  <div
                    className="cf-catalog-visibility-row"
                    role="radiogroup"
                    aria-label="Catalog visibility"
                  >
                    {CATALOG_STATUSES.map((s) => {
                      const isSelected = form.status === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`cf-shopify-status-row cf-catalog-vis-option ${
                            isSelected ? 'is-selected' : ''
                          }`}
                          onClick={() => handleVisibilityChange(s.value)}
                        >
                          <span className="cf-shopify-status-radio" aria-hidden="true" />
                          <div className="cf-shopify-status-copy">
                            <div className="cf-shopify-status-title-row">
                              <span className="cf-shopify-status-name">{s.label}</span>
                              <span className={`cf-shopify-status-dot is-${s.variant}`} />
                            </div>
                            <span className="cf-shopify-status-desc">{s.description}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className={`cf-catalog-vis-note ${
                      form.status === 'Hidden' ? 'is-warning' : ''
                    }`}
                  >
                    <AlertTriangle size={14} />
                    <span>
                      {form.status === 'Hidden'
                        ? 'Hidden catalogs are not shown on the storefront, and all products inside them will also stay hidden. Shift products to another catalog first if you want them visible.'
                        : 'Note: Hiding a catalog will also hide its assigned products from the storefront unless you shift them to another catalog first.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Bottom Paginated Catalog Products Table */}
        <Card>
          <Card.Header
            title={`Catalog Products (${productsInCatalog.length})`}
            subtitle={
              isEditMode
                ? 'Click any product row to open its edit page'
                : 'Products assigned to this catalog will appear here after creation'
            }
            action={
              isEditMode && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  icon={Plus}
                  onClick={() => navigate('/admin/inventory/new')}
                >
                  Add Product
                </Button>
              )
            }
          />
          <Card.Body style={{ padding: 0 }}>
            <Table
              className="is-embedded"
              keyField="id"
              data={paginatedProducts}
              onRowClick={(row) => navigate(`/admin/inventory/${row.id}/edit`)}
              emptyMessage={
                isEditMode
                  ? 'No products are assigned to this catalog yet.'
                  : 'Save this catalog first to start assigning products to it.'
              }
              pagination={{
                currentPage,
                pageSize,
                totalItems: productsInCatalog.length,
                onPageChange: setCurrentPage,
                onPageSizeChange: (nextSize) => {
                  setPageSize(nextSize);
                  setCurrentPage(1);
                },
                pageSizeOptions: [6, 10, 20],
              }}
              columns={[
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
                        <div className="cf-admin-inv-sub">{row.supplier || 'CartFlow Atelier'}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'price',
                  label: 'Price',
                  render: (val) => <strong>₹{Number(val).toLocaleString('en-IN')}</strong>,
                },
                {
                  key: 'stockCount',
                  label: 'Stock',
                  render: (_, row) => {
                    const totalStock = getTotalVariantStock(row);
                    const st = getStockStatus(row);
                    return (
                      <div className="cf-admin-inv-variant-top">
                        <strong>{totalStock} units</strong>
                        <Badge dot size="sm" variant={st.variant}>
                          {st.label}
                        </Badge>
                      </div>
                    );
                  },
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (val) => {
                    const meta = getProductStatusMeta(val || 'Active');
                    return (
                      <Badge dot size="sm" variant={meta.variant}>
                        {meta.label}
                      </Badge>
                    );
                  },
                },
              ]}
            />
          </Card.Body>
        </Card>
      </form>

      {/* Hide Catalog Guard Modal (shift products first or hide all) */}
      <Modal
        isOpen={hideModalOpen}
        onClose={() => setHideModalOpen(false)}
        icon={AlertTriangle}
        title={`Hide "${existingCatalog?.name}" Catalog?`}
        subtitle={`${productsInCatalog.length} product(s) are currently assigned to this catalog`}
        maxWidth="510px"
      >
        <div className="cf-admin-form-stack">
          <div className="cf-shopify-status-warn-box is-warning">
            <p className="cf-shopify-status-warn-main">
              Hiding this catalog will also hide all {productsInCatalog.length} product(s) inside it
              from the storefront.
            </p>
            <p className="cf-shopify-status-warn-tip">
              Recommended: Shift these products to another active catalog before hiding, or confirm
              below if you want to hide all of them too.
            </p>
          </div>

          {otherActiveCatalogs.length > 0 && (
            <Select
              label="Shift all products to another catalog"
              value={shiftTargetCatalog}
              onChange={(e) => setShiftTargetCatalog(e.target.value)}
              options={otherActiveCatalogs.map((c) => ({ value: c.name, label: c.name }))}
            />
          )}

          <div className="cf-shopify-status-modal-actions">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHideModalOpen(false)}
            >
              Cancel
            </Button>
            <div className="cf-shopify-status-modal-right">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleHideCatalogAndProducts}
              >
                Hide Catalog & Products
              </Button>
              {otherActiveCatalogs.length > 0 && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleShiftAndHide}
                >
                  Shift & Hide Catalog
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
