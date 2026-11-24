import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Feather, Sparkles, Compass, ArrowRight, Check, Lock } from 'lucide-react';
import './Storefront.css';

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="cf-store-footer">
      {/* Brand Craftsmanship & Garment Pillars Strip */}
      <div className="cf-footer-perks-strip">
        <div className="cf-store-container cf-perks-row">
          <div className="cf-perk-block">
            <Award size={22} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Master Atelier Tailoring</span>
              <span className="cf-perk-sub">Handcrafted seams & structured Italian cut</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Feather size={22} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">100% Pure Natural Fibres</span>
              <span className="cf-perk-sub">Normandy flax linen & Egyptian long-staple cotton</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Sparkles size={22} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Limited Small-Batch Runs</span>
              <span className="cf-perk-sub">Zero mass overproduction, exclusive curated drops</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Compass size={22} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Engineered Silhouette</span>
              <span className="cf-perk-sub">Preshrunk & sculpted for modern proportions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Footer Content Grid (4 Balanced Columns) */}
      <div className="cf-store-container cf-footer-content-grid">
        {/* Col 1: Brand Atelier & Newsletter */}
        <div className="cf-footer-brand-col">
          <Link to="/" className="cf-footer-brand-title">
            CART<span>FLOW</span>
          </Link>
          <p className="cf-footer-brand-desc">
            A quiet-luxury menswear label engineered around architectural tailoring, pure natural fibres, and limited weekly batch releases.
          </p>

          <form onSubmit={handleSubscribe} className="cf-footer-newsletter-wrap">
            <input
              type="email"
              required
              placeholder="Enter your email for private drop access..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" aria-label="Subscribe to newsletter">
              {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>
          {subscribed && (
            <span className="cf-footer-subscribed-notice">
              You are on the VIP Radar. Check your inbox!
            </span>
          )}

          <div className="cf-footer-concierge-hint">
            <span>Concierge:</span> <strong>concierge@cartflow.com</strong>
          </div>
        </div>

        {/* Col 2: Collections & Drops */}
        <div className="cf-footer-links-col">
          <h5>The Drops</h5>
          <ul>
            <li><Link to="/shop?cat=Old Money">The Old Money Edit</Link></li>
            <li><Link to="/shop?cat=Formal & Suiting">Architectural Suiting</Link></li>
            <li><Link to="/shop?cat=Linen & Resort">Normandy Linen Resort</Link></li>
            <li><Link to="/shop?cat=Co-Ords">Tailored Co-Ords & Sets</Link></li>
            <li><Link to="/shop?cat=Footwear">Handcrafted Footwear</Link></li>
            <li><Link to="/shop">View All Drops &rarr;</Link></li>
          </ul>
        </div>

        {/* Col 3: Client Concierge */}
        <div className="cf-footer-links-col">
          <h5>Client Concierge</h5>
          <ul>
            <li><Link to="/account">Track Orders & Shipments</Link></li>
            <li><Link to="/account">Doorstep Exchanges</Link></li>
            <li><Link to="/account">Size & Measurement Guide</Link></li>
            <li><Link to="/cart">Shopping Bag & Wardrobe</Link></li>
            <li><Link to="/account">VIP Member Privileges</Link></li>
          </ul>
        </div>

        {/* Col 4: The House & Philosophy */}
        <div className="cf-footer-links-col">
          <h5>The Atelier</h5>
          <ul>
            <li><Link to="/shop">Textile Philosophy</Link></li>
            <li><Link to="/shop">Small-Batch Production</Link></li>
            <li><Link to="/shop">Master Tailoring Standards</Link></li>
            <li><Link to="/shop">Garment Care & Longevity</Link></li>
            <li><Link to="/account">VIP Drop Radar</Link></li>
          </ul>
        </div>
      </div>

      {/* Payment & Security Trust Strip */}
      <div className="cf-store-container cf-footer-trust-strip">
        <div className="cf-trust-left">
          <Lock size={13} />
          <span>256-Bit SSL Secure Checkout • 100% Genuine Apparel</span>
        </div>
        <div className="cf-trust-badges">
          <span className="cf-payment-pill">UPI</span>
          <span className="cf-payment-pill">RUPAY</span>
          <span className="cf-payment-pill">VISA</span>
          <span className="cf-payment-pill">MASTERCARD</span>
          <span className="cf-payment-pill">NETBANKING</span>
          <span className="cf-payment-pill">COD</span>
        </div>
      </div>

      {/* Footer Bottom Legal Bar */}
      <div className="cf-store-container cf-footer-bottom-bar">
        <span>© 2026 CARTFLOW. All rights reserved.</span>
        <span className="cf-footer-mantra">Engineered for Enduring Elegance & Modern Proportions.</span>
        <div className="cf-bottom-legal-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Exchange Guidelines</span>
          <span>Security</span>
        </div>
      </div>
    </footer>
  );
}
