import React, { useState, useEffect } from 'react';
import { Course, Topic } from '../types';

interface DetailedTopicViewProps {
  selectedCourse: Course | undefined;
  selectedTopic: Topic | undefined;
  canEdit: boolean;
  updateTopicContent: (field: 'html', value: string) => void;
}

export const DetailedTopicView: React.FC<DetailedTopicViewProps> = ({
  selectedCourse,
  selectedTopic,
  canEdit,
  updateTopicContent
}) => {
  const [editorHtml, setEditorHtml] = useState(selectedTopic?.html ?? '');

  useEffect(() => {
    setEditorHtml(selectedTopic?.html ?? '');
  }, [selectedTopic]);

  const htmlContent = selectedTopic?.html ?? '';
  const previewHtml = htmlContent || '<div style="padding:16px;color:#555;">No detailed HTML content available.</div>';

  const handleEditorChange = (value: string) => {
    setEditorHtml(value);
    updateTopicContent('html', value);
  };

  return (
    <section className="panel content-panel detailed-topic-view">
      {selectedTopic ? (
        <>
          <div className={`html-editor-layout ${!canEdit ? 'full-width-preview' : ''}`}>
            {canEdit && (
              <div className="html-editor-pane">
                <div className="content-block">
                  <h3>HTML Editor</h3>
                  <p className="section-hint">Paste full HTML markup here. Styles and layout will render in the preview.</p>
                  <textarea
                    className="html-edit-area code-font"
                    value={editorHtml}
                    onChange={(e) => handleEditorChange(e.target.value)}
                    placeholder="Paste full HTML content here..."
                    rows={20}
                  />
                </div>
              </div>
            )}

            <div className="html-preview-pane">
              <div className="content-block">
                <div className="html-iframe-wrapper">
                  <iframe
                    title="HTML Preview"
                    srcDoc={previewHtml}
                    sandbox="allow-same-origin allow-scripts"
                    className="html-preview-iframe"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Select a topic from the sidebar to view details.</p>
        </div>
      )}
    </section>
  );
};
