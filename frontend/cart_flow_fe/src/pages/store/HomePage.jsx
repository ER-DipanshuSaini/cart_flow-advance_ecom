import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShoppingBag, Eye, ShieldCheck, Flame, Compass, Award } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Badge } from '../../components/ui';
import './StorePages.css';

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div className="cf-store-page">
      {/* 1. High-Impact Editorial Hero Section */}
      <section className="cf-store-hero">
        <div className="cf-hero-media">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=85"
            alt="CartFlow Autumn Editorial"
            className="cf-hero-cover-img"
          />
          <div className="cf-hero-gradient-overlay" />
        </div>

        <div className="cf-store-container cf-hero-inner">
          <div className="cf-hero-text-block">
            <div className="cf-hero-badge-tag">
              <span className="cf-pulse-dot" />
              <span>THE OLD MONEY & FORMAL CAPSULE 2026</span>
            </div>

            <h1 className="cf-hero-main-title">
              OLD MONEY LUXURY.<br />MODERN TAILORING.
            </h1>

            <p className="cf-hero-main-desc">
              Curated for the modern tastemaker. Signature Gurkha trousers, textured Cuban knit polos, and structured Italian blazers engineered with precision.
            </p>

            <div className="cf-hero-btn-row">
              <Link to="/shop">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  Explore The Collection
                </Button>
              </Link>
              <Link to="/shop?cat=Old Money">
                <Button variant="secondary" size="lg" icon={Sparkles}>
                  The Old Money Edit
                </Button>
              </Link>
            </div>

            {/* Quick Proof Pills */}
            <div className="cf-hero-proof-pills">
              <div className="cf-proof-pill">
                <Flame size={14} className="cf-proof-icon" />
                <span>Snitch-Tier Fresh Drops Weekly</span>
              </div>
              <div className="cf-proof-pill">
                <Star size={14} className="cf-proof-icon" fill="currentColor" />
                <span>4.9/5 Rating (12,000+ Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Snitch-Inspired Ticker Strip */}
      <div className="cf-snitch-ticker">
        <div className="cf-ticker-track">
          <span>OLD MONEY CLASSICS • BESPOKE ITALIAN CUT • 100% FRENCH LINEN • COMPLIMENTARY EXPRESS SHIPPING • LIMITED BATCH DROPS • PREMIUM HANDCRAFTED APPAREL • OLD MONEY CLASSICS • BESPOKE ITALIAN CUT •</span>
        </div>
      </div>

      {/* 3. Curated Aesthetic Categories Grid (Snitch Style Lookbook) */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Aesthetic Playlists</span>
            <h2 className="cf-section-headline">Shop by Aesthetic</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            Browse All Drops <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-aesthetic-lookbook-grid">
          <Link to="/shop?cat=Old Money" className="cf-lookbook-card">
            <img
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
              alt="Old Money Styling"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'; }}
            />
            <div className="cf-lookbook-overlay">
              <span className="cf-lookbook-tag">SIGNATURE LOOK</span>
              <h4>The Old Money Edit</h4>
              <p>Textured knit polos, linen trousers & loafers</p>
              <span className="cf-lookbook-cta">Shop Edit <ArrowRight size={13} /></span>
            </div>
          </Link>

          <Link to="/shop?cat=Formal & Suiting" className="cf-lookbook-card">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
              alt="Formal Tailoring"
            />
            <div className="cf-lookbook-overlay">
              <span className="cf-lookbook-tag">CONTEMPORARY SUITING</span>
              <h4>Modern Formal</h4>
              <p>Double-breasted blazers & tailored overcoats</p>
              <span className="cf-lookbook-cta">Shop Suits <ArrowRight size={13} /></span>
            </div>
          </Link>

          <Link to="/shop?cat=Linen & Resort" className="cf-lookbook-card">
            <img
              src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
              alt="Linen Resort"
            />
            <div className="cf-lookbook-overlay">
              <span className="cf-lookbook-tag">SUMMER LUXE</span>
              <h4>Linen & Resort</h4>
              <p>French Normandy linen & crochet Cuban shirts</p>
              <span className="cf-lookbook-cta">Shop Resort <ArrowRight size={13} /></span>
            </div>
          </Link>

          <Link to="/shop?cat=Co-Ords" className="cf-lookbook-card">
            <img
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
              alt="Co-Ords & Sets"
            />
            <div className="cf-lookbook-overlay">
              <span className="cf-lookbook-tag">GEN-Z FAVORITE</span>
              <h4>Tailored Co-Ords</h4>
              <p>Effortless matched shackets & trousers</p>
              <span className="cf-lookbook-cta">Shop Sets <ArrowRight size={13} /></span>
            </div>
          </Link>
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
            View All ({PRODUCTS.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards in 1 Row (Compact & Modern) */}
        <div className="cf-products-compact-grid">
          {PRODUCTS.slice(0, 8).map((product) => (
            <div key={product.id} className="cf-compact-product-card">
              <div className="cf-compact-media-box">
                {product.badge && (
                  <span className={`cf-compact-badge ${product.badge === 'OLD MONEY' ? 'is-oldmoney' : product.badge === 'VIRAL' ? 'is-viral' : ''}`}>
                    {product.badge}
                  </span>
                )}
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="cf-compact-cover-img"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'; }}
                  />
                </Link>

                <div className="cf-compact-hover-actions">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={ShoppingBag}
                    onClick={() => addToCart(product, 1)}
                    className="cf-compact-quick-add"
                  >
                    Quick Add
                  </Button>
                  <Link to={`/product/${product.id}`}>
                    <Button size="sm" variant="secondary" icon={Eye} className="cf-compact-view-btn">
                      View
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="cf-compact-details">
                <div className="cf-compact-meta-row">
                  <span className="cf-compact-cat">{product.category}</span>
                  <div className="cf-compact-rating">
                    <Star size={11} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="cf-compact-title">
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                </h3>

                <div className="cf-compact-price-row">
                  <span className="cf-compact-price">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="cf-compact-orig-price">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Snitch-Inspired Promo Promo Banner */}
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

      {/* 6. Craftsmanship & Old Money Philosophy Pillars */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-pillars-grid">
          <div className="cf-pillar-item">
            <Award size={28} className="cf-pillar-icon" />
            <h4>Artisanal Fabric Selection</h4>
            <p>100% Normandy flax linen, Egyptian cotton, and Grade-A Merino wool designed to age with elegance.</p>
          </div>
          <div className="cf-pillar-item">
            <Compass size={28} className="cf-pillar-icon" />
            <h4>Bespoke Architectural Cut</h4>
            <p>Balanced silhouettes bridging heritage old-money proportions with modern Gen-Z smart-casual comfort.</p>
          </div>
          <div className="cf-pillar-item">
            <ShieldCheck size={28} className="cf-pillar-icon" />
            <h4>Sustainable Small-Batch Drops</h4>
            <p>Zero deadstock overproduction. Every drop is crafted in limited batches to guarantee exclusive quality.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
