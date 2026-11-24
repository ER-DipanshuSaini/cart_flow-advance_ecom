import React, { useState } from 'react';
import { Truck, Check, MapPin, Printer, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button, Input, Badge, Card, MetricCard, Table, Modal } from '../../components/ui';
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
  const [shipments] = useState(DISPATCH_SHIPMENTS);
  const [activeLabelModal, setActiveLabelModal] = useState(null);
  const [manifestBanner, setManifestBanner] = useState('');

  const handlePrintDailyManifest = () => {
    setManifestBanner('Daily Courier Manifest compiled (3 Shipments). Ready for Air Cargo handover.');
    setTimeout(() => setManifestBanner(''), 5000);
  };

  const columns = [
    {
      key: 'waybill',
      label: 'Air Waybill (AWB)',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'orderId',
      label: 'Order Ref',
      cellClassName: 'cf-table-cell-mono',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'destination',
      label: 'Delivery Destination',
      render: (val) => <span style={{ fontSize: '0.78rem', color: 'var(--cf-text-main)' }}>{val}</span>,
    },
    {
      key: 'carrier',
      label: 'Assigned Carrier',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--cf-text-main)' }}>{val}</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--cf-text-dim)' }}>{row.service}</div>
        </div>
      ),
    },
    {
      key: 'weight',
      label: 'Parcel Weight',
      render: (val) => <span style={{ color: 'var(--cf-text-muted)' }}>{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge
          dot
          variant={
            val === 'In Transit'
              ? 'processing'
              : val === 'Ready for Pickup'
              ? 'warning'
              : 'completed'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'sla',
      label: 'Delivery SLA',
      render: (val) => <span className="cf-table-cell-mono">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          icon={Printer}
          onClick={() => setActiveLabelModal(row)}
        >
          Print Label
        </Button>
      ),
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Logistics & Courier Dispatch Hub</h1>
          <p className="cf-bo-page-subtitle">
            Real-time courier API sync, Air Waybills (AWBs), shipping manifests, and delivery SLAs.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          icon={Printer}
          onClick={handlePrintDailyManifest}
        >
          Print Daily Manifest
        </Button>
      </div>

      {manifestBanner && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--cf-radius-md)',
            backgroundColor: 'var(--cf-accent-primary-tint)',
            border: '1px solid var(--cf-accent-primary)',
            color: 'var(--cf-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={16} />
          <span>{manifestBanner}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Active Dispatches"
          value="28"
          subtext="18 BlueDart • 10 Delhivery"
          icon={Truck}
        />
        <MetricCard
          title="On-Time Delivery Rate"
          value="99.2%"
          subtext="Exceeding 98% SLA target"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Pending Pickup"
          value="4"
          subtext="Scheduled for 5:00 PM slot"
          icon={Truck}
          highlighted
        />
        <MetricCard
          title="Avg Transit Time"
          value="1.4 Days"
          subtext="Across metro pin codes"
          icon={Truck}
        />
      </div>

      {/* Manifest Table Card */}
      <Card>
        <Card.Header
          title="Live Dispatch Manifest"
          subtitle="Real-time multi-carrier tracking telemetry"
        />
        <Card.Body style={{ padding: 0 }}>
          <Table columns={columns} data={shipments} keyField="waybill" />
        </Card.Body>
      </Card>

      {/* Thermal Label Modal */}
      <Modal
        isOpen={Boolean(activeLabelModal)}
        onClose={() => setActiveLabelModal(null)}
        title="Thermal Shipping Label Preview"
        subtitle={activeLabelModal ? `AWB: ${activeLabelModal.waybill}` : ''}
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="ghost" onClick={() => setActiveLabelModal(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={Printer}
              onClick={() => {
                window.print();
                setActiveLabelModal(null);
              }}
            >
              Send to Zebra Thermal Printer
            </Button>
          </div>
        }
      >
        {activeLabelModal && (
          <div
            style={{
              padding: '1.25rem',
              border: '2px dashed var(--cf-border-hover)',
              borderRadius: 'var(--cf-radius-md)',
              backgroundColor: 'var(--cf-bg-elevated)',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--cf-border-subtle)', paddingBottom: '6px' }}>
              <strong>CARRIER: {activeLabelModal.carrier.toUpperCase()}</strong>
              <strong>{activeLabelModal.service}</strong>
            </div>
            <div>
              <strong>AIR WAYBILL:</strong> {activeLabelModal.waybill}
            </div>
            <div>
              <strong>ORDER REF:</strong> {activeLabelModal.orderId}
            </div>
            <div>
              <strong>DESTINATION:</strong> {activeLabelModal.destination}
            </div>
            <div>
              <strong>WEIGHT:</strong> {activeLabelModal.weight} | SLA: {activeLabelModal.sla}
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', letterSpacing: '4px', fontSize: '1.2rem' }}>
              ||| | |||| || |||||| | |||
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
