import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui';
import './Storefront.css';

export function Navbar() {
  const { cartCount, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    try {
      return sessionStorage.getItem('cf_announcement_closed') !== 'true';
    } catch {
      return true;
    }
  });

  const navigate = useNavigate();

  const handleDismissAnnouncement = () => {
    setShowAnnouncement(false);
    try {
      sessionStorage.setItem('cf_announcement_closed', 'true');
    } catch {
      // storage disabled
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="cf-store-header">
      {/* 1. Dismissable Announcement Bar */}
      {showAnnouncement && (
        <div className="cf-announcement-strip">
          <div className="cf-announcement-inner">
            <span>
              <strong>NEW DROP:</strong> The Old Money & Formal Capsule &nbsp;•&nbsp; Free Express Shipping on orders over ₹1,999
            </span>
            <button
              type="button"
              className="cf-announcement-close-btn"
              onClick={handleDismissAnnouncement}
              title="Dismiss announcement"
              aria-label="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <nav className="cf-store-navbar">
        <div className="cf-nav-container">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="cf-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Brand Logo with Royal Navy Accent */}
          <Link to="/" className="cf-store-logo">
            CART<span>FLOW</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="cf-desktop-nav">
            <Link to="/" className="cf-nav-link">Home</Link>
            <Link to="/shop" className="cf-nav-link">All Drops</Link>
            <Link to="/shop?cat=Old Money" className="cf-nav-link">Old Money</Link>
            <Link to="/shop?cat=Formal & Suiting" className="cf-nav-link">Formal & Suiting</Link>
            <Link to="/shop?cat=Linen & Resort" className="cf-nav-link">Linen & Resort</Link>
            <Link to="/shop?cat=Co-Ords" className="cf-nav-link">Co-Ords</Link>
          </div>

          {/* Search Bar */}
          <form className="cf-nav-search-form" onSubmit={handleSearchSubmit}>
            <Search size={14} className="cf-search-input-icon" />
            <input
              type="text"
              placeholder="Search Old Money, Shirts, Suits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cf-nav-search-input"
            />
          </form>

          {/* Right Action Icons (Discreet Theme Toggle, User, Cart) */}
          <div className="cf-nav-actions-group">
            {/* Subtle, non-intrusive theme toggle */}
            <ThemeToggle />

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
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>All Drops</Link>
            <Link to="/shop?cat=Old Money" onClick={() => setMobileMenuOpen(false)}>Old Money Edit</Link>
            <Link to="/shop?cat=Formal & Suiting" onClick={() => setMobileMenuOpen(false)}>Formal & Suiting</Link>
            <Link to="/shop?cat=Linen & Resort" onClick={() => setMobileMenuOpen(false)}>Linen & Resort</Link>
            <Link to="/shop?cat=Co-Ords" onClick={() => setMobileMenuOpen(false)}>Co-Ords</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Shopping Bag ({cartCount})</Link>
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
