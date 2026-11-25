import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  Wallet,
  ArrowRight,
  MapPin,
  Tag,
  X,
  ShoppingBag,
  Truck,
  Plus,
  Info,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Select, Card, Modal, ToastContainer } from '../../components/ui';
import './StorePages.css';

const INITIAL_SAVED_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Primary Residence',
    name: 'Vikramaditya Roy',
    phone: '+91 98765 43210',
    address: 'Suite 402, Imperial Heights, Worli',
    landmark: 'Near Sea Face Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400018',
    country: 'India',
  },
  {
    id: 'addr-2',
    label: 'Office Studio',
    name: 'Vikramaditya Roy',
    phone: '+91 98765 43210',
    address: 'Level 14, One BKC, Bandra East',
    landmark: 'Opp. MCA Club',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'India',
  },
];

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Telangana',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Madhya Pradesh',
  'Other',
];

export default function CheckoutPage() {
  const {
    cartItems,
    cartSubtotal,
    clearCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState(() => {
    if (!customer) return [];
    try {
      const saved = localStorage.getItem('cf_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return INITIAL_SAVED_ADDRESSES;
  });

  useEffect(() => {
    if (!customer) return;
    try {
      localStorage.setItem('cf_saved_addresses', JSON.stringify(savedAddresses));
    } catch {
      // ignore storage errors
    }
  }, [savedAddresses, customer]);

  // Selected address ID or 'new'
  const [selectedAddressId, setSelectedAddressId] = useState(() =>
    customer && savedAddresses.length > 0 ? savedAddresses[0].id : 'new'
  );

  // Standard New Address Form State
  const [fullName, setFullName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Payment Method State ('cod' | 'razorpay' | 'cashfree')
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Coupon Input
  const [couponInput, setCouponInput] = useState('');

  // Toasts & Order Success
  const [toasts, setToasts] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  const shippingFee = cartSubtotal >= 1999 ? 0 : 99;
  const taxFee = Math.round(cartSubtotal * 0.05);
  const totalAmount = Math.max(0, cartSubtotal + shippingFee + taxFee - couponDiscount);

  // 7-Day Estimated Delivery Date
  const estimatedDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const activeSavedAddress = savedAddresses.find((a) => a.id === selectedAddressId);
  const hasValidDeliveryDestination =
    Boolean(activeSavedAddress) ||
    (selectedAddressId === 'new' && city.trim().length > 0 && postalCode.trim().length === 6);

  const isNewAddressFormComplete = Boolean(
    fullName.trim() &&
    phone.replace(/\D/g, '').length >= 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    addressLine.trim() &&
    city.trim() &&
    stateName.trim() &&
    postalCode.trim().length === 6
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (!res.ok) {
      addToast('error', 'Invalid Coupon', res.message);
    } else {
      addToast('success', 'Coupon Applied', `${res.coupon.code} (${res.coupon.label}) applied.`);
      setCouponInput('');
    }
  };

  const validateNewAddressFields = () => {
    if (!fullName.trim()) {
      addToast('error', 'Full Name Required', 'Please enter recipient full name.');
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      addToast('error', 'Phone Required', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    if (!addressLine.trim() || !city.trim() || !stateName.trim() || postalCode.trim().length < 6) {
      addToast('error', 'Address Incomplete', 'Please fill address, city, state, and 6-digit pin code.');
      return false;
    }
    return true;
  };

  const handleSaveNewAddress = () => {
    if (!validateNewAddressFields()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: 'Saved Address',
      name: fullName.trim(),
      phone: phone.trim(),
      address: addressLine.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: stateName.trim(),
      postalCode: postalCode.trim(),
      country,
    };

    setSavedAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id);
    setAddressLine('');
    setLandmark('');
    setCity('');
    setPostalCode('');
    addToast('success', 'Address Saved', 'New delivery address added and selected.');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (selectedAddressId === 'new' && !validateNewAddressFields()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const orderId = 'CF-' + Math.floor(10000 + Math.random() * 90000);
      setPlacedOrderId(orderId);
      setLoading(false);
      clearCart();
      setIsSuccessModalOpen(true);
    }, 850);
  };

  if (cartItems.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="cf-store-container cf-cart-page-wrap">
        <div className="cf-cart-empty-box">
          <div className="cf-cart-empty-icon-ring">
            <ShoppingBag size={28} />
          </div>
          <h2 className="cf-cart-empty-title">Your cart is empty</h2>
          <p className="cf-cart-empty-desc">
            Add garments to your cart before proceeding to checkout.
          </p>
          <Link to="/shop" className="cf-cart-empty-cta">
            <Button variant="primary" size="lg" iconRight={ArrowRight}>
              Explore Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const receiptEmail = email || customer?.email || 'your email';

  return (
    <div className="cf-store-container cf-checkout-page-wrap">
      <ToastContainer
        toasts={toasts}
        onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <div className="cf-shop-breadcrumb">
        <Link to="/">Home</Link>
        <span className="cf-bc-separator">/</span>
        <Link to="/cart">Cart</Link>
        <span className="cf-bc-separator">/</span>
        <span className="cf-bc-current">Checkout</span>
      </div>

      <div className="cf-checkout-header">
        <h1 className="cf-checkout-title">Secure Checkout</h1>
        <p className="cf-checkout-sub">Complete your delivery address and payment method</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="cf-checkout-grid" noValidate>
        {/* Left Column: Delivery Address & Vertical Payment Stack */}
        <div className="cf-checkout-left-col">
          {/* 1. Delivery Address Card */}
          <Card>
            <Card.Header title="1. Delivery Address" subtitle="Choose a saved address or add a new destination" />
            <Card.Body>
              {savedAddresses.length === 0 ? (
                <div className="cf-no-address-notice">
                  <Info size={16} />
                  <span>No saved delivery addresses found. Please enter your delivery details below.</span>
                </div>
              ) : (
                <>
                  {/* Scrollable Saved Addresses List */}
                  <div className="cf-saved-addr-scroll-list">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        className={`cf-saved-addr-card ${selectedAddressId === addr.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div className="cf-saved-addr-top">
                          <span className="cf-saved-addr-tag">
                            <MapPin size={12} /> {addr.label}
                          </span>
                          {selectedAddressId === addr.id && (
                            <span className="cf-saved-addr-active">Selected</span>
                          )}
                        </div>
                        <div className="cf-saved-addr-name">
                          {addr.name} • <span>{addr.phone}</span>
                        </div>
                        <div className="cf-saved-addr-line">
                          {addr.address}
                          {addr.landmark ? `, ${addr.landmark}` : ''}, {addr.city}, {addr.state} - {addr.postalCode}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Fixed "Add New Address" Bar inside Card */}
                  <button
                    type="button"
                    className={`cf-add-new-addr-fixed-btn ${selectedAddressId === 'new' ? 'is-selected' : ''}`}
                    onClick={() => setSelectedAddressId('new')}
                  >
                    <Plus size={15} />
                    <span>Add New Address</span>
                  </button>
                </>
              )}

              {/* New Address Form */}
              {selectedAddressId === 'new' && (
                <div className="cf-checkout-form-grid" style={{ marginTop: '1.15rem' }}>
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Mobile Number"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <Input
                    label="House / Flat No., Building & Street"
                    required
                    placeholder="Flat 402, Imperial Heights, MG Road..."
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <Input
                    label="Landmark (Optional)"
                    placeholder="Near Metro Station / Park"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <Input
                    label="City"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Select
                    label="State"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    options={INDIAN_STATES.map((st) => ({ label: st, value: st }))}
                  />
                  <Input
                    label="Pin Code"
                    required
                    placeholder="400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <Input
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled
                  />

                  <div className="cf-ui-form-group" style={{ alignSelf: 'end' }}>
                    <Button
                      type="button"
                      variant={isNewAddressFormComplete ? 'primary' : 'secondary'}
                      icon={Check}
                      onClick={handleSaveNewAddress}
                      style={{ width: '100%', height: '39px' }}
                    >
                      Save Address
                    </Button>
                  </div>
                </div>
              )}

              {/* 7-Day Estimated Delivery Date Strip */}
              {hasValidDeliveryDestination && (
                <div className="cf-delivery-eta-banner">
                  <Truck size={16} />
                  <span>
                    Estimated Delivery by <strong>{estimatedDeliveryDate}</strong> (Standard 7-Day Dispatch)
                  </span>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* 2. Payment Method Card (Stacked Vertically: COD, Razorpay, Cashfree) */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card>
              <Card.Header title="2. Payment Method" subtitle="Select your preferred payment mode" />
              <Card.Body>
                <div className="cf-payment-vertical-list">
                  {/* COD */}
                  <button
                    type="button"
                    className={`cf-payment-vertical-card ${paymentMethod === 'cod' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="cf-payment-card-left">
                      <span className={`cf-payment-radio ${paymentMethod === 'cod' ? 'is-checked' : ''}`} />
                      <Banknote size={18} className="cf-payment-icon" />
                      <div className="cf-payment-text-col">
                        <div className="cf-payment-title-line">
                          <strong>Cash on Delivery (COD)</strong>
                          <span className="cf-payment-methods-hint">(Cash / UPI at Doorstep)</span>
                        </div>
                        <span className="cf-payment-cod-amount">
                          Total Pay at COD: <strong>₹{Math.round(totalAmount).toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Razorpay */}
                  <button
                    type="button"
                    className={`cf-payment-vertical-card ${paymentMethod === 'razorpay' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    <div className="cf-payment-card-left">
                      <span className={`cf-payment-radio ${paymentMethod === 'razorpay' ? 'is-checked' : ''}`} />
                      <CreditCard size={18} className="cf-payment-icon" />
                      <div className="cf-payment-text-col">
                        <div className="cf-payment-title-line">
                          <strong>Razorpay</strong>
                          <span className="cf-payment-methods-hint">(UPI, Credit/Debit Cards, NetBanking, Wallets)</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Cashfree */}
                  <button
                    type="button"
                    className={`cf-payment-vertical-card ${paymentMethod === 'cashfree' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('cashfree')}
                  >
                    <div className="cf-payment-card-left">
                      <span className={`cf-payment-radio ${paymentMethod === 'cashfree' ? 'is-checked' : ''}`} />
                      <Wallet size={18} className="cf-payment-icon" />
                      <div className="cf-payment-text-col">
                        <div className="cf-payment-title-line">
                          <strong>Cashfree</strong>
                          <span className="cf-payment-methods-hint">(UPI, Cards, NetBanking, Pay Later)</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Right Column: Sticky Order Overview */}
        <div className="cf-checkout-right-col">
          <Card>
            <Card.Header title="Order Overview" subtitle={`${cartItems.length} item(s) in your order`} />
            <Card.Body>
              <div className="cf-checkout-items-preview">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="cf-checkout-item-row">
                    <img src={item.imageUrl} alt={item.title} className="cf-chk-thumb" />
                    <div className="cf-chk-info">
                      <span className="cf-chk-title">{item.title}</span>
                      <span className="cf-chk-sub">{item.variant} • Qty: {item.quantity}</span>
                    </div>
                    <span className="cf-chk-price">₹{Math.round(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="cf-pdp-divider" />

              {/* Apply Coupon */}
              <div style={{ marginBottom: '0.85rem' }}>
                {appliedCoupon ? (
                  <div className="cf-checkout-coupon-pill">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={14} /> {appliedCoupon.code} ({appliedCoupon.label})
                    </span>
                    <button type="button" onClick={removeCoupon} title="Remove coupon">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code (e.g. CARTFLOW10)"
                      className="cf-checkout-coupon-input"
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <div className="cf-summary-rows">
                <div className="cf-summary-row">
                  <span>Subtotal</span>
                  <span>₹{Math.round(cartSubtotal).toLocaleString('en-IN')}</span>
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
                  <span>Total Amount</span>
                  <span className="cf-summary-total-val">₹{Math.round(totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                iconRight={ArrowRight}
                style={{ width: '100%', marginTop: '1.25rem' }}
              >
                {paymentMethod === 'cod'
                  ? `Place COD Order • ₹${Math.round(totalAmount).toLocaleString('en-IN')}`
                  : `Pay ₹${Math.round(totalAmount).toLocaleString('en-IN')} via ${paymentMethod === 'razorpay' ? 'Razorpay' : 'Cashfree'}`}
              </Button>

              <div className="cf-summary-guarantee" style={{ marginTop: '1rem' }}>
                <ShieldCheck size={14} className="cf-guarantee-icon" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      </form>

      {/* Order Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate('/')}
        eyebrow="ORDER CONFIRMED"
        title="Order Successfully Placed!"
        subtitle={`Order Reference ID: ${placedOrderId}`}
        footer={
          <>
            <Button variant="outline" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
            <Button variant="primary" onClick={() => navigate('/account?tab=orders')}>
              Track in My Orders
            </Button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
          <CheckCircle2 size={52} style={{ color: 'var(--cf-accent-primary)', margin: '0 auto 1rem' }} />
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--cf-text-main)' }}>Thank you for shopping with CartFlow</h4>
          <p style={{ color: 'var(--cf-text-muted)', fontSize: '0.86rem' }}>
            Confirmation and tracking updates have been sent to <strong>{receiptEmail}</strong>.
            <br />
            Estimated Delivery: <strong>{estimatedDeliveryDate}</strong>
          </p>
        </div>
      </Modal>
    </div>
  );
}
