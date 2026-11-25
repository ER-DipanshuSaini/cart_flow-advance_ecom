import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  MapPin,
  Truck,
  ArrowRight,
  Printer,
  ShoppingBag,
  Copy,
  Check
} from 'lucide-react';
import { Button, Card, Badge } from '../../components/ui';
import './StorePages.css';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = React.useState(false);

  const orderData = useMemo(() => {
    if (location.state && location.state.orderId) return location.state;
    try {
      const saved = sessionStorage.getItem('cf_last_order');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return null;
  }, [location.state]);

  const handleCopyOrderId = () => {
    if (!orderData?.orderId) return;
    navigator.clipboard?.writeText(orderData.orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  if (!orderData) {
    return (
      <div className="cf-store-container cf-cart-page-wrap">
        <div className="cf-cart-empty-box">
          <div className="cf-cart-empty-icon-ring">
            <ShoppingBag size={28} />
          </div>
          <h2 className="cf-cart-empty-title">No recent order found</h2>
          <p className="cf-cart-empty-desc">
            View your past orders in your account dashboard or continue browsing our collection.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/account?tab=orders">
              <Button variant="secondary" size="md">View My Orders</Button>
            </Link>
            <Link to="/shop">
              <Button variant="primary" size="md" iconRight={ArrowRight}>Explore Shop</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    orderId,
    items = [],
    subtotal = 0,
    shippingFee = 0,
    taxFee = 0,
    couponDiscount = 0,
    totalAmount = 0,
    paymentMethod,
    gatewayResponse = {},
    deliveryAddress = {},
    estimatedDeliveryDate,
    createdAt,
  } = orderData;

  const status = gatewayResponse.status || 'SUCCESS'; // 'SUCCESS' | 'PENDING' | 'FAILED'

  const statusConfig = {
    SUCCESS: {
      icon: CheckCircle2,
      toneClass: 'is-success',
      badgeVariant: 'completed',
      badgeText: paymentMethod === 'cod' ? 'COD CONFIRMED' : 'PAYMENT SUCCESSFUL',
      heading: 'Order Confirmed!',
      subtext: `Thank you for shopping with CartFlow. Confirmation has been sent to ${deliveryAddress.email || 'your email'}.`,
    },
    PENDING: {
      icon: Clock,
      toneClass: 'is-pending',
      badgeVariant: 'pending',
      badgeText: 'PAYMENT PENDING',
      heading: 'Payment Processing',
      subtext: 'We are awaiting final confirmation from your bank/gateway. Your order will update shortly.',
    },
    FAILED: {
      icon: XCircle,
      toneClass: 'is-failed',
      badgeVariant: 'danger',
      badgeText: 'PAYMENT FAILED',
      heading: 'Payment Could Not Be Completed',
      subtext: gatewayResponse.message || 'The payment gateway declined the transaction. No amount was deducted.',
    },
  }[status] || {};

  const StatusIcon = statusConfig.icon || CheckCircle2;

  return (
    <div className="cf-store-container cf-order-confirm-wrap">
      {/* Status Hero Banner */}
      <div className={`cf-confirm-hero-card ${statusConfig.toneClass}`}>
        <div className="cf-confirm-hero-left">
          <div className={`cf-confirm-status-icon ${statusConfig.toneClass}`}>
            <StatusIcon size={30} />
          </div>
          <div>
            <div className="cf-confirm-badge-row">
              <Badge variant={statusConfig.badgeVariant} size="sm">
                {statusConfig.badgeText}
              </Badge>
              <span className="cf-confirm-timestamp">{createdAt}</span>
            </div>
            <h1 className="cf-confirm-heading">{statusConfig.heading}</h1>
            <p className="cf-confirm-subtext">{statusConfig.subtext}</p>
          </div>
        </div>

        <div className="cf-confirm-order-id-box">
          <span className="cf-confirm-id-label">Order Reference</span>
          <div className="cf-confirm-id-val-row">
            <strong>{orderId}</strong>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="cf-confirm-copy-btn"
              title="Copy Order ID"
            >
              {copiedId ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="cf-confirm-grid">
        {/* Left: Payment Gateway Response & Delivery Destination */}
        <div className="cf-confirm-left-col">
          <Card>
            <Card.Header
              title="Payment Gateway Response"
              subtitle="Transaction verification details"
            />
            <Card.Body>
              <div className="cf-confirm-kv-list">
                <div className="cf-confirm-kv-row">
                  <span>Gateway</span>
                  <strong>{gatewayResponse.gateway || 'Cash on Delivery'}</strong>
                </div>
                <div className="cf-confirm-kv-row">
                  <span>Transaction ID</span>
                  <strong className="cf-mono-text">{gatewayResponse.transactionId || 'COD-DOORSTEP'}</strong>
                </div>
                <div className="cf-confirm-kv-row">
                  <span>Payment Mode</span>
                  <strong>{gatewayResponse.method || 'Cash / UPI at Doorstep'}</strong>
                </div>
                <div className="cf-confirm-kv-row">
                  <span>Payment Status</span>
                  <strong className={`cf-confirm-status-text ${statusConfig.toneClass}`}>
                    {gatewayResponse.paymentState || (paymentMethod === 'cod' ? 'Pay on Delivery' : 'Captured')}
                  </strong>
                </div>
                <div className="cf-confirm-kv-row">
                  <span>Currency</span>
                  <strong>INR (₹)</strong>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Delivery Destination" subtitle="Shipping address & estimated arrival" />
            <Card.Body>
              <div className="cf-confirm-address-block">
                <div className="cf-confirm-addr-name">
                  <MapPin size={15} className="cf-confirm-addr-icon" />
                  <strong>{deliveryAddress.name}</strong>
                  {deliveryAddress.phone && (
                    <span className="cf-confirm-addr-phone">• {deliveryAddress.phone}</span>
                  )}
                </div>
                <p className="cf-confirm-addr-lines">
                  {deliveryAddress.address}
                  {deliveryAddress.landmark ? `, ${deliveryAddress.landmark}` : ''}
                  <br />
                  {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postalCode}
                  {deliveryAddress.country ? `, ${deliveryAddress.country}` : ''}
                </p>
              </div>

              {estimatedDeliveryDate && (
                <div className="cf-delivery-eta-banner" style={{ marginTop: '1rem' }}>
                  <Truck size={16} />
                  <span>
                    Estimated Delivery by <strong>{estimatedDeliveryDate}</strong>
                  </span>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Right: Ordered Items, Price Breakdown & Actions */}
        <div className="cf-confirm-right-col">
          <Card>
            <Card.Header
              title="Order Summary"
              subtitle={`${items.length} item(s) in this order`}
            />
            <Card.Body>
              <div className="cf-checkout-items-preview">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="cf-checkout-item-row">
                    <img src={item.imageUrl} alt={item.title} className="cf-chk-thumb" />
                    <div className="cf-chk-info">
                      <span className="cf-chk-title">{item.title}</span>
                      <span className="cf-chk-sub">
                        {item.variant} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="cf-chk-price">
                      ₹{Math.round(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="cf-pdp-divider" />

              <div className="cf-summary-rows">
                <div className="cf-summary-row">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="cf-summary-row">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong style={{ color: 'var(--cf-accent-primary)' }}>FREE</strong>
                    ) : (
                      `₹${Math.round(shippingFee).toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="cf-summary-row">
                  <span>Estimated Tax (GST 5%)</span>
                  <span>₹{Math.round(taxFee).toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="cf-summary-row is-discount">
                    <span>Coupon Discount</span>
                    <span>-₹{Math.round(couponDiscount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="cf-summary-divider" />
                <div className="cf-summary-row is-total">
                  <span>{paymentMethod === 'cod' ? 'Total Payable at COD' : 'Total Paid'}</span>
                  <span className="cf-summary-total-val">
                    ₹{Math.round(totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="cf-confirm-actions-row">
                {status === 'FAILED' ? (
                  <Button variant="primary" size="lg" onClick={() => navigate('/checkout')}>
                    Retry Payment
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" onClick={() => navigate('/account?tab=orders')}>
                    Track in My Orders
                  </Button>
                )}
                <Button variant="outline" size="lg" icon={Printer} onClick={() => window.print()}>
                  Print Receipt
                </Button>
                <Link to="/shop" className="cf-confirm-continue-link">
                  Continue Shopping <ArrowRight size={14} />
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
