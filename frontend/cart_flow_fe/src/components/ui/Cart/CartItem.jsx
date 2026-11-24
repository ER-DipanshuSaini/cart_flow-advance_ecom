import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import './Cart.css';

/**
 * Reusable Cart Item Component
 */
export default function CartItem({
  id,
  title,
  variant,
  price,
  quantity = 1,
  imageUrl,
  onQuantityChange,
  onRemove,
  className = '',
}) {
  return (
    <div className={`cf-ui-cart-item ${className}`}>
      {/* Thumbnail */}
      <div className="cf-cart-item-img-wrap">
        <img src={imageUrl} alt={title} className="cf-cart-item-img" />
      </div>

      {/* Info */}
      <div className="cf-cart-item-info">
        <div className="cf-cart-item-top">
          <h4 className="cf-cart-item-title">{title}</h4>
          <button
            type="button"
            className="cf-cart-item-remove"
            onClick={() => onRemove && onRemove(id)}
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {variant && <div className="cf-cart-item-variant">{variant}</div>}

        <div className="cf-cart-item-bottom">
          {/* Quantity Controls */}
          <div className="cf-cart-qty-ctrl">
            <button
              type="button"
              className="cf-qty-btn"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange && onQuantityChange(id, quantity - 1)}
            >
              <Minus size={13} />
            </button>
            <span className="cf-qty-display">{quantity}</span>
            <button
              type="button"
              className="cf-qty-btn"
              onClick={() => onQuantityChange && onQuantityChange(id, quantity + 1)}
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Item Total Price */}
          <div className="cf-cart-item-price">₹{Math.round(price * quantity).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
}
