import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Card.css';

export default function Card({
  children,
  className = '',
  hoverable = false,
  highlighted = false,
  ...props
}) {
  return (
    <div
      className={`cf-ui-card ${hoverable ? 'is-hoverable' : ''} ${
        highlighted ? 'is-highlighted' : ''
      } ${className}`}
      {...props}
    >
      {children}
      {highlighted && <div className="cf-card-gradient-indicator" />}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`cf-ui-card-header ${className}`}>
      {title ? (
        <div className="cf-card-title-wrap">
          <h4 className="cf-card-heading">{title}</h4>
          {subtitle && <p className="cf-card-subheading">{subtitle}</p>}
        </div>
      ) : (
        children
      )}
      {action && <div className="cf-card-action">{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`cf-ui-card-body ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={`cf-ui-card-footer ${className}`}>{children}</div>;
};

/**
 * Metric Card Primitive (Matching screenshot)
 */
export function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  hasArrow = false,
  highlighted = false,
  className = '',
}) {
  return (
    <Card highlighted={highlighted} className={`cf-metric-card-primitive ${className}`}>
      <div className="cf-metric-primitive-top">
        <span className="cf-metric-primitive-title">{title}</span>
        {Icon && <Icon size={18} className="cf-metric-primitive-icon" />}
      </div>
      <div className="cf-metric-primitive-mid">
        <div className="cf-metric-primitive-val">{value}</div>
        {hasArrow && <ArrowUpRight size={16} className="cf-metric-primitive-arrow" />}
      </div>
      {subtext && <div className="cf-metric-primitive-sub">{subtext}</div>}
    </Card>
  );
}
