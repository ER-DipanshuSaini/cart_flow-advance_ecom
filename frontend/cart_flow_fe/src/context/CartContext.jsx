import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'The Minimalist Wool Overcoat',
          variant: 'Size: L • Charcoal',
          price: 245.0,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        },
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cf_cart', JSON.stringify(cartItems));
    } catch {
      // storage disabled
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('cf_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('cf_coupon');
      }
    } catch {
      // storage disabled
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, variant = 'Standard') => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.variant === variant);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          variant: variant || product.category,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
        },
      ];
    });
    setIsCartOpen(true); // Auto-open right slide drawer
  };

  const removeFromCart = (id, variant) => {
    setCartItems((prev) =>
      prev.filter((item) =>
        variant !== undefined ? !(item.id === id && item.variant === variant) : item.id !== id
      )
    );
  };

  const updateQuantity = (id, quantity, variant) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && (variant === undefined || item.variant === variant)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (rawCode) => {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) return { ok: false, message: 'Please enter a coupon code.' };

    const COUPONS = {
      CARTFLOW10: { code: 'CARTFLOW10', type: 'percent', value: 10, label: '10% Off' },
      VIP20: { code: 'VIP20', type: 'percent', value: 20, label: '20% VIP Off' },
      WELCOME500: { code: 'WELCOME500', type: 'flat', value: 500, label: '₹500 Off' },
    };

    const found = COUPONS[code];
    if (!found) {
      return { ok: false, message: 'Invalid coupon. Try CARTFLOW10, VIP20, or WELCOME500.' };
    }
    setAppliedCoupon(found);
    return { ok: true, coupon: found };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : Math.min(cartSubtotal, appliedCoupon.value)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
