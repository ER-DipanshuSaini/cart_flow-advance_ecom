import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button, Input, Dropdown, Card, Modal } from '../../components/ui';
import './StorePages.css';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('us');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Order Success State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const shippingFee = cartSubtotal > 1999 ? 0 : 149.0;
  const taxFee = Math.round(cartSubtotal * 0.05);
  const totalAmount = cartSubtotal + shippingFee + taxFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
      setPlacedOrderId(orderId);
      setLoading(false);
      clearCart();
      setIsSuccessModalOpen(true);
    }, 1200);
  };

  return (
    <div className="cf-store-container cf-checkout-page-wrap">
      <div className="cf-checkout-header">
        <h1 className="cf-checkout-title">Secure Checkout</h1>
        <p className="cf-checkout-sub">Complete your shipping and payment information</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="cf-checkout-grid">
        {/* Left Column: Shipping & Payment */}
        <div className="cf-checkout-left-col">
          {/* Shipping Address Card */}
          <Card>
            <Card.Header title="1. Shipping Details" subtitle="Enter your delivery destination" />
            <Card.Body>
              <div className="cf-checkout-form-grid">
                <Input
                  label="First Name"
                  required
                  placeholder="e.g. Liam"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  required
                  placeholder="e.g. Sterling"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  label="Email Confirmation"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ gridColumn: '1 / -1' }}
                />
                <Input
                  label="Street Address"
                  required
                  placeholder="Apartment, suite, street..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ gridColumn: '1 / -1' }}
                />
                <Input
                  label="City"
                  required
                  placeholder="e.g. New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  label="Postal Code"
                  required
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <Dropdown
                  label="Country / Region"
                  value={country}
                  onChange={setCountry}
                  searchable={false}
                  options={[
                    { label: 'United States', value: 'us' },
                    { label: 'United Kingdom', value: 'uk' },
                    { label: 'Canada', value: 'ca' },
                    { label: 'India', value: 'in' },
                  ]}
                  style={{ gridColumn: '1 / -1' }}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Payment Method Card */}
          <div style={{ marginTop: '1.5rem' }}>
            <Card>
              <Card.Header title="2. Payment Method" subtitle="All transactions are 256-bit encrypted" />
              <Card.Body>
                <div className="cf-payment-options-row">
                  <button
                    type="button"
                    className={`cf-payment-choice-btn ${paymentMethod === 'card' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    className={`cf-payment-choice-btn ${paymentMethod === 'upi' ? 'is-selected' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <span>Instant UPI / Wire</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="cf-checkout-form-grid" style={{ marginTop: '1.25rem' }}>
                    <Input
                      label="Card Number"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ gridColumn: '1 / -1' }}
                    />
                    <Input
                      label="Expiration Date"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input
                      label="Security CVC"
                      required
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="cf-checkout-right-col">
          <Card>
            <Card.Header title="Order Overview" subtitle={`${cartItems.length} items selected`} />
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

              <div className="cf-summary-rows">
                <div className="cf-summary-row">
                  <span>Subtotal</span>
                  <span>₹{Math.round(cartSubtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="cf-summary-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: 'var(--cf-accent-primary)' }}>FREE</strong> : `₹${Math.round(shippingFee).toLocaleString('en-IN')}`}</span>
                </div>
                <div className="cf-summary-row">
                  <span>Estimated Tax (GST 5%)</span>
                  <span>₹{Math.round(taxFee).toLocaleString('en-IN')}</span>
                </div>
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
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Place Order • ₹{Math.round(totalAmount).toLocaleString('en-IN')}
              </Button>
            </Card.Body>
          </Card>
        </div>
      </form>

      {/* Order Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate('/')}
        title="Order Successfully Placed!"
        subtitle={`Order Reference ID: ${placedOrderId}`}
        footer={
          <Button variant="primary" onClick={() => navigate('/account')}>
            View in My Orders
          </Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <CheckCircle2 size={54} style={{ color: 'var(--cf-accent-primary)', margin: '0 auto 1rem' }} />
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--cf-text-main)' }}>Thank you for your purchase</h4>
          <p style={{ color: 'var(--cf-text-muted)', fontSize: '0.88rem' }}>
            A confirmation receipt and tracking code have been dispatched to <strong>{email || 'your email'}</strong>.
          </p>
        </div>
      </Modal>
    </div>
  );
}
