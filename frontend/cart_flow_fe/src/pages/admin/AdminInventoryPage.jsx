import React, { useState } from 'react';
import { Boxes, AlertCircle, Plus, TrendingUp, CheckCircle } from 'lucide-react';
import { Button, Input, Badge, Card, MetricCard, Table, Modal } from '../../components/ui';
import './AdminConsole.css';

const INVENTORY_DATA = [
  {
    sku: 'SKU-BLZ-001',
    title: 'Italian Double-Breasted Structured Blazer',
    supplier: 'Vanguard Mills Florence',
    available: 48,
    reserved: 12,
    reorderLevel: 20,
    costPerUnit: '₹2,200',
    status: 'Healthy',
  },
  {
    sku: 'SKU-PLO-002',
    title: 'The Riviera Textured Knit Polo',
    supplier: 'Aegean Combed Cottons',
    available: 14,
    reserved: 8,
    reorderLevel: 25,
    costPerUnit: '₹850',
    status: 'Low Stock',
  },
  {
    sku: 'SKU-TRS-003',
    title: 'Pleated Gurkha Trousers - Straight Cut',
    supplier: 'Napoli Tailored Mills',
    available: 62,
    reserved: 5,
    reorderLevel: 30,
    costPerUnit: '₹1,100',
    status: 'Healthy',
  },
  {
    sku: 'SKU-SHR-004',
    title: 'Pure French Linen Relaxed Overshirt',
    supplier: 'Normandy Flax Weavers',
    available: 8,
    reserved: 14,
    reorderLevel: 20,
    costPerUnit: '₹950',
    status: 'Critical Alert',
  },
  {
    sku: 'SKU-LFR-005',
    title: 'Minimalist Suede Tassel Loafers',
    supplier: 'Tuscany Leather Works',
    available: 34,
    reserved: 6,
    reorderLevel: 15,
    costPerUnit: '₹1,800',
    status: 'Healthy',
  },
  {
    sku: 'SKU-CRH-006',
    title: 'Cuban Collar Resort Crochet Shirt',
    supplier: 'Mediterranean Weavers',
    available: 22,
    reserved: 9,
    reorderLevel: 20,
    costPerUnit: '₹890',
    status: 'Healthy',
  },
  {
    sku: 'SKU-HOD-007',
    title: 'Forest Green Oversized Zip Hoodie',
    supplier: 'Alpine Knits Co.',
    available: 11,
    reserved: 7,
    reorderLevel: 15,
    costPerUnit: '₹1,200',
    status: 'Low Stock',
  },
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState(INVENTORY_DATA);
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState(null);
  const [replenishSuccess, setReplenishSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReplenish = (item) => {
    setSelectedSku(item);
    setPoModalOpen(true);
  };

  const handleConfirmPO = (e) => {
    e.preventDefault();
    if (selectedSku) {
      setItems((prev) =>
        prev.map((i) =>
          i.sku === selectedSku.sku
            ? { ...i, available: i.available + 30, status: 'Healthy' }
            : i
        )
      );
      setReplenishSuccess(`Purchase Order dispatched for ${selectedSku.title} (+30 units).`);
      setTimeout(() => setReplenishSuccess(''), 4000);
    }
    setPoModalOpen(false);
  };

  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      render: (val) => <Badge variant="mono">{val}</Badge>,
    },
    {
      key: 'title',
      label: 'Garment Description',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--cf-text-main)' }}>{val}</span>,
    },
    {
      key: 'supplier',
      label: 'Supplier Vendor',
      render: (val) => <span style={{ color: 'var(--cf-text-muted)' }}>{val}</span>,
    },
    {
      key: 'available',
      label: 'Available Units',
      render: (val) => <Badge variant="neutral">{val} units</Badge>,
    },
    {
      key: 'reserved',
      label: 'Reserved for Orders',
      render: (val) => <Badge variant="mono">{val}</Badge>,
    },
    {
      key: 'reorderLevel',
      label: 'Reorder Trigger',
      render: (val) => <Badge variant="neutral">{val}</Badge>,
    },
    {
      key: 'status',
      label: 'Stock Status',
      render: (val) => (
        <Badge
          dot
          variant={
            val === 'Healthy'
              ? 'completed'
              : val === 'Low Stock'
              ? 'warning'
              : 'failed'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button size="sm" variant="outline" onClick={() => handleReplenish(row)}>
          Replenish
        </Button>
      ),
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Supplier & Inventory Console</h1>
          <p className="cf-bo-page-subtitle">
            Real-time garment warehouse stock, vendor purchase orders, and replenishment thresholds.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => {
            setSelectedSku(items[1]);
            setPoModalOpen(true);
          }}
        >
          Create Stock PO
        </Button>
      </div>

      {replenishSuccess && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--cf-radius-md)',
            backgroundColor: 'var(--cf-accent-success-tint)',
            border: '1px solid var(--cf-accent-success)',
            color: 'var(--cf-accent-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={16} />
          <span>{replenishSuccess}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Active SKUs"
          value="12"
          subtext="Across 4 premium suppliers"
          icon={Boxes}
        />
        <MetricCard
          title="Total Units on Hand"
          value="846"
          subtext="Warehoused in Central Hub"
          icon={TrendingUp}
        />
        <MetricCard
          title="Low Stock Alerts"
          value="2"
          subtext="Polo & French Linen"
          icon={AlertCircle}
          highlighted
        />
        <MetricCard
          title="Inventory Valuation"
          value="₹58,42,000"
          subtext="At landed wholesale cost"
          icon={Boxes}
        />
      </div>

      {/* Inventory Table with Interactive Pagination */}
      <Card>
        <Card.Header
          title="Warehouse Stock & Inward Pipeline"
          subtitle={`${items.length} total SKUs tracked`}
        />
        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={paginatedItems}
            keyField="sku"
            pagination={{
              currentPage,
              pageSize,
              totalItems: items.length,
              pageSizeOptions: [4, 8, 12],
              onPageChange: setCurrentPage,
              onPageSizeChange: (newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              },
            }}
          />
        </Card.Body>
      </Card>

      {/* Styled PO Modal using Reusable Input labels */}
      <Modal
        isOpen={poModalOpen}
        onClose={() => setPoModalOpen(false)}
        title="Create Inward Purchase Order"
        subtitle={selectedSku ? `Replenishing ${selectedSku.title} (${selectedSku.sku})` : 'New Vendor Restock'}
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="ghost" onClick={() => setPoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmPO}>
              Dispatch Purchase Order
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Supplier Mill"
            readOnly
            value={selectedSku?.supplier || 'Vanguard Mills Florence'}
          />
          <Input
            label="Units to Inward"
            type="number"
            defaultValue="30"
            placeholder="Enter batch quantity"
          />
          <div style={{ fontSize: '0.78rem', color: 'var(--cf-text-dim)', lineHeight: 1.5 }}>
            Automated EDI delivery notice will be sent to the textile warehouse. Stock ledger will update upon quality inspection.
          </div>
        </div>
      </Modal>
    </div>
  );
}
