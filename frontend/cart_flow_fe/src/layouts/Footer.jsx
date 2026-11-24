import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Feather, Sparkles, Compass, ArrowRight } from 'lucide-react';
import './Storefront.css';

export function Footer() {
  return (
    <footer className="cf-store-footer">
      {/* Brand Craftsmanship & Garment Pillars Strip */}
      <div className="cf-footer-perks-strip">
        <div className="cf-store-container cf-perks-row">
          <div className="cf-perk-block">
            <Award size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Master Atelier Tailoring</span>
              <span className="cf-perk-sub">Handcrafted seams & structured Italian cut</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Feather size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">100% Pure Natural Fibres</span>
              <span className="cf-perk-sub">Normandy flax linen & Egyptian long-staple cotton</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Sparkles size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Limited Small-Batch Runs</span>
              <span className="cf-perk-sub">Zero mass overproduction, exclusive curated drops</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Compass size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Engineered Silhouette</span>
              <span className="cf-perk-sub">Preshrunk & sculpted for modern proportions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="cf-store-container cf-footer-content-grid">
        <div className="cf-footer-brand-col">
          <h3 className="cf-footer-brand-title">CART<span>FLOW</span></h3>
          <p className="cf-footer-brand-desc">
            Next-generation e-commerce platform engineered with architectural minimalism, sustainable materials, and seamless high-speed commerce workflows.
          </p>
          <div className="cf-footer-newsletter-wrap">
            <input type="email" placeholder="Join the CartFlow newsletter..." />
            <button type="button" aria-label="Subscribe">
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="cf-footer-links-col">
          <h5>Collections</h5>
          <ul>
            <li><Link to="/shop">Shop All Arrivals</Link></li>
            <li><Link to="/shop?cat=Outerwear">Outerwear & Coats</Link></li>
            <li><Link to="/shop?cat=Tailored">Tailored Suiting</Link></li>
            <li><Link to="/shop?cat=Footwear">Artisanal Footwear</Link></li>
          </ul>
        </div>

        <div className="cf-footer-links-col">
          <h5>Client Care</h5>
          <ul>
            <li><Link to="/account">My Orders</Link></li>
            <li><Link to="/cart">Shopping Bag</Link></li>
            <li><Link to="/components">UI Kit Showcase</Link></li>
            <li><Link to="/admin-portal">Staff Portal</Link></li>
          </ul>
        </div>
      </div>

      <div className="cf-store-container cf-footer-bottom-bar">
        <span>© 2026 CartFlow Inc. All rights reserved.</span>
        <div className="cf-bottom-legal-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security</span>
        </div>
      </div>
    </footer>
  );
}
