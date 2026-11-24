import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Drawer, CartItem, Button, Badge } from '../components/ui';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--cf-text-muted)' }}>Estimated Subtotal:</span>
              <span style={{ color: 'var(--cf-accent-primary)', fontSize: '1.2rem', fontWeight: '700' }}>
                ${cartSubtotal.toFixed(2)}
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
