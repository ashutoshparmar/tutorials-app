import React from 'react';
import { Course, Topic } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

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
              <span className="course-meta">📖 {selectedCourse?.title}</span>
              <h2>{selectedTopic.title}</h2>
            </div>
          </div>

          <div className="content-block">
            <h3>1️⃣ What Is It?</h3>
            <p className="section-hint">A clear explanation of the core concept</p>
            {canEdit ? (
              <textarea
                className="edit-area"
                value={definition}
                onChange={(e) => updateTopicContent('definition', e.target.value)}
                placeholder="Write a concise definition of the topic..."
                rows={4}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={definition || '*Definition is not yet available.*'} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>2️⃣ Why Is It Important?</h3>
            <p className="section-hint">When and why you should use this</p>
            {canEdit ? (
              <textarea
                className="edit-area"
                value={why}
                onChange={(e) => updateTopicContent('why', e.target.value)}
                placeholder="Explain why this topic is important or when to use it..."
                rows={4}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={why || '*This section explains the need for the topic.*'} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>3️⃣ The Problem It Solves</h3>
            <p className="section-hint">What challenge or pain point does this address?</p>
            {canEdit ? (
              <textarea
                className="edit-area"
                value={problem}
                onChange={(e) => updateTopicContent('problem', e.target.value)}
                placeholder="Describe the problem or pain point this solves..."
                rows={4}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={problem || '*Clarify the problem this topic addresses.*'} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>4️⃣ Real-World Scenario</h3>
            <p className="section-hint">How is this used in practice?</p>
            {canEdit ? (
              <textarea
                className="edit-area"
                value={realWorldExample}
                onChange={(e) => updateTopicContent('realWorldExample', e.target.value)}
                placeholder="Give a concrete real-world scenario for this topic..."
                rows={4}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={realWorldExample || '*Provide a real use case or scenario.*'} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>5️⃣ Syntax & Structure</h3>
            <p className="section-hint">How to write or use it</p>
            {canEdit ? (
              <textarea
                className="edit-area code-font"
                value={syntax}
                onChange={(e) => updateTopicContent('syntax', e.target.value)}
                placeholder="Show the basic syntax or structure for this topic..."
                rows={6}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={syntax || '*Show the syntax or core structure here.*'} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>6️⃣ Complete Code Example</h3>
            <p className="section-hint">A working implementation</p>
            {canEdit ? (
              <textarea
                className="edit-area code-font"
                value={practicalExample}
                onChange={(e) => updateTopicContent('practicalExample', e.target.value)}
                placeholder="Include a working example or code snippet..."
                rows={8}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={`\`\`\`typescript\n${practicalExample}\n\`\`\``} />
              </div>
            )}
          </div>

          <div className="content-block">
            <h3>7️⃣ Common Pitfalls</h3>
            <p className="section-hint">Mistakes to avoid and best practices</p>
            {canEdit ? (
              <textarea
                className="edit-area"
                value={commonMistakes}
                onChange={(e) => updateTopicContent('commonMistakes', e.target.value)}
                placeholder="List frequent errors, pitfalls, or misconceptions..."
                rows={4}
              />
            ) : (
              <div className="rendered-markdown">
                <MarkdownRenderer content={commonMistakes || '*List common traps or misunderstandings.*'} />
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
