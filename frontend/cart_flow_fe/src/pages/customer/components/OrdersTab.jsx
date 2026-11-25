import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  Check,
  Star,
  ShoppingBag,
  Receipt,
  MessageSquareWarning,
  XCircle,
  Ticket
} from 'lucide-react';
import { Button, Badge, Pagination } from '../../../components/ui';
import EmptyState from '../../../components/common/EmptyState';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getOrderBadgeVariant, getTicketBadgeVariant } from '../../../data/customerDefaults';

const ORDERS_PER_PAGE = 3;

const FULFILLMENT_STAGES = [
  { step: 1, label: 'Confirmed' },
  { step: 2, label: 'Packed' },
  { step: 3, label: 'Shipped' },
  { step: 4, label: 'Delivered' },
];

export default function OrdersTab({
  orders,
  complaints,
  hasReviewedItem,
  onOpenProduct,
  onOpenReview,
  onOpenComplaint,
  onOpenTicket,
  onViewReceipt,
  onCancelOrder,
  onBuyAgain,
}) {
  const navigate = useNavigate();
  const { page, setPage, pageSize, totalItems, paginatedItems } = usePaginatedList(
    orders,
    ORDERS_PER_PAGE
  );

  return (
    <div className="cf-cust-tab-panel">
      <div className="cf-panel-header">
        <div>
          <h2 className="cf-panel-title">My Orders</h2>
          <p className="cf-panel-subtitle">Track orders, download receipts, or get help.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/shop')}>
          Shop More
        </Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your placed orders will appear here."
          actionLabel="Explore Store"
          onAction={() => navigate('/shop')}
        />
      ) : (
        <>
          <div className="cf-orders-cards-list">
            {paginatedItems.map((order) => {
              const orderTickets = complaints.filter((t) => t.orderId === order.id);

              return (
                <div key={order.id} className="cf-order-box-card">
                  {/* Top Bar */}
                  <div className="cf-order-box-header">
                    <div className="cf-order-id-meta">
                      <span className="cf-order-ref">{order.id}</span>
                      <span className="cf-order-date">
                        {order.date}
                        {order.gatewayResponse?.gateway ? ` • ${order.gatewayResponse.gateway}` : ''}
                      </span>
                    </div>

                    <div className="cf-order-status-group">
                      <span className="cf-order-amount">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </span>
                      <Badge variant={getOrderBadgeVariant(order.status)} dot>
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Fulfillment Tracker */}
                  {order.status !== 'Cancelled' && (
                    <div className="cf-order-timeline-box">
                      <div className="cf-timeline-steps">
                        {FULFILLMENT_STAGES.map((s) => {
                          const isDone = (order.currentStage || 1) >= s.step;
                          const isCurrent = (order.currentStage || 1) === s.step;

                          return (
                            <div
                              key={s.step}
                              className={`cf-timeline-node ${isDone ? 'is-done' : ''} ${
                                isCurrent ? 'is-current' : ''
                              }`}
                            >
                              <div className="cf-timeline-circle">
                                {isDone ? <Check size={12} /> : s.step}
                              </div>
                              <span className="cf-timeline-label">{s.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="cf-timeline-courier-line">
                        <Truck size={15} color="var(--cf-accent-primary)" />
                        <span>{order.courier}</span>
                        {order.estimatedDelivery && (
                          <span className="cf-est-arrival">
                            • ETA: <strong>{order.estimatedDelivery}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items Breakdown */}
                  <div className="cf-order-items-grid">
                    {order.items.map((item, idx) => {
                      const reviewed = hasReviewedItem(order.id, item.id);
                      return (
                        <div
                          key={idx}
                          className="cf-order-item-row cf-clickable-product-row"
                          onClick={() => onOpenProduct(item.id)}
                          title="View product"
                        >
                          <img src={item.image} alt={item.title} className="cf-order-thumb" />
                          <div className="cf-order-item-info">
                            <h4 className="cf-order-item-title">{item.title}</h4>
                            <p className="cf-order-item-spec">
                              {item.size} • Qty: {item.qty}
                            </p>
                            <span className="cf-order-item-price">
                              ₹{Number(item.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div
                            className="cf-order-item-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {order.status === 'Delivered' && (
                              <Button
                                size="sm"
                                variant={reviewed ? 'ghost' : 'outline'}
                                icon={Star}
                                disabled={reviewed}
                                onClick={() => onOpenReview(order.id, item)}
                              >
                                {reviewed ? 'Reviewed' : 'Write Review'}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              icon={ShoppingBag}
                              onClick={() => onBuyAgain(item, idx)}
                            >
                              Buy Again
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Actions & Compact Linked Ticket Chip */}
                  <div className="cf-order-footer-bar">
                    <div className="cf-order-ticket-inline-list">
                      {orderTickets.length > 0 ? (
                        orderTickets.map((ticket) => {
                          const ticketTone = getTicketBadgeVariant(ticket.status);
                          return (
                            <button
                              key={ticket.id}
                              type="button"
                              className={`cf-order-ticket-chip is-${ticketTone}`}
                              onClick={() => onOpenTicket(ticket.id)}
                              title="View ticket details & timelog"
                            >
                              <Ticket size={13} />
                              <span className="cf-ticket-chip-id">{ticket.id}</span>
                              <Badge variant={ticketTone} size="sm" dot>
                                {ticket.status}
                              </Badge>
                            </button>
                          );
                        })
                      ) : (
                        <span className="cf-return-window-notice">
                          {order.status === 'Cancelled'
                            ? `Cancelled${order.cancelReason ? ` • ${order.cancelReason}` : ''}`
                            : '7-day return eligible'}
                        </span>
                      )}
                    </div>

                    <div className="cf-order-footer-actions">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Receipt}
                        onClick={() => onViewReceipt(order)}
                      >
                        Receipt
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={MessageSquareWarning}
                        onClick={() => onOpenComplaint(order)}
                      >
                        Raise Complaint
                      </Button>
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={XCircle}
                          onClick={() => onCancelOrder(order)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cf-cust-pagination-wrap">
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
