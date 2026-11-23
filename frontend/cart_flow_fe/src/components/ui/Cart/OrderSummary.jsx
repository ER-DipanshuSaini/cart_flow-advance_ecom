import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
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
  onCheckout,
  loading = false,
  className = '',
}) {
  const total = Math.max(0, subtotal + shipping + tax - discount);

  return (
    <div className={`cf-ui-order-summary ${className}`}>
      <h3 className="cf-summary-title">Order Summary</h3>

      <div className="cf-summary-rows">
        <div className="cf-summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="cf-summary-row">
          <span>Estimated Shipping</span>
          <span>{shipping === 0 ? <span className="cf-summary-free">FREE</span> : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="cf-summary-row">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="cf-summary-row is-discount">
            <span>Promo Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="cf-summary-divider" />

        <div className="cf-summary-row is-total">
          <span>Total</span>
          <span className="cf-summary-total-val">${total.toFixed(2)}</span>
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
