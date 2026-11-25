import React, { useRef } from 'react';
import { UploadCloud, Paperclip, X, Film } from 'lucide-react';

/**
 * Reusable Image & Video attachment picker with preview strip.
 * Supports `compact` footer layout (trigger button + optional submit/action buttons side-by-side).
 */
export default function MediaAttachmentField({
  label = 'Photos / Video (Optional)',
  files = [],
  onChange,
  onError,
  maxFiles = 4,
  compact = false,
  actionSlot = null,
}) {
  const inputRef = useRef(null);

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    if (files.length + selected.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed.`);
      e.target.value = '';
      return;
    }

    selected.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) {
        onError?.(`Unsupported file: ${file.name}`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onError?.(`${file.name} exceeds 10 MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            url: ev.target.result,
            name: file.name,
            type: isVideo ? 'video' : 'image',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemove = (indexToRemove) => {
    onChange((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const previewStrip = files.length > 0 && (
    <div className="cf-media-preview-grid">
      {files.map((item, idx) => (
        <div key={item.id || idx} className="cf-media-preview-card">
          {item.type === 'video' ? (
            <div className="cf-media-video-thumb">
              <video src={item.url} muted />
              <span className="cf-media-video-badge">
                <Film size={12} /> Video
              </span>
            </div>
          ) : (
            <img src={item.url} alt={item.name || `Attachment ${idx + 1}`} />
          )}
          <button
            type="button"
            className="cf-remove-image-btn"
            onClick={() => handleRemove(idx)}
            title="Remove"
          >
            <X size={12} />
          </button>
          <span className="cf-preview-img-tag">{item.name || `File ${idx + 1}`}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="cf-ui-form-group">
      {label && <label className="cf-ui-label">{label}</label>}

      <input
        type="file"
        ref={inputRef}
        accept="image/*,video/*"
        multiple
        onChange={handleFilesSelected}
        style={{ display: 'none' }}
      />

      {compact ? (
        <>
          {previewStrip}
          <div className="cf-media-compact-bar">
            <button
              type="button"
              className="cf-media-compact-trigger"
              onClick={() => inputRef.current?.click()}
              disabled={files.length >= maxFiles}
              title="Attach photos or videos"
            >
              <Paperclip size={14} />
              <span>Attach ({files.length}/{maxFiles})</span>
            </button>
            {actionSlot}
          </div>
        </>
      ) : (
        <>
          <div className="cf-media-upload-row">
            <button
              type="button"
              className="cf-photo-upload-trigger-btn"
              onClick={() => inputRef.current?.click()}
              disabled={files.length >= maxFiles}
            >
              <UploadCloud size={16} />
              <span>Add Photos / Video ({files.length}/{maxFiles})</span>
            </button>
          </div>
          {previewStrip}
        </>
      )}
    </div>
  );
}
