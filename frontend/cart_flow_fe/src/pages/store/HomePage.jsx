import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  Eye,
  Award,
  Feather,
  Scissors,
  Check,
  Mail,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { getListedStoreProducts, loadInventoryProducts } from '../../data/inventoryProducts';
import { useCart } from '../../context/CartContext';
import { Button, Badge, ProductCard, Input } from '../../components/ui';
import './StorePages.css';

const HERO_SLIDES = [
  {
    id: 1,
    kicker: 'SUMMER CAPSULE 2026',
    title: 'THE OLD MONEY EDIT',
    subtitle: 'Signature Gurkha trousers, textured Cuban knit polos, and bespoke Italian blazers.',
    primaryBtn: { text: 'Shop Collection', link: '/shop' },
    secondaryBtn: { text: 'Explore Drops', link: '/shop?cat=Old Money' },
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 2,
    kicker: '100% FRENCH FLAX',
    title: 'ARCHITECTURAL LINEN',
    subtitle: 'Stone-washed Normandy linen overshirts engineered for effortless coastal drape.',
    primaryBtn: { text: 'Shop Linen', link: '/shop?cat=Linen & Resort' },
    secondaryBtn: { text: 'View Resort Edits', link: '/shop?cat=Linen & Resort' },
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 3,
    kicker: 'ITALIAN ATELIER',
    title: 'QUIET LUXURY FOOTWEAR',
    subtitle: 'Hand-burnished calf suede tassel loafers built on Goodyear-welted soles.',
    primaryBtn: { text: 'Shop Footwear', link: '/shop?cat=Footwear' },
    secondaryBtn: { text: 'All Collections', link: '/shop' },
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=2000&q=85',
  },
];

const CATALOG_ITEMS = [
  {
    id: 'shirts',
    name: 'Textured Shirts',
    category: 'Old Money',
    itemCount: '48 Pieces',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'suiting',
    name: 'Tailored Suiting & Blazers',
    category: 'Formal & Suiting',
    itemCount: '36 Pieces',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'linen',
    name: 'Linen & Resort Wear',
    category: 'Linen & Resort',
    itemCount: '42 Pieces',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'co-ords',
    name: 'Trousers & Co-Ords',
    category: 'Co-Ords',
    itemCount: '32 Pieces',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'footwear',
    name: 'Handcrafted Footwear',
    category: 'Footwear',
    itemCount: '24 Pieces',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop'
  }
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [addedItemNotice, setAddedItemNotice] = useState(null);
  const [vipEmail, setVipEmail] = useState('');
  const [vipSubscribed, setVipSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1800);
  };

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (vipEmail.trim()) {
      setVipSubscribed(true);
      setTimeout(() => setVipSubscribed(false), 5000);
      setVipEmail('');
    }
  };

  const storeProducts = useMemo(() => getListedStoreProducts(), []);
  const spotlightProduct =
    storeProducts.find((p) => p.id === 6) ||
    storeProducts[0] ||
    loadInventoryProducts()[0];

  return (
    <div className="cf-store-page">
      {/* 1. Snitch / Shopify Minimal Luxury Hero Section */}
      <section className="cf-snitch-hero">
        <div className="cf-snitch-hero-media">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              className={`cf-snitch-hero-img ${idx === activeSlide ? 'is-active' : ''}`}
            />
          ))}
          <div className="cf-snitch-hero-overlay" />
        </div>

        <div className="cf-store-container cf-snitch-hero-content">
          <div className="cf-snitch-hero-card">
            <span className="cf-snitch-kicker">{HERO_SLIDES[activeSlide].kicker}</span>
            <h1 className="cf-snitch-title">{HERO_SLIDES[activeSlide].title}</h1>
            <p className="cf-snitch-subtitle">{HERO_SLIDES[activeSlide].subtitle}</p>

            <div className="cf-snitch-btn-row">
              <Link to={HERO_SLIDES[activeSlide].primaryBtn.link}>
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  {HERO_SLIDES[activeSlide].primaryBtn.text}
                </Button>
              </Link>
              <Link to={HERO_SLIDES[activeSlide].secondaryBtn.link}>
                <Button variant="secondary" size="lg">
                  {HERO_SLIDES[activeSlide].secondaryBtn.text}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Minimalist Slide Indicators */}
        <div className="cf-snitch-indicators">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`cf-snitch-dot ${idx === activeSlide ? 'is-active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Snitch-Inspired Ticker Strip */}
      <div className="cf-snitch-ticker">
        <div className="cf-ticker-track">
          <span>OLD MONEY CLASSICS • BESPOKE ITALIAN CUT • 100% FRENCH LINEN • COMPLIMENTARY EXPRESS SHIPPING • LIMITED BATCH DROPS • PREMIUM HANDCRAFTED APPAREL • OLD MONEY CLASSICS • BESPOKE ITALIAN CUT •</span>
        </div>
      </div>

      {/* 3. Clean Studio Apparel Catalog Showcase (5 Items in 1 Row) */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">The Wardrobe Edit</span>
            <h2 className="cf-section-headline">Shop by Catalog</h2>
          </div>

          <Link to="/catalog" className="cf-section-view-all">
            Browse All Catalogs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-catalog-showcase-grid">
          {CATALOG_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={`/shop?cat=${encodeURIComponent(item.category)}`}
              className="cf-catalog-card"
            >
              <div className="cf-catalog-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    if (item.fallback) e.currentTarget.src = item.fallback;
                  }}
                />
              </div>
              <div className="cf-catalog-meta">
                <h3 className="cf-catalog-name">{item.name}</h3>
                <span className="cf-catalog-count">
                  {item.itemCount} <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Drops: 4-Column Sleek Compact Grid */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">The New Arrival Drop</span>
            <h2 className="cf-section-headline">Trending Essentials</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            View All ({storeProducts.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards in 1 Row (Compact & Modern) */}
        <div className="cf-products-compact-grid">
          {storeProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
              isAdded={addedItemNotice === product.id}
            />
          ))}
        </div>
      </section>

      {/* 5. NEW: Architectural Spotlight Capsule Feature */}
      <section className="cf-store-container cf-spotlight-section">
        <div className="cf-spotlight-card">
          <div className="cf-spotlight-media">
            <img
              src={spotlightProduct.imageUrl}
              alt={spotlightProduct.title}
              className="cf-spotlight-img"
            />
            <div className="cf-spotlight-badge-float">
              <Badge variant="primary">CAPSULE HIGHLIGHT</Badge>
            </div>
          </div>

          <div className="cf-spotlight-content">
            <span className="cf-spotlight-tag">HERITAGE TAILORING 2026</span>
            <h3 className="cf-spotlight-title">{spotlightProduct.title}</h3>
            <p className="cf-spotlight-desc">
              Precision-tailored from bespoke Italian high-twist wool with subtle roped shoulders and sharp peak lapels. Designed to drape effortlessly from board meetings to evening Galas.
            </p>

            <div className="cf-spotlight-specs">
              <div className="cf-spec-item">
                <span className="cf-spec-label">Material Weave</span>
                <span className="cf-spec-value">100% Tropical Wool</span>
              </div>
              <div className="cf-spec-item">
                <span className="cf-spec-label">Fit Profile</span>
                <span className="cf-spec-value">Structured Architectural</span>
              </div>
              <div className="cf-spec-item">
                <span className="cf-spec-label">Hardware</span>
                <span className="cf-spec-value">Hand-Carved Horn Buttons</span>
              </div>
              <div className="cf-spec-item">
                <span className="cf-spec-label">Origin</span>
                <span className="cf-spec-value">Florence Atelier</span>
              </div>
            </div>

            <div className="cf-spotlight-pricing-row">
              <div>
                <span className="cf-spotlight-price">₹{spotlightProduct.price.toLocaleString('en-IN')}</span>
                {spotlightProduct.originalPrice && (
                  <span className="cf-spotlight-orig">₹{spotlightProduct.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>

              <div className="cf-spotlight-actions">
                <Button
                  variant="primary"
                  size="md"
                  icon={addedItemNotice === spotlightProduct.id ? Check : ShoppingBag}
                  onClick={() => handleQuickAdd(spotlightProduct)}
                >
                  {addedItemNotice === spotlightProduct.id ? 'Added to Bag' : 'Quick Add'}
                </Button>
                <Link to={`/product/${spotlightProduct.id}`}>
                  <Button variant="outline" size="md" iconRight={Eye}>
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW: Shop by Fabric / Textile Architecture */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Tactile Materials</span>
            <h2 className="cf-section-headline">Shop by Premium Textile</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            Textile Guide <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-fabrics-grid">
          <Link to="/shop?cat=Linen & Resort" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Feather size={22} />
            </div>
            <span className="cf-fabric-origin">NORMANDY, FRANCE</span>
            <h4 className="cf-fabric-name">100% French Linen</h4>
            <p className="cf-fabric-desc">
              Stone-washed flax linen offering unmatched airy breathability and relaxed fluid draping.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Linen Drops <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?cat=Formal & Suiting" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Scissors size={22} />
            </div>
            <span className="cf-fabric-origin">NAPLES, ITALY</span>
            <h4 className="cf-fabric-name">High-Twist Tropical Wool</h4>
            <p className="cf-fabric-desc">
              Wrinkle-resistant fine fibers engineered for sharp suiting that maintains structure all day.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Suiting <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?cat=Old Money" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Award size={22} />
            </div>
            <span className="cf-fabric-origin">NILE DELTA, EGYPT</span>
            <h4 className="cf-fabric-name">Combed Egyptian Cotton</h4>
            <p className="cf-fabric-desc">
              Extra-long staple yarn offering silky handfeel, rich luster, and remarkable tactile durability.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Knit Polos <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?cat=Co-Ords" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Layers size={22} />
            </div>
            <span className="cf-fabric-origin">LYON, FRANCE</span>
            <h4 className="cf-fabric-name">450 GSM French Terry</h4>
            <p className="cf-fabric-desc">
              Heavyweight looped-back cotton for dense oversized hoodies and slouchy structural co-ords.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Heavy Terry <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </section>

      {/* 7. Snitch-Inspired Promo Promo Banner */}
      <section className="cf-store-container cf-promo-callout-wrap">
        <div className="cf-promo-callout-box">
          <div className="cf-promo-callout-content">
            <span className="cf-promo-pill">LIMITED TIME OFFER</span>
            <h3>CLAIM 15% OFF YOUR FIRST CAPSULE</h3>
            <p>Use code <strong>ROYAL15</strong> at checkout. Valid on all Old Money & Tailored Drops.</p>
          </div>
          <Link to="/shop">
            <Button variant="primary" size="lg" iconRight={ArrowRight}>
              Claim Promo & Shop
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. VIP Drop Radar / Newsletter Box */}
      <section className="cf-store-container">
        <div className="cf-drop-radar-box">
          <Badge variant="primary">EXCLUSIVE ACCESS</Badge>
          <h3>Join The CartFlow Drop Radar</h3>
          <p>
            Gain 1-hour early access to limited weekly Friday drops, secret capsule releases, and invitations to private VIP events.
          </p>

          {vipSubscribed ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--cf-accent-success)',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>You're on the VIP Radar. Check your inbox for your 15% welcome code!</span>
            </div>
          ) : (
            <form onSubmit={handleVipSubmit} className="cf-drop-radar-form">
              <Input
                type="email"
                required
                placeholder="Enter your VIP email address..."
                icon={Mail}
                value={vipEmail}
                onChange={(e) => setVipEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" size="md" iconRight={ArrowRight}>
                Join Radar
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
