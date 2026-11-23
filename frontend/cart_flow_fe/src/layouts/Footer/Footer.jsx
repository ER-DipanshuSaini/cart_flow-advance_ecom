import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="cf-footer">
      {/* Value Badges Banner */}
      <div className="cf-footer-perks">
        <div className="cf-container cf-perks-grid">
          <div className="cf-perk-item">
            <Truck size={24} strokeWidth={1.5} />
            <div>
              <h4>Complimentary Delivery</h4>
              <p>On domestic orders above $150</p>
            </div>
          </div>
          <div className="cf-perk-item">
            <RotateCcw size={24} strokeWidth={1.5} />
            <div>
              <h4>Effortless Returns</h4>
              <p>30-day seamless exchange policy</p>
            </div>
          </div>
          <div className="cf-perk-item">
            <ShieldCheck size={24} strokeWidth={1.5} />
            <div>
              <h4>Secure Checkout</h4>
              <p>256-bit SSL encrypted transactions</p>
            </div>
          </div>
          <div className="cf-perk-item">
            <Sparkles size={24} strokeWidth={1.5} />
            <div>
              <h4>AI Try-On Ready</h4>
              <p>Virtual fitting powered by AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="cf-container cf-footer-main">
        <div className="cf-footer-grid">
          {/* Brand & Newsletter */}
          <div className="cf-footer-col cf-col-brand">
            <h3 className="cf-footer-logo">CART<span>FLOW</span></h3>
            <p className="cf-footer-desc">
              Curated luxury fashion and essentials engineered with modern aesthetic standards and artificial intelligence.
            </p>
            <div className="cf-newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="button" aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Column 1 */}
          <div className="cf-footer-col">
            <h5>Collections</h5>
            <ul>
              <li><a href="#new">New Season 2026</a></li>
              <li><a href="#minimal">The Minimal Capsule</a></li>
              <li><a href="#apparel">Outerwear & Coats</a></li>
              <li><a href="#footwear">Italian Leather Shoes</a></li>
              <li><a href="#accessories">Everyday Carry</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="cf-footer-col">
            <h5>Client Services</h5>
            <ul>
              <li><a href="#track">Track Order</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#sizing">Size Guide</a></li>
              <li><a href="#support">Concierge Support</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="cf-footer-col">
            <h5>Organization</h5>
            <ul>
              <li><a href="#about">About CartFlow</a></li>
              <li><a href="#sustainability">Sustainability Mission</a></li>
              <li><a href="#press">Press & Editorial</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#admin">Admin Portal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="cf-footer-bottom">
          <p>© 2026 CartFlow Inc. All rights reserved.</p>
          <div className="cf-footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
