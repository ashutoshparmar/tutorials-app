import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import './HtmlEditorPreview.css';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  canEdit?: boolean;
  rows?: number;
  placeholder?: string;
}

export const HtmlEditorPreview: React.FC<Props> = ({ value, onChange, canEdit = true, rows = 8, placeholder }) => {
  const isHtml = /<[^>]+>/.test(value || '');

  if (canEdit) {
    return (
      <div className="html-editor-grid">
        <textarea
          className="html-edit-area code-font"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
        <div className="html-iframe-wrapper">
          <iframe
            title="preview"
            srcDoc={value || '<div style="padding:16px;color:#555;">Preview is empty</div>'}
            sandbox="allow-same-origin allow-scripts"
            className="html-preview-iframe"
          />
        </div>
      </div>
    );
  }

  // view mode: render HTML if present, otherwise render markdown
  if (isHtml) {
    return (
      <div className="html-iframe-wrapper">
        <iframe
          title="preview"
          srcDoc={value}
          sandbox="allow-same-origin"
          className="html-preview-iframe"
        />
      </div>
    );
  }

  return <MarkdownRenderer content={value || ''} />;
};
