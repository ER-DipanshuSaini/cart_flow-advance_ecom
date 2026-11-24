import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Star,
  ShoppingBag,
  Eye,
  ShieldCheck,
  Flame,
  Compass,
  Award,
  Feather,
  Scissors,
  Check,
  Mail,
  HelpCircle,
  Truck,
  RefreshCw,
  Layers,
  Heart,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { Button, Badge, ProductCard, Input } from '../../components/ui';
import './StorePages.css';

const HERO_SLIDES = [
  {
    id: 1,
    kicker: 'SUMMER CAPSULE 2026',
    title: 'THE OLD MONEY EDIT',
    subtitle: 'Signature Gurkha trousers, textured Cuban knit polos, and bespoke Italian blazers.',
    primaryBtn: { text: 'Shop Collection', link: '/shop' },
    secondaryBtn: { text: 'Explore Drops', link: '/shop?cat=Old Money' },
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 2,
    kicker: '100% FRENCH FLAX',
    title: 'ARCHITECTURAL LINEN',
    subtitle: 'Stone-washed Normandy linen overshirts engineered for effortless coastal drape.',
    primaryBtn: { text: 'Shop Linen', link: '/shop?cat=Linen & Resort' },
    secondaryBtn: { text: 'View Resort Edits', link: '/shop?cat=Linen & Resort' },
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 3,
    kicker: 'ITALIAN ATELIER',
    title: 'QUIET LUXURY FOOTWEAR',
    subtitle: 'Hand-burnished calf suede tassel loafers built on Goodyear-welted soles.',
    primaryBtn: { text: 'Shop Footwear', link: '/shop?cat=Footwear' },
    secondaryBtn: { text: 'All Collections', link: '/shop' },
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=2000&q=85',
  },
];

const CATALOG_ITEMS = [
  {
    id: 'shirts',
    name: 'Textured Shirts',
    category: 'Old Money',
    itemCount: '48 Pieces',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'suiting',
    name: 'Tailored Suiting & Blazers',
    category: 'Formal & Suiting',
    itemCount: '36 Pieces',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'linen',
    name: 'Linen & Resort Wear',
    category: 'Linen & Resort',
    itemCount: '42 Pieces',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'co-ords',
    name: 'Trousers & Co-Ords',
    category: 'Co-Ords',
    itemCount: '32 Pieces',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'footwear',
    name: 'Handcrafted Footwear',
    category: 'Footwear',
    itemCount: '24 Pieces',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop'
  }
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [addedItemNotice, setAddedItemNotice] = useState(null);
  const [vipEmail, setVipEmail] = useState('');
  const [vipSubscribed, setVipSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1800);
  };

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (vipEmail.trim()) {
      setVipSubscribed(true);
      setTimeout(() => setVipSubscribed(false), 5000);
      setVipEmail('');
    }
  };

  const spotlightProduct = PRODUCTS.find((p) => p.id === 6) || PRODUCTS[0];

  return (
    <div className="cf-store-page">
      {/* 1. Snitch / Shopify Minimal Luxury Hero Section */}
      <section className="cf-snitch-hero">
        <div className="cf-snitch-hero-media">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              className={`cf-snitch-hero-img ${idx === activeSlide ? 'is-active' : ''}`}
            />
          ))}
          <div className="cf-snitch-hero-overlay" />
        </div>

        <div className="cf-store-container cf-snitch-hero-content">
          <div className="cf-snitch-hero-card">
            <span className="cf-snitch-kicker">{HERO_SLIDES[activeSlide].kicker}</span>
            <h1 className="cf-snitch-title">{HERO_SLIDES[activeSlide].title}</h1>
            <p className="cf-snitch-subtitle">{HERO_SLIDES[activeSlide].subtitle}</p>

            <div className="cf-snitch-btn-row">
              <Link to={HERO_SLIDES[activeSlide].primaryBtn.link}>
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  {HERO_SLIDES[activeSlide].primaryBtn.text}
                </Button>
              </Link>
              <Link to={HERO_SLIDES[activeSlide].secondaryBtn.link}>
                <Button variant="secondary" size="lg">
                  {HERO_SLIDES[activeSlide].secondaryBtn.text}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Minimalist Slide Indicators */}
        <div className="cf-snitch-indicators">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`cf-snitch-dot ${idx === activeSlide ? 'is-active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Snitch-Inspired Ticker Strip */}
      <div className="cf-snitch-ticker">
        <div className="cf-ticker-track">
          <span>OLD MONEY CLASSICS • BESPOKE ITALIAN CUT • 100% FRENCH LINEN • COMPLIMENTARY EXPRESS SHIPPING • LIMITED BATCH DROPS • PREMIUM HANDCRAFTED APPAREL • OLD MONEY CLASSICS • BESPOKE ITALIAN CUT •</span>
        </div>
      </div>

      {/* 3. Clean Studio Apparel Catalog Showcase (5 Items in 1 Row) */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">The Wardrobe Edit</span>
            <h2 className="cf-section-headline">Shop by Catalog</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            Browse All Drops <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-catalog-showcase-grid">
          {CATALOG_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={`/shop?cat=${encodeURIComponent(item.category)}`}
              className="cf-catalog-card"
            >
              <div className="cf-catalog-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    if (item.fallback) e.currentTarget.src = item.fallback;
                  }}
                />
              </div>
              <div className="cf-catalog-meta">
                <h3 className="cf-catalog-name">{item.name}</h3>
                <span className="cf-catalog-count">
                  {item.itemCount} <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Drops: 4-Column Sleek Compact Grid */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">The New Arrival Drop</span>
            <h2 className="cf-section-headline">Trending Essentials</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            View All ({PRODUCTS.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards in 1 Row (Compact & Modern) */}
        <div className="cf-products-compact-grid">
          {PRODUCTS.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
              isAdded={addedItemNotice === product.id}
            />
          ))}
        </div>
      </section>

      {/* 5. NEW: Architectural Spotlight Capsule Feature */}
      <section className="cf-store-container cf-spotlight-section">
        <div className="cf-spotlight-card">
          <div className="cf-spotlight-media">
            <img
              src={spotlightProduct.imageUrl}
              alt={spotlightProduct.title}
              className="cf-spotlight-img"
            />
            <div className="cf-spotlight-badge-float">
              <Badge variant="primary">CAPSULE HIGHLIGHT</Badge>
            </div>
          </div>

          <div className="cf-spotlight-content">
            <span className="cf-spotlight-tag">HERITAGE TAILORING 2026</span>
            <h3 className="cf-spotlight-title">{spotlightProduct.title}</h3>
            <p className="cf-spotlight-desc">
              Precision-tailored from bespoke Italian high-twist wool with subtle roped shoulders and sharp peak lapels. Designed to drape effortlessly from board meetings to evening Galas.
            </p>

            <div className="cf-spotlight-specs">
              <div className="cf-spec-item">
                <span className="cf-spec-label">Material Weave</span>
                <span className="cf-spec-value">100% Tropical Wool</span>
              </div>
              <div className="cf-spec-item">
                <span className="cf-spec-label">Fit Profile</span>
                <span className="cf-spec-value">Structured Architectural</span>
              </div>
              <div className="cf-spec-item">
                <span className="cf-spec-label">Hardware</span>
                <span className="cf-spec-value">Hand-Carved Horn Buttons</span>
              </div>
              <div className="cf-spec-item">
                <span className="cf-spec-label">Origin</span>
                <span className="cf-spec-value">Florence Atelier</span>
              </div>
            </div>

            <div className="cf-spotlight-pricing-row">
              <div>
                <span className="cf-spotlight-price">₹{spotlightProduct.price.toLocaleString('en-IN')}</span>
                {spotlightProduct.originalPrice && (
                  <span className="cf-spotlight-orig">₹{spotlightProduct.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>

              <div className="cf-spotlight-actions">
                <Button
                  variant="primary"
                  size="md"
                  icon={addedItemNotice === spotlightProduct.id ? Check : ShoppingBag}
                  onClick={() => handleQuickAdd(spotlightProduct)}
                >
                  {addedItemNotice === spotlightProduct.id ? 'Added to Bag' : 'Quick Add'}
                </Button>
                <Link to={`/product/${spotlightProduct.id}`}>
                  <Button variant="outline" size="md" iconRight={Eye}>
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW: Shop by Fabric / Textile Architecture */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Tactile Materials</span>
            <h2 className="cf-section-headline">Shop by Premium Textile</h2>
          </div>
          <Link to="/shop" className="cf-section-view-all">
            Textile Guide <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cf-fabrics-grid">
          <Link to="/shop?cat=Linen & Resort" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Feather size={22} />
            </div>
            <span className="cf-fabric-origin">NORMANDY, FRANCE</span>
            <h4 className="cf-fabric-name">100% French Linen</h4>
            <p className="cf-fabric-desc">
              Stone-washed flax linen offering unmatched airy breathability and relaxed fluid draping.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Linen Drops <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?cat=Formal & Suiting" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Scissors size={22} />
            </div>
            <span className="cf-fabric-origin">NAPLES, ITALY</span>
            <h4 className="cf-fabric-name">High-Twist Tropical Wool</h4>
            <p className="cf-fabric-desc">
              Wrinkle-resistant fine fibers engineered for sharp suiting that maintains structure all day.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Suiting <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?cat=Old Money" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Award size={22} />
            </div>
            <span className="cf-fabric-origin">NILE DELTA, EGYPT</span>
            <h4 className="cf-fabric-name">Combed Egyptian Cotton</h4>
            <p className="cf-fabric-desc">
              Extra-long staple yarn offering silky handfeel, rich luster, and remarkable tactile durability.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Knit Polos <ArrowRight size={13} />
            </span>
          </Link>

          <Link to="/shop?cat=Co-Ords" className="cf-fabric-card">
            <div className="cf-fabric-icon-box">
              <Layers size={22} />
            </div>
            <span className="cf-fabric-origin">LYON, FRANCE</span>
            <h4 className="cf-fabric-name">450 GSM French Terry</h4>
            <p className="cf-fabric-desc">
              Heavyweight looped-back cotton for dense oversized hoodies and slouchy structural co-ords.
            </p>
            <span className="cf-fabric-link-cta">
              Explore Heavy Terry <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </section>

      {/* 7. Snitch-Inspired Promo Promo Banner */}
      <section className="cf-store-container cf-promo-callout-wrap">
        <div className="cf-promo-callout-box">
          <div className="cf-promo-callout-content">
            <span className="cf-promo-pill">LIMITED TIME OFFER</span>
            <h3>CLAIM 15% OFF YOUR FIRST CAPSULE</h3>
            <p>Use code <strong>ROYAL15</strong> at checkout. Valid on all Old Money & Tailored Drops.</p>
          </div>
          <Link to="/shop">
            <Button variant="primary" size="lg" iconRight={ArrowRight}>
              Claim Promo & Shop
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. NEW: Verified Customer Testimonials & VIP Endorsements */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Verified Community</span>
            <h2 className="cf-section-headline">The Wall of VIP Endorsements</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge variant="completed" dot>4.9/5 from 12,000+ Shoppers</Badge>
          </div>
        </div>

        <div className="cf-testimonials-grid">
          <div className="cf-testimonial-card">
            <div>
              <div className="cf-testi-top">
                <div className="cf-testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <Badge variant="completed" size="sm">Verified VIP</Badge>
              </div>
              <p className="cf-testi-quote">
                "The cut on the Gurkha trousers is unmatched. High rise, double pleats that sit flush, and heavy fabric that falls straight without crumpling."
              </p>
              <div className="cf-testi-item-tag">Purchased: Pleated Gurkha Trousers (32)</div>
            </div>
            <div className="cf-testi-user-row">
              <div className="cf-testi-avatar">AR</div>
              <div className="cf-testi-info">
                <span className="cf-testi-name">Aditya Rao</span>
                <span className="cf-testi-city">Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          <div className="cf-testimonial-card">
            <div>
              <div className="cf-testi-top">
                <div className="cf-testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <Badge variant="completed" size="sm">Verified VIP</Badge>
              </div>
              <p className="cf-testi-quote">
                "Far better textile quality than high-street fast fashion at one-third the designer price. The French Linen overshirt breathes remarkably well."
              </p>
              <div className="cf-testi-item-tag">Purchased: French Linen Overshirt (L)</div>
            </div>
            <div className="cf-testi-user-row">
              <div className="cf-testi-avatar">VR</div>
              <div className="cf-testi-info">
                <span className="cf-testi-name">Vikramaditya Roy</span>
                <span className="cf-testi-city">New Delhi, Delhi NCR</span>
              </div>
            </div>
          </div>

          <div className="cf-testimonial-card">
            <div>
              <div className="cf-testi-top">
                <div className="cf-testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <Badge variant="completed" size="sm">Verified VIP</Badge>
              </div>
              <p className="cf-testi-quote">
                "The textured knit Cuban polo arrived within 36 hours via BlueDart. The open-weave gauge feels like tailored Italian knitwear. Instant repeat buyer."
              </p>
              <div className="cf-testi-item-tag">Purchased: The Riviera Textured Knit (M)</div>
            </div>
            <div className="cf-testi-user-row">
              <div className="cf-testi-avatar">SV</div>
              <div className="cf-testi-info">
                <span className="cf-testi-name">Sameer Varma</span>
                <span className="cf-testi-city">Bengaluru, Karnataka</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEW: Lookbook Community Fits Gallery (@CartFlowClub) */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Styled by You</span>
            <h2 className="cf-section-headline">#CartFlowLookbook</h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--cf-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Camera size={15} /> Tag @cartflow_official to be featured
          </span>
        </div>

        <div className="cf-community-grid">
          <Link to="/shop" className="cf-community-card">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 1"
              className="cf-community-img"
            />
            <div className="cf-community-overlay">
              <span className="cf-community-handle">@dev.kapur</span>
              <span className="cf-community-piece">Structured Italian Blazer</span>
              <span className="cf-community-tag">Shop Look <ArrowRight size={11} /></span>
            </div>
          </Link>

          <Link to="/shop" className="cf-community-card">
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 2"
              className="cf-community-img"
            />
            <div className="cf-community-overlay">
              <span className="cf-community-handle">@kabir.malhotra</span>
              <span className="cf-community-piece">Riviera Textured Knit</span>
              <span className="cf-community-tag">Shop Look <ArrowRight size={11} /></span>
            </div>
          </Link>

          <Link to="/shop" className="cf-community-card">
            <img
              src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 3"
              className="cf-community-img"
            />
            <div className="cf-community-overlay">
              <span className="cf-community-handle">@aarav.singh</span>
              <span className="cf-community-piece">Normandy French Linen</span>
              <span className="cf-community-tag">Shop Look <ArrowRight size={11} /></span>
            </div>
          </Link>

          <Link to="/shop" className="cf-community-card">
            <img
              src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80"
              alt="Community Style 4"
              className="cf-community-img"
            />
            <div className="cf-community-overlay">
              <span className="cf-community-handle">@rohan.mehra</span>
              <span className="cf-community-piece">Pleated Gurkha Trousers</span>
              <span className="cf-community-tag">Shop Look <ArrowRight size={11} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* 10. Craftsmanship & Philosophy Pillars */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-pillars-grid">
          <div className="cf-pillar-item">
            <Award size={28} className="cf-pillar-icon" />
            <h4>Artisanal Fabric Selection</h4>
            <p>100% Normandy flax linen, Egyptian cotton, and Grade-A Merino wool designed to age with elegance.</p>
          </div>
          <div className="cf-pillar-item">
            <Compass size={28} className="cf-pillar-icon" />
            <h4>Bespoke Architectural Cut</h4>
            <p>Balanced silhouettes bridging heritage old-money proportions with modern Gen-Z smart-casual comfort.</p>
          </div>
          <div className="cf-pillar-item">
            <ShieldCheck size={28} className="cf-pillar-icon" />
            <h4>Sustainable Small-Batch Drops</h4>
            <p>Zero deadstock overproduction. Every drop is crafted in limited batches to guarantee exclusive quality.</p>
          </div>
        </div>
      </section>

      {/* 11. NEW: Buying Confidence & Frequently Asked Questions */}
      <section className="cf-store-section cf-store-container">
        <div className="cf-section-title-row">
          <div>
            <span className="cf-section-pretitle">Buying Confidence</span>
            <h2 className="cf-section-headline">Frequently Asked Questions</h2>
          </div>
          <Badge variant="neutral">Customer Help Hub</Badge>
        </div>

        <div className="cf-faq-grid">
          <div className="cf-faq-item">
            <div className="cf-faq-q">
              <Truck size={18} className="cf-faq-icon" />
              <span>How fast is pan-India delivery?</span>
            </div>
            <p className="cf-faq-a">
              All orders are dispatched within 24 hours from our central warehouse via BlueDart Air Priority and Delhivery Express. Metro deliveries typically arrive in 24–48 hours.
            </p>
          </div>

          <div className="cf-faq-item">
            <div className="cf-faq-q">
              <RefreshCw size={18} className="cf-faq-icon" />
              <span>What is the return and exchange policy?</span>
            </div>
            <p className="cf-faq-a">
              We offer a 7-day hassle-free doorstep exchange and return service. If the garment size or fit is not ideal, our courier will pick it up directly from your door with zero extra fees.
            </p>
          </div>

          <div className="cf-faq-item">
            <div className="cf-faq-q">
              <ShieldCheck size={18} className="cf-faq-icon" />
              <span>What payment methods are supported?</span>
            </div>
            <p className="cf-faq-a">
              We support all major payment modes including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), NetBanking, and Cash on Delivery (COD).
            </p>
          </div>

          <div className="cf-faq-item">
            <div className="cf-faq-q">
              <Scissors size={18} className="cf-faq-icon" />
              <span>How do I select the right size?</span>
            </div>
            <p className="cf-faq-a">
              Every garment follows tailored modern proportions. We recommend picking your standard size for a tailored drape, or one size up for an oversized contemporary silhouette.
            </p>
          </div>
        </div>
      </section>

      {/* 12. NEW: VIP Drop Radar / Newsletter Box */}
      <section className="cf-store-container">
        <div className="cf-drop-radar-box">
          <Badge variant="primary">EXCLUSIVE ACCESS</Badge>
          <h3>Join The CartFlow Drop Radar</h3>
          <p>
            Gain 1-hour early access to limited weekly Friday drops, secret capsule releases, and invitations to private VIP events.
          </p>

          {vipSubscribed ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--cf-accent-success)',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>You're on the VIP Radar. Check your inbox for your 15% welcome code!</span>
            </div>
          ) : (
            <form onSubmit={handleVipSubmit} className="cf-drop-radar-form">
              <Input
                type="email"
                required
                placeholder="Enter your VIP email address..."
                icon={Mail}
                value={vipEmail}
                onChange={(e) => setVipEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" size="md" iconRight={ArrowRight}>
                Join Radar
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
