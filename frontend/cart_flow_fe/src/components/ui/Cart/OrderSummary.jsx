import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Tag, X } from 'lucide-react';
import Button from '../Button/Button';
import './Cart.css';

/**
 * Reusable Order Summary / Checkout Box Component
 */
export default function OrderSummary({
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  loading = false,
  className = '',
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const total = Math.max(0, subtotal + shipping + tax - discount);

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!onApplyCoupon) return;
    const res = onApplyCoupon(couponInput);
    if (!res.ok) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className={`cf-ui-order-summary ${className}`}>
      <h3 className="cf-summary-title">Order Summary</h3>

      <div className="cf-summary-rows">
        <div className="cf-summary-row">
          <span>Subtotal</span>
          <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
        </div>

        <div className="cf-summary-row">
          <span>Estimated Shipping</span>
          <span>{shipping === 0 ? <span className="cf-summary-free">FREE</span> : `₹${Math.round(shipping).toLocaleString('en-IN')}`}</span>
        </div>

        <div className="cf-summary-row">
          <span>Estimated Tax (GST 5%)</span>
          <span>₹{Math.round(tax).toLocaleString('en-IN')}</span>
        </div>

        {discount > 0 && (
          <div className="cf-summary-row is-discount">
            <span>Coupon Discount</span>
            <span>-₹{Math.round(discount).toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="cf-summary-divider" />

        {/* Apply Coupon Form */}
        {onApplyCoupon && (
          <div style={{ margin: '4px 0 6px' }}>
            {appliedCoupon ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
                  <Tag size={14} />
                  <span>{appliedCoupon.code} ({appliedCoupon.label})</span>
                </div>
                {onRemoveCoupon && (
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#059669',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError('');
                  }}
                  placeholder="Coupon code (e.g. CARTFLOW10)"
                  style={{
                    flex: 1,
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--cf-border-subtle)',
                    backgroundColor: 'var(--cf-bg-input)',
                    color: 'var(--cf-text-main)',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              </form>
            )}
            {couponError && (
              <div style={{ color: '#ef4444', fontSize: '0.73rem', marginTop: '5px' }}>
                {couponError}
              </div>
            )}
          </div>
        )}

        <div className="cf-summary-row is-total">
          <span>Total</span>
          <span className="cf-summary-total-val">₹{Math.round(total).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        loading={loading}
        iconRight={ArrowRight}
        onClick={onCheckout}
        className="cf-summary-checkout-btn"
      >
        Proceed to Checkout
      </Button>

      <div className="cf-summary-guarantee">
        <ShieldCheck size={14} className="cf-guarantee-icon" />
        <span>Encrypted 256-Bit SSL Checkout</span>
      </div>
    </div>
  );
}
