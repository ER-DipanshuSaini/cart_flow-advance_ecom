import React, { useState, useEffect } from 'react';
import { Button, Select, Textarea, Modal } from '../ui';
import MediaAttachmentField from './MediaAttachmentField';

/**
 * Generic Reusable Modal for Order Actions (Raise Complaint, Cancel Order, etc.)
 */
export default function OrderActionModal({
  isOpen,
  onClose,
  onSubmit,
  onUploadError,
  icon,
  title,
  subtitle = '',
  maxWidth = '580px',
  reasonLabel = 'Reason',
  reasons = [],
  items = [],
  showItemSelect = false,
  noteLabel = 'Message',
  notePlaceholder = 'Add details...',
  requireNoteAlways = false,
  allowMedia = false,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  submitVariant = 'primary',
  submitIcon,
}) {
  const [reason, setReason] = useState(reasons[0] || '');
  const [affectedItem, setAffectedItem] = useState('Entire Order');
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setReason(reasons[0] || '');
      setAffectedItem('Entire Order');
      setNote('');
      setAttachments([]);
    }
  }, [isOpen, title, subtitle, reasons]);

  const isNoteRequired = requireNoteAlways || reason === 'Other';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      reason,
      affectedItem,
      note,
      attachments,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={icon}
      title={title}
      subtitle={subtitle}
      maxWidth={maxWidth}
    >
      <form onSubmit={handleSubmit} className="cf-modal-form-grid">
        <Select
          label={reasonLabel}
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={reasons.map((r) => ({ value: r, label: r }))}
        />

        {showItemSelect && items.length > 0 && (
          <Select
            label="Item"
            value={affectedItem}
            onChange={(e) => setAffectedItem(e.target.value)}
            options={[
              { value: 'Entire Order', label: 'Entire Order' },
              ...items.map((item) => ({
                value: `${item.title} (${item.size})`,
                label: `${item.title} (${item.size})`,
              })),
            ]}
          />
        )}

        <Textarea
          label={isNoteRequired ? `${noteLabel} *` : `${noteLabel} (Optional)`}
          required={isNoteRequired}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={notePlaceholder}
        />

        {allowMedia && (
          <MediaAttachmentField
            label="Photos / Video (Optional)"
            files={attachments}
            onChange={setAttachments}
            onError={onUploadError}
            maxFiles={4}
          />
        )}

        <div className="cf-form-actions-bar">
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant={submitVariant} icon={submitIcon}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
