import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({
  id,
  title,
  category,
  price,
  originalPrice,
  rating = 4.8,
  reviewCount = 42,
  badge,
  imageUrl,
  colors = ['#111111', '#c4a482', '#334155'],
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className="cf-product-card">
      {/* Image Container with Badges & Actions */}
      <div className="cf-card-media">
        {badge && (
          <span className={`cf-badge-tag ${badge === 'SALE' ? 'is-sale' : ''}`}>
            {badge}
          </span>
        )}

        <button
          className={`cf-wishlist-toggle ${isWishlisted ? 'is-active' : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? 'var(--cf-accent-sale)' : 'none'} color={isWishlisted ? 'var(--cf-accent-sale)' : 'var(--cf-black)'} />
        </button>

        <img src={imageUrl} alt={title} className="cf-product-img" loading="lazy" />

        {/* Quick Add Overlay */}
        <div className="cf-quick-actions">
          <button className="cf-quick-add-btn">
            <ShoppingBag size={15} /> Quick Add
          </button>
          <button className="cf-ai-tryon-btn" title="AI Try-On Preview">
            <Sparkles size={14} /> Try On
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="cf-card-details">
        <div className="cf-details-meta">
          <span className="cf-product-cat">{category}</span>
          <div className="cf-product-rating">
            <Star size={13} fill="#111" color="#111" />
            <span>{rating}</span>
            <span className="cf-rating-count">({reviewCount})</span>
          </div>
        </div>

        <h3 className="cf-product-title">
          <a href={`#product-${id}`}>{title}</a>
        </h3>

        {/* Color Swatches */}
        {colors && colors.length > 0 && (
          <div className="cf-color-swatches">
            {colors.map((c, i) => (
              <span
                key={i}
                className={`cf-swatch-dot ${selectedColor === c ? 'is-selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
        )}

        <div className="cf-product-price">
          <span className="cf-current-price">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="cf-orig-price">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
