import React from 'react';
import Button from '../ui/Button/Button';
import Card from '../ui/Card/Card';

/**
 * Reusable Empty State card matching CartFlow's theme tokens.
 */
export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Card className="cf-cust-empty-state">
      {Icon && <Icon size={36} />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
