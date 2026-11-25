import React, { useState, useEffect } from 'react';
import { Clock, Send, Ticket, MessageSquareWarning, Film, XCircle } from 'lucide-react';
import { Button, Badge, Textarea, Modal, WriteReviewModal } from '../../../components/ui';
import MediaAttachmentField from '../../../components/common/MediaAttachmentField';
import OrderActionModal from '../../../components/common/OrderActionModal';
import {
  CANCEL_ORDER_REASONS,
  COMPLAINT_CATEGORIES,
  getTicketBadgeVariant,
  getTicketTimelogs,
} from '../../../data/customerDefaults';

function AttachmentsPreviewList({ attachments = [] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="cf-ticket-attachments-grid">
      {attachments.map((file, idx) => (
        <div key={file.id || idx} className="cf-ticket-attachment-item">
          {file.type === 'video' ? (
            <video src={file.url} controls className="cf-ticket-attachment-video" />
          ) : (
            <a href={file.url} target="_blank" rel="noopener noreferrer" title={file.name}>
              <img src={file.url} alt={file.name || `Attachment ${idx + 1}`} />
            </a>
          )}
          <span className="cf-ticket-attachment-name">
            {file.type === 'video' && <Film size={11} />}
            {file.name || `File ${idx + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OrderSupportModals({
  reviewModal,
  onCloseReview,
  onSubmitReview,
  complaintModal,
  onCloseComplaint,
  onSubmitComplaint,
  onUploadError,
  cancelModal,
  onCloseCancel,
  onConfirmCancel,
  activeTicket,
  onCloseTicket,
  onAddTicketReply,
}) {
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);

  useEffect(() => {
    if (!activeTicket) {
      setTicketReplyText('');
      setReplyAttachments([]);
    }
  }, [activeTicket]);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!ticketReplyText.trim() && replyAttachments.length === 0) return;
    onAddTicketReply({
      message: ticketReplyText.trim() || 'Shared media attachment.',
      attachments: replyAttachments,
    });
    setTicketReplyText('');
    setReplyAttachments([]);
  };

  const timelogs = activeTicket ? getTicketTimelogs(activeTicket) : [];
  const lastUpdated =
    timelogs.length > 0 ? timelogs[timelogs.length - 1].timestamp : activeTicket?.createdAt;
  const activeTicketTone = activeTicket ? getTicketBadgeVariant(activeTicket.status) : 'warning';

  return (
    <>
      {/* Shared Write a Review Modal */}
      <WriteReviewModal
        isOpen={reviewModal.open}
        onClose={onCloseReview}
        productTitle={reviewModal.item?.title || 'Product'}
        onSubmitReview={onSubmitReview}
      />

      {/* Generic Raise Complaint Modal */}
      <OrderActionModal
        isOpen={complaintModal.open}
        onClose={onCloseComplaint}
        onSubmit={({ reason, affectedItem, note, attachments }) =>
          onSubmitComplaint({
            category: reason,
            affectedItem,
            description: note,
            attachments,
          })
        }
        onUploadError={onUploadError}
        icon={MessageSquareWarning}
        title="Raise a Complaint"
        subtitle={complaintModal.order ? `Order ${complaintModal.order.id}` : ''}
        maxWidth="600px"
        reasonLabel="Issue Category *"
        reasons={COMPLAINT_CATEGORIES}
        items={complaintModal.order?.items || []}
        showItemSelect
        noteLabel="Message"
        notePlaceholder="Describe the issue..."
        requireNoteAlways
        allowMedia
        submitLabel="Submit Ticket"
        submitIcon={Send}
      />

      {/* Generic Cancel Order Modal */}
      <OrderActionModal
        isOpen={!!cancelModal?.open}
        onClose={onCloseCancel}
        onSubmit={({ reason, note }) => onConfirmCancel({ reason, note })}
        icon={XCircle}
        title="Cancel Order"
        subtitle={cancelModal?.order ? `Order ${cancelModal.order.id}` : ''}
        maxWidth="540px"
        reasonLabel="Cancellation Reason *"
        reasons={CANCEL_ORDER_REASONS}
        noteLabel="Additional Note"
        notePlaceholder="Share details (required if Other)..."
        cancelLabel="Keep Order"
        submitLabel="Confirm Cancellation"
        submitVariant="danger"
        submitIcon={XCircle}
      />

      {/* Ticket Details & Timelog Modal — Wide 2-Column Theme Layout */}
      <Modal
        isOpen={!!activeTicket}
        onClose={onCloseTicket}
        icon={Ticket}
        title={activeTicket ? `${activeTicket.id} • ${activeTicket.category}` : 'Ticket'}
        subtitle={
          activeTicket
            ? `Order ${activeTicket.orderId} • ${activeTicket.affectedItem || 'Entire Order'} • Updated ${lastUpdated}`
            : ''
        }
        maxWidth="940px"
      >
        {activeTicket && (
          <div className="cf-ticket-modal-grid">
            {/* Left Column: Issue + Activity Timeline */}
            <div className="cf-ticket-modal-main">
              <div className={`cf-ticket-detail-summary is-${activeTicketTone}`}>
                <div className="cf-ticket-issue-head">
                  <span className="cf-ticket-section-tag">Issue</span>
                  <Badge variant={activeTicketTone} dot>
                    {activeTicket.status}
                  </Badge>
                </div>
                <p className="cf-ticket-detail-desc">{activeTicket.description}</p>
                {activeTicket.attachments?.length > 0 && (
                  <AttachmentsPreviewList attachments={activeTicket.attachments} />
                )}
              </div>

              <div className="cf-ticket-timelog-section">
                <h4 className="cf-ticket-timelog-heading">
                  <Clock size={14} /> Time Logs ({timelogs.length})
                </h4>
                <div className="cf-ticket-timelog-list">
                  {timelogs.map((log, idx) => {
                    const prevStatus = idx > 0 ? timelogs[idx - 1].status : null;
                    const logTone = getTicketBadgeVariant(log.status || activeTicket.status);
                    const showStatusBadge = log.status && log.status !== prevStatus;

                    return (
                      <div key={log.id} className="cf-ticket-timelog-item">
                        <div className={`cf-timelog-dot is-${logTone}`} />
                        <div className="cf-timelog-body">
                          <div className="cf-timelog-top">
                            <div className="cf-timelog-actor-row">
                              <strong>{log.actor}</strong>
                              {showStatusBadge && (
                                <Badge variant={logTone} size="sm">
                                  {log.status}
                                </Badge>
                              )}
                            </div>
                            <span>{log.timestamp}</span>
                          </div>
                          <p className="cf-timelog-msg">{log.message}</p>
                          <AttachmentsPreviewList attachments={log.attachments} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Ticket Info + Theme-Styled Composer */}
            <div className="cf-ticket-modal-side">
              <div className="cf-ticket-kv-card">
                <div className="cf-ticket-kv-row">
                  <span>Order</span>
                  <strong>{activeTicket.orderId}</strong>
                </div>
                <div className="cf-ticket-kv-row">
                  <span>Item</span>
                  <strong>{activeTicket.affectedItem || 'Entire Order'}</strong>
                </div>
                <div className="cf-ticket-kv-row">
                  <span>Raised</span>
                  <strong>{activeTicket.createdAt}</strong>
                </div>
                <div className="cf-ticket-kv-row">
                  <span>Updated</span>
                  <strong>{lastUpdated}</strong>
                </div>
              </div>

              <form onSubmit={handleReplySubmit} className="cf-ticket-reply-box">
                <Textarea
                  label="Follow-up"
                  rows={4}
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  placeholder="Write a reply..."
                />

                <MediaAttachmentField
                  compact
                  label=""
                  files={replyAttachments}
                  onChange={setReplyAttachments}
                  onError={onUploadError}
                  maxFiles={4}
                  actionSlot={
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      icon={Send}
                      disabled={!ticketReplyText.trim() && replyAttachments.length === 0}
                    >
                      Send Reply
                    </Button>
                  }
                />
              </form>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
