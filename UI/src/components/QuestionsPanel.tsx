import React, { useState } from 'react';
import { Topic } from '../types';

interface QuestionsPanelProps {
  selectedTopic: Topic | undefined;
  canEdit: boolean;
  newQuestionText: string;
  setNewQuestionText: (text: string) => void;
  newAnswerText: string;
  setNewAnswerText: (text: string) => void;
  addQuestion: () => void;
  removeQuestion: (id: string) => void;
}

export const QuestionsPanel: React.FC<QuestionsPanelProps> = ({
  selectedTopic,
  canEdit,
  newQuestionText,
  setNewQuestionText,
  newAnswerText,
  setNewAnswerText,
  addQuestion,
  removeQuestion
}) => {
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <aside className="panel question-panel">
      <h2>💡 Interview Prep</h2>
      
      {selectedTopic ? (
        <>
          {selectedTopic.questions.length ? (
            <ul className="questions-list">
              {selectedTopic.questions.map((question) => {
                const isRevealed = !!revealedQuestions[question.id];
                return (
                  <li key={question.id} className="question-item">
                    <div className="question-header">
                      <strong>Q: {question.question}</strong>
                    </div>
                    
                    {/* Interactive Answer Reveal */}
                    <div className={`answer-body ${isRevealed || canEdit ? 'revealed' : 'collapsed'}`}>
                      <p>{question.answer}</p>
                    </div>

                    <div className="question-actions-row">
                      {!canEdit && (
                        <button 
                          className={`reveal-btn ${isRevealed ? 'active' : ''}`} 
                          onClick={() => toggleReveal(question.id)}
                        >
                          {isRevealed ? '🙈 Hide Answer' : '👁️ Show Answer'}
                        </button>
                      )}
                      
                      {canEdit && (
                        <button 
                          className="remove-button" 
                          onClick={() => removeQuestion(question.id)}
                          title="Remove Question"
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted-text">No interview questions added for this topic yet.</p>
          )}

          {canEdit && (
            <div className="admin-panel add-question-panel">
              <h3>＋ Add Question</h3>
              <input
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Question text"
              />
              <textarea
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Correct answer"
                rows={3}
              />
              <button className="primary-btn" onClick={addQuestion}>Add Question</button>
            </div>
          )}
        </>
      ) : (
        <p className="muted-text">Select a topic to view interview questions.</p>
      )}
    </aside>
  );
};
