import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  return (
    <header className="cf-header-wrapper">
      {/* Announcement Bar */}
      <div className="cf-announcement-bar">
        <div className="cf-container cf-announcement-content">
          <span>Complimentary Express Shipping on orders over $150 &nbsp;•&nbsp; Free 30-Day Returns</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="cf-navbar">
        <div className="cf-container cf-nav-inner">
          {/* Mobile Menu Toggle */}
          <button 
            className="cf-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo */}
          <a href="/" className="cf-brand-logo">
            CART<span>FLOW</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="cf-nav-links">
            <li><a href="/" className="active">New In</a></li>
            <li><a href="#collections">Collections</a></li>
            <li><a href="#apparel">Apparel</a></li>
            <li><a href="#footwear">Footwear</a></li>
            <li><a href="#accessories">Accessories</a></li>
            <li><a href="#sale" className="cf-link-sale">Sale</a></li>
          </ul>

          {/* Action Icons */}
          <div className="cf-nav-actions">
            <a href="/admin" className="cf-console-link-btn" title="Open Admin Try-On Console">
              <span className="cf-console-dot">•</span> Admin Console
            </a>
            <button className="cf-action-btn" aria-label="Search Catalog">
              <Search size={20} strokeWidth={1.75} />
            </button>
            <a href="#login" className="cf-action-btn" aria-label="User Account">
              <User size={20} strokeWidth={1.75} />
            </a>
            <button className="cf-action-btn" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.75} />
            </button>
            <button className="cf-action-btn cf-cart-btn" aria-label="Shopping Cart">
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && <span className="cf-cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="cf-mobile-menu">
            <a href="/" onClick={() => setMobileMenuOpen(false)}>New In</a>
            <a href="#collections" onClick={() => setMobileMenuOpen(false)}>Collections</a>
            <a href="#apparel" onClick={() => setMobileMenuOpen(false)}>Apparel</a>
            <a href="#footwear" onClick={() => setMobileMenuOpen(false)}>Footwear</a>
            <a href="#accessories" onClick={() => setMobileMenuOpen(false)}>Accessories</a>
            <a href="#sale" className="cf-link-sale" onClick={() => setMobileMenuOpen(false)}>Sale</a>
            <div className="cf-mobile-menu-divider" />
            <a href="#login" className="cf-mobile-account-link" onClick={() => setMobileMenuOpen(false)}>
              Sign In / Account <ArrowRight size={16} />
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
