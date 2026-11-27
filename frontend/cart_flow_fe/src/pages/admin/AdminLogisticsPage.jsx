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
  {
    waybill: 'AWB-DEL-5510294811',
    orderId: 'CF-99415',
    destination: 'Indiranagar 100ft Rd, Bengaluru, KA - 560038',
    carrier: 'Delhivery Express',
    service: 'Express Air Cargo',
    weight: '1.2 kg',
    status: 'Delivered',
    sla: 'Completed (Next Day)',
  },
  {
    waybill: 'AWB-BLU-1192847291',
    orderId: 'CF-99414',
    destination: 'Vasant Vihar, New Delhi, DL - 110057',
    carrier: 'BlueDart Express',
    service: 'Priority Air',
    weight: '3.1 kg',
    status: 'Delivered',
    sla: 'Completed (Same Day)',
  },
  {
    waybill: 'AWB-DEL-9847291823',
    orderId: 'CF-99413',
    destination: 'Koregaon Park, Pune, MH - 411001',
    carrier: 'Delhivery Surface',
    service: 'Standard Surface',
    weight: '1.5 kg',
    status: 'Manifest Created',
    sla: 'Within 48 Hours',
  },
];

export default function AdminLogisticsPage() {
  const [shipments] = useState(DISPATCH_SHIPMENTS);
  const [activeLabelModal, setActiveLabelModal] = useState(null);
  const [manifestBanner, setManifestBanner] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const paginatedShipments = shipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrintDailyManifest = () => {
    setManifestBanner('Daily Courier Manifest compiled (6 Shipments). Ready for Air Cargo handover.');
    setTimeout(() => setManifestBanner(''), 5000);
  };

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
      key: 'waybill',
      label: 'Air Waybill (AWB)',
      render: (val) => <Badge variant="mono">{val}</Badge>,
    },
    {
      key: 'orderId',
      label: 'Order Ref',
      render: (val) => <Badge variant="neutral">{val}</Badge>,
    },
    {
      key: 'destination',
      label: 'Delivery Destination',
      render: (val) => <span style={{ fontSize: '0.8rem', color: 'var(--cf-text-main)' }}>{val}</span>,
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
      render: (val) => <Badge variant="neutral">{val}</Badge>,
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
              : val === 'Delivered'
              ? 'completed'
              : 'neutral'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'sla',
      label: 'Delivery SLA',
      render: (val) => <Badge variant="mono">{val}</Badge>,
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
          variant="primary"
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
        />
        <MetricCard
          title="Avg Transit Time"
          value="1.4 Days"
          subtext="Across metro pin codes"
          icon={Truck}
        />
      </div>

      {/* Manifest Table Card with Interactive Pagination */}
      <Card>
        <Card.Header
          title="Live Dispatch Manifest"
          subtitle={`${shipments.length} total carrier manifests generated`}
        />
        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={paginatedShipments}
            keyField="waybill"
            pagination={{
              currentPage,
              pageSize,
              totalItems: shipments.length,
              pageSizeOptions: [3, 6, 12],
              onPageChange: setCurrentPage,
              onPageSizeChange: (newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              },
            }}
          />
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
              fontFamily: 'var(--cf-font-mono)',
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
