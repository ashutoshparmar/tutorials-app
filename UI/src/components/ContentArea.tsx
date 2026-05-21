import React from 'react';
import { Course, Topic } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ContentAreaProps {
  selectedCourse: Course | undefined;
  selectedTopic: Topic | undefined;
  canEdit: boolean;
  updateTopicContent: (field: 'content' | 'example', value: string) => void;
  navigateTopic: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  selectedCourse,
  selectedTopic,
  canEdit,
  updateTopicContent,
  navigateTopic,
  hasPrev,
  hasNext
}) => {
  return (
    <section className="panel content-panel">
      {selectedTopic ? (
        <>
          <div className="content-header">
            <div className="title-section">
              <span className="course-meta">📖 {selectedCourse?.title}</span>
              <h2>{selectedTopic.title}</h2>
            </div>
          </div>

          <div className="content-block">
            <h3>Explanation</h3>
            {canEdit ? (
              <textarea
                className="edit-area"
                value={selectedTopic.content}
                onChange={(e) => updateTopicContent('content', e.target.value)}
                placeholder="Topic explanation (supports Markdown)..."
                rows={10}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={selectedTopic.content} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>Example / Practical Implementation</h3>
            {canEdit ? (
              <textarea
                className="edit-area code-font"
                value={selectedTopic.example}
                onChange={(e) => updateTopicContent('example', e.target.value)}
                placeholder="Topic code sample..."
                rows={8}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={`\`\`\`typescript\n${selectedTopic.example}\n\`\`\``} />
              </div>
            )}
          </div>

          <div className="pager-controls">
            <button 
              className="pager-btn"
              onClick={() => navigateTopic('prev')} 
              disabled={!hasPrev}
            >
              ◀ Previous Topic
            </button>
            <button 
              className="pager-btn"
              onClick={() => navigateTopic('next')} 
              disabled={!hasNext}
            >
              Next Topic ▶
            </button>
          </div>
        </>
      ) : (
        <div className="content-placeholder">
          <div className="placeholder-icon">📖</div>
          <h3>Select a Topic</h3>
          <p className="muted-text">Choose a topic from the sidebar menu to read the details, run code examples, and review interview questions.</p>
        </div>
      )}
    </section>
  );
};
