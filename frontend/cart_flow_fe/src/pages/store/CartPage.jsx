import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button, CartItem, OrderSummary } from '../../components/ui';
import './StorePages.css';

export default function CartPage() {
  const {
    cartItems,
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

  return (
    <div className="cf-store-container cf-cart-page-wrap">
      <div className="cf-cart-page-header">
        <span className="cf-section-pretitle">CartFlow Atelier</span>
        <h1 className="cf-cart-page-title">Shopping Cart</h1>
        <p className="cf-cart-page-sub">
          {cartCount === 0 ? 'Your cart is currently empty' : `You have ${cartCount} item(s) in your cart`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="cf-cart-empty-box">
          <div className="cf-cart-empty-icon-ring">
            <ShoppingBag size={28} />
          </div>
          <h2 className="cf-cart-empty-title">Your shopping cart is empty</h2>
          <p className="cf-cart-empty-desc">
            Explore our curated menswear capsules and add tailored essentials to your order.
          </p>
          <Link to="/shop" className="cf-cart-empty-cta">
            <Button variant="primary" size="lg" iconRight={ArrowRight}>
              Explore Collection
            </Button>
          </Link>

          <div className="cf-cart-empty-links">
            <span className="cf-cart-empty-links-label">Popular Categories:</span>
            <div className="cf-cart-empty-pills">
              <Link to="/shop?cat=Knitwear%20%26%20Sweaters" className="cf-cart-empty-pill">
                Knitwear &amp; Sweaters
              </Link>
              <Link to="/shop?cat=Formal%20%26%20Suiting" className="cf-cart-empty-pill">
                Formal &amp; Suiting
              </Link>
              <Link to="/shop?cat=Co-Ords" className="cf-cart-empty-pill">
                Co-Ords
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="cf-cart-layout-grid">
          {/* Items List */}
          <div className="cf-cart-items-column">
            <div className="cf-cart-items-stack">
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

            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/shop" className="cf-continue-shopping-link">
                <ArrowLeft size={15} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cf-cart-summary-column">
            <OrderSummary
              subtotal={cartSubtotal}
              shipping={cartSubtotal >= 1999 ? 0 : 99}
              tax={cartSubtotal * 0.05}
              discount={couponDiscount}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              onCheckout={() => navigate('/checkout')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
