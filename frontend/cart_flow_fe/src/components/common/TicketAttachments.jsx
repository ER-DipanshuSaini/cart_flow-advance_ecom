import React from 'react';
import { Film } from 'lucide-react';
import './TicketAttachments.css';

/**
 * Shared Image & Video Attachments Preview Strip for Support Tickets.
 */
export default function TicketAttachments({ attachments = [] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="cf-common-attachments-grid">
      {attachments.map((file, idx) => (
        <div key={file.id || idx} className="cf-common-attachment-item">
          {file.type === 'video' ? (
            <video src={file.url} controls className="cf-common-attachment-media" />
          ) : (
            <a href={file.url} target="_blank" rel="noopener noreferrer" title={file.name}>
              <img
                src={file.url}
                alt={file.name || `Attachment ${idx + 1}`}
                className="cf-common-attachment-media"
              />
            </a>
          )}
          <span className="cf-common-attachment-name">
            {file.type === 'video' && <Film size={11} />}
            {file.name || `File ${idx + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}
