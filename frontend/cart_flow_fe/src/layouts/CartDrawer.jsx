import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Drawer, CartItem, Button, Badge } from '../components/ui';
import { ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';

export function CartDrawer() {

  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (!res.ok) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} />
          <span>Shopping Cart</span>
          {cartCount > 0 && <Badge variant="completed" size="sm">{cartCount}</Badge>}
        </div>
      }
      subtitle={cartCount === 0 ? 'Your bag is empty' : `${cartCount} items ready for checkout`}
      footer={
        cartCount > 0 && (
          <>
            {/* Apply Coupon Section */}
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--cf-border-subtle)' }}>
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
                    <span>{appliedCoupon.code} ({appliedCoupon.label}) applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
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
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
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

            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '4px', color: '#059669' }}>
                <span>Coupon Discount:</span>
                <span>-₹{Math.round(couponDiscount).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '10px' }}>
              <span style={{ color: 'var(--cf-text-muted)' }}>Estimated Subtotal:</span>
              <span style={{ color: 'var(--cf-accent-primary)', fontSize: '1.2rem', fontWeight: '700' }}>
                ₹{Math.round(finalTotal).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleViewCart}
              >
                View Full Cart
              </Button>
            </div>
          </>
        )
      }
    >
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--cf-text-muted)' }}>
          <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h4 style={{ color: 'var(--cf-text-main)', marginBottom: '6px' }}>Your Cart is Empty</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Discover our latest capsule collections and add your favorite pieces.</p>
          <Button variant="primary" onClick={() => { closeCart(); navigate('/shop'); }}>
            Explore Shop
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cartItems.map((item) => (
            <CartItem
              key={`${item.id}-${item.variant}`}
              id={item.id}
              title={item.title}
              variant={item.variant}
              price={item.price}
              quantity={item.quantity}
              imageUrl={item.imageUrl}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
      )}
    </Drawer>
  );
}
