import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import Button from '../Button/Button';
import './ProductCard.css';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';

/**
 * Standard Reusable Product Card Component
 * Shared across Home, Shop, and Related Product sections
 */
export default function ProductCard({
  product,
  onQuickAdd,
  isAdded = false,
  className = '',
}) {
  if (!product) return null;

  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className={`cf-product-card-root ${className}`}>
      {/* 1. Media Image Container */}
      <div className="cf-product-card-media">
        {/* Badges Row */}
        <div className="cf-product-card-badges">
          {product.badge && (
            <span
              className={`cf-card-badge-pill ${
                product.badge.toLowerCase().includes('money')
                  ? 'is-oldmoney'
                  : product.badge.toLowerCase().includes('viral')
                  ? 'is-viral'
                  : ''
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPct && (
            <span className="cf-card-badge-pill is-discount">-{discountPct}%</span>
          )}
        </div>

        {/* Product Cover Image */}
        <Link to={`/product/${product.id}`} className="cf-product-card-img-link">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="cf-product-card-cover-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        </Link>

        {/* Sizes Quick Preview Bar */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="cf-product-card-sizes">
            <span>Sizes: {product.sizes.join(' • ')}</span>
          </div>
        )}

        {/* Hover Action Overlay Buttons */}
        <div className="cf-product-card-actions">
          <Button
            size="sm"
            variant={isAdded ? 'secondary' : 'primary'}
            icon={isAdded ? Check : ShoppingBag}
            className="cf-product-card-quick-btn"
            onClick={() => onQuickAdd && onQuickAdd(product)}
          >
            {isAdded ? 'Added' : 'Quick Add'}
          </Button>

          <Link to={`/product/${product.id}`}>
            <Button
              size="sm"
              variant="secondary"
              icon={Eye}
              className="cf-product-card-quick-btn"
              title="View Product"
            />
          </Link>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="cf-product-card-details">
        <div className="cf-product-card-meta">
          <span className="cf-product-card-cat">{product.category}</span>
          <div className="cf-product-card-rating">
            <Star size={11} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
            <span>{product.rating}</span>
            {product.reviewCount && (
              <span className="cf-product-card-review-count">({product.reviewCount})</span>
            )}
          </div>
        </div>

        <h3 className="cf-product-card-title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>

        {/* Color Palette Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="cf-product-card-colors">
            {product.colors.map((c, idx) => (
              <span
                key={idx}
                className="cf-product-color-dot"
                style={{ backgroundColor: c }}
                title={`Color variant ${idx + 1}`}
              />
            ))}
            <span className="cf-product-color-label">+{product.colors.length} shades</span>
          </div>
        )}

        {/* Indian Rupee Pricing */}
        <div className="cf-product-card-pricing">
          <span className="cf-product-price-current">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="cf-product-price-original">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
