import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { Input } from '../../components/ui';
import './StorePages.css';

// Backend-ready Catalogs schema: image, title/name, description, category filter key, count
const CATALOGS = [
  {
    id: 'old-money',
    name: 'Old Money',
    category: 'Old Money',
    itemCount: '48 Pieces',
    description: 'Timeless quiet-luxury silhouettes crafted in Egyptian combed cotton and bespoke tailoring.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'knitwear',
    name: 'Knitwear & Sweaters',
    category: 'Knitwear & Sweaters',
    itemCount: '28 Pieces',
    description: 'Heavyweight Peruvian cotton and cable-knit weaves engineered for structured drape.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'formal',
    name: 'Formal & Suiting',
    category: 'Formal & Suiting',
    itemCount: '36 Pieces',
    description: 'Double-breasted blazers, Italian pinpoint shirts, and sharp architectural suiting.',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'linen',
    name: 'Linen & Resort',
    category: 'Linen & Resort',
    itemCount: '42 Pieces',
    description: 'Breathable Normandy flax linen and relaxed Mediterranean resort tailoring.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'trousers',
    name: 'Trousers',
    category: 'Trousers',
    itemCount: '26 Pieces',
    description: 'High-rise Gurkha trousers and pleated cuts with tailored horn waist adjusters.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'coords',
    name: 'Co-Ords',
    category: 'Co-Ords',
    itemCount: '32 Pieces',
    description: 'Matched shacket and trouser sets for effortless contemporary styling.',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'footwear',
    name: 'Footwear',
    category: 'Footwear',
    itemCount: '24 Pieces',
    description: 'Goodyear-welted artisanal suede loafers and Italian leather footwear.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop',
  },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalogs = useMemo(() => {
    if (!searchQuery.trim()) return CATALOGS;
    const q = searchQuery.toLowerCase().trim();
    return CATALOGS.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="cf-store-container cf-catalog-page-wrap">
      {/* Editorial Header */}
      <div className="cf-shop-banner-strip">
        <div className="cf-shop-breadcrumb">
          <Link to="/">Home</Link>
          <span className="cf-bc-separator">/</span>
          <span className="cf-bc-current">Catalogs</span>
        </div>

        <div className="cf-shop-header-row">
          <div>
            <span className="cf-section-pretitle">Curated Archive</span>
            <h1 className="cf-shop-page-title">All Catalogs</h1>
            <p className="cf-shop-page-subtitle">
              Select any catalog below to explore its garments in the shop.
            </p>
          </div>

          <Link to="/shop" className="cf-section-view-all">
            View All Products in Shop <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Catalog Search Toolbar */}
      <div className="cf-catalog-search-bar">
        <div className="cf-shop-search-box">
          <Input
            placeholder="Search catalogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="cf-shop-search-field"
          />
          {searchQuery && (
            <button
              type="button"
              className="cf-search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Catalog Cards Grid (Only Catalog Cards — 5:6 Ratio) */}
      {filteredCatalogs.length === 0 ? (
        <div className="cf-shop-empty-state">
          <h3>No catalogs found</h3>
          <p>Try searching with a different keyword or view all catalogs.</p>
        </div>
      ) : (
        <div className="cf-catalogs-page-grid">
          {filteredCatalogs.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?cat=${encodeURIComponent(cat.category)}`}
              className="cf-catalog-card cf-catalog-archive-card"
            >
              <div className="cf-catalog-img-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    if (cat.fallback) e.currentTarget.src = cat.fallback;
                  }}
                />
              </div>
              <div className="cf-catalog-archive-body">
                <div className="cf-catalog-meta">
                  <h2 className="cf-catalog-name">{cat.name}</h2>
                  <span className="cf-catalog-count">
                    {cat.itemCount} <ArrowRight size={11} />
                  </span>
                </div>
                {cat.description && (
                  <p className="cf-catalog-archive-desc">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
