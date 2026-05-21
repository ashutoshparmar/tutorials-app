import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Course, Database, InterviewQuestion, Topic, User } from './types';

const STORAGE_VERSION = 2;
const STORAGE_KEY = `tutorial-app-db-v${STORAGE_VERSION}`;
const OLD_STORAGE_KEYS = ['tutorial-app-db', 'tutorial-app-db-v1'];

const getInitialDb = async (): Promise<Database> => {
  try {
    const response = await fetch('/data/db.json');

    if (!response.ok) {
      throw new Error('Failed to load db.json');
    }

    const data = await response.json();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Could not cache DB in localStorage', error);
    }

    OLD_STORAGE_KEYS.forEach((oldKey) => localStorage.removeItem(oldKey));

    return data;
  } catch (error) {
    console.warn('Error loading DB from network, falling back to localStorage', error);

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed?.users && parsed?.courses) {
        return parsed as Database;
      }

      localStorage.removeItem(STORAGE_KEY);
    }

    return {
      users: [],
      courses: []
    } as Database;
  }
};

function App() {
  const [db, setDb] = useState<Database>({ users: [], courses: [] } as Database);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicExample, setNewTopicExample] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [loginUserId, setLoginUserId] = useState(() => db.users.find((user) => user.role === 'admin')?.id ?? '');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash === '/admin' ? '/admin' : '/';
  });
  const [showTopics, setShowTopics] = useState(true);

  useEffect(() => {
    let mounted = true;

    getInitialDb().then((data) => {
      if (!mounted) return;
      setDb(data);
      setSelectedCourseId(data.courses[0]?.id || '');
      setSelectedTopicId(data.courses[0]?.topics[0]?.id || '');
      setLoginUserId((current) => current || (data.users.find((user) => user.role === 'admin')?.id ?? ''));
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      setRoute(hash === '/admin' ? '/admin' : '/');
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (path: string) => {
    const normalized = path === '/admin' ? '/admin' : '/';
    if (window.location.hash.slice(1) !== normalized) {
      window.location.hash = normalized;
    } else {
      setRoute(normalized);
    }
  };

  const selectedCourse = useMemo(
    () => db.courses.find((course) => course.id === selectedCourseId) ?? db.courses[0],
    [db.courses, selectedCourseId]
  );

  const selectedTopic = useMemo(
    () => selectedCourse?.topics.find((topic) => topic.id === selectedTopicId) ?? selectedCourse?.topics[0],
    [selectedCourse, selectedTopicId]
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
      console.warn('Could not save tutorials to localStorage', error);
    }
  }, [db]);

  const isAdmin = activeUser?.role === 'admin';
  const isAdminRoute = route === '/admin';
  const canEdit = isAdminRoute && isAdmin;

  useEffect(() => {
    if (route === '/admin' && activeUser && !isAdmin) {
      navigateTo('/');
    }
  }, [route, activeUser, isAdmin]);

  const handleLogin = () => {
    const user = db.users.find((item) => item.id === loginUserId && item.password === loginPassword);
    if (!user) {
      setLoginError('Invalid username or password.');
      return;
    }

    setActiveUser(user);
    setLoginError('');
    setLoginPassword('');
    const nextCourse = db.courses[0];
    setSelectedCourseId(nextCourse?.id || '');
    setSelectedTopicId(nextCourse?.topics[0]?.id || '');
    navigateTo('/admin');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'db.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        if (typeof text !== 'string') {
          throw new Error('File content could not be read as text.');
        }

        const importedData = JSON.parse(text);
        if (!importedData || !Array.isArray(importedData.users) || !Array.isArray(importedData.courses)) {
          throw new Error('Invalid db.json format.');
        }

        setDb(importedData as Database);
        setImportError('');
        setSelectedCourseId(importedData.courses[0]?.id || '');
        setSelectedTopicId(importedData.courses[0]?.topics[0]?.id || '');
      } catch (error) {
        setImportError(
          error instanceof Error ? `Failed to import db.json: ${error.message}` : 'Failed to import db.json.'
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read the selected file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    const text = await file.text();

    // Validate JSON
    JSON.parse(text);

    const response = await fetch(
      "https://tutorials-app-nlyu.onrender.com/api/git/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
        }),
      }
    );

    const result = await response.json();

    alert(result.message);
  } catch (error) {
    alert("Invalid JSON");
  }
};

  const setCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = db.courses.find((item) => item.id === courseId);
    setSelectedTopicId(course?.topics[0]?.id || '');
  };

  const updateCourseState = (updater: (courses: Course[]) => Course[]) => {
    setDb((current) => ({ ...current, courses: updater(current.courses) }));
  };

  const addCourse = () => {
    if (!newCourseTitle.trim()) return;
    const id = newCourseTitle.toLowerCase().replace(/\s+/g, '-');
    updateCourseState((courses) => [
      ...courses,
      {
        id,
        title: newCourseTitle,
        topics: []
      }
    ]);
    setNewCourseTitle('');
    setCourse(id);
  };

  const removeCourse = (courseId: string) => {
    updateCourseState((courses) => courses.filter((course) => course.id !== courseId));
    const nextCourse = db.courses.find((course) => course.id !== courseId);
    if (nextCourse) setCourse(nextCourse.id);
  };

  const addTopic = () => {
    if (!selectedCourse || !newTopicTitle.trim()) return;
    const id = newTopicTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    updateCourseState((courses) =>
      courses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              topics: [
                ...course.topics,
                {
                  id,
                  title: newTopicTitle,
                  content: newTopicContent || 'Explain the topic clearly here.',
                  example: newTopicExample || 'Add an example for this topic.',
                  questions: []
                }
              ]
            }
          : course
      )
    );
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicExample('');
    setSelectedTopicId(id);
  };

  const removeTopic = (topicId: string) => {
    if (!selectedCourse) return;
    updateCourseState((courses) =>
      courses.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, topics: course.topics.filter((topic) => topic.id !== topicId) }
          : course
      )
    );
    const nextTopic = selectedCourse.topics.find((topic) => topic.id !== topicId);
    if (nextTopic) setSelectedTopicId(nextTopic.id);
  };

  const moveTopic = (topicId: string, direction: 'up' | 'down') => {
    if (!selectedCourse) return;
    const index = selectedCourse.topics.findIndex((topic) => topic.id === topicId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= selectedCourse.topics.length) return;

    updateCourseState((courses) =>
      courses.map((course) => {
        if (course.id !== selectedCourse.id) return course;
        const topics = [...course.topics];
        [topics[index], topics[targetIndex]] = [topics[targetIndex], topics[index]];
        return { ...course, topics };
      })
    );
  };

  const addQuestion = () => {
    if (!selectedCourse || !selectedTopic || !newQuestionText.trim()) return;
    const id = 'q-' + Date.now();
    updateCourseState((courses) =>
      courses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              topics: course.topics.map((topic) =>
                topic.id === selectedTopic.id
                  ? {
                      ...topic,
                      questions: [
                        ...topic.questions,
                        { id, question: newQuestionText, answer: newAnswerText || 'Provide a clear answer.' }
                      ]
                    }
                  : topic
              )
            }
          : course
      )
    );
    setNewQuestionText('');
    setNewAnswerText('');
  };

  const removeQuestion = (questionId: string) => {
    if (!selectedCourse || !selectedTopic) return;
    updateCourseState((courses) =>
      courses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              topics: course.topics.map((topic) =>
                topic.id === selectedTopic.id
                  ? { ...topic, questions: topic.questions.filter((question) => question.id !== questionId) }
                  : topic
              )
            }
          : course
      )
    );
  };

  const updateTopicContent = (field: 'content' | 'example', value: string) => {
    if (!selectedCourse || !selectedTopic) return;
    updateCourseState((courses) =>
      courses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              topics: course.topics.map((topic) =>
                topic.id === selectedTopic.id ? { ...topic, [field]: value } : topic
              )
            }
          : course
      )
    );
  };

  const navigateTopic = (direction: 'prev' | 'next') => {
    if (!selectedCourse || !selectedTopic) return;
    const idx = selectedCourse.topics.findIndex((topic) => topic.id === selectedTopic.id);
    const nextIndex = direction === 'prev' ? idx - 1 : idx + 1;
    if (nextIndex >= 0 && nextIndex < selectedCourse.topics.length) {
      setSelectedTopicId(selectedCourse.topics[nextIndex].id);
    }
  };

  if (isAdminRoute && !activeUser) {
    return (
      <div className="login-screen">
        <div className="login-card panel">
          <div className="login-logo">A</div>
          <h1>Admin sign-in</h1>
          <p className="muted">Sign in to access editing features. Browse the tutorials without signing in.</p>

          <div className="login-form">
            <label htmlFor="user-select">Select user</label>
            <select
              id="user-select"
              value={loginUserId}
              onChange={(e) => {
                setLoginUserId(e.target.value);
                setLoginError('');
              }}
            >
              {db.users
                .filter((user) => user.role === 'admin')
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
            </select>

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setLoginError('');
              }}
            />

            <div className="login-actions">
              <button className="primary" onClick={handleLogin}>
                Sign in
              </button>
              <button type="button" className="secondary" onClick={() => navigateTo('/')}>Browse tutorials</button>
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <strong>My Tutorials</strong>
        </div>
        {isAdmin && (
          <div className="route-links">
            <button className={route === '/' ? 'active' : ''} onClick={() => navigateTo('/')}>Browse</button>
            <button className={route === '/admin' ? 'active' : ''} onClick={() => navigateTo('/admin')}>Admin</button>
          </div>
        )}
        <div className="login-panel">
          {activeUser ? (
            <div className="user-badge">
              <span>Signed in as {activeUser.name}</span>
              <span className="role-tag">{activeUser.role.toUpperCase()}</span>
              <button
                onClick={() => {
                  setActiveUser(null);
                  setLoginPassword('');
                  setLoginError('');
                  navigateTo('/');
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button className="admin-link" onClick={() => navigateTo('/admin')}>
              Admin sign in
            </button>
          )}
        </div>
      </header>

      <section className="course-bar">
        <div className="course-tabs">
          {db.courses.map((course) => (
            <button
              key={course.id}
              className={course.id === selectedCourse?.id ? 'active' : ''}
              onClick={() => setCourse(course.id)}
            >
              {course.title}
            </button>
          ))}
        </div>
        {canEdit && (
          <div className="admin-panel add-course-inline">
            <input
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              placeholder="New course title"
            />
            <button onClick={addCourse}>Add course</button>
            <button onClick={handleExport}>Export db.json</button>
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                  fileInputRef.current.click();
                }
              }}
            >
              Import db.json
            </button>
            <input
              ref={fileInputRef}
              id="db-import-file"
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            {importError && <div className="import-error">{importError}</div>}
          </div>
        )}
      </section>

      <main className="layout-grid">
        <aside className="panel nav-panel">
          <div className="nav-header">
            <h2>Course Contents</h2>
            <button className="hamburger-button" onClick={() => setShowTopics((current) => !current)}>
              <span className="hamburger-icon">☰</span>
              <span>{showTopics ? 'Hide topics' : 'Show topics'}</span>
            </button>
          </div>
          {selectedCourse?.topics.length ? (
            showTopics ? (
              <ul>
              {selectedCourse.topics.map((topic, index) => (
                <li key={topic.id}>
                  <button
                    className={topic.id === selectedTopic?.id ? 'active' : ''}
                    onClick={() => setSelectedTopicId(topic.id)}
                  >
                    {topic.title}
                  </button>
                  {canEdit && (
                    <div className="topic-actions">
                      <button
                        className="move-button"
                        disabled={index === 0}
                        onClick={() => moveTopic(topic.id, 'up')}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="move-button"
                        disabled={index === selectedCourse.topics.length - 1}
                        onClick={() => moveTopic(topic.id, 'down')}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button className="remove-button" onClick={() => removeTopic(topic.id)}>
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            ) : (
              <div className="topics-collapsed">
                <p>Topics are hidden. Tap the menu to show them.</p>
              </div>
            )
          ) : (
            <p>No topics yet. Add one with the admin controls below.</p>
          )}

          {canEdit && (
            <div className="admin-panel">
              <h3>Add topic</h3>
              <input
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Topic title"
              />
              <textarea
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
                placeholder="Topic content"
              />
              <textarea
                value={newTopicExample}
                onChange={(e) => setNewTopicExample(e.target.value)}
                placeholder="Topic example"
              />
              <button onClick={addTopic}>Add topic</button>
            </div>
          )}
        </aside>

        <section className="panel content-panel">
          <div className="content-header">
            <h2>{selectedTopic?.title || 'Select a topic'}</h2>
            <div className="course-meta">Course: {selectedCourse?.title}</div>
          </div>
          {selectedTopic ? (
            <>
              <div className="content-block">
                <h3>Explanation</h3>
                {canEdit ? (
                  <textarea
                    className="edit-area"
                    value={selectedTopic.content}
                    onChange={(e) => updateTopicContent('content', e.target.value)}
                  />
                ) : (
                  <p>{selectedTopic.content}</p>
                )}
              </div>
              <div className="content-block">
                <h3>Example</h3>
                {canEdit ? (
                  <textarea
                    className="edit-area"
                    value={selectedTopic.example}
                    onChange={(e) => updateTopicContent('example', e.target.value)}
                  />
                ) : (
                  <pre>{selectedTopic.example}</pre>
                )}
              </div>
            </>
          ) : (
            <p>Select a topic to see the full explanation and example.</p>
          )}
          <div className="pager-controls">
            <button onClick={() => navigateTopic('prev')} disabled={!selectedCourse || selectedCourse.topics.findIndex((t) => t.id === selectedTopic?.id) <= 0}>
              Prev
            </button>
            <button onClick={() => navigateTopic('next')} disabled={!selectedCourse || selectedCourse.topics.findIndex((t) => t.id === selectedTopic?.id) >= (selectedCourse.topics.length - 1)}>
              Next
            </button>
          </div>
        </section>

        <aside className="panel question-panel">
          <h2>Interview Questions</h2>
          {selectedTopic?.questions.length ? (
            <ul>
              {selectedTopic.questions.map((question) => (
                <li key={question.id}>
                  <strong>{question.question}</strong>
                  <p>{question.answer}</p>
                  {canEdit && (
                    <button className="remove-button" onClick={() => removeQuestion(question.id)}>
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions yet for this topic. Add one with admin controls below.</p>
          )}

          {canEdit && (
            <div className="admin-panel">
              <h3>Add question</h3>
              <input
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Question text"
              />
              <textarea
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Answer text"
              />
              <button onClick={addQuestion}>Add question</button>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
