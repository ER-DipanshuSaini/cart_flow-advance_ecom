import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle, Badge } from '../components/ui';
import './Storefront.css';

export function Navbar() {
  const { cartCount, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="cf-store-header">
      {/* Announcement Top Bar */}
      <div className="cf-announcement-strip">
        <span>Complimentary Express Shipping on orders over $150 &nbsp;•&nbsp; Free 30-Day Returns</span>
      </div>

      <nav className="cf-store-navbar">
        <div className="cf-nav-container">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="cf-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="cf-store-logo">
            CART<span>FLOW</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="cf-desktop-nav">
            <Link to="/" className="cf-nav-link">Home</Link>
            <Link to="/shop" className="cf-nav-link">Shop All</Link>
            <Link to="/shop?cat=Outerwear" className="cf-nav-link">Outerwear</Link>
            <Link to="/shop?cat=Tailored" className="cf-nav-link">Tailored</Link>
            <Link to="/components" className="cf-nav-link cf-nav-uikit">UI Kit</Link>
          </div>

          {/* Search Bar */}
          <form className="cf-nav-search-form" onSubmit={handleSearchSubmit}>
            <Search size={15} className="cf-search-input-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cf-nav-search-input"
            />
          </form>

          {/* Right Action Icons */}
          <div className="cf-nav-actions-group">
            <ThemeToggle size="sm" />

            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="cf-nav-icon-link"
              title={isAuthenticated ? `Account (${user.name})` : 'Sign In'}
            >
              <User size={19} />
              {isAuthenticated && <span className="cf-online-indicator" />}
            </Link>

            <button
              type="button"
              className="cf-nav-cart-btn"
              onClick={openCart}
              title="Open Shopping Cart"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="cf-cart-pill">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="cf-mobile-dropdown">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            <Link to="/shop?cat=Outerwear" onClick={() => setMobileMenuOpen(false)}>Outerwear</Link>
            <Link to="/shop?cat=Tailored" onClick={() => setMobileMenuOpen(false)}>Tailored</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>View Cart ({cartCount})</Link>
            <Link to="/components" onClick={() => setMobileMenuOpen(false)}>UI Kit Showcase</Link>
            <div className="cf-mobile-divider" />
            <Link to={isAuthenticated ? '/account' : '/login'} onClick={() => setMobileMenuOpen(false)}>
              {isAuthenticated ? `My Account (${user.name})` : 'Sign In / Register'} <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
