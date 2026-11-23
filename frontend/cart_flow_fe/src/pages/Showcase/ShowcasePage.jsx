import React, { useState } from 'react';
import {
  Button,
  Badge,
  Tabs,
  Input,
  Select,
  Toggle,
  Textarea,
  Card,
  MetricCard,
  Table,
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
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Bell,
  Code2,
} from 'lucide-react';
import './ShowcasePage.css';

const SHOWCASE_TABS = [
  { id: 'buttons', label: 'Buttons & Badges', count: 9 },
  { id: 'forms', label: 'Forms & Inputs', count: 6 },
  { id: 'cards', label: 'Cards & Metrics', count: 5 },
  { id: 'tables', label: 'Data Tables', count: 1 },
  { id: 'feedback', label: 'Modals & Toasters', count: 2 },
  { id: 'ecommerce', label: 'Cart & Checkout', count: 2 },
];

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState('buttons');

  // Interactive Form States
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('us');
  const [toggleActive, setToggleActive] = useState(true);
  const [textareaValue, setTextareaValue] = useState('');

  // Interactive Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Interactive Toast State
  const [toasts, setToasts] = useState([]);

  // Interactive Cart State
  const [cartQuantity, setCartQuantity] = useState(2);

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

  // Demo Table Columns & Data (Atomic & Reusable)
  const tableColumns = [
    { label: 'Sr. No.', key: 'sr', width: '70px', cellClassName: 'cf-table-cell-muted' },
    { label: 'Process ID', key: 'id', width: '130px', cellClassName: 'cf-table-cell-mono' },
    { label: 'Product Name', key: 'product' },
    {
      label: 'Status',
      key: 'status',
      width: '160px',
      render: (status) => (
        <Badge
          variant={status === 'Completed' ? 'completed' : status === 'Quota exceeded' ? 'warning' : 'failed'}
          dot={true}
        >
          {status}
        </Badge>
      ),
    },
    { label: 'User ID', key: 'user', width: '120px', cellClassName: 'cf-table-cell-muted' },
    { label: 'Tokens', key: 'tokens', width: '100px' },
  ];

  const tableData = [
    { sr: 1, id: 'TRY-0067', product: 'Black Cable Knit Crop Sweater – Mock Neck', status: 'Quota exceeded', user: 'USR-0441', tokens: 0 },
    { sr: 2, id: 'TRY-0066', product: 'Sky Blue Cable Knit Crop Sweater – Crew Neck', status: 'Completed', user: 'USR-0441', tokens: '3,151' },
    { sr: 3, id: 'TRY-0065', product: "Men's Sky Blue & White Micro-Check Shirt", status: 'Quota exceeded', user: 'USR-0212', tokens: 0 },
    { sr: 4, id: 'TRY-0064', product: "Men's Sky Blue & White Micro-Check Shirt", status: 'Completed', user: 'USR-0212', tokens: '3,150' },
  ];

  return (
    <div className="cf-showcase-container">
      {/* Toast Notification Mount */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header Banner */}
      <header className="cf-showcase-header">
        <div className="cf-showcase-badge-row">
          <Badge variant="mono">• ATOMIC COMPONENT LIBRARY</Badge>
          <Badge variant="completed">DARK THEME PRIMITIVES</Badge>
        </div>
        <h1 className="cf-showcase-title">
          CartFlow <span>UI Kit</span>
        </h1>
        <p className="cf-showcase-desc">
          Pure, unstyled-data atomic components designed in Obsidian & Neon Green palette. Ready for custom layout placement.
        </p>

        {/* Navigation Tabs */}
        <div className="cf-showcase-tabs-wrapper">
          <Tabs tabs={SHOWCASE_TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="cf-showcase-body">
        {/* 1. Buttons & Badges */}
        {activeTab === 'buttons' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Button Variants & Sizes</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Button Styles" subtitle="All standardized action variants" />
                <Card.Body>
                  <div className="cf-flex-wrap">
                    <Button variant="primary" icon={Zap}>Primary Action</Button>
                    <Button variant="secondary">Secondary Dark</Button>
                    <Button variant="outline">Outline Border</Button>
                    <Button variant="danger">Danger / Delete</Button>
                    <Button variant="ghost">Ghost Plain</Button>
                    <Button variant="primary" loading={true}>Processing</Button>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Button Sizes" subtitle="sm, md, lg options" />
                <Card.Body>
                  <div className="cf-flex-wrap" style={{ alignItems: 'center' }}>
                    <Button size="sm" variant="outline">Small Button</Button>
                    <Button size="md" variant="primary">Medium (Default)</Button>
                    <Button size="lg" variant="secondary">Large Action</Button>
                  </div>
                </Card.Body>
              </Card>

              <Card style={{ gridColumn: '1 / -1' }}>
                <Card.Header title="Status Badges & Monospace Tags" subtitle="State indicators matching screenshot" />
                <Card.Body>
                  <div className="cf-flex-wrap" style={{ alignItems: 'center' }}>
                    <Badge variant="completed" dot={true}>Completed</Badge>
                    <Badge variant="warning" dot={true}>Quota exceeded</Badge>
                    <Badge variant="failed" dot={true}>Failed / Error</Badge>
                    <Badge variant="processing" dot={true}>Processing</Badge>
                    <Badge variant="neutral">Neutral Tag</Badge>
                    <Badge variant="mono">TRY-0067</Badge>
                    <Badge variant="mono">USR-0441</Badge>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </section>
        )}

        {/* 2. Form Inputs */}
        {activeTab === 'forms' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Form Input Controls</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Text & Password Inputs" subtitle="Icons, validation, and states" />
                <Card.Body>
                  <div className="cf-form-stack">
                    <Input
                      label="Search Query"
                      placeholder="Search processes, users..."
                      icon={Search}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      helperText="Type to test live reactive input"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required={true}
                      placeholder="admin@cartflow.com"
                      icon={Mail}
                    />
                    <Input
                      label="Secure Key"
                      type="password"
                      placeholder="••••••••••••"
                      icon={Lock}
                      error={inputValue.length > 0 && inputValue.length < 3 ? 'Query must be at least 3 chars' : undefined}
                    />
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Select, Textarea & Toggles" subtitle="Dropdown and switch controls" />
                <Card.Body>
                  <div className="cf-form-stack">
                    <Select
                      label="AI Model Service Region"
                      value={selectValue}
                      onChange={(e) => setSelectValue(e.target.value)}
                      options={[
                        { label: 'US East (FastAPI Cluster)', value: 'us' },
                        { label: 'EU Central (GPU Accelerated)', value: 'eu' },
                        { label: 'Asia Pacific (Edge Low-Latency)', value: 'ap' },
                      ]}
                    />

                    <Textarea
                      label="System Prompt / Configuration"
                      placeholder="Enter AI model inference parameters..."
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                    />

                    <div style={{ paddingTop: '0.5rem' }}>
                      <Toggle
                        label="Enable FastAPI Try-On Webhooks"
                        sublabel="Stream live frame generation outcomes to DRF backend"
                        checked={toggleActive}
                        onChange={setToggleActive}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </section>
        )}

        {/* 3. Cards & Metric Cards */}
        {activeTab === 'cards' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Cards & Metric Primitives</h3>
            <div className="cf-metrics-grid">
              <MetricCard
                title="Try-on processes"
                value="56"
                subtext="40 completed generations"
                icon={Layers}
                hasArrow={true}
                highlighted={true}
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

            <div style={{ marginTop: '1.5rem' }}>
              <Card hoverable={true}>
                <Card.Header
                  title="Generic Compound Card"
                  subtitle="Card.Header, Card.Body, and Card.Footer"
                  action={<Badge variant="completed">Active</Badge>}
                />
                <Card.Body>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    This card component is completely flexible. You can place tables, charts, forms, or media inside it. It supports hoverable lift transitions, highlighted bottom borders, and custom action slots.
                  </p>
                </Card.Body>
                <Card.Footer>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary">Save Configuration</Button>
                </Card.Footer>
              </Card>
            </div>
          </section>
        )}

        {/* 4. Data Tables */}
        {activeTab === 'tables' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Reusable Data Table Primitive</h3>
            <Card>
              <Card.Header
                title="Process & Inventory Table"
                subtitle="Configurable columns with custom cell rendering and status tags"
              />
              <Table
                columns={tableColumns}
                data={tableData}
                keyField="id"
                onRowClick={(row) => addToast('info', 'Row Clicked', `Selected process ${row.id}`)}
              />
            </Card>
          </section>
        )}

        {/* 5. Modals & Toasters */}
        {activeTab === 'feedback' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Interactive Modals & Message Toasters</h3>
            <div className="cf-component-grid">
              <Card>
                <Card.Header title="Message Toasters" subtitle="Click buttons to trigger floating notification toasts" />
                <Card.Body>
                  <div className="cf-flex-wrap">
                    <Button
                      variant="primary"
                      onClick={() => addToast('success', 'Generation Completed', 'Try-On process TRY-0068 finished in 14.2s')}
                    >
                      Trigger Success Toast
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => addToast('warning', 'Quota Limit Warning', 'Your workspace has consumed 85% of monthly tokens')}
                    >
                      Trigger Warning Toast
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => addToast('error', 'Inference Failure', 'FastAPI microservice returned 504 Gateway Timeout')}
                    >
                      Trigger Error Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addToast('info', 'System Update', 'Database schema migration complete')}
                    >
                      Trigger Info Toast
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Modal Dialog" subtitle="Backdrop blur, animated entrance & actions" />
                <Card.Body>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Click below to open the reusable Modal component. Supports keyboard ESC close, outside click dismiss, and custom footers.
                  </p>
                  <Button variant="secondary" icon={Layers} onClick={() => setIsModalOpen(true)}>
                    Open Demo Modal
                  </Button>
                </Card.Body>
              </Card>
            </div>

            {/* The Actual Modal Component */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Process Generation Details"
              subtitle="Inspect AI model inference payload and tokens"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
                  <Button variant="primary" onClick={() => {
                    setIsModalOpen(false);
                    addToast('success', 'Changes Saved', 'Process parameters updated');
                  }}>
                    Confirm & Apply
                  </Button>
                </>
              }
            >
              <div>
                <p style={{ marginBottom: '1rem' }}>
                  This modal is completely decoupled. You can pass any children (form fields, confirmation prompts, JSON inspectors).
                </p>
                <Input label="Process Name" placeholder="Overcoat Autumn Inference" />
              </div>
            </Modal>
          </section>
        )}

        {/* 6. Cart & Checkout */}
        {activeTab === 'ecommerce' && (
          <section className="cf-showcase-section">
            <h3 className="cf-section-heading">Cart & Checkout Primitives</h3>
            <div className="cf-component-grid">
              {/* Cart Item Primitive */}
              <Card>
                <Card.Header title="Cart Item Component" subtitle="Quantity controls, image thumbnail & price total" />
                <Card.Body>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                  </div>
                </Card.Body>
              </Card>

              {/* Order Summary Primitive */}
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
      </main>
    </div>
  );
}
