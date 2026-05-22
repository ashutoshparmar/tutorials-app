import { useEffect, useMemo, useRef, useState } from 'react';
import type { Course, Database, User } from './types';
import { Header } from './components/Header';
import { AdminSignIn } from './components/AdminSignIn';
import { CourseTabs } from './components/CourseTabs';
import { TopicSidebar } from './components/TopicSidebar';
import { ContentArea } from './components/ContentArea';
import { QuestionsPanel } from './components/QuestionsPanel';
//new commit
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
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash === '/admin' ? '/admin' : '/';
  });
  const [showTopics, setShowTopics] = useState(true);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      // Validate local JSON syntax
      const parsedDb = JSON.parse(text);

      if (!parsedDb || !Array.isArray(parsedDb.users) || !Array.isArray(parsedDb.courses)) {
        throw new Error("Uploaded database is missing 'users' or 'courses' sections.");
      }

      // POST to standard API endpoint which performs strong type validation
      const response = await fetch(
        "https://tutorials-app-nlyu.onrender.com/api/git/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedDb),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Backend responded with status code: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message || "Database uploaded and validated successfully!");

      setDb(parsedDb as Database);
      setSelectedCourseId(parsedDb.courses[0]?.id || '');
      setSelectedTopicId(parsedDb.courses[0]?.topics[0]?.id || '');
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Network error uploading database.";
      setImportError(msg);
      alert(`Upload failed: ${msg}`);
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
                  definition: '',
                  why: '',
                  problem: '',
                  realWorldExample: '',
                  syntax: '',
                  practicalExample: '',
                  commonMistakes: '',
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

  const updateTopicContent = (
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
  ) => {
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

  const hasPrev = useMemo(() => {
    if (!selectedCourse || !selectedTopic) return false;
    const idx = selectedCourse.topics.findIndex((topic) => topic.id === selectedTopic.id);
    return idx > 0;
  }, [selectedCourse, selectedTopic]);

  const hasNext = useMemo(() => {
    if (!selectedCourse || !selectedTopic) return false;
    const idx = selectedCourse.topics.findIndex((topic) => topic.id === selectedTopic.id);
    return idx >= 0 && idx < selectedCourse.topics.length - 1;
  }, [selectedCourse, selectedTopic]);

  // If Admin route and not signed in
  if (isAdminRoute && !activeUser) {
    return (
      <AdminSignIn
        users={db.users}
        loginUserId={loginUserId}
        setLoginUserId={setLoginUserId}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        handleLogin={handleLogin}
        navigateTo={navigateTo}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        activeUser={activeUser}
        isAdmin={isAdmin}
        route={route}
        navigateTo={navigateTo}
        onSignOut={() => {
          setActiveUser(null);
          setLoginPassword('');
          setLoginError('');
          navigateTo('/');
        }}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <CourseTabs
        courses={db.courses}
        selectedCourseId={selectedCourseId}
        setCourse={setCourse}
        canEdit={canEdit}
        newCourseTitle={newCourseTitle}
        setNewCourseTitle={setNewCourseTitle}
        addCourse={addCourse}
        handleExport={handleExport}
        handleUpload={handleUpload}
        importError={importError}
      />

      <main className="layout-grid">
        <TopicSidebar
          selectedCourse={selectedCourse}
          selectedTopicId={selectedTopicId}
          setSelectedTopicId={setSelectedTopicId}
          canEdit={canEdit}
          showTopics={showTopics}
          setShowTopics={setShowTopics}
          moveTopic={moveTopic}
          removeTopic={removeTopic}
          newTopicTitle={newTopicTitle}
          setNewTopicTitle={setNewTopicTitle}
          newTopicContent={newTopicContent}
          setNewTopicContent={setNewTopicContent}
          newTopicExample={newTopicExample}
          setNewTopicExample={setNewTopicExample}
          addTopic={addTopic}
        />

        <ContentArea
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          canEdit={canEdit}
          updateTopicContent={updateTopicContent}
          navigateTopic={navigateTopic}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />

        <QuestionsPanel
          selectedTopic={selectedTopic}
          canEdit={canEdit}
          newQuestionText={newQuestionText}
          setNewQuestionText={setNewQuestionText}
          newAnswerText={newAnswerText}
          setNewAnswerText={setNewAnswerText}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
        />
      </main>
    </div>
  );
}

export default App;
