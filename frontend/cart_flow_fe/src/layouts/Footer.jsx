import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import './Storefront.css';

export function Footer() {
  return (
    <footer className="cf-store-footer">
      {/* Brand Perks Strip */}
      <div className="cf-footer-perks-strip">
        <div className="cf-store-container cf-perks-row">
          <div className="cf-perk-block">
            <Truck size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Complimentary Express Shipping</span>
              <span className="cf-perk-sub">On orders exceeding ₹1,999</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <RotateCcw size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">30-Day Flawless Returns</span>
              <span className="cf-perk-sub">Pre-paid labels included</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <ShieldCheck size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Secure SSL Checkout</span>
              <span className="cf-perk-sub">256-bit encrypted transactions</span>
            </div>
          </div>
          <div className="cf-perk-block">
            <Sparkles size={20} className="cf-perk-icon" />
            <div>
              <span className="cf-perk-heading">Express Pan-India Delivery</span>
              <span className="cf-perk-sub">Dispatched within 24 hours</span>
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
