import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  LogOut,
  Sparkles,
  Flame
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui';
import './Storefront.css';

export function Navbar() {
  const { cartCount, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const menuTimerRef = useRef(null);
  const userTimerRef = useRef(null);

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
    }
  };

  // Safe hover handlers with 160ms buffer like Snitch & Flipkart
  const handleCollectionsEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setCollectionsOpen(true);
  };

  const handleCollectionsLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setCollectionsOpen(false);
    }, 160);
  };

  const handleUserEnter = () => {
    if (userTimerRef.current) clearTimeout(userTimerRef.current);
    setUserDropdownOpen(true);
  };

  const handleUserLeave = () => {
    userTimerRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 160);
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Member';
  const avatarLetter = user?.avatar || (user?.name ? user.name.charAt(0) : 'U');

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

          {/* Desktop Navigation Links with Snitch/Flipkart Mega Menu Trigger */}
          <div className="cf-desktop-nav">
            <Link to="/" className="cf-nav-link">Home</Link>
            <Link to="/shop" className="cf-nav-link">Shop</Link>
            <Link to="/catalog" className="cf-nav-link">Catalogs</Link>

            {/* Collections Mega Menu Trigger */}
            <div
              className="cf-nav-dropdown-wrapper"
              onMouseEnter={handleCollectionsEnter}
              onMouseLeave={handleCollectionsLeave}
            >
              <button
                type="button"
                className={`cf-nav-link cf-nav-dropdown-trigger ${collectionsOpen ? 'is-active' : ''}`}
                onClick={() => setCollectionsOpen(!collectionsOpen)}
              >
                <span>Collections</span>
                <ChevronDown size={13} className={`cf-nav-chevron ${collectionsOpen ? 'is-flipped' : ''}`} />
              </button>
            </div>

            <Link to="/shop?cat=Formal & Suiting" className="cf-nav-link">Formal</Link>
          </div>

          {/* Prominent Wide Search Bar */}
          <form className="cf-nav-search-form" onSubmit={handleSearchSubmit}>
            <Search size={15} className="cf-search-input-icon" />
            <input
              type="text"
              placeholder="Search shirts, blazers, linen, trousers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cf-nav-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="cf-search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Right Action Group: Theme Toggle, User Name Chip, Cart */}
          <div className="cf-nav-actions-group">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Chip: Shows Name when logged in */}
            {isAuthenticated ? (
              <div
                className="cf-nav-user-dropdown-wrap"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <Link to="/account" className="cf-nav-user-chip" title="View Account">
                  <span className="cf-user-avatar-badge">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user?.name || 'User'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      avatarLetter
                    )}
                  </span>
                  <span className="cf-user-name-text">Hi, {firstName}</span>
                  <ChevronDown size={13} className={`cf-user-chevron ${userDropdownOpen ? 'is-flipped' : ''}`} />
                </Link>

                {userDropdownOpen && (
                  <div className="cf-user-editorial-dropdown">
                    <div className="cf-mega-col-heading cf-user-dd-heading">
                      <span>{user?.name || 'Account'}</span>
                    </div>

                    <ul className="cf-mega-links cf-user-dd-links">
                      <li>
                        <Link to="/account?tab=profile" onClick={() => setUserDropdownOpen(false)}>
                          My Account &amp; Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/account?tab=orders" onClick={() => setUserDropdownOpen(false)}>
                          Orders &amp; Tracking
                        </Link>
                      </li>
                      <li>
                        <Link to="/account?tab=wishlist" onClick={() => setUserDropdownOpen(false)}>
                          Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link to="/account?tab=addresses" onClick={() => setUserDropdownOpen(false)}>
                          Saved Addresses
                        </Link>
                      </li>
                      <li className="cf-user-dd-divider" />
                      <li>
                        <button
                          type="button"
                          className="cf-user-dd-signout"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                        >
                          <LogOut size={13} />
                          <span>Sign Out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="cf-nav-signin-chip" title="Sign In">
                <User size={15} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              type="button"
              className="cf-nav-cart-btn"
              onClick={openCart}
              title="Open Shopping Bag"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="cf-cart-pill">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* 3. Snitch & Flipkart Style Full-Width Multi-Column Mega Menu Drawer */}
        {collectionsOpen && (
          <div
            className="cf-mega-menu-drawer"
            onMouseEnter={handleCollectionsEnter}
            onMouseLeave={handleCollectionsLeave}
          >
            <div className="cf-mega-menu-container">
              {/* Column 1: Curated Drops */}
              <div className="cf-mega-col">
                <div className="cf-mega-col-heading">Curated Drops</div>
                <ul className="cf-mega-links">
                  <li>
                    <Link to="/shop?cat=Old Money" onClick={() => setCollectionsOpen(false)}>
                      The Old Money Edit <span className="cf-mega-badge is-hot">HOT</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Linen & Resort" onClick={() => setCollectionsOpen(false)}>
                      Linen & Coastal Resort <span className="cf-mega-badge">NEW</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Formal & Suiting" onClick={() => setCollectionsOpen(false)}>
                      Architectural Suiting
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Co-Ords" onClick={() => setCollectionsOpen(false)}>
                      Monochrome Co-Ords
                    </Link>
                  </li>
                  <li className="cf-mega-all-item">
                    <Link to="/shop" className="cf-mega-view-all" onClick={() => setCollectionsOpen(false)}>
                      View All 240+ Drops <ArrowRight size={13} />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Topwear */}
              <div className="cf-mega-col">
                <div className="cf-mega-col-heading">Topwear</div>
                <ul className="cf-mega-links">
                  <li>
                    <Link to="/shop?cat=Old Money" onClick={() => setCollectionsOpen(false)}>
                      Textured Cuban Knits
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Formal & Suiting" onClick={() => setCollectionsOpen(false)}>
                      Double-Breasted Blazers
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Formal & Suiting" onClick={() => setCollectionsOpen(false)}>
                      Tailored Pinpoint Shirts
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Linen & Resort" onClick={() => setCollectionsOpen(false)}>
                      Normandy Flax Shirts
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Co-Ords" onClick={() => setCollectionsOpen(false)}>
                      Heavyweight Shackets
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Bottomwear & Tailoring */}
              <div className="cf-mega-col">
                <div className="cf-mega-col-heading">Bottomwear & Suiting</div>
                <ul className="cf-mega-links">
                  <li>
                    <Link to="/shop?cat=Old Money" onClick={() => setCollectionsOpen(false)}>
                      Italian Gurkha Trousers <span className="cf-mega-badge is-popular">BESTSELLER</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Formal & Suiting" onClick={() => setCollectionsOpen(false)}>
                      Pleated Wool-Blend Pants
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Linen & Resort" onClick={() => setCollectionsOpen(false)}>
                      Belgian Linen Drawstrings
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Co-Ords" onClick={() => setCollectionsOpen(false)}>
                      Relaxed Tailored Chinos
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Formal & Suiting" onClick={() => setCollectionsOpen(false)}>
                      Evening Tuxedo Trousers
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Footwear & Leather */}
              <div className="cf-mega-col">
                <div className="cf-mega-col-heading">Footwear & Loafers</div>
                <ul className="cf-mega-links">
                  <li>
                    <Link to="/shop?cat=Footwear" onClick={() => setCollectionsOpen(false)}>
                      Burnished Calf Loafers
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Footwear" onClick={() => setCollectionsOpen(false)}>
                      Suede Tassel Mules
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Footwear" onClick={() => setCollectionsOpen(false)}>
                      Top-Grain Leather Belts
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Footwear" onClick={() => setCollectionsOpen(false)}>
                      Italian Silk Pocket Squares
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?cat=Footwear" onClick={() => setCollectionsOpen(false)}>
                      Handmade Lapel Pins
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 5: Featured Lookbook Promo Card (Snitch Signature Look) */}
              <div className="cf-mega-promo-col">
                <Link
                  to="/shop?cat=Old Money"
                  className="cf-mega-promo-card"
                  onClick={() => setCollectionsOpen(false)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=700&auto=format&fit=crop"
                    alt="The Old Money Capsule"
                    className="cf-mega-promo-img"
                    loading="lazy"
                  />
                  <div className="cf-mega-promo-overlay">
                    <span className="cf-mega-promo-badge">SPRING / SUMMER '26</span>
                    <div className="cf-mega-promo-title">The Old Money Edit</div>
                    <div className="cf-mega-promo-desc">Italian woven tailoring & silk-blend knits</div>
                    <span className="cf-mega-promo-btn">
                      Explore Drop <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="cf-mobile-dropdown">
            <form
              className="cf-mobile-search-form"
              onSubmit={(e) => {
                handleSearchSubmit(e);
                setMobileMenuOpen(false);
              }}
            >
              <Search size={15} className="cf-search-input-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirts, blazers, linen..."
                className="cf-nav-search-input"
              />
            </form>

            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>Catalogs</Link>
            <Link to="/shop?cat=Old Money" onClick={() => setMobileMenuOpen(false)}>Old Money Edit</Link>
            <Link to="/shop?cat=Formal & Suiting" onClick={() => setMobileMenuOpen(false)}>Formal & Suiting</Link>
            <Link to="/shop?cat=Linen & Resort" onClick={() => setMobileMenuOpen(false)}>Linen & Resort</Link>
            <Link to="/shop?cat=Co-Ords" onClick={() => setMobileMenuOpen(false)}>Co-Ords & Sets</Link>
            <Link to="/shop?cat=Footwear" onClick={() => setMobileMenuOpen(false)}>Footwear & Loafers</Link>
            <div className="cf-mobile-divider" />
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Shopping Cart ({cartCount})</Link>
            <Link to={isAuthenticated ? '/account' : '/login'} onClick={() => setMobileMenuOpen(false)}>
              {isAuthenticated ? `Signed in as ${user.name}` : 'Sign In / Register'} <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
