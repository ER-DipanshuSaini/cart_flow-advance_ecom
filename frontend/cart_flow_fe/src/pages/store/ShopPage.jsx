import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, Grid3X3, LayoutGrid, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveCatalogs, getListedStoreProducts } from '../../data/inventoryProducts';
import { useCart } from '../../context/CartContext';
import { Button, Input, Dropdown, ProductCard } from '../../components/ui';
import './StorePages.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'all';
  const urlQuery = searchParams.get('q') || '';

  const [searchFilter, setSearchFilter] = useState(urlQuery);
  const [priceRange, setPriceRange] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // 8 items = 2 rows of 4
  const [gridColumns, setGridColumns] = useState(4); // 4 or 3
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const { addToCart } = useCart();
  const storeProducts = useMemo(() => getListedStoreProducts(), []);
  const catalogPills = useMemo(() => {
    const activeCats = getActiveCatalogs();
    return [
      { id: 'all', name: 'All Drops', count: storeProducts.length },
      ...activeCats.map((c) => ({
        id: c.id,
        name: c.name,
        count: storeProducts.filter(
          (p) => String(p.category || '').toLowerCase() === c.name.toLowerCase()
        ).length,
      })),
    ];
  }, [storeProducts]);

  useEffect(() => {
    setSearchFilter(urlQuery);
    setCurrentPage(1);
  }, [urlQuery]);

  // Unique sizes across all products for filter dropdown
  const availableSizes = useMemo(() => {
    const sizeSet = new Set();
    storeProducts.forEach((p) => (p.sizes || []).forEach((s) => sizeSet.add(s)));
    return [
      { label: 'All Sizes', value: 'all' },
      ...Array.from(sizeSet).map((s) => ({ label: `Size: ${s}`, value: s })),
    ];
  }, [storeProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...storeProducts];

    // Catalog / Category filter
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

    // Size filter
    if (sizeFilter !== 'all') {
      list = list.filter((p) => (p.sizes || []).includes(sizeFilter));
    }

    // Rating filter
    if (ratingFilter === '4.8') {
      list = list.filter((p) => p.rating >= 4.8);
    } else if (ratingFilter === '4.5') {
      list = list.filter((p) => p.rating >= 4.5);
    }

    // Availability & Offer filter
    if (stockFilter === 'in-stock') {
      list = list.filter((p) => p.inStock !== false);
    } else if (stockFilter === 'on-sale') {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Price range filter
    if (priceRange === 'under-2000') {
      list = list.filter((p) => p.price < 2000);
    } else if (priceRange === '2000-4000') {
      list = list.filter((p) => p.price >= 2000 && p.price <= 4000);
    } else if (priceRange === 'over-4000') {
      list = list.filter((p) => p.price > 4000);
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
  }, [storeProducts, activeCategory, searchFilter, sizeFilter, ratingFilter, stockFilter, priceRange, sortBy]);

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
    searchParams.delete('q');
    setSearchParams(searchParams);
    setSearchFilter('');
    setPriceRange('all');
    setSizeFilter('all');
    setRatingFilter('all');
    setStockFilter('all');
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

  const hasActiveFilters =
    activeCategory !== 'all' ||
    searchFilter.trim() !== '' ||
    priceRange !== 'all' ||
    sizeFilter !== 'all' ||
    ratingFilter !== 'all' ||
    stockFilter !== 'all';

  return (
    <div className="cf-store-container cf-shop-page-wrap">
      {/* Editorial Header / Breadcrumb Strip */}
      <div className="cf-shop-banner-strip">
        <div className="cf-shop-breadcrumb">
          <Link to="/">Home</Link>
          <span className="cf-bc-separator">/</span>
          <Link to="/shop">Shop</Link>
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
              {activeCategory === 'all' ? 'All Products' : activeCategory}
            </h1>
            <p className="cf-shop-page-subtitle">
              Showing {filteredProducts.length} curated garments engineered for modern wardrobes.
            </p>
          </div>

          <Link to="/catalog" className="cf-section-view-all">
            Browse All Catalogs <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="cf-category-pills-row">
        {catalogPills.map((cat) => {
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

        {/* Right Controls: Size, Rating, Availability, Price, Sorting, Grid switch */}
        <div className="cf-shop-right-controls">
          {/* Size Filter Dropdown */}
          <div className="cf-filter-dropdown-wrap">
            <Dropdown
              options={availableSizes}
              value={sizeFilter}
              onChange={(val) => {
                setSizeFilter(val);
                setCurrentPage(1);
              }}
              searchable={false}
              className="cf-shop-filter-dropdown"
            />
          </div>

          {/* Rating Filter Dropdown */}
          <div className="cf-filter-dropdown-wrap">
            <Dropdown
              options={[
                { label: 'All Ratings', value: 'all' },
                { label: '4.8 ★ & above', value: '4.8' },
                { label: '4.5 ★ & above', value: '4.5' },
              ]}
              value={ratingFilter}
              onChange={(val) => {
                setRatingFilter(val);
                setCurrentPage(1);
              }}
              searchable={false}
              className="cf-shop-filter-dropdown"
            />
          </div>

          {/* Availability / Offers Filter */}
          <div className="cf-filter-dropdown-wrap">
            <Dropdown
              options={[
                { label: 'All Availability', value: 'all' },
                { label: 'In Stock Only', value: 'in-stock' },
                { label: 'On Sale / Offers', value: 'on-sale' },
              ]}
              value={stockFilter}
              onChange={(val) => {
                setStockFilter(val);
                setCurrentPage(1);
              }}
              searchable={false}
              className="cf-shop-filter-dropdown"
            />
          </div>

          {/* Price Range Dropdown */}
          <div className="cf-filter-dropdown-wrap">
            <Dropdown
              options={[
                { label: 'All Price Tiers', value: 'all' },
                { label: 'Under ₹2,000', value: 'under-2000' },
                { label: '₹2,000 – ₹4,000', value: '2000-4000' },
                { label: '₹4,000 and Above', value: 'over-4000' },
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
              Catalog: {activeCategory}
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className="cf-chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {sizeFilter !== 'all' && (
            <span className="cf-active-chip">
              Size: {sizeFilter}
              <button
                type="button"
                onClick={() => setSizeFilter('all')}
                className="cf-chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {ratingFilter !== 'all' && (
            <span className="cf-active-chip">
              Rating: {ratingFilter} ★ &amp; up
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                className="cf-chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {stockFilter !== 'all' && (
            <span className="cf-active-chip">
              {stockFilter === 'on-sale' ? 'On Sale' : 'In Stock'}
              <button
                type="button"
                onClick={() => setStockFilter('all')}
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
          {paginatedList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
              isAdded={addedItemNotice === product.id}
            />
          ))}
        </div>
      )}

      {/* Storefront Pagination Bar */}
      {filteredProducts.length > pageSize && (() => {
        const totalPages = Math.ceil(filteredProducts.length / pageSize);
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, filteredProducts.length);
        const goToPage = (page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        };

        return (
          <div className="cf-shop-pagination-bar">
            <span className="cf-shop-pagination-status">
              Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
              <strong>{filteredProducts.length}</strong> products
            </span>

            <div className="cf-shop-pagination-controls">
              <button
                type="button"
                className="cf-shop-page-btn"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft size={15} /> Prev
              </button>

              <div className="cf-shop-page-numbers">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`cf-shop-page-num ${pageNum === currentPage ? 'is-active' : ''}`}
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="cf-shop-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
