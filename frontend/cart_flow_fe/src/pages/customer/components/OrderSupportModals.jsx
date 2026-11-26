import React, { useState, useEffect } from 'react';
import { Clock, Send, Ticket, MessageSquareWarning, XCircle } from 'lucide-react';
import { Button, Badge, Textarea, Modal, WriteReviewModal } from '../../../components/ui';
import MediaAttachmentField from '../../../components/common/MediaAttachmentField';
import OrderActionModal from '../../../components/common/OrderActionModal';
import ActivityTimeline from '../../../components/common/ActivityTimeline';
import TicketAttachments from '../../../components/common/TicketAttachments';
import {
  CANCEL_ORDER_REASONS,
  COMPLAINT_CATEGORIES,
  getTicketBadgeVariant,
  getTicketTimelogs,
} from '../../../data/customerDefaults';

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

  const timelineItems = timelogs.map((log, idx) => {
    const prevStatus = idx > 0 ? timelogs[idx - 1].status : null;
    const logTone = getTicketBadgeVariant(log.status || activeTicket?.status);
    const showStatusBadge = log.status && log.status !== prevStatus;

    return {
      id: log.id,
      title: log.actor,
      tone: logTone,
      badgeText: showStatusBadge ? log.status : null,
      badgeVariant: logTone,
      timestamp: log.timestamp,
      description: log.message,
      extra: <TicketAttachments attachments={log.attachments} />,
    };
  });

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

      {/* Ticket Details & Timelog Modal */}
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
            <div className="cf-ticket-modal-main">
              <div className={`cf-ticket-detail-summary is-${activeTicketTone}`}>
                <div className="cf-ticket-issue-head">
                  <span className="cf-ticket-section-tag">Issue</span>
                  <Badge variant={activeTicketTone} dot>
                    {activeTicket.status}
                  </Badge>
                </div>
                <p className="cf-ticket-detail-desc">{activeTicket.description}</p>
                <TicketAttachments attachments={activeTicket.attachments} />
              </div>

              <div className="cf-ticket-timelog-section">
                <h4 className="cf-ticket-timelog-heading">
                  <Clock size={14} /> Time Logs ({timelogs.length})
                </h4>
                <ActivityTimeline items={timelineItems} style={{ maxHeight: '280px' }} />
              </div>
            </div>

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
