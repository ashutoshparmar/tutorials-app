import React, { useRef } from 'react';
import { Course } from '../types';

interface CourseTabsProps {
  courses: Course[];
  selectedCourseId: string;
  setCourse: (id: string) => void;
  canEdit: boolean;
  newCourseTitle: string;
  setNewCourseTitle: (title: string) => void;
  addCourse: () => void;
  handleExport: () => void;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  importError: string;
}

export const CourseTabs: React.FC<CourseTabsProps> = ({
  courses,
  selectedCourseId,
  setCourse,
  canEdit,
  newCourseTitle,
  setNewCourseTitle,
  addCourse,
  handleExport,
  handleUpload,
  importError
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <section className="course-bar">
      <div className="course-tabs">
        {courses.map((course) => (
          <button
            key={course.id}
            className={`course-tab-btn ${course.id === selectedCourseId ? 'active' : ''}`}
            onClick={() => setCourse(course.id)}
          >
            📁 {course.title}
          </button>
        ))}
      </div>

      {canEdit && (
        <div className="admin-panel add-course-inline">
          <div className="input-group">
            <input
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              placeholder="New course title..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCourse();
              }}
            />
            <button className="add-btn" onClick={addCourse}>＋ Add Course</button>
          </div>
          
          <div className="action-group">
            <button className="secondary-btn" onClick={handleExport}>📥 Export DB</button>
            <button className="secondary-btn" onClick={triggerImportClick}>📤 Upload to Git</button>
          </div>

          <input
            ref={fileInputRef}
            id="db-import-file"
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
          {importError && <div className="import-error">⚠️ {importError}</div>}
        </div>
      )}
    </section>
  );
};
