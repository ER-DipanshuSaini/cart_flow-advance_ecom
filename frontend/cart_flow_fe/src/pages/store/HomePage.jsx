import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Badge, Card } from '../../components/ui';
import './StorePages.css';

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div className="cf-store-page">
      {/* Hero Banner */}
      <section className="cf-store-hero">
        <div className="cf-hero-media">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
            alt="Autumn Collection"
            className="cf-hero-cover-img"
          />
          <div className="cf-hero-gradient-overlay" />
        </div>

        <div className="cf-store-container cf-hero-inner">
          <div className="cf-hero-text-block">
            <Badge variant="mono">• AUTUMN / WINTER 2026 CAPSULE</Badge>
            <h1 className="cf-hero-main-title">
              ARCHITECTURAL<br />MINIMALISM
            </h1>
            <p className="cf-hero-main-desc">
              Engineered wardrobe essentials featuring virgin wools, bespoke tailoring, and precision AI virtual try-on fitting.
            </p>
            <div className="cf-hero-btn-row">
              <Link to="/shop">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  Explore Full Catalog
                </Button>
              </Link>
              <Link to="/shop?cat=Outerwear">
                <Button variant="secondary" size="lg" icon={Sparkles}>
                  Virtual Try-On Picks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Silhouette Categories */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Curated Silhouettes</span>
            <h2 className="cf-section-headline">Shop by Category</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            All Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-categories-grid">
          <Link to="/shop?cat=Outerwear" className="cf-category-tile">
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
              alt="Outerwear"
            />
            <div className="cf-cat-tile-overlay">
              <h4>Outerwear</h4>
              <p>Heavy coats & technical parkas</p>
            </div>
          </Link>

          <Link to="/shop?cat=Tailored" className="cf-category-tile">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
              alt="Tailored"
            />
            <div className="cf-cat-tile-overlay">
              <h4>Tailored Suiting</h4>
              <p>Boxy blazers & wide-leg trousers</p>
            </div>
          </Link>

          <Link to="/shop?cat=Footwear" className="cf-category-tile">
            <img
              src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
              alt="Footwear"
            />
            <div className="cf-cat-tile-overlay">
              <h4>Artisanal Footwear</h4>
              <p>Handcrafted Italian calfskin</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Weekly Highlights</span>
            <h2 className="cf-section-headline">Trending Essentials</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            View Collection ({PRODUCTS.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-products-catalog-grid">
          {PRODUCTS.slice(0, 4).map((product) => (
            <div key={product.id} className="cf-store-product-card">
              <div className="cf-product-media-wrap">
                {product.badge && (
                  <span className={`cf-media-badge ${product.badge === 'SALE' ? 'is-sale' : ''}`}>
                    {product.badge}
                  </span>
                )}
                <Link to={`/product/${product.id}`}>
                  <img src={product.imageUrl} alt={product.title} className="cf-product-cover" />
                </Link>
                <div className="cf-media-actions-hover">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={ShoppingBag}
                    onClick={() => addToCart(product, 1)}
                  >
                    Quick Add
                  </Button>
                  <Link to={`/product/${product.id}`}>
                    <Button size="sm" variant="secondary" icon={Eye}>
                      Details
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="cf-product-meta-block">
                <div className="cf-meta-top-line">
                  <span className="cf-product-category">{product.category}</span>
                  <div className="cf-product-stars">
                    <Star size={12} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="cf-product-title-text">
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                </h3>

                <div className="cf-product-price-line">
                  <span className="cf-price-current">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="cf-price-strikethrough">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Try-On Innovation Banner */}
      <section className="cf-tryon-highlight-banner">
        <div className="cf-store-container cf-tryon-highlight-inner">
          <div className="cf-tryon-text-wrap">
            <Badge variant="mono">
              <Sparkles size={13} /> POWERED BY FASTAPI MICROSERVICES
            </Badge>
            <h2 className="cf-tryon-banner-heading">Virtual Fitting Room Studio</h2>
            <p className="cf-tryon-banner-desc">
              Experience zero-friction sizing and garment draping. Upload an avatar or picture to test fabrics and colors in real-time before making your purchase.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>
                Try On In Studio
              </Button>
            </Link>
          </div>
          <div className="cf-tryon-media-wrap">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80"
              alt="AI Virtual Fitting Room"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
