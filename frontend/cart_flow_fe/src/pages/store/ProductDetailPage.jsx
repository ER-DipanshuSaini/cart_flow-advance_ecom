import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Badge, ToastContainer } from '../../components/ui';
import './StorePages.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '#111');
  const [quantity, setQuantity] = useState(1);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3000);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, `Size: ${selectedSize}`);
    addToast('success', 'Added to Shopping Bag', `${product.title} (Size: ${selectedSize}) added to your bag.`);
  };

  return (
    <div className="cf-store-container cf-pdp-wrapper">
      <ToastContainer toasts={toasts} onClose={(tId) => setToasts((prev) => prev.filter((t) => t.id !== tId))} />

      {/* Back to Shop Link */}
      <Link to="/shop" className="cf-pdp-back-link">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="cf-pdp-grid">
        {/* Media Gallery Column */}
        <div className="cf-pdp-gallery-col">
          <div className="cf-pdp-main-img-box">
            <img src={product.imageUrl} alt={product.title} className="cf-pdp-hero-image" />
            {product.badge && <span className="cf-pdp-badge-tag">{product.badge}</span>}
          </div>
        </div>

        {/* Details & Purchase Column */}
        <div className="cf-pdp-info-col">
          <span className="cf-pdp-category">{product.category}</span>
          <h1 className="cf-pdp-title">{product.title}</h1>

          {/* Rating Line */}
          <div className="cf-pdp-rating-line">
            <div className="cf-pdp-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
              ))}
            </div>
            <span className="cf-pdp-rating-val">{product.rating}</span>
            <span className="cf-pdp-review-count">({product.reviewCount} verified client reviews)</span>
          </div>

          {/* Pricing */}
          <div className="cf-pdp-price-row">
            <span className="cf-pdp-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="cf-pdp-orig-price">${product.originalPrice.toFixed(2)}</span>
            )}
            <Badge variant="completed">IN STOCK</Badge>
          </div>

          <p className="cf-pdp-short-desc">{product.description}</p>

          <div className="cf-pdp-divider" />

          {/* Size Selector */}
          <div className="cf-pdp-selector-group">
            <div className="cf-selector-label-row">
              <span className="cf-selector-label">Select Size</span>
              <a href="#size-guide" className="cf-size-guide-link">Size Guide</a>
            </div>
            <div className="cf-size-chips-row">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`cf-size-chip ${selectedSize === sz ? 'is-selected' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="cf-pdp-selector-group">
            <span className="cf-selector-label">Select Palette</span>
            <div className="cf-color-dots-row">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className={`cf-color-dot ${selectedColor === c ? 'is-selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="cf-pdp-actions-row">
            <div className="cf-pdp-qty-counter">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={ShoppingBag}
              onClick={handleAddToCart}
              className="cf-pdp-add-cart-btn"
            >
              Add to Bag • ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>

          {/* Perks Row */}
          <div className="cf-pdp-perks-box">
            <div className="cf-pdp-perk-item">
              <Truck size={16} />
              <span>Complimentary shipping over $150</span>
            </div>
            <div className="cf-pdp-perk-item">
              <RotateCcw size={16} />
              <span>30-day hassle free exchanges</span>
            </div>
            <div className="cf-pdp-perk-item">
              <ShieldCheck size={16} />
              <span>256-bit SSL encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
