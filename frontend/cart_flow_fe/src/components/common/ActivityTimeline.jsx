import React from 'react';
import { Badge } from '../ui';
import './ActivityTimeline.css';

/**
 * Shared Vertical Timeline Component.
 * Used across Admin Customer Activity Timeline, Admin Ticket Logs, and Customer Ticket Logs.
 */
export default function ActivityTimeline({
  items = [],
  emptyText = 'No activity logged yet.',
  className = '',
  style,
}) {
  if (!items || items.length === 0) {
    return (
      <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--cf-text-muted)' }}>
        {emptyText}
      </p>
    );
  }

  return (
    <div className={`cf-common-timeline ${className}`} style={style}>
      {items.map((item) => (
        <div key={item.id} className="cf-common-timeline-item">
          <div className={`cf-common-timeline-dot is-${item.tone || 'default'}`} />
          <div>
            <div className="cf-common-timeline-top">
              <div className="cf-common-timeline-title-row">
                <strong>{item.title}</strong>
                {item.badgeText && (
                  <Badge variant={item.badgeVariant || 'neutral'} size="sm">
                    {item.badgeText}
                  </Badge>
                )}
              </div>
              {item.timestamp && <span>{item.timestamp}</span>}
            </div>
            {item.description && <p className="cf-common-timeline-msg">{item.description}</p>}
            {item.extra}
          </div>
        </div>
      ))}
    </div>
  );
}
