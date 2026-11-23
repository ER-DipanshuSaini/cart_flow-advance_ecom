import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function Toast({
  id,
  type = 'success', // 'success' | 'error' | 'warning' | 'info'
  title,
  message,
  onClose,
}) {
  const Icon = TOAST_ICONS[type] || Info;

  return (
    <div className={`cf-ui-toast cf-ui-toast-${type}`}>
      <div className="cf-ui-toast-icon-wrap">
        <Icon size={18} />
      </div>
      <div className="cf-ui-toast-content">
        {title && <h5 className="cf-ui-toast-title">{title}</h5>}
        {message && <p className="cf-ui-toast-msg">{message}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          className="cf-ui-toast-close"
          onClick={() => onClose(id)}
          aria-label="Dismiss toast"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts = [], onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="cf-ui-toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
