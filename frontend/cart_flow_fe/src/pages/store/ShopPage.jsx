import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingBag, Eye, Star, Filter } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Input, Dropdown, Pagination, Badge } from '../../components/ui';
import './StorePages.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'all';
  const urlQuery = searchParams.get('q') || '';
  const [searchFilter, setSearchFilter] = useState(urlQuery);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { addToCart } = useCart();

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeCategory, searchFilter, sortBy]);

  const paginatedList = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCategoryChange = (catId) => {
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  return (
    <div className="cf-store-container cf-shop-page-wrap">
      {/* Shop Header */}
      <div className="cf-shop-header-row">
        <div>
          <h1 className="cf-shop-page-title">Catalog & Collections</h1>
          <p className="cf-shop-page-subtitle">
            Showing {filteredProducts.length} curated luxury garments engineered for modern wardrobes.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="cf-shop-top-controls">
          <Input
            placeholder="Filter catalog..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            icon={Search}
            className="cf-shop-search-input"
          />

          <Dropdown
            options={[
              { label: 'Featured Arrivals', value: 'featured' },
              { label: 'Price: Low to High', value: 'price-low' },
              { label: 'Price: High to Low', value: 'price-high' },
              { label: 'Highest Rated', value: 'rating' },
            ]}
            value={sortBy}
            onChange={setSortBy}
            searchable={false}
            className="cf-shop-sort-dropdown"
          />
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="cf-category-pills-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cf-cat-pill ${
              (cat.id === 'all' && activeCategory === 'all') ||
              cat.name.toLowerCase() === activeCategory.toLowerCase()
                ? 'is-active'
                : ''
            }`}
            onClick={() => handleCategoryChange(cat.id === 'all' ? 'all' : cat.name)}
          >
            <span>{cat.name}</span>
            <span className="cf-pill-count">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {paginatedList.length === 0 ? (
        <div className="cf-shop-empty-state">
          <h3>No products match your filter</h3>
          <p>Try clearing your search query or selecting another category.</p>
          <Button
            variant="primary"
            onClick={() => {
              setSearchFilter('');
              handleCategoryChange('all');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="cf-products-catalog-grid">
          {paginatedList.map((product) => (
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
      )}

      {/* Pagination */}
      {filteredProducts.length > pageSize && (
        <div style={{ marginTop: '2.5rem' }}>
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredProducts.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
