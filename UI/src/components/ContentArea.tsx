import React from 'react';
import { Course, Topic } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { HtmlEditorPreview } from './HtmlEditorPreview';

interface ContentAreaProps {
  selectedCourse: Course | undefined;
  selectedTopic: Topic | undefined;
  canEdit: boolean;
  updateTopicContent: (
    field:
      | 'content'
      | 'example'
      | 'definition'
      | 'why'
      | 'problem'
      | 'realWorldExample'
      | 'syntax'
      | 'practicalExample'
      | 'commonMistakes',
    value: string
  ) => void;
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
  const definition = selectedTopic?.definition ?? selectedTopic?.content ?? '';
  const why = selectedTopic?.why ?? '';
  const problem = selectedTopic?.problem ?? '';
  const realWorldExample = selectedTopic?.realWorldExample ?? '';
  const syntax = selectedTopic?.syntax ?? '';
  const practicalExample = selectedTopic?.practicalExample ?? selectedTopic?.example ?? '';
  const commonMistakes = selectedTopic?.commonMistakes ?? '';

  return (
    <section className="panel content-panel">
      {selectedTopic ? (
        <>
          <div className="content-header">
            <div className="title-section">              
              <h2>{selectedTopic.title}</h2>
            </div>
          </div>

          <div className="content-block">
            <h3>1️⃣ What Is It?</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={definition}
                onChange={(v) => updateTopicContent('definition', v)}
                canEdit={true}
                rows={6}
                placeholder="Write a concise definition of the topic..."
              />
            ) : (
              <HtmlEditorPreview value={definition} canEdit={false} />
            )}
          </div>

          <div className="content-block">
            <h3>2️⃣ Why Is It Important?</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={why}
                onChange={(v) => updateTopicContent('why', v)}
                canEdit={true}
                rows={6}
                placeholder="Explain why this topic is important or when to use it..."
              />
            ) : (
              <HtmlEditorPreview value={why} canEdit={false} />
            )}
          </div>

          <div className="content-block">
            <h3>3️⃣ The Problem It Solves</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={problem}
                onChange={(v) => updateTopicContent('problem', v)}
                canEdit={true}
                rows={6}
                placeholder="Describe the problem or pain point this solves..."
              />
            ) : (
              <HtmlEditorPreview value={problem} canEdit={false} />
            )}
          </div>

          <div className="content-block">
            <h3>4️⃣ Real-World Scenario</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={realWorldExample}
                onChange={(v) => updateTopicContent('realWorldExample', v)}
                canEdit={true}
                rows={6}
                placeholder="Give a concrete real-world scenario for this topic..."
              />
            ) : (
              <HtmlEditorPreview value={realWorldExample} canEdit={false} />
            )}
          </div>

          <div className="content-block">
            <h3>5️⃣ Syntax & Structure</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={syntax}
                onChange={(v) => updateTopicContent('syntax', v)}
                canEdit={true}
                rows={6}
                placeholder="Show the basic syntax or structure for this topic..."
              />
            ) : (
              <HtmlEditorPreview value={syntax} canEdit={false} />
            )}
          </div>

          <div className="content-block">
            <h3>6️⃣ Complete Code Example</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={practicalExample}
                onChange={(v) => updateTopicContent('practicalExample', v)}
                canEdit={true}
                rows={10}
                placeholder="Include a working example or code snippet..."
              />
            ) : (
              <HtmlEditorPreview value={`<pre><code>${practicalExample}</code></pre>`} canEdit={false} />
            )}
          </div>

          <div className="content-block">
            <h3>7️⃣ Common Pitfalls</h3>
            {canEdit ? (
              <HtmlEditorPreview
                value={commonMistakes}
                onChange={(v) => updateTopicContent('commonMistakes', v)}
                canEdit={true}
                rows={6}
                placeholder="List frequent errors, pitfalls, or misconceptions..."
              />
            ) : (
              <HtmlEditorPreview value={commonMistakes} canEdit={false} />
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
