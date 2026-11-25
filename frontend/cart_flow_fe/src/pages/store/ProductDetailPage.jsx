import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  Minus,
  Plus,
  Heart,
  Share2,
  Ruler,
  Check,
  ChevronDown,
  Sparkles,
  MapPin,
  Flame,
  Award,
  Feather,
  Zap,
  ChevronRight
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Badge, ProductCard, ProductReviews, ToastContainer, Modal } from '../../components/ui';
import './StorePages.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  }, [id]);

  // Gallery Images (High-Resolution Multi-Angle Views)
  const galleryImages = useMemo(() => {
    return [
      product.imageUrl,
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85'
    ];
  }, [product]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '#111');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('110001');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('fabric');
  const [toasts, setToasts] = useState([]);

  // Toast notifier
  const addToast = (type, title, message) => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3200);
  };

  // Add to Bag
  const handleAddToCart = () => {
    addToCart(product, quantity, `Size: ${selectedSize}`);
    addToast('success', 'Added to Shopping Bag', `${product.title} (Size: ${selectedSize}) has been added.`);
  };

  // Instant Buy Now
  const handleBuyNow = () => {
    addToCart(product, quantity, `Size: ${selectedSize}`);
    navigate('/checkout');
  };

  // Toggle Wishlist
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    addToast(
      'info',
      !isWishlisted ? 'Saved to Wardrobe' : 'Removed from Wardrobe',
      !isWishlisted ? `${product.title} added to your personal wishlist.` : 'Item removed.'
    );
  };

  // Share Product Link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('success', 'Link Copied', 'Product link copied to your clipboard.');
  };

  // Pincode Verification
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeChecked(true);
      addToast('success', 'Pincode Serviceable', `Express delivery available for ${pincode}`);
    }
  };

  // Related & Complete the Look Products
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  }, [product.id]);

  const completeLookProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 2);
  }, [product.id, product.category]);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="cf-store-container cf-pdp-wrapper">
      <ToastContainer toasts={toasts} onClose={(tId) => setToasts((prev) => prev.filter((t) => t.id !== tId))} />

      {/* 1. Breadcrumb Navigation Bar */}
      <nav className="cf-pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop">Catalog</Link>
        <ChevronRight size={13} />
        <Link to={`/shop?cat=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <ChevronRight size={13} />
        <span className="cf-breadcrumb-current">{product.title}</span>
      </nav>

      {/* 2. Main Product Showcase Grid */}
      <div className="cf-pdp-grid">
        {/* Gallery Column: Vertical Thumbnail Strip + High-Res Zoomable Hero */}
        <div className="cf-pdp-gallery-col">
          <div className="cf-pdp-thumbnails">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`cf-pdp-thumb-btn ${idx === activeImgIndex ? 'is-active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="cf-pdp-main-img-box">
            <img
              src={galleryImages[activeImgIndex]}
              alt={product.title}
              className="cf-pdp-hero-image"
            />
            {product.badge && <span className="cf-pdp-badge-tag">{product.badge}</span>}
            <span className="cf-pdp-limited-batch-pill">
              <Sparkles size={12} /> BATCH: 250 UNITS
            </span>
          </div>
        </div>

        {/* Product Details & Purchase Form Column */}
        <div className="cf-pdp-info-col">
          <div className="cf-pdp-cat-row">
            <span className="cf-pdp-category">{product.category}</span>
            <span className="cf-pdp-sku">SKU: CF-{product.id}042</span>
          </div>

          <h1 className="cf-pdp-title">{product.title}</h1>

          {/* Social Proof & Rating Line */}
          <div className="cf-pdp-rating-line">
            <div className="cf-pdp-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
              ))}
            </div>
            <span className="cf-pdp-rating-val">{product.rating}</span>
            <span className="cf-pdp-review-count">({product.reviewCount} verified client reviews)</span>
            <span className="cf-pdp-rating-sep">•</span>
            <span className="cf-pdp-recommend-tag">96% recommend fit</span>
          </div>

          {/* Pricing Row with Strikethrough & Savings Badge */}
          <div className="cf-pdp-price-row">
            <span className="cf-pdp-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="cf-pdp-orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="cf-pdp-discount-badge">{discountPercent}% OFF</span>
              </>
            )}
            <Badge variant="completed" size="sm">IN STOCK</Badge>
          </div>
          <span className="cf-pdp-tax-notice">Inclusive of all taxes • Complimentary shipping included</span>

          <p className="cf-pdp-short-desc">{product.description}</p>

          <div className="cf-pdp-divider" />

          {/* Color Palette Selector */}
          <div className="cf-pdp-selector-group">
            <div className="cf-selector-label-row">
              <span className="cf-selector-label">
                Color Palette: <strong>{selectedColor}</strong>
              </span>
            </div>
            <div className="cf-color-dots-row">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className={`cf-color-dot ${selectedColor === c ? 'is-selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                  title={`Color variant ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Size Selector with Urgency Indicator & Size Chart Modal Trigger */}
          <div className="cf-pdp-selector-group">
            <div className="cf-selector-label-row">
              <span className="cf-selector-label">
                Select Size: <strong>{selectedSize}</strong>
              </span>
              <button
                type="button"
                className="cf-size-guide-link"
                onClick={() => setSizeModalOpen(true)}
              >
                <Ruler size={13} /> Size Chart & Measurements
              </button>
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
            <div className="cf-pdp-stock-notice">
              <Flame size={13} />
              <span>Only 3 pieces remaining in Size {selectedSize} — High demand drop</span>
            </div>
          </div>

          {/* Purchase Actions: Quantity, Add to Bag & Instant Buy Now */}
          <div className="cf-pdp-actions-row">
            <div className="cf-pdp-qty-counter">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant="secondary"
              size="lg"
              icon={ShoppingBag}
              onClick={handleAddToCart}
              className="cf-pdp-add-cart-btn"
            >
              Add to Bag
            </Button>

            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={handleBuyNow}
              className="cf-pdp-buy-now-btn"
            >
              Buy Now • ₹{Math.round(product.price * quantity).toLocaleString('en-IN')}
            </Button>

            <button
              type="button"
              className={`cf-pdp-icon-action-btn ${isWishlisted ? 'is-active' : ''}`}
              onClick={handleToggleWishlist}
              title="Save to Wardrobe"
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            <button
              type="button"
              className="cf-pdp-icon-action-btn"
              onClick={handleShare}
              title="Share Link"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Real-Time Pincode Delivery Estimator */}
          <div className="cf-pdp-pincode-card">
            <div className="cf-pincode-title-row">
              <MapPin size={16} className="cf-pincode-icon" />
              <span>Delivery & Doorstep Service Checker</span>
            </div>
            <form onSubmit={handleCheckPincode} className="cf-pincode-form">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="cf-pincode-input"
              />
              <button type="submit" className="cf-pincode-btn">Check</button>
            </form>
            {pincodeChecked && (
              <div className="cf-pincode-result">
                <div className="cf-pincode-item">
                  <Check size={14} />
                  <span>Express Dispatch: Delivered by <strong>Friday, 28 Nov</strong> to {pincode}</span>
                </div>
                <div className="cf-pincode-item">
                  <Check size={14} />
                  <span>Free 7-Day Doorstep Size Exchange & Pickup</span>
                </div>
                <div className="cf-pincode-item">
                  <Check size={14} />
                  <span>Cash on Delivery (COD) Available</span>
                </div>
              </div>
            )}
          </div>

          {/* Garment Details & Accordion Tabs */}
          <div className="cf-pdp-tabs-container">
            <div className="cf-pdp-tabs-header">
              <button
                type="button"
                className={`cf-pdp-tab-trigger ${activeTab === 'fabric' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('fabric')}
              >
                Fabric & Heritage
              </button>
              <button
                type="button"
                className={`cf-pdp-tab-trigger ${activeTab === 'fit' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('fit')}
              >
                Silhouette & Fit
              </button>
              <button
                type="button"
                className={`cf-pdp-tab-trigger ${activeTab === 'care' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('care')}
              >
                Garment Care
              </button>
              <button
                type="button"
                className={`cf-pdp-tab-trigger ${activeTab === 'exchange' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('exchange')}
              >
                Doorstep Exchanges
              </button>
            </div>

            <div className="cf-pdp-tab-content">
              {activeTab === 'fabric' && (
                <div className="cf-tab-panel">
                  <ul className="cf-spec-list">
                    <li><span>Textile:</span> 100% Normandy Flax Linen & Long-Staple Combed Cotton</li>
                    <li><span>Weave Gauge:</span> 280 GSM Structured Luxury Knitted Drape</li>
                    <li><span>Hardware:</span> Hand-carved Mother-of-Pearl Troca Shell Buttons</li>
                    <li><span>Atelier Origin:</span> Woven in Biella, Italy & Handcrafted in Florence</li>
                  </ul>
                </div>
              )}
              {activeTab === 'fit' && (
                <div className="cf-tab-panel">
                  <ul className="cf-spec-list">
                    <li><span>Cut:</span> Tailored Modern Proportions with Clean Shoulder Drop</li>
                    <li><span>Collar:</span> Vintage Spread Cuban Lapel Collar with Reinforcement</li>
                    <li><span>Hem:</span> Straight-cut vented hem engineered to be worn tucked or untucked</li>
                    <li><span>Fit Advice:</span> True to size. Take your standard size for a sculpted look.</li>
                  </ul>
                </div>
              )}
              {activeTab === 'care' && (
                <div className="cf-tab-panel">
                  <ul className="cf-spec-list">
                    <li><span>Washing:</span> Machine wash cold on delicate cycle or dry clean for best longevity</li>
                    <li><span>Drying:</span> Lay flat to dry in shade. Avoid tumble dry to preserve natural fibers</li>
                    <li><span>Ironing:</span> Warm steam iron inside-out while garment is slightly damp</li>
                  </ul>
                </div>
              )}
              {activeTab === 'exchange' && (
                <div className="cf-tab-panel">
                  <ul className="cf-spec-list">
                    <li><span>Exchange Window:</span> 7 Days from delivery date</li>
                    <li><span>Doorstep Service:</span> Courier brings your new size and picks up old piece simultaneously</li>
                    <li><span>Reverse Shipping:</span> 100% Free doorstep pickup across 19,000+ pan-India pincodes</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Complete The Look / Curated Outfit Pairings */}
      <section className="cf-pdp-complete-look-section">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Curated Styling</span>
            <h2 className="cf-section-headline">Complete The Look</h2>
          </div>
          <span className="cf-pdp-look-tag">Style Advice by CartFlow Atelier</span>
        </div>

        <div className="cf-pdp-pairing-grid">
          {completeLookProducts.map((item) => (
            <div key={item.id} className="cf-pdp-pairing-card">
              <Link to={`/product/${item.id}`} className="cf-pairing-img-link">
                <img src={item.imageUrl} alt={item.title} />
              </Link>
              <div className="cf-pairing-details">
                <span className="cf-pairing-cat">{item.category}</span>
                <Link to={`/product/${item.id}`} className="cf-pairing-title">
                  {item.title}
                </Link>
                <div className="cf-pairing-price-row">
                  <span className="cf-pairing-price">₹{item.price.toLocaleString('en-IN')}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ShoppingBag}
                    onClick={() => {
                      addToCart(item, 1, 'Standard');
                      addToast('success', 'Added to Bag', `${item.title} added to your bag.`);
                    }}
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Client Reviews & Community Feedback Section */}
      <ProductReviews
        productId={product.id}
        productTitle={product.title}
        baseRating={product.rating}
        baseReviewCount={product.reviewCount}
        selectedSize={selectedSize}
      />

      {/* 5. You May Also Like (Related Drops Grid) */}
      <section className="cf-pdp-related-section">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">The Catalog</span>
            <h2 className="cf-section-headline">You May Also Like</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            Browse All Drops <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-products-compact-grid">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onQuickAdd={() => {
                addToCart(item, 1, 'Standard');
                addToast('success', 'Added to Shopping Bag', `${item.title} added.`);
              }}
            />
          ))}
        </div>
      </section>

      {/* 6. Interactive Size Chart & Measurement Modal */}
      <Modal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        title="Size Guide & Tailored Measurements"
        size="lg"
      >
        <div className="cf-size-modal-body">
          <p className="cf-size-modal-desc">
            All garments are engineered following modern architectural silhouettes. Measurements below reflect actual garment dimensions in inches.
          </p>

          <div className="cf-size-table-wrap">
            <table className="cf-size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Shoulder (in)</th>
                  <th>Length (in)</th>
                  <th>Sleeve (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr className={selectedSize === 'S' ? 'is-selected' : ''}>
                  <td><strong>S</strong></td>
                  <td>38</td>
                  <td>17.5</td>
                  <td>27.5</td>
                  <td>8.5</td>
                </tr>
                <tr className={selectedSize === 'M' ? 'is-selected' : ''}>
                  <td><strong>M</strong></td>
                  <td>40</td>
                  <td>18.0</td>
                  <td>28.5</td>
                  <td>9.0</td>
                </tr>
                <tr className={selectedSize === 'L' ? 'is-selected' : ''}>
                  <td><strong>L</strong></td>
                  <td>42</td>
                  <td>18.5</td>
                  <td>29.5</td>
                  <td>9.5</td>
                </tr>
                <tr className={selectedSize === 'XL' ? 'is-selected' : ''}>
                  <td><strong>XL</strong></td>
                  <td>44</td>
                  <td>19.0</td>
                  <td>30.5</td>
                  <td>10.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="cf-size-how-to">
            <h5>How to Measure:</h5>
            <p><strong>Chest:</strong> Measure across the fullest part of your chest, keeping tape comfortably horizontal under arms.</p>
            <p><strong>Length:</strong> Measure from highest point of the shoulder seam down to the bottom hemline.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
