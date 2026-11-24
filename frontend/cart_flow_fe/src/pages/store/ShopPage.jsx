import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingBag, Eye, Star, Filter, X, SlidersHorizontal, Grid3X3, LayoutGrid, Check } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Input, Dropdown, Pagination, Badge } from '../../components/ui';
import './StorePages.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'all';
  const urlQuery = searchParams.get('q') || '';

  const [searchFilter, setSearchFilter] = useState(urlQuery);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // 8 items = 2 rows of 4
  const [gridColumns, setGridColumns] = useState(4); // 4 or 3
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const { addToCart } = useCart();

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search query filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (priceRange === 'under-100') {
      list = list.filter((p) => p.price < 100);
    } else if (priceRange === '100-200') {
      list = list.filter((p) => p.price >= 100 && p.price <= 200);
    } else if (priceRange === 'over-200') {
      list = list.filter((p) => p.price > 200);
    }

    // Sort order
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [activeCategory, searchFilter, priceRange, sortBy]);

  const paginatedList = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCategoryChange = (catName) => {
    if (catName === 'all' || catName === 'All Drops') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catName);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    searchParams.delete('cat');
    setSearchParams(searchParams);
    setSearchFilter('');
    setPriceRange('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1800);
  };

  const hasActiveFilters = activeCategory !== 'all' || searchFilter.trim() !== '' || priceRange !== 'all';

  return (
    <div className="cf-store-container cf-shop-page-wrap">
      {/* Editorial Header / Breadcrumb Strip */}
      <div className="cf-shop-banner-strip">
        <div className="cf-shop-breadcrumb">
          <Link to="/">Home</Link>
          <span className="cf-bc-separator">/</span>
          <span>Catalog</span>
          {activeCategory !== 'all' && (
            <>
              <span className="cf-bc-separator">/</span>
              <span className="cf-bc-current">{activeCategory}</span>
            </>
          )}
        </div>
        
        <div className="cf-shop-header-row">
          <div>
            <h1 className="cf-shop-page-title">
              {activeCategory === 'all' ? 'Ready-to-Wear Catalog' : activeCategory}
            </h1>
            <p className="cf-shop-page-subtitle">
              Showing {filteredProducts.length} curated luxury garments engineered for modern wardrobes.
            </p>
          </div>

          <div className="cf-shop-stats-pills">
            <span className="cf-stat-tag">Imperial Navy #003F7F Accent</span>
            <span className="cf-stat-tag">4-Column Grid</span>
            <span className="cf-stat-tag">Snitch Aesthetic</span>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="cf-category-pills-row">
        {CATEGORIES.map((cat) => {
          const isActive =
            (cat.id === 'all' && activeCategory === 'all') ||
            cat.name.toLowerCase() === activeCategory.toLowerCase();

          return (
            <button
              key={cat.id}
              type="button"
              className={`cf-cat-pill ${isActive ? 'is-active' : ''}`}
              onClick={() => handleCategoryChange(cat.id === 'all' ? 'all' : cat.name)}
            >
              <span>{cat.name}</span>
              <span className="cf-pill-count">{cat.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="cf-shop-toolbar">
        {/* Left: Search input */}
        <div className="cf-shop-search-box">
          <Input
            placeholder="Search silhouettes, fabrics..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            icon={Search}
            className="cf-shop-search-field"
          />
          {searchFilter && (
            <button
              type="button"
              className="cf-search-clear-btn"
              onClick={() => {
                setSearchFilter('');
                setCurrentPage(1);
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right Controls: Price filter, Sorting, Grid switch */}
        <div className="cf-shop-right-controls">
          {/* Price Range Dropdown */}
          <div className="cf-filter-dropdown-wrap">
            <Dropdown
              options={[
                { label: 'All Price Tiers', value: 'all' },
                { label: 'Under $100', value: 'under-100' },
                { label: '$100 – $200', value: '100-200' },
                { label: '$200 and Above', value: 'over-200' },
              ]}
              value={priceRange}
              onChange={(val) => {
                setPriceRange(val);
                setCurrentPage(1);
              }}
              searchable={false}
              className="cf-shop-filter-dropdown"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="cf-filter-dropdown-wrap">
            <Dropdown
              options={[
                { label: 'Featured Arrivals', value: 'featured' },
                { label: 'Price: Low to High', value: 'price-low' },
                { label: 'Price: High to Low', value: 'price-high' },
                { label: 'Highest Rated', value: 'rating' },
                { label: 'Alphabetical', value: 'title' },
              ]}
              value={sortBy}
              onChange={setSortBy}
              searchable={false}
              className="cf-shop-sort-dropdown"
            />
          </div>

          {/* Grid Layout Switcher (Desktop) */}
          <div className="cf-grid-layout-switcher" title="Toggle Grid Layout">
            <button
              type="button"
              className={`cf-grid-switch-btn ${gridColumns === 4 ? 'is-active' : ''}`}
              onClick={() => setGridColumns(4)}
              title="4-Column View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`cf-grid-switch-btn ${gridColumns === 3 ? 'is-active' : ''}`}
              onClick={() => setGridColumns(3)}
              title="3-Column View"
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="cf-active-filters-bar">
          <span className="cf-active-filters-label">Active Filters:</span>

          {activeCategory !== 'all' && (
            <span className="cf-active-chip">
              Category: {activeCategory}
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className="cf-chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {searchFilter.trim() && (
            <span className="cf-active-chip">
              Query: "{searchFilter}"
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="cf-chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="cf-active-chip">
              Price: {priceRange}
              <button
                type="button"
                onClick={() => setPriceRange('all')}
                className="cf-chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}

          <button
            type="button"
            className="cf-clear-all-link"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Products Catalog Grid */}
      {paginatedList.length === 0 ? (
        <div className="cf-shop-empty-state">
          <div className="cf-empty-icon-wrap">
            <Filter size={32} />
          </div>
          <h3>No garments match your filters</h3>
          <p>Try resetting active filters or searching for alternative aesthetics like linen, blazer, or polo.</p>
          <Button variant="primary" onClick={clearAllFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className={`cf-products-compact-grid ${gridColumns === 3 ? 'is-3-cols' : ''}`}>
          {paginatedList.map((product) => {
            const discountPct = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            const isJustAdded = addedItemNotice === product.id;

            return (
              <div key={product.id} className="cf-compact-product-card">
                {/* Image Media Box */}
                <div className="cf-compact-media-box">
                  {/* Badges */}
                  <div className="cf-card-badges-row">
                    {product.badge && (
                      <span
                        className={`cf-compact-badge ${
                          product.badge.toLowerCase().includes('money')
                            ? 'is-oldmoney'
                            : product.badge.toLowerCase().includes('viral')
                            ? 'is-viral'
                            : ''
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    {discountPct && (
                      <span className="cf-compact-badge is-discount">-{discountPct}%</span>
                    )}
                  </div>

                  {/* Product Clickable Image */}
                  <Link to={`/product/${product.id}`} className="cf-compact-img-link">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="cf-compact-cover-img"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'; }}
                    />
                  </Link>

                  {/* Sizes Quick Preview Bar */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="cf-card-sizes-overlay">
                      <span>Sizes: {product.sizes.join(' • ')}</span>
                    </div>
                  )}

                  {/* Hover Actions Strip */}
                  <div className="cf-compact-hover-actions">
                    <Button
                      size="sm"
                      variant={isJustAdded ? 'secondary' : 'primary'}
                      icon={isJustAdded ? Check : ShoppingBag}
                      className="cf-compact-quick-add"
                      onClick={() => handleQuickAdd(product)}
                    >
                      {isJustAdded ? 'Added to Bag' : 'Quick Add'}
                    </Button>
                    <Link to={`/product/${product.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        className="cf-compact-view-btn"
                        title="View Details"
                      />
                    </Link>
                  </div>
                </div>

                {/* Card Details & Metadata */}
                <div className="cf-compact-details">
                  <div className="cf-compact-meta-row">
                    <span className="cf-compact-cat">{product.category}</span>
                    <div className="cf-compact-rating">
                      <Star size={11} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
                      <span>{product.rating}</span>
                      <span className="cf-rating-count">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="cf-compact-title">
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>

                  {/* Color Swatch Dots */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="cf-card-colors-row">
                      {product.colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="cf-card-color-dot"
                          style={{ backgroundColor: c }}
                          title={`Color variant ${idx + 1}`}
                        />
                      ))}
                      <span className="cf-color-count-label">+{product.colors.length} shades</span>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="cf-compact-price-row">
                    <span className="cf-compact-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="cf-compact-orig-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Strip */}
      {filteredProducts.length > pageSize && (
        <div className="cf-shop-pagination-wrap">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredProducts.length}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}
