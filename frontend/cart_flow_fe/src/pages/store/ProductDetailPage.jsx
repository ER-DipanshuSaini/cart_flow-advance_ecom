import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  Heart,
  Share2,
  Ruler,
  ChevronUp,
  ChevronDown,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info,
  HelpCircle
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button, ProductCard, ProductReviews, ToastContainer, Modal } from '../../components/ui';
import './StorePages.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { customer } = useAuth();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  }, [id]);

  // Gallery Images (High-Resolution Multi-Angle Views)
  const galleryImages = useMemo(() => {
    const baseImages = [
      product.imageUrl,
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85',
    ];

    if (product.id === 1 || product.id === 2) {
      return [
        ...baseImages,
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      ];
    }

    return baseImages;
  }, [product]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [id]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '#111');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [fullViewOpen, setFullViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [thumbsOverflow, setThumbsOverflow] = useState(false);
  const thumbsListRef = useRef(null);

  // Stock & Short Description (max 20 words)
  const stockCount = typeof product.stockCount === 'number' ? product.stockCount : product.inStock ? 5 : 0;
  const isOutOfStock = !product.inStock || stockCount <= 0;

  const shortDescription = useMemo(() => {
    if (!product.description) return 'No short description available for this item.';
    const words = product.description.trim().split(/\s+/);
    return words.length > 20 ? `${words.slice(0, 20).join(' ')}...` : product.description;
  }, [product.description]);

  // Delivery Address Lookup (Selected address from profile or null)
  const deliveryAddress = useMemo(() => {
    if (!customer) return null;
    try {
      const saved = localStorage.getItem('cf_selected_address');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return {
      label: 'Primary Residence',
      line: 'Suite 402, Imperial Heights, Worli, Mumbai - 400018',
    };
  }, [customer]);

  // Product FAQs with fallback support
  const productFaqs = useMemo(() => {
    if (Array.isArray(product.faqs)) return product.faqs;
    return [
      {
        q: 'How does the sizing run for this piece?',
        a: 'It is tailored for a clean, true-to-size silhouette. Choose your regular size, or refer to the Size Chart above for exact chest and length measurements.',
      },
      {
        q: 'What is the fabric care and washing procedure?',
        a: 'Machine wash cold on a delicate cycle with mild detergent or dry clean. Lay flat in shade to dry and steam lightly inside-out.',
      },
      {
        q: 'How can I exchange or return if the fit is not right?',
        a: 'We offer a 7-day complimentary doorstep exchange and return pickup across 19,000+ pincodes.',
      },
    ];
  }, [product]);

  useEffect(() => {
    const checkOverflow = () => {
      const el = thumbsListRef.current;
      if (!el) return;
      const isVertical = window.innerWidth >= 640;
      setThumbsOverflow(
        isVertical ? el.scrollHeight > el.clientHeight + 2 : el.scrollWidth > el.clientWidth + 2
      );
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [galleryImages]);

  const scrollThumbnails = (direction) => {
    if (!thumbsListRef.current) return;
    const offset = direction === 'up' ? -150 : 150;
    thumbsListRef.current.scrollBy({ top: offset, left: offset, behavior: 'smooth' });
  };

  // Toast notifier
  const addToast = (type, title, message) => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3200);
  };

  // Add to Cart
  const handleAddToCart = () => {
    addToCart(product, quantity, `Size: ${selectedSize}`);
    addToast('success', 'Added to Cart', `${product.title} (Size: ${selectedSize}) has been added.`);
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

  // Native OS Share Modal with Clipboard Fallback
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on CartFlow`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    navigator.clipboard?.writeText(shareUrl);
    addToast('success', 'Link Copied', 'Product link copied to your clipboard.');
  };

  // Scroll smoothly to Reviews section
  const handleScrollToReviews = () => {
    const el = document.getElementById('cf-reviews-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Navigate to Saved Addresses or Login
  const handleAddressAction = () => {
    if (customer) {
      navigate('/account?tab=addresses');
    } else {
      navigate('/login');
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
        {/* Gallery Column: Vertical Thumbnail Strip (slider only on overflow) + Natural-Fit Hero */}
        <div className="cf-pdp-gallery-col">
          <div className="cf-pdp-thumbs-slider-col">
            {thumbsOverflow && (
              <button
                type="button"
                className="cf-pdp-thumb-nav-btn"
                onClick={() => scrollThumbnails('up')}
                aria-label="Scroll thumbnails up"
              >
                <ChevronUp size={15} />
              </button>
            )}

            <div className="cf-pdp-thumbnails" ref={thumbsListRef}>
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

            {thumbsOverflow && (
              <button
                type="button"
                className="cf-pdp-thumb-nav-btn"
                onClick={() => scrollThumbnails('down')}
                aria-label="Scroll thumbnails down"
              >
                <ChevronDown size={15} />
              </button>
            )}
          </div>

          <div className="cf-pdp-main-stage-wrap">
            <div className="cf-pdp-main-img-box">
              <img
                src={galleryImages[activeImgIndex]}
                alt={product.title}
                className="cf-pdp-hero-image"
                onClick={() => setFullViewOpen(true)}
              />

              <button
                type="button"
                className="cf-pdp-zoom-trigger-btn"
                onClick={() => setFullViewOpen(true)}
                aria-label="View full screen image"
                title="Full View"
              >
                <Maximize2 size={15} />
              </button>

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="cf-pdp-slider-btn cf-pdp-slider-prev"
                    onClick={() =>
                      setActiveImgIndex((prev) =>
                        (prev - 1 + galleryImages.length) % galleryImages.length
                      )
                    }
                    aria-label="Previous product photo"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="cf-pdp-slider-btn cf-pdp-slider-next"
                    onClick={() =>
                      setActiveImgIndex((prev) => (prev + 1) % galleryImages.length)
                    }
                    aria-label="Next product photo"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="cf-pdp-slider-dots">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`cf-pdp-slider-dot ${idx === activeImgIndex ? 'is-active' : ''}`}
                        onClick={() => setActiveImgIndex(idx)}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details & Purchase Form Column (Compact to match 5:6 Image Height) */}
        <div className="cf-pdp-info-col">
          <div className="cf-pdp-cat-row">
            <div className="cf-pdp-cat-meta">
              <span className="cf-pdp-category">{product.category}</span>
              <span className="cf-pdp-sku">SKU: CF-{product.id}042</span>
            </div>

            <div className="cf-pdp-top-actions">
              <button
                type="button"
                className={`cf-pdp-icon-action-btn ${isWishlisted ? 'is-active' : ''}`}
                onClick={handleToggleWishlist}
                title="Save to Wishlist"
                aria-label="Save to Wishlist"
              >
                <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                className="cf-pdp-icon-action-btn"
                onClick={handleShare}
                title="Share Product"
                aria-label="Share Product"
              >
                <Share2 size={17} />
              </button>
            </div>
          </div>

          <h1 className="cf-pdp-title">{product.title}</h1>

          {/* Clickable Rating Line -> Smooth Scroll to Reviews */}
          <button
            type="button"
            className="cf-pdp-rating-line cf-pdp-rating-btn"
            onClick={handleScrollToReviews}
            title="Jump to Ratings & Reviews"
          >
            <div className="cf-pdp-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
              ))}
            </div>
            <span className="cf-pdp-rating-val">{product.rating}</span>
            <span className="cf-pdp-review-count">({product.reviewCount} verified reviews)</span>
          </button>

          {/* Pricing Row with Strikethrough, Savings & Stock Urgency */}
          <div className="cf-pdp-price-row">
            <span className="cf-pdp-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="cf-pdp-orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="cf-pdp-discount-badge">{discountPercent}% OFF</span>
              </>
            )}
            <span className={`cf-pdp-stock-pill ${isOutOfStock ? 'is-out' : 'is-low'}`}>
              {isOutOfStock ? 'Out of Stock' : `Only ${stockCount} left`}
            </span>
          </div>
          <span className="cf-pdp-tax-notice">Inclusive of all taxes</span>

          {/* Short Description (Max 20 Words) */}
          <p className="cf-pdp-short-desc">{shortDescription}</p>

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

          {/* Size Selector with Size Chart Link */}
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
                <Ruler size={13} /> Size Chart &amp; Measurements
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
          </div>

          {/* Purchase Actions: Quantity & Add to Cart */}
          <div className="cf-pdp-actions-row">
            <div className="cf-pdp-qty-counter">
              <button
                type="button"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                disabled={isOutOfStock || quantity >= stockCount}
                onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={ShoppingBag}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="cf-pdp-add-cart-btn"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {/* Deliver To Address Card */}
          <div className="cf-pdp-deliver-card">
            <div className="cf-deliver-left">
              <MapPin size={16} className="cf-pincode-icon" />
              {deliveryAddress ? (
                <div className="cf-deliver-info">
                  <span className="cf-deliver-label">
                    Deliver to: <strong>{customer?.name}</strong> ({deliveryAddress.label})
                  </span>
                  <span className="cf-deliver-address-txt">{deliveryAddress.line}</span>
                </div>
              ) : (
                <div className="cf-deliver-info">
                  <span className="cf-deliver-label">No delivery address selected</span>
                  <span className="cf-deliver-address-txt">
                    {customer ? 'Add an address in your profile to proceed.' : 'Sign in to select or add a delivery address.'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              className="cf-deliver-action-btn"
              onClick={handleAddressAction}
            >
              {deliveryAddress ? 'Change' : 'Add Address'}
            </button>
          </div>
        </div>
      </div>

      {/* 2B. Full-Width Additional Details, Instructions & FAQ Container */}
      <section className="cf-pdp-full-details-section">
        <div className="cf-pdp-tabs-header">
          <button
            type="button"
            className={`cf-pdp-tab-trigger ${activeTab === 'details' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Additional Details
          </button>
          <button
            type="button"
            className={`cf-pdp-tab-trigger ${activeTab === 'instructions' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('instructions')}
          >
            Care Instructions
          </button>
          <button
            type="button"
            className={`cf-pdp-tab-trigger ${activeTab === 'faq' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQs
          </button>
        </div>

        <div className="cf-pdp-full-tab-body">
          {activeTab === 'details' && (
            <div className="cf-full-details-grid">
              <div className="cf-full-desc-block">
                <h3 className="cf-full-block-title">Product Description</h3>
                {product.description ? (
                  <p className="cf-full-desc-text">{product.description}</p>
                ) : (
                  <div className="cf-pdp-fallback-box">
                    <Info size={16} />
                    <span>No detailed description is available for this product yet.</span>
                  </div>
                )}
              </div>

              <div className="cf-full-specs-block">
                <h3 className="cf-full-block-title">Specifications</h3>
                <ul className="cf-spec-list">
                  <li><span>Category:</span> {product.category || 'Menswear'}</li>
                  <li><span>Textile:</span> 100% Normandy Flax Linen &amp; Long-Staple Combed Cotton</li>
                  <li><span>Weave Gauge:</span> 280 GSM Structured Luxury Drape</li>
                  <li><span>Cut &amp; Fit:</span> Tailored Modern Proportions</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="cf-full-instructions-block">
              <h3 className="cf-full-block-title">Garment Care &amp; Handling Instructions</h3>
              <ul className="cf-spec-list">
                <li><span>Washing:</span> Machine wash cold on delicate cycle or dry clean for best longevity.</li>
                <li><span>Drying:</span> Lay flat to dry in shade. Avoid tumble dry to preserve natural fibers.</li>
                <li><span>Ironing:</span> Warm steam iron inside-out while garment is slightly damp.</li>
                <li><span>Storage:</span> Hang on wide-shouldered wooden hangers to maintain collar and shoulder line.</li>
              </ul>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="cf-full-faq-block">
              <h3 className="cf-full-block-title">Frequently Asked Questions</h3>
              {productFaqs.length === 0 ? (
                <div className="cf-pdp-fallback-box">
                  <HelpCircle size={16} />
                  <span>No frequently asked questions available for this product yet.</span>
                </div>
              ) : (
                <div className="cf-pdp-faq-list">
                  {productFaqs.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className={`cf-pdp-faq-item ${isOpen ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="cf-pdp-faq-question"
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        >
                          <span>{item.q}</span>
                          <ChevronDown size={16} className="cf-faq-chevron" />
                        </button>
                        {isOpen && <p className="cf-pdp-faq-answer">{item.a}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

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

      {/* 7. Full-View Product Image Lightbox Modal */}
      <Modal
        isOpen={fullViewOpen}
        onClose={() => setFullViewOpen(false)}
        title={product.title}
        subtitle={`Image ${activeImgIndex + 1} of ${galleryImages.length}`}
        maxWidth="820px"
      >
        <div className="cf-pdp-fullview-wrap">
          <div className="cf-pdp-fullview-stage">
            <img
              src={galleryImages[activeImgIndex]}
              alt={product.title}
              className="cf-pdp-fullview-img"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="cf-pdp-fullview-nav cf-pdp-fullview-prev"
                  onClick={() =>
                    setActiveImgIndex((prev) =>
                      (prev - 1 + galleryImages.length) % galleryImages.length
                    )
                  }
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="cf-pdp-fullview-nav cf-pdp-fullview-next"
                  onClick={() =>
                    setActiveImgIndex((prev) => (prev + 1) % galleryImages.length)
                  }
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="cf-pdp-fullview-thumbs">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`cf-pdp-fullview-thumb-btn ${idx === activeImgIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveImgIndex(idx)}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
