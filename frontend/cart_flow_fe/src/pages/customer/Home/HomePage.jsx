import React from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from '../../../components/customer/ProductCard/ProductCard';
import './HomePage.css';

// Curated demo products with high quality lifestyle imagery
const FEATURED_PRODUCTS = [
  {
    id: 1,
    title: 'The Minimalist Wool Overcoat',
    category: 'Outerwear',
    price: 245.0,
    originalPrice: 320.0,
    rating: 4.9,
    reviewCount: 68,
    badge: 'BESTSELLER',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    colors: ['#1c1917', '#78716c', '#44403c'],
  },
  {
    id: 2,
    title: 'Structured Boxy Blazer',
    category: 'Tailored',
    price: 185.0,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 34,
    badge: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    colors: ['#0f172a', '#e2e8f0'],
  },
  {
    id: 3,
    title: 'Italian Calfskin Derby Shoes',
    category: 'Footwear',
    price: 295.0,
    originalPrice: 350.0,
    rating: 5.0,
    reviewCount: 52,
    badge: 'SALE',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    colors: ['#18181b', '#713f12'],
  },
  {
    id: 4,
    title: 'Heavyweight Ribbed Cashmere Knit',
    category: 'Knitwear',
    price: 140.0,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 29,
    badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    colors: ['#f5f5f4', '#292524', '#0c4a6e'],
  },
];

export default function HomePage() {
  return (
    <div className="cf-home">
      {/* Hero Editorial Banner */}
      <section className="cf-hero">
        <div className="cf-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
            alt="CartFlow Autumn Collection"
            className="cf-hero-img"
          />
          <div className="cf-hero-overlay" />
        </div>

        <div className="cf-container cf-hero-content">
          <span className="cf-hero-tag">Autumn / Winter 2026 Collection</span>
          <h1 className="cf-hero-title">
            ENGINEERED<br />MINIMALISM
          </h1>
          <p className="cf-hero-desc">
            Redefining wardrobe staples through architectural tailoring, sustainable fabrics, and intelligent virtual fitting.
          </p>
          <div className="cf-hero-actions">
            <a href="#shop" className="cf-btn-hero primary">
              Explore Collection <ArrowRight size={16} />
            </a>
            <a href="#virtual-fitting" className="cf-btn-hero secondary">
              <Sparkles size={16} /> Try-On Studio
            </a>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="cf-categories-section">
        <div className="cf-container">
          <div className="cf-section-header">
            <div>
              <span className="cf-section-subtitle">Curated Categories</span>
              <h2 className="cf-section-title">Shop by Silhouette</h2>
            </div>
            <a href="#all" className="cf-view-all">
              View All <ArrowRight size={14} />
            </a>
          </div>

          <div className="cf-category-grid">
            <div className="cf-cat-card">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
                alt="Outerwear"
              />
              <div className="cf-cat-overlay">
                <h3>Outerwear</h3>
                <p>Tailored trench & overcoats</p>
                <span className="cf-cat-link">Shop Outerwear <ArrowRight size={14} /></span>
              </div>
            </div>

            <div className="cf-cat-card">
              <img
                src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80"
                alt="Apparel"
              />
              <div className="cf-cat-overlay">
                <h3>Apparel</h3>
                <p>Relaxed fits & textured knits</p>
                <span className="cf-cat-link">Shop Apparel <ArrowRight size={14} /></span>
              </div>
            </div>

            <div className="cf-cat-card">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                alt="Footwear"
              />
              <div className="cf-cat-overlay">
                <h3>Footwear</h3>
                <p>Artisanal leathercraft</p>
                <span className="cf-cat-link">Shop Footwear <ArrowRight size={14} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="cf-products-section">
        <div className="cf-container">
          <div className="cf-section-header">
            <div>
              <span className="cf-section-subtitle">Trending This Week</span>
              <h2 className="cf-section-title">Curated Essentials</h2>
            </div>
            <a href="#shop" className="cf-view-all">
              Explore All (24) <ArrowRight size={14} />
            </a>
          </div>

          <div className="cf-products-grid">
            {FEATURED_PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} {...prod} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Try-On Innovation Banner */}
      <section className="cf-innovation-banner">
        <div className="cf-container cf-innovation-inner">
          <div className="cf-innovation-text">
            <span className="cf-badge-glow">
              <Sparkles size={14} /> Powered by FastAPI AI Service
            </span>
            <h2>Virtual Fitting Studio</h2>
            <p>
              Upload your photo or select a personalized 3D avatar to preview garments with accurate drape, sizing, and lighting simulations before placing an order.
            </p>
            <div className="cf-innovation-actions">
              <button className="cf-btn-hero primary">
                Launch Try-On Beta <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="cf-innovation-media">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80"
              alt="AI Virtual Try On Preview"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
