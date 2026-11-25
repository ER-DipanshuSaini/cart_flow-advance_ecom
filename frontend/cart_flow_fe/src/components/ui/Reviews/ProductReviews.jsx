import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Star,
  ThumbsUp,
  Edit3,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  UploadCloud,
  X,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Textarea from '../Input/Textarea';
import './ProductReviews.css';

// Default Realistic Verified Reviews
const INITIAL_MOCK_REVIEWS = [
  {
    id: 'rev-101',
    userName: 'Armaan Khanna',
    avatar: 'AK',
    rating: 5,
    comment:
      'The fabric weight and tactile texture surpassed every expectation. The collar sits perfectly flush under a tailored blazer without curling. True architectural tailoring. Easily rivals garments triple the price.',
    date: 'Nov 20, 2026',
    verifiedBuyer: true,
    helpfulCount: 24,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
        caption: 'Collar & shoulder drape',
      },
      {
        url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
        caption: 'Texture under natural daylight',
      },
    ],
  },
  {
    id: 'rev-102',
    userName: 'Rohit Singhal',
    avatar: 'RS',
    rating: 4.5,
    comment:
      'Delivered within 36 hours. The breathability in warm weather is unmatched compared to ordinary high-street cotton. Natural flax drape feels substantial yet featherlight. Will definitely order the other colorways.',
    date: 'Nov 17, 2026',
    verifiedBuyer: true,
    helpfulCount: 18,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
        caption: 'Mother-of-pearl Troca shell buttons',
      },
    ],
  },
  {
    id: 'rev-103',
    userName: 'Devansh Parekh',
    avatar: 'DP',
    rating: 3.5,
    comment:
      'Solid structured weave. Mother-of-pearl buttons are authentic Troca shell. If you prefer an ultra-sculpted Italian fit, size down, but standard size gives a relaxed modern resort aesthetic.',
    date: 'Nov 12, 2026',
    verifiedBuyer: true,
    helpfulCount: 11,
    images: [],
  },
  {
    id: 'rev-104',
    userName: 'Siddharth Varma',
    avatar: 'SV',
    rating: 5,
    comment:
      'The French seams and blind hem finishing are master atelier grade. Holds its shape flawlessly after hand washing in cold water. Packaged in a signature linen dust garment pouch.',
    date: 'Nov 08, 2026',
    verifiedBuyer: true,
    helpfulCount: 9,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        caption: 'Clean knitwear stitch close-up',
      },
    ],
  },
  {
    id: 'rev-105',
    userName: 'Kabir Malhotra',
    avatar: 'KM',
    rating: 4,
    comment:
      'Wore this to an evening cocktail preview in Goa. Countless compliments. Fabric catches subtle ambient light without any synthetic sheen.',
    date: 'Oct 30, 2026',
    verifiedBuyer: true,
    helpfulCount: 7,
    images: [],
  },
  {
    id: 'rev-106',
    userName: 'Vikrant Deshmukh',
    avatar: 'VD',
    rating: 3,
    comment:
      'The flax linen tends to wrinkle during transit, which is expected of 100% natural fibers. Once steamed, it looks immaculate. Sleeve length is 0.5 inch longer than standard.',
    date: 'Oct 22, 2026',
    verifiedBuyer: true,
    helpfulCount: 5,
    images: [],
  },
  {
    id: 'rev-107',
    userName: 'Nikhil Mehta',
    avatar: 'NM',
    rating: 5,
    comment:
      'Minimalist detailing, zero gaudy logos, impeccable silhouette. Snitch and Zara cannot match this textile density.',
    date: 'Oct 15, 2026',
    verifiedBuyer: true,
    helpfulCount: 14,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
        caption: 'Worn with tailored cream trousers',
      },
    ],
  },
];

// Reusable 5-Star Visual Renderer with 0.5 Half-Star Support
function StarRatingDisplay({ rating = 0, size = 15 }) {
  return (
    <div className="cf-star-display-row" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFull = rating >= starIndex;
        const isHalf = !isFull && rating >= starIndex - 0.5;

        if (isHalf) {
          return (
            <span
              key={starIndex}
              className="cf-half-star-wrap"
              style={{ width: size, height: size }}
            >
              <Star size={size} fill="none" color="var(--cf-accent-warning)" className="cf-star-svg-fixed" />
              <span className="cf-half-star-fill">
                <Star size={size} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" className="cf-star-svg-fixed" />
              </span>
            </span>
          );
        }

        return (
          <Star
            key={starIndex}
            size={size}
            fill={isFull ? 'var(--cf-accent-warning)' : 'none'}
            color="var(--cf-accent-warning)"
          />
        );
      })}
    </div>
  );
}

export default function ProductReviews({
  productId = 1,
  productTitle = 'Garment',
  baseRating = 4.9,
  baseReviewCount = 88,
}) {
  const { customer } = useAuth();
  const fileInputRef = useRef(null);

  // Storage keys per product
  const storageKey = `cf_reviews_p_${productId}`;
  const verifiedStorageKey = `cf_verified_buyer_${productId}_${customer?.id || 'guest'}`;

  // State: Reviews List
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MOCK_REVIEWS;
  });

  // State: Verified Purchase Status (Button only visible to verified buyers)
  const [hasPurchased] = useState(() => {
    try {
      const saved = localStorage.getItem(verifiedStorageKey);
      if (saved !== null) return JSON.parse(saved);
      // Default: logged in customer is verified for product 1 & 2
      if (customer && (productId === 1 || productId === 2)) return true;
    } catch {
      // fallback
    }
    return false;
  });

  const canWriteReview = Boolean(customer && hasPurchased);

  // Helpful votes tracked in state
  const [helpfulVoted, setHelpfulVoted] = useState({});

  // Filters & Pagination State
  const [activeStarFilter, setActiveStarFilter] = useState('ALL'); // 'ALL' | 5 | 4 | 3 | 2 | 1
  const [sortBy, setSortBy] = useState('helpful'); // 'helpful' | 'recent' | 'highest' | 'lowest'
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 3;

  // Modals State
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);

  // Form State for New Review (Rating with 0.5 steps, Description, Images)
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formUploadedImages, setFormUploadedImages] = useState([]);
  const [formError, setFormError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Sync reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch {
      // storage disabled
    }
  }, [reviews, storageKey]);

  // Image Upload Handlers for Individual Images
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (formUploadedImages.length + files.length > 4) {
      setFormError('You can attach a maximum of 4 images.');
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormUploadedImages((prev) => [
          ...prev,
          {
            url: uploadEvent.target.result,
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Interactive 0.5-step Star Picker Handler
  const handleStarPointerMove = (e, starIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setHoverRating(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  const handleStarClick = (e, starIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setFormRating(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  // Submit Review Handler
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (formComment.trim().length < 15) {
      setFormError('Please write at least 15 characters of review description.');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: customer?.name || 'Verified Buyer',
      avatar: (customer?.name || 'V').charAt(0).toUpperCase(),
      rating: formRating,
      comment: formComment.trim(),
      date: 'Just now',
      verifiedBuyer: true,
      helpfulCount: 1,
      images: formUploadedImages,
    };

    setReviews((prev) => [newRev, ...prev]);
    setWriteModalOpen(false);

    // Reset form
    setFormComment('');
    setFormError('');
    setFormRating(5);
    setFormUploadedImages([]);
    setCurrentPage(1);
  };

  // Thumbs up / Helpful handler
  const handleHelpfulClick = (reviewId) => {
    if (helpfulVoted[reviewId]) return;
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  // Calculate Rating Statistics
  const ratingStats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        avg: baseRating,
        totalCount: baseReviewCount,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percents: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const bucket = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[bucket] = (counts[bucket] || 0) + 1;
      sum += r.rating;
    });

    const avg = (sum / total).toFixed(1);
    const percents = {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };

    return {
      avg: Number(avg),
      totalCount: total,
      counts,
      percents,
    };
  }, [reviews, baseRating, baseReviewCount]);

  // Filter and Sort Reviews
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (activeStarFilter !== 'ALL') {
      result = result.filter((r) => Math.round(r.rating) === activeStarFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

    return result;
  }, [reviews, activeStarFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return filteredAndSortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [filteredAndSortedReviews, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const elem = document.getElementById('cf-reviews-anchor');
      if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeDisplayRating = hoverRating || formRating;

  return (
    <section className="cf-reviews-section" id="cf-reviews-anchor">
      {/* 1. Header Row */}
      <div className="cf-section-title-row">
        <div>
          <span className="cf-section-pretitle">Verified Community Insights</span>
          <h2 className="cf-section-headline">Ratings &amp; Reviews</h2>
        </div>

        {/* Write a Review Button ONLY visible to verified buyers who purchased the item */}
        {canWriteReview && (
          <div className="cf-reviews-head-action">
            <Button
              variant="primary"
              icon={Edit3}
              onClick={() => setWriteModalOpen(true)}
            >
              Write a Review
            </Button>
          </div>
        )}
      </div>

      {/* 2. Main Reviews Dashboard Layout */}
      <div className="cf-reviews-layout-grid">
        {/* Left Column: Score Breakdown */}
        <div className="cf-reviews-sidebar">
          <div className="cf-score-summary-card">
            <div className="cf-score-main-flex">
              <div className="cf-score-number">{ratingStats.avg.toFixed(1)}</div>
              <div className="cf-score-stars-col">
                <StarRatingDisplay rating={ratingStats.avg} size={18} />
                <span className="cf-score-total-txt">
                  {ratingStats.totalCount} Verified Ratings
                </span>
              </div>
            </div>

            {/* Clickable Star Breakdown Bars */}
            <div className="cf-star-breakdown-list">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`cf-star-bar-btn ${activeStarFilter === star ? 'is-selected' : ''}`}
                  onClick={() => {
                    setActiveStarFilter(activeStarFilter === star ? 'ALL' : star);
                    setCurrentPage(1);
                  }}
                  title={`Filter by ${star} Stars`}
                >
                  <span className="cf-star-bar-label">
                    {star} <Star size={11} fill="currentColor" color="currentColor" />
                  </span>
                  <div className="cf-star-bar-track">
                    <div
                      className="cf-star-bar-fill"
                      style={{ width: `${ratingStats.percents[star]}%` }}
                    />
                  </div>
                  <span className="cf-star-bar-pct">{ratingStats.counts[star]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Review Controls, List, and Pagination */}
        <div className="cf-reviews-main-col">
          {/* Controls Bar */}
          <div className="cf-reviews-controls-bar">
            <div className="cf-reviews-filter-pills">
              <button
                type="button"
                className={`cf-filter-pill ${activeStarFilter === 'ALL' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveStarFilter('ALL');
                  setCurrentPage(1);
                }}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`cf-filter-pill ${activeStarFilter === star ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveStarFilter(activeStarFilter === star ? 'ALL' : star);
                    setCurrentPage(1);
                  }}
                >
                  {star} ★ ({ratingStats.counts[star]})
                </button>
              ))}
            </div>

            <div className="cf-reviews-sort-wrap">
              <span className="cf-sort-label">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="cf-sort-select"
              >
                <option value="helpful">Most Helpful</option>
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Notice */}
          {activeStarFilter !== 'ALL' && (
            <div className="cf-active-filter-strip">
              <span>Showing only <strong>{activeStarFilter}-Star</strong> reviews</span>
              <button
                type="button"
                onClick={() => {
                  setActiveStarFilter('ALL');
                  setCurrentPage(1);
                }}
                className="cf-clear-filter-btn"
              >
                Clear Filter ✕
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div className="cf-reviews-cards-stack">
            {paginatedReviews.length === 0 ? (
              <div className="cf-reviews-empty">
                <AlertCircle size={32} />
                <h4>No reviews match this filter</h4>
                <p>Try resetting the star filter to view all verified reviews.</p>
                <Button variant="secondary" size="sm" onClick={() => setActiveStarFilter('ALL')}>
                  Reset Filter
                </Button>
              </div>
            ) : (
              paginatedReviews.map((rev) => (
                <article key={rev.id} className="cf-client-review-card">
                  {/* Card Header: Avatar, Name, Date & Individual 5-Star Rating (with 0.5 fill) */}
                  <div className="cf-client-review-header">
                    <div className="cf-client-avatar-row">
                      <div className="cf-client-avatar">{rev.avatar}</div>
                      <div>
                        <div className="cf-client-name-row">
                          <span className="cf-client-name">{rev.userName}</span>
                          {rev.verifiedBuyer && (
                            <span className="cf-verified-buyer-pill">
                              <Check size={11} strokeWidth={3} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="cf-client-meta-info">{rev.date}</span>
                      </div>
                    </div>

                    {/* Individual 5-Star Rating Display on Right Top */}
                    <div className="cf-review-card-stars-wrap">
                      <StarRatingDisplay rating={rev.rating} size={15} />
                      <span className="cf-review-rating-num">{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="cf-review-body">{rev.comment}</p>

                  {/* Individual Customer Images attached to this specific review */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="cf-review-individual-images">
                      {rev.images.map((img, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          className="cf-review-individual-thumb"
                          onClick={() =>
                            setLightboxData({
                              images: rev.images,
                              activeIndex: imgIdx,
                              reviewerName: rev.userName,
                              rating: rev.rating,
                            })
                          }
                          title={img.caption || 'Click to enlarge'}
                        >
                          <img src={img.url} alt={img.caption || 'Customer photo'} />
                          <span className="cf-thumb-zoom-icon">
                            <Maximize2 size={13} />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="cf-review-footer">
                    <button
                      type="button"
                      className={`cf-helpful-action-btn ${helpfulVoted[rev.id] ? 'is-voted' : ''}`}
                      onClick={() => handleHelpfulClick(rev.id)}
                      disabled={helpfulVoted[rev.id]}
                    >
                      <ThumbsUp size={13} fill={helpfulVoted[rev.id] ? 'currentColor' : 'none'} />
                      <span>
                        {helpfulVoted[rev.id] ? 'Marked as Helpful' : 'Helpful'} ({rev.helpfulCount})
                      </span>
                    </button>
                    <span className="cf-review-verified-text">
                      <ShieldCheck size={12} /> Certified Purchase by CartFlow Atelier
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="cf-reviews-pagination-bar">
              <span className="cf-pagination-status">
                Showing <strong>{(currentPage - 1) * REVIEWS_PER_PAGE + 1}</strong> to{' '}
                <strong>
                  {Math.min(currentPage * REVIEWS_PER_PAGE, filteredAndSortedReviews.length)}
                </strong>{' '}
                of <strong>{filteredAndSortedReviews.length}</strong> reviews
              </span>

              <div className="cf-pagination-controls">
                <button
                  type="button"
                  className="cf-page-btn cf-page-prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <div className="cf-page-numbers-group">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        className={`cf-page-num-btn ${pageNum === currentPage ? 'is-active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="cf-page-btn cf-page-next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Lightbox Modal for Individual Photos with Slider */}
      <Modal
        isOpen={Boolean(lightboxData)}
        onClose={() => setLightboxData(null)}
        title={
          lightboxData
            ? `${lightboxData.images[lightboxData.activeIndex]?.caption || 'Customer Photo'} (${lightboxData.activeIndex + 1} / ${lightboxData.images.length})`
            : 'Customer Photo Preview'
        }
        maxWidth="680px"
      >
        {lightboxData && (
          <div className="cf-lightbox-modal-content">
            <div className="cf-lightbox-image-box">
              <img
                src={lightboxData.images[lightboxData.activeIndex]?.url}
                alt={lightboxData.images[lightboxData.activeIndex]?.caption || 'Customer photo preview'}
              />

              {lightboxData.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="cf-lightbox-nav-btn cf-lightbox-prev"
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        activeIndex:
                          (prev.activeIndex - 1 + prev.images.length) % prev.images.length,
                      }))
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="cf-lightbox-nav-btn cf-lightbox-next"
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        activeIndex: (prev.activeIndex + 1) % prev.images.length,
                      }))
                    }
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {lightboxData.images.length > 1 && (
              <div className="cf-lightbox-thumbs-strip">
                {lightboxData.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`cf-lightbox-thumb-btn ${idx === lightboxData.activeIndex ? 'is-active' : ''}`}
                    onClick={() =>
                      setLightboxData((prev) => ({ ...prev, activeIndex: idx }))
                    }
                  >
                    <img src={img.url} alt={img.caption || `Slide ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="cf-lightbox-meta-row">
              <div className="cf-lightbox-user">
                <strong>{lightboxData.reviewerName}</strong>
                {lightboxData.images[lightboxData.activeIndex]?.caption && (
                  <span className="cf-lightbox-cap">
                    {lightboxData.images[lightboxData.activeIndex].caption}
                  </span>
                )}
              </div>
              <div className="cf-review-card-stars-wrap">
                <StarRatingDisplay rating={lightboxData.rating} size={14} />
                <span className="cf-review-rating-num">{Number(lightboxData.rating).toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 4. Write a Review Modal Form: ONLY Rating (0.5 steps), Description & Image Upload */}
      <Modal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        title="Write a Review"
        subtitle={productTitle}
        maxWidth="540px"
      >
        <form onSubmit={handleSubmitReview} className="cf-review-form">
          {formError && (
            <div className="cf-form-error-banner">
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          {/* 0.5-Step Star Rating Picker */}
          <div className="cf-ui-form-group">
            <label className="cf-ui-label">
              Rating <span className="cf-ui-required">*</span>
            </label>
            <div
              className="cf-star-picker"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFull = activeDisplayRating >= starIndex;
                const isHalf = !isFull && activeDisplayRating >= starIndex - 0.5;

                return (
                  <button
                    key={starIndex}
                    type="button"
                    className="cf-star-picker-btn"
                    onMouseMove={(e) => handleStarPointerMove(e, starIndex)}
                    onClick={(e) => handleStarClick(e, starIndex)}
                    aria-label={`Rate ${starIndex} stars (click left half for ${starIndex - 0.5})`}
                  >
                    {isHalf ? (
                      <span
                        className="cf-half-star-wrap"
                        style={{ width: 28, height: 28 }}
                      >
                        <Star size={28} fill="none" color="var(--cf-accent-warning)" className="cf-star-svg-fixed" />
                        <span className="cf-half-star-fill">
                          <Star size={28} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" className="cf-star-svg-fixed" />
                        </span>
                      </span>
                    ) : (
                      <Star
                        size={28}
                        fill={isFull ? 'var(--cf-accent-warning)' : 'none'}
                        color="var(--cf-accent-warning)"
                      />
                    )}
                  </button>
                );
              })}
              <span className="cf-star-picker-label">
                {activeDisplayRating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          {/* Theme Textarea: Description */}
          <Textarea
            label="Review Description"
            rows={4}
            placeholder="Share your experience with the fabric, fit, and overall quality..."
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            required
            maxLength={600}
            helperText={`${formComment.length} / 600 characters (minimum 15 characters required)`}
          />

          {/* Individual Image Upload Section */}
          <div className="cf-ui-form-group">
            <label className="cf-ui-label">
              Upload Photos (Up to 4 images)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              style={{ display: 'none' }}
            />

            <div className="cf-photo-dropzone-row">
              <button
                type="button"
                className="cf-photo-upload-trigger-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={formUploadedImages.length >= 4}
              >
                <UploadCloud size={18} />
                <span>Choose Photos</span>
              </button>
            </div>

            {formUploadedImages.length > 0 && (
              <div className="cf-form-images-preview-grid">
                {formUploadedImages.map((img, idx) => (
                  <div key={idx} className="cf-form-image-preview-card">
                    <img src={img.url} alt={`Upload ${idx + 1}`} />
                    <button
                      type="button"
                      className="cf-remove-image-btn"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                    <span className="cf-preview-img-tag">{img.caption || `Photo ${idx + 1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cf-form-modal-footer">
            <Button
              type="button"
              variant="outline"
              onClick={() => setWriteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Check}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
