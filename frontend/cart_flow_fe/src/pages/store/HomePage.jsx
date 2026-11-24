import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShoppingBag, Eye, ShieldCheck, Flame, Compass, Award } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Badge, ProductCard } from '../../components/ui';
import './StorePages.css';

export default function HomePage() {
  const { addToCart } = useCart();
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1800);
  };

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
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
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
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
              isAdded={addedItemNotice === product.id}
            />
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
