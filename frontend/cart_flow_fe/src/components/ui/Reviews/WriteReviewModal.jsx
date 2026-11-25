import React, { useState, useRef, useEffect } from 'react';
import { Star, AlertCircle, UploadCloud, X, Check } from 'lucide-react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Textarea from '../Input/Textarea';
import './ProductReviews.css';

/**
 * Shared Reusable Write Review Modal Component
 * Used across ProductReviews (PDP) and CustomerDashboard (My Orders).
 */
export default function WriteReviewModal({
  isOpen,
  onClose,
  productTitle = 'Product',
  onSubmitReview,
}) {
  const fileInputRef = useRef(null);
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formUploadedImages, setFormUploadedImages] = useState([]);
  const [formError, setFormError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setFormRating(5);
      setFormComment('');
      setFormUploadedImages([]);
      setFormError('');
      setHoverRating(0);
    }
  }, [isOpen, productTitle]);

  const activeDisplayRating = hoverRating > 0 ? hoverRating : formRating;

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (formUploadedImages.length + files.length > 4) {
      setFormError('You can attach a maximum of 4 images.');
      return;
    }

    setFormError('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({
      rating: formRating,
      comment: formComment.trim(),
      images: formUploadedImages,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Review"
      subtitle={productTitle}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} className="cf-review-form">
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

        {/* Theme Textarea: Description (Optional) */}
        <Textarea
          label="Review Description (Optional)"
          rows={4}
          placeholder="Share your experience with the fabric, fit, and overall quality..."
          value={formComment}
          onChange={(e) => setFormComment(e.target.value)}
          maxLength={600}
          helperText={`${formComment.length} / 600 characters`}
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Check}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
