import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RemoveFormatting,
} from 'lucide-react';
import './RichTextEditor.css';

export function stripHtmlTags(html = '') {
  if (!html) return '';
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|h4|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+\n/g, '\n')
    .trim();
}

export function sanitizeRichHtml(raw = '') {
  const input = String(raw || '').trim();
  if (!input) return '';

  if (!/<[a-z][\s\S]*>/i.test(input)) {
    return input
      .split(/\n{2,}/)
      .map((para) => `<p>${para.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }

  if (typeof DOMParser === 'undefined') return input;

  const doc = new DOMParser().parseFromString(input, 'text/html');
  const blocked = doc.querySelectorAll('script, style, iframe, object, embed, link, meta');
  blocked.forEach((el) => el.remove());

  doc.body.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || name === 'style') {
        el.removeAttribute(attr.name);
      }
      if (name === 'href' && /^\s*javascript:/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

export default function RichTextEditor({
  label,
  required = false,
  value = '',
  onChange,
  placeholder = 'Write product details...',
  maxLength = 2000,
  error = '',
  className = '',
}) {
  const editorRef = useRef(null);
  const lastEmittedRef = useRef(null);
  const savedRangeRef = useRef(null);

  const [blockType, setBlockType] = useState('p');
  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });

  const plainLength = stripHtmlTags(value).length;

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || !savedRangeRef.current) return;
    sel.removeAllRanges();
    sel.addRange(savedRangeRef.current);
  }, []);

  const syncToolbarState = useCallback(() => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    if (!editorRef.current.contains(sel.anchorNode)) return;

    saveSelection();

    try {
      const rawBlock = String(document.queryCommandValue('formatBlock') || 'p')
        .toLowerCase()
        .replace(/[<>]/g, '');
      setBlockType(['p', 'h2', 'h3'].includes(rawBlock) ? rawBlock : 'p');

      setActiveMarks({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // ignore unsupported browser command checks
    }
  }, [saveSelection]);

  useEffect(() => {
    if (!editorRef.current) return;
    const normalizedHtml = sanitizeRichHtml(value);
    if (lastEmittedRef.current === value) return;
    if (editorRef.current.innerHTML !== normalizedHtml) {
      editorRef.current.innerHTML = normalizedHtml;
    }
    lastEmittedRef.current = value;
  }, [value]);

  useEffect(() => {
    document.addEventListener('selectionchange', syncToolbarState);
    return () => document.removeEventListener('selectionchange', syncToolbarState);
  }, [syncToolbarState]);

  const emitChange = (html) => {
    const clean = stripHtmlTags(html).length === 0 ? '' : html;
    lastEmittedRef.current = clean;
    onChange && onChange(clean);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (stripHtmlTags(html).length > maxLength && lastEmittedRef.current !== null) {
      editorRef.current.innerHTML = lastEmittedRef.current;
      return;
    }
    emitChange(html);
    syncToolbarState();
  };

  const runExec = (command, arg = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    document.execCommand(command, false, arg);
    emitChange(editorRef.current.innerHTML);
    syncToolbarState();
  };

  const handleBlockChange = (e) => {
    const tag = e.target.value;
    setBlockType(tag);
    runExec('formatBlock', tag.toUpperCase());
  };

  return (
    <div className={`cf-ui-form-group ${className}`}>
      {(label || maxLength) && (
        <div className="cf-rte-label-row">
          {label ? (
            <label className="cf-ui-label">
              {label} {required && <span className="cf-ui-required">*</span>}
            </label>
          ) : (
            <span />
          )}
          <span className={`cf-rte-counter ${plainLength >= maxLength ? 'is-limit' : ''}`}>
            {plainLength} / {maxLength} chars
          </span>
        </div>
      )}

      <div className={`cf-rte-container ${error ? 'has-error' : ''}`}>
        <div className="cf-rte-toolbar">
          <select
            className="cf-rte-block-select"
            value={blockType}
            onMouseDown={saveSelection}
            onChange={handleBlockChange}
            title="Text format"
            aria-label="Text format"
          >
            <option value="p">Paragraph</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <span className="cf-rte-sep" />

          <button
            type="button"
            className={`cf-rte-btn ${activeMarks.bold ? 'is-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              runExec('bold');
            }}
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>

          <button
            type="button"
            className={`cf-rte-btn ${activeMarks.italic ? 'is-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              runExec('italic');
            }}
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>

          <button
            type="button"
            className={`cf-rte-btn ${activeMarks.underline ? 'is-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              runExec('underline');
            }}
            title="Underline (Ctrl+U)"
          >
            <Underline size={14} />
          </button>

          <span className="cf-rte-sep" />

          <button
            type="button"
            className={`cf-rte-btn ${activeMarks.ul ? 'is-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              runExec('insertUnorderedList');
            }}
            title="Bullet list"
          >
            <List size={14} />
          </button>

          <button
            type="button"
            className={`cf-rte-btn ${activeMarks.ol ? 'is-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              runExec('insertOrderedList');
            }}
            title="Numbered list"
          >
            <ListOrdered size={14} />
          </button>

          <span className="cf-rte-sep" />

          <button
            type="button"
            className="cf-rte-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              runExec('removeFormat');
            }}
            title="Clear formatting"
          >
            <RemoveFormatting size={14} />
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="cf-rte-surface"
          data-placeholder={placeholder}
          onInput={handleEditorInput}
          onKeyUp={syncToolbarState}
          onMouseUp={syncToolbarState}
          onBlur={saveSelection}
        />
      </div>

      {error && <span className="cf-ui-field-error">{error}</span>}
    </div>
  );
}


