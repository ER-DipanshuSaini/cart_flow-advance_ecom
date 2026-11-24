import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button, CartItem, OrderSummary, Card } from '../../components/ui';
import './StorePages.css';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cf-store-container cf-cart-page-wrap">
      <div className="cf-cart-page-header">
        <h1 className="cf-cart-page-title">Shopping Bag</h1>
        <p className="cf-cart-page-sub">
          {cartCount === 0 ? 'Your bag is empty' : `You have ${cartCount} item(s) in your bag`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="cf-cart-empty-card">
          <Card.Body style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <ShoppingBag size={56} style={{ color: 'var(--cf-text-dim)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Your shopping bag is empty</h3>
            <p style={{ color: 'var(--cf-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Explore our new season arrivals and add luxury staples to your order.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>
                Explore All Products
              </Button>
            </Link>
          </Card.Body>
        </Card>
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
              shipping={cartSubtotal > 150 ? 0 : 15.0}
              tax={cartSubtotal * 0.08}
              discount={0}
              onCheckout={() => navigate('/checkout')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
