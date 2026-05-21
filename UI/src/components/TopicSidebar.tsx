import React from 'react';
import { Course } from '../types';

interface TopicSidebarProps {
  selectedCourse: Course | undefined;
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;
  canEdit: boolean;
  showTopics: boolean;
  setShowTopics: React.Dispatch<React.SetStateAction<boolean>>;
  moveTopic: (id: string, direction: 'up' | 'down') => void;
  removeTopic: (id: string) => void;
  newTopicTitle: string;
  setNewTopicTitle: (title: string) => void;
  newTopicContent: string;
  setNewTopicContent: (content: string) => void;
  newTopicExample: string;
  setNewTopicExample: (example: string) => void;
  addTopic: () => void;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({
  selectedCourse,
  selectedTopicId,
  setSelectedTopicId,
  canEdit,
  showTopics,
  setShowTopics,
  moveTopic,
  removeTopic,
  newTopicTitle,
  setNewTopicTitle,
  newTopicContent,
  setNewTopicContent,
  newTopicExample,
  setNewTopicExample,
  addTopic
}) => {
  return (
    <aside className="panel nav-panel">
      <div className="nav-header">
        <h2>Topics List</h2>
        <button className="hamburger-button" onClick={() => setShowTopics(!showTopics)}>
          <span className="hamburger-icon">{showTopics ? '✕' : '☰'}</span>
          <span>{showTopics ? 'Hide' : 'Show'}</span>
        </button>
      </div>

      {selectedCourse?.topics.length ? (
        showTopics ? (
          <ul className="topics-list">
            {selectedCourse.topics.map((topic, index) => (
              <li key={topic.id} className={`topic-item ${topic.id === selectedTopicId ? 'active' : ''}`}>
                <button
                  className="topic-btn"
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  📄 {topic.title}
                </button>
                {canEdit && (
                  <div className="topic-actions">
                    <button
                      className="move-button"
                      disabled={index === 0}
                      onClick={() => moveTopic(topic.id, 'up')}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      className="move-button"
                      disabled={index === selectedCourse.topics.length - 1}
                      onClick={() => moveTopic(topic.id, 'down')}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button className="remove-button" onClick={() => removeTopic(topic.id)} title="Delete Topic">
                      🗑️
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="topics-collapsed">
            <p>Topics menu is hidden. Click the button to expand.</p>
          </div>
        )
      ) : (
        <p className="muted-text">No topics found in this course.</p>
      )}

      {canEdit && (
        <div className="admin-panel add-topic-panel">
          <h3>＋ Add New Topic</h3>
          <input
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="Topic title"
          />
          <textarea
            value={newTopicContent}
            onChange={(e) => setNewTopicContent(e.target.value)}
            placeholder="Topic content (Markdown supported!)"
            rows={3}
          />
          <textarea
            value={newTopicExample}
            onChange={(e) => setNewTopicExample(e.target.value)}
            placeholder="Code example / snippet"
            rows={2}
          />
          <button className="primary-btn" onClick={addTopic}>Create Topic</button>
        </div>
      )}
    </aside>
  );
};
