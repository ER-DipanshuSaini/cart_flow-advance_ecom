import React, { useState } from 'react';
import {
  Button,
  Badge,
  Tabs,
  ThemeToggle,
  Input,
  Select,
  Toggle,
  Textarea,
  Dropdown,
  DatePicker,
  Card,
  MetricCard,
  Table,
  Pagination,
  WaveLoader,
  OverlayLoader,
  Skeleton,
  Drawer,
  Modal,
  Toast,
  ToastContainer,
  CartItem,
  OrderSummary,
} from '../../components/ui';
import {
  Layers,
  Users,
  Cpu,
  Clock,
  Search,
  Lock,
  Mail,
  Zap,
  Globe,
  Sparkles,
  Server,
  Database,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import './ShowcasePage.css';

const SHOWCASE_TABS = [
  { id: 'loaders', label: 'Wave Loader', count: 1 },
  { id: 'forms', label: 'Forms, Dropdown & DatePicker', count: 6 },
  { id: 'tables', label: 'Paginated Tables', count: 1 },
  { id: 'buttons', label: 'Buttons & Badges', count: 8 },
  { id: 'cards', label: 'Cards & Metrics', count: 5 },
  { id: 'feedback', label: 'Modals, Toasters & Drawer', count: 3 },
  { id: 'ecommerce', label: 'Cart Drawer & Checkout', count: 3 },
];

const REGION_OPTIONS = [
  { label: 'FastAPI AI Cluster (US-East)', sublabel: 'Low latency GPU inference', value: 'us-east', icon: Server },
  { label: 'DRF Core Backend (EU-Central)', sublabel: 'PostgreSQL & Redis cache', value: 'eu-central', icon: Database },
  { label: 'Global Edge CDN (Singapore)', sublabel: 'Static asset delivery', value: 'sg-edge', icon: Globe },
  { label: 'Order Processing Pipeline', sublabel: 'High-throughput fulfillment queue', value: 'proc-ai', icon: Sparkles },
];

const FULL_PROCESS_DATA = [
  { sr: 1, id: 'ORD-0067', product: 'Black Cable Knit Crop Sweater – Mock Neck', status: 'Payment Pending', user: 'USR-0441', tokens: 0, time: '12:13 AM' },
  { sr: 2, id: 'ORD-0066', product: 'Sky Blue Cable Knit Crop Sweater – Crew Neck', status: 'Completed', user: 'USR-0441', tokens: '3,151', time: '12:11 AM' },
  { sr: 3, id: 'ORD-0065', product: "Men's Sky Blue & White Micro-Check Shirt", status: 'Payment Pending', user: 'USR-0212', tokens: 0, time: '10:18 PM' },
  { sr: 4, id: 'ORD-0064', product: "Men's Sky Blue & White Micro-Check Shirt", status: 'Completed', user: 'USR-0212', tokens: '3,150', time: '10:15 PM' },
  { sr: 5, id: 'ORD-0063', product: 'Forest Green Oversized Zip-Up Hoodie', status: 'Completed', user: 'USR-0176', tokens: '3,150', time: '10:43 AM' },
  { sr: 6, id: 'ORD-0062', product: 'Charcoal Minimalist Wool Overcoat', status: 'Completed', user: 'USR-0922', tokens: '3,200', time: '09:20 AM' },
  { sr: 7, id: 'ORD-0061', product: 'Relaxed Fit Tailored Pleated Trousers', status: 'Failed', user: 'USR-0811', tokens: 0, time: '08:45 AM' },
  { sr: 8, id: 'ORD-0060', product: 'Raw Indigo Selvedge Denim Jacket', status: 'Completed', user: 'USR-0554', tokens: '3,145', time: '07:12 AM' },
  { sr: 9, id: 'TRY-0059', product: 'Italian Leather Derby Brogues', status: 'Processing', user: 'USR-0310', tokens: '1,500', time: '06:50 AM' },
  { sr: 10, id: 'TRY-0058', product: 'Textured Waffle Knit Beanie', status: 'Completed', user: 'USR-0102', tokens: '2,900', time: '05:30 AM' },
  { sr: 11, id: 'TRY-0057', product: 'Cashmere Ribbed Turtleneck Sweater', status: 'Completed', user: 'USR-0441', tokens: '3,180', time: '04:15 AM' },
  { sr: 12, id: 'TRY-0056', product: 'Water-Resistant Technical Parka', status: 'Quota exceeded', user: 'USR-0789', tokens: 0, time: '03:00 AM' },
];

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState('loaders');

  // Form states
  const [selectedRegion, setSelectedRegion] = useState('us-east');
  const [selectedDate, setSelectedDate] = useState('2026-11-24');
  const [toggleActive, setToggleActive] = useState(true);

  // Overlay Loader State
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // Overlays / Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(1);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const paginatedRows = FULL_PROCESS_DATA.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns = [
    { label: 'Sr.', key: 'sr', width: '50px', cellClassName: 'cf-table-cell-muted' },
    { label: 'Process ID', key: 'id', width: '130px', cellClassName: 'cf-table-cell-mono' },
    { label: 'Product Name', key: 'product' },
    {
      label: 'Status',
      key: 'status',
      width: '160px',
      render: (status) => (
        <Badge
          variant={
            status === 'Completed'
              ? 'completed'
              : status === 'Quota exceeded'
                ? 'warning'
                : status === 'Processing'
                  ? 'processing'
                  : 'failed'
          }
          dot={true}
        >
          {status}
        </Badge>
      ),
    },
    { label: 'User ID', key: 'user', width: '120px', cellClassName: 'cf-table-cell-muted' },
    { label: 'Tokens', key: 'tokens', width: '100px' },
    { label: 'Time', key: 'time', width: '100px', cellClassName: 'cf-table-cell-muted' },
  ];

  return (
    <div className="cf-showcase-container">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header Banner with Live Theme Toggle */}
      <header className="cf-showcase-header">
        <div className="cf-showcase-top-bar">
          <div className="cf-showcase-badge-row">
            <Badge variant="mono">• ATOMIC COMPONENT LIBRARY</Badge>
            <Badge variant="completed">THEME-READY</Badge>
          </div>
          <ThemeToggle size="md" />
        </div>

        <h1 className="cf-showcase-title">
          CartFlow <span>UI Kit</span>
        </h1>
        <p className="cf-showcase-desc">
          Clean, decoupled component primitives in Dark & Light modes. Ready for custom placement across your application.
        </p>

        {/* Tab Navigation */}
        <div className="cf-showcase-tabs-wrapper">
          <Tabs tabs={SHOWCASE_TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="cf-showcase-body">
        {/* 1. Wave Loader */}
        {activeTab === 'loaders' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Modern Wave Equalizer Loader</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Wave Equalizer Indicator" subtitle="Clean cybernetic wave bars matching reference" />
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <WaveLoader />
                      <span style={{ fontSize: '0.85rem', color: 'var(--cf-text-muted)' }}>
                        Active Wave Equalizer (5 Animated Bars)
                      </span>
                    </div>

                    <div style={{ marginTop: '0.5rem' }}>
                      <Button
                        size="md"
                        variant="primary"
                        onClick={() => {
                          setIsSimulatingAI(true);
                          setTimeout(() => setIsSimulatingAI(false), 2500);
                        }}
                      >
                        {isSimulatingAI ? 'Simulating...' : 'Test Full Card Overlay (2.5s)'}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Shimmer Skeletons */}
              <Card>
                <Card.Header title="Placeholder Skeletons" subtitle="Smooth placeholder loading animations" />
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Skeleton.Circle size={44} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Skeleton width="45%" height="14px" />
                        <Skeleton width="80%" height="12px" />
                      </div>
                    </div>
                    <Skeleton height="18px" />
                    <Skeleton width="70%" height="14px" />
                  </div>
                </Card.Body>
              </Card>

              {/* Card with Overlay Loader Simulator */}
              <Card style={{ gridColumn: '1 / -1', position: 'relative' }}>
                <Card.Header
                  title="Card Loading State"
                  subtitle="Overlay loader with Wave Equalizer animation"
                />
                <Card.Body>
                  <p style={{ color: 'var(--cf-text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                    When users initiate an asynchronous order placement or inventory sync, this overlay loader blurs the container and presents the animated wave indicator.
                  </p>
                </Card.Body>

                {isSimulatingAI && (
                  <OverlayLoader
                    message="Processing Order Dispatch..."
                    subtext="Synchronizing courier API gateway"
                  />
                )}
              </Card>
            </div>
          </section>
        )}

        {/* 2. Forms, Rich Dropdown & DatePicker */}
        {activeTab === 'forms' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Form Controls, Searchable Dropdown & DatePicker</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Searchable Rich Dropdown" subtitle="Custom options with icons, subtext & search filter" />
                <Card.Body>
                  <Dropdown
                    label="Target Service Microservice"
                    options={REGION_OPTIONS}
                    value={selectedRegion}
                    onChange={setSelectedRegion}
                    searchable={true}
                    helperText="Custom searchable dropdown component"
                  />

                  <div style={{ marginTop: '1.5rem' }}>
                    <Input
                      label="API Gateway Endpoint"
                      placeholder="https://api.cartflow.internal/v1/"
                      icon={Globe}
                    />
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Standard Native DatePicker" subtitle="Reliable browser native calendar with custom look & feel" />
                <Card.Body>
                  <DatePicker
                    label="Process Generation Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    helperText="Click to open standard calendar picker (never clipped, fully responsive)"
                  />

                  <div style={{ marginTop: '1.5rem' }}>
                    <Toggle
                      label="Auto-archive logs older than selected date"
                      sublabel="Exports completed fulfillment sessions to cloud storage"
                      checked={toggleActive}
                      onChange={setToggleActive}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          </section>
        )}

        {/* 3. Paginated Tables */}
        {activeTab === 'tables' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Data Table with Interactive Pagination</h3>
            <Table
              columns={tableColumns}
              data={paginatedRows}
              keyField="id"
              onRowClick={(row) => addToast('info', 'Row Inspected', `Process ${row.id} - ${row.product}`)}
              pagination={{
                currentPage,
                pageSize,
                totalItems: FULL_PROCESS_DATA.length,
                pageSizeOptions: [3, 4, 6, 12],
                onPageChange: setCurrentPage,
                onPageSizeChange: (newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                },
              }}
            />
          </section>
        )}

        {/* 4. Buttons & Badges */}
        {activeTab === 'buttons' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Action Buttons & Status Badges</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Button Variants" subtitle="Adapts seamlessly to Dark & Light themes" />
                <Card.Body>
                  <div className="cf-flex-wrap">
                    <Button variant="primary" icon={Zap}>Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Status Badges" subtitle="Bullet dots and monospace identifiers" />
                <Card.Body>
                  <div className="cf-flex-wrap" style={{ alignItems: 'center' }}>
                    <Badge variant="completed" dot={true}>Completed</Badge>
                    <Badge variant="warning" dot={true}>Quota exceeded</Badge>
                    <Badge variant="failed" dot={true}>Failed</Badge>
                    <Badge variant="processing" dot={true}>Processing</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="mono">ORD-0067</Badge>
                    <Badge variant="mono">USR-0441</Badge>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </section>
        )}

        {/* 5. Cards & Metrics */}
        {activeTab === 'cards' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Metrics & Compound Cards</h3>
            <div className="cf-metrics-grid">
              <MetricCard
                title="Active Orders"
                value="56"
                subtext="40 dispatched packages"
                icon={Layers}
                hasArrow={true}
              />
              <MetricCard
                title="Customers"
                value="437"
                subtext="9 signed in / 428 guests"
                icon={Users}
              />
              <MetricCard
                title="AI tokens consumed"
                value="102,840"
                subtext="Across all recorded generations"
                icon={Cpu}
              />
              <MetricCard
                title="Average processing"
                value="17.53 s"
                subtext="Completed process step duration"
                icon={Clock}
              />
            </div>
          </section>
        )}

        {/* 6. Modals, Toasters & Right-Side Drawer */}
        {activeTab === 'feedback' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Feedback, Dialogs & Right-Side Drawer</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Toast Alerts" subtitle="Trigger live floating notifications" />
                <Card.Body>
                  <div className="cf-flex-wrap">
                    <Button
                      variant="primary"
                      onClick={() => addToast('success', 'Generation Completed', 'Process TRY-0068 finished in 14.2s')}
                    >
                      Trigger Success
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => addToast('warning', 'Quota Limit Warning', '85% of monthly tokens consumed')}
                    >
                      Trigger Warning
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => addToast('error', 'Microservice Error', 'FastAPI 504 Gateway Timeout')}
                    >
                      Trigger Error
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Modal & Drawer Triggers" subtitle="Center Dialog or Right-Side Slide-Over" />
                <Card.Body>
                  <div className="cf-flex-wrap">
                    <Button variant="secondary" icon={Layers} onClick={() => setIsModalOpen(true)}>
                      Open Centered Modal
                    </Button>
                    <Button variant="primary" icon={ShoppingBag} onClick={() => setIsDrawerOpen(true)}>
                      Open Right Sidebar Drawer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Modal Component */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Process Generation Details"
              subtitle="Inspect AI model inference payload and tokens"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsModalOpen(false);
                      addToast('success', 'Changes Saved', 'Process parameters updated');
                    }}
                  >
                    Confirm & Apply
                  </Button>
                </>
              }
            >
              <div>
                <p style={{ marginBottom: '1rem', color: 'var(--cf-text-muted)', fontSize: '0.85rem' }}>
                  Decoupled modal component accepting custom inputs and action footers.
                </p>
                <Input label="Process Tag" placeholder="e.g. Autumn Trench Fitting" />
              </div>
            </Modal>
          </section>
        )}

        {/* 7. Cart & Checkout */}
        {activeTab === 'ecommerce' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Cart Items, Order Summary & Right Cart Drawer</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header
                  title="Cart Item Component"
                  subtitle="Quantity controls, image thumbnail & price total"
                  action={
                    <Button
                      size="sm"
                      variant="primary"
                      icon={ShoppingBag}
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      Open Cart Drawer
                    </Button>
                  }
                />
                <Card.Body>
                  <CartItem
                    id="item-1"
                    title="Black Cable Knit Crop Sweater"
                    variant="Size: M • Color: Obsidian Black"
                    price={120.0}
                    quantity={cartQuantity}
                    imageUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
                    onQuantityChange={(_, qty) => setCartQuantity(qty)}
                    onRemove={() => addToast('warning', 'Item Removed', 'Product removed from cart')}
                  />
                </Card.Body>
              </Card>

              <OrderSummary
                subtotal={120.0 * cartQuantity}
                shipping={0}
                tax={14.5}
                discount={15.0}
                onCheckout={() => addToast('success', 'Checkout Initiated', 'Redirecting to payment gateway...')}
              />
            </div>
          </section>
        )}

        {/* The Right-Side Drawer Component (Tested Live) */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={
            <>
              <ShoppingBag size={18} />
              <span>Your Shopping Cart</span>
              <Badge variant="completed" size="sm">1</Badge>
            </>
          }
          subtitle="Review selected items before proceeding to checkout"
          footer={
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                <span style={{ color: 'var(--cf-text-muted)' }}>Subtotal:</span>
                <span style={{ color: 'var(--cf-accent-primary)', fontSize: '1.1rem', fontWeight: '700' }}>
                  ${(120.0 * cartQuantity).toFixed(2)}
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                onClick={() => {
                  setIsDrawerOpen(false);
                  addToast('success', 'Checkout Started', 'Proceeding to secure checkout...');
                }}
              >
                Proceed to Checkout
              </Button>
            </>
          }
        >
          <CartItem
            id="drawer-item-1"
            title="Black Cable Knit Crop Sweater"
            variant="Size: M • Color: Obsidian Black"
            price={120.0}
            quantity={cartQuantity}
            imageUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
            onQuantityChange={(_, qty) => setCartQuantity(qty)}
            onRemove={() => {
              setIsDrawerOpen(false);
              addToast('warning', 'Item Removed', 'Product removed from cart');
            }}
          />
        </Drawer>
      </main>
    </div>
  );
}
