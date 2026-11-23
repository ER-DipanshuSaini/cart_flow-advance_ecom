import React from 'react';
import './Card.css';

export default function Card({
  children,
  className = '',
  hoverable = false,
  ...props
}) {
  return (
    <div className={`cf-card ${hoverable ? 'hoverable' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return <div className={`cf-card-header ${className}`}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`cf-card-body ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={`cf-card-footer ${className}`}>{children}</div>;
};
