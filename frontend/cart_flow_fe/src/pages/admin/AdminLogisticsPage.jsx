import React, { useState } from 'react';
import { Truck, Check, MapPin, Printer, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button, Input, Dropdown } from '../../components/ui';
import './AdminConsole.css';

const DISPATCH_SHIPMENTS = [
  {
    waybill: 'AWB-BLU-8847291039',
    orderId: 'CF-99418',
    destination: 'Worli Sea Face, Mumbai, MH - 400018',
    carrier: 'BlueDart Express',
    service: 'Air Express Priority',
    weight: '1.8 kg',
    status: 'In Transit',
    sla: 'Within 48 Hours',
  },
  {
    waybill: 'AWB-DEL-4019283711',
    orderId: 'CF-99417',
    destination: 'Banjara Hills, Hyderabad, TS - 500034',
    carrier: 'Delhivery Surface',
    service: 'Standard Surface',
    weight: '0.9 kg',
    status: 'Manifest Created',
    sla: 'Within 72 Hours',
  },
  {
    waybill: 'AWB-BLU-9920194820',
    orderId: 'CF-99416',
    destination: 'Golf Course Road, Gurugram, HR - 122002',
    carrier: 'BlueDart Express',
    service: 'Next Day Delivery',
    weight: '2.4 kg',
    status: 'Ready for Pickup',
    sla: 'Within 24 Hours',
  },
];

export default function AdminLogisticsPage() {
  const [shipments, setShipments] = useState(DISPATCH_SHIPMENTS);

  return (
    <div>
      <div className="cf-overview-header">
        <h1 className="cf-overview-title">Logistics & Courier Dispatch Hub</h1>
        <p className="cf-overview-subtitle">
          Real-time courier API sync, Air Waybills (AWBs), shipping manifests, and delivery SLAs.
        </p>
      </div>

      {/* KPI Cards for Logistics */}
      <div className="cf-admin-kpi-grid">
        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Active Dispatches</span>
            <Truck size={18} className="cf-kpi-icon" />
          </div>
          <div className="cf-kpi-val">28</div>
          <div className="cf-kpi-subtext">18 BlueDart • 10 Delhivery</div>
        </div>

        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">On-Time Delivery Rate</span>
            <ShieldCheck size={18} color="#22c55e" />
          </div>
          <div className="cf-kpi-val" style={{ color: '#4ade80' }}>99.2%</div>
          <div className="cf-kpi-subtext">Exceeding 98% SLA target</div>
        </div>

        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Pending Pickup</span>
            <Truck size={18} color="#facc15" />
          </div>
          <div className="cf-kpi-val" style={{ color: '#facc15' }}>4</div>
          <div className="cf-kpi-subtext">Scheduled for 5:00 PM slot</div>
        </div>

        <div className="cf-admin-kpi-card">
          <div className="cf-kpi-top">
            <span className="cf-kpi-label">Avg Transit Time</span>
            <Truck size={18} className="cf-kpi-icon" />
          </div>
          <div className="cf-kpi-val">1.4 Days</div>
          <div className="cf-kpi-subtext">Across metro pin codes</div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="cf-admin-table-card">
        <div className="cf-table-card-header">
          <h3 className="cf-table-card-title">Live Dispatch Manifest</h3>
          <Button size="sm" variant="outline" icon={Printer} onClick={() => alert('Printing Daily Manifest Summary')}>
            Print Daily Manifest
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cf-admin-data-table">
            <thead>
              <tr>
                <th>Air Waybill (AWB)</th>
                <th>Order Ref</th>
                <th>Delivery Destination</th>
                <th>Assigned Carrier</th>
                <th>Parcel Weight</th>
                <th>Status</th>
                <th>Delivery SLA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.waybill}>
                  <td className="cf-td-mono">{s.waybill}</td>
                  <td className="cf-td-mono">{s.orderId}</td>
                  <td style={{ color: '#ffffff', fontSize: '0.74rem' }}>{s.destination}</td>
                  <td className="cf-td-product-title">{s.carrier}</td>
                  <td className="cf-td-mono">{s.weight}</td>
                  <td>
                    <span
                      className={`cf-status-chip ${
                        s.status === 'In Transit'
                          ? 'is-processing'
                          : s.status === 'Ready for Pickup'
                          ? 'is-quota'
                          : 'is-completed'
                      }`}
                    >
                      • {s.status}
                    </span>
                  </td>
                  <td className="cf-td-mono">{s.sla}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => alert(`Printing thermal label for ${s.waybill}`)}
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
                      Print Label
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
