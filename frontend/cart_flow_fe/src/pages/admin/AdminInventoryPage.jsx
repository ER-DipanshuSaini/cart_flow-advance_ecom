import React, { useState } from 'react';
import { Boxes, AlertCircle, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Button, Input, Badge } from '../../components/ui';
import './AdminConsole.css';

const INVENTORY_DATA = [
  {
    sku: 'SKU-BLZ-001',
    title: 'Italian Double-Breasted Structured Blazer',
    supplier: 'Vanguard Mills Florence',
    available: 48,
    reserved: 12,
    reorderLevel: 20,
    costPerUnit: '$110.00',
    status: 'Healthy',
  },
  {
    sku: 'SKU-PLO-002',
    title: 'The Riviera Textured Knit Polo',
    supplier: 'Aegean Combed Cottons',
    available: 14,
    reserved: 8,
    reorderLevel: 25,
    costPerUnit: '$35.00',
    status: 'Low Stock',
  },
  {
    sku: 'SKU-TRS-003',
    title: 'Pleated Gurkha Trousers - Straight Cut',
    supplier: 'Napoli Tailored Mills',
    available: 62,
    reserved: 5,
    reorderLevel: 30,
    costPerUnit: '$48.00',
    status: 'Healthy',
  },
  {
    sku: 'SKU-SHR-004',
    title: 'Pure French Linen Relaxed Overshirt',
    supplier: 'Normandy Flax Weavers',
    available: 8,
    reserved: 14,
    reorderLevel: 20,
    costPerUnit: '$42.00',
    status: 'Critical Alert',
  },
  {
    sku: 'SKU-LFR-005',
    title: 'Minimalist Suede Tassel Loafers',
    supplier: 'Tuscany Leather Works',
    available: 34,
    reserved: 6,
    reorderLevel: 15,
    costPerUnit: '$85.00',
    status: 'Healthy',
  },
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState(INVENTORY_DATA);

  return (
    <div>
      <div className="cf-overview-header">
        <h1 className="cf-overview-title">Supplier & Inventory Console</h1>
        <p className="cf-overview-subtitle">
          Real-time garment warehouse stock, vendor purchase orders, and replenishment thresholds.
        </p>
      </div>

      {/* KPI Cards for Inventory */}
      <div className="cf-admin-kpi-grid">
        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Active SKUs</span>
            <Boxes size={18} className="cf-kpi-icon" />
          </div>
          <div className="cf-kpi-val">12</div>
          <div className="cf-kpi-subtext">Across 4 premium suppliers</div>
        </div>

        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Total Units on Hand</span>
            <TrendingUp size={18} className="cf-kpi-icon" />
          </div>
          <div className="cf-kpi-val">846</div>
          <div className="cf-kpi-subtext">Warehoused in Central Hub</div>
        </div>

        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Low Stock Alerts</span>
            <AlertCircle size={18} color="#facc15" />
          </div>
          <div className="cf-kpi-val" style={{ color: '#facc15' }}>2</div>
          <div className="cf-kpi-subtext">Polo & French Linen</div>
        </div>

        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Inventory Valuation</span>
            <Boxes size={18} className="cf-kpi-icon" />
          </div>
          <div className="cf-kpi-val">$58,420</div>
          <div className="cf-kpi-subtext">At landed wholesale cost</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="cf-admin-table-card">
        <div className="cf-table-card-header">
          <h3 className="cf-table-card-title">Warehouse Stock & Inward Pipeline</h3>
          <Button size="sm" variant="primary" icon={Plus} onClick={() => alert('Create Inward Purchase Order')}>
            Create Stock PO
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cf-admin-data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Garment Description</th>
                <th>Supplier Vendor</th>
                <th>Available Units</th>
                <th>Reserved for Orders</th>
                <th>Reorder Trigger</th>
                <th>Stock Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.sku}>
                  <td className="cf-td-mono">{it.sku}</td>
                  <td className="cf-td-product-title">{it.title}</td>
                  <td className="cf-td-mono">{it.supplier}</td>
                  <td style={{ fontWeight: 800, color: '#ffffff' }}>{it.available}</td>
                  <td className="cf-td-mono">{it.reserved}</td>
                  <td className="cf-td-mono">{it.reorderLevel}</td>
                  <td>
                    <span
                      className={`cf-status-chip ${
                        it.status === 'Healthy'
                          ? 'is-completed'
                          : it.status === 'Low Stock'
                          ? 'is-quota'
                          : 'is-failed'
                      }`}
                    >
                      • {it.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => alert(`Replenishment request dispatched to ${it.supplier}`)}
                      style={{
                        backgroundColor: '#161e2c',
                        border: '1px solid #243042',
                        color: '#93c5fd',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Replenish
                    </button>
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
