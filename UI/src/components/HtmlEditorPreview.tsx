import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

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
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    );
  }

  // view mode: render HTML if present, otherwise render markdown
  if (isHtml) {
    return (
      <div dangerouslySetInnerHTML={{ __html: value }} />
    );
  }

  return <MarkdownRenderer content={value || ''} />;
};
