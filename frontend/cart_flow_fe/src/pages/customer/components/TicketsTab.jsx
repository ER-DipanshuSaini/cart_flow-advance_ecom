import React from 'react';
import { Ticket, ArrowRight } from 'lucide-react';
import { Button, Badge, Pagination } from '../../../components/ui';
import EmptyState from '../../../components/common/EmptyState';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getTicketBadgeVariant, getTicketTimelogs } from '../../../data/customerDefaults';

const TICKETS_PER_PAGE = 4;

export default function TicketsTab({
  complaints,
  onOpenTicket,
  onGoToOrders,
}) {
  const { page, setPage, pageSize, totalItems, paginatedItems } = usePaginatedList(
    complaints,
    TICKETS_PER_PAGE
  );

  return (
    <div className="cf-cust-tab-panel">
      <div className="cf-panel-header">
        <div>
          <h2 className="cf-panel-title">Raised Tickets &amp; Support</h2>
          <p className="cf-panel-subtitle">
            Click any ticket to view complete details, resolution progress, and activity timelogs.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onGoToOrders}>
          Go to My Orders
        </Button>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No raised tickets"
          description="If you face an issue with any order, you can raise a complaint from My Orders."
          actionLabel="View Orders"
          onAction={onGoToOrders}
        />
      ) : (
        <>
          <div className="cf-complaints-list">
            {paginatedItems.map((ticket) => {
              const logs = getTicketTimelogs(ticket);
              const tone = getTicketBadgeVariant(ticket.status);
              return (
                <div
                  key={ticket.id}
                  className={`cf-complaint-ticket-card cf-clickable-ticket-card is-${tone}`}
                  onClick={() => onOpenTicket(ticket.id)}
                >
                  <div className="cf-complaint-ticket-top">
                    <div className="cf-ticket-id-row">
                      <Ticket size={15} />
                      <strong>{ticket.id}</strong>
                      <span className="cf-ticket-order-ref">• Order {ticket.orderId}</span>
                    </div>
                    <Badge variant={tone} dot>
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="cf-complaint-cat">{ticket.category}</p>
                  <p className="cf-complaint-desc">{ticket.description}</p>
                  <div className="cf-ticket-card-footer">
                    <span className="cf-complaint-date">
                      Raised on {ticket.createdAt} • {logs.length} timelog update(s)
                    </span>
                    <span className="cf-ticket-view-cta">
                      View Details &amp; Timelog <ArrowRight size={13} />
                    </span>
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
