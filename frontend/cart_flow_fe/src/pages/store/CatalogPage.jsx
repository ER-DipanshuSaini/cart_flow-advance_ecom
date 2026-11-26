import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { Input } from '../../components/ui';
import { getActiveCatalogs, getListedStoreProducts } from '../../data/inventoryProducts';
import './StorePages.css';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const catalogs = useMemo(() => {
    const active = getActiveCatalogs();
    const listed = getListedStoreProducts();
    return active.map((cat) => {
      const count = listed.filter(
        (p) => String(p.category || '').toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...cat,
        category: cat.name,
        itemCount: `${count} ${count === 1 ? 'Piece' : 'Pieces'}`,
      };
    });
  }, []);

  const filteredCatalogs = useMemo(() => {
    if (!searchQuery.trim()) return catalogs;
    const q = searchQuery.toLowerCase().trim();
    return catalogs.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description || '').toLowerCase().includes(q)
    );
  }, [catalogs, searchQuery]);

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
