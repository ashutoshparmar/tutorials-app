import React, { useRef, useState, useEffect } from 'react';
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
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminPaneOpen, setIsAdminPaneOpen] = useState(false);

  const activeCourse = courses.find((course) => course.id === selectedCourseId) || courses[0];

  const triggerImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Check overflow and update chevron visibility
  const checkScroll = () => {
    const container = tabsRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Allow 2px boundary tolerance
      setShowLeftChevron(scrollLeft > 2);
      setShowRightChevron(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [courses]);

  // Handle manual tab switching ensuring the selected tab is scrolled into view
  useEffect(() => {
    const activeTabElement = tabsRef.current?.querySelector('.course-tab-btn.active');
    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
      // Delay checkScroll slightly to allow smooth scroll animation to finish
      setTimeout(checkScroll, 300);
    }
  }, [selectedCourseId]);

  const handleScroll = () => {
    checkScroll();
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = tabsRef.current;
    if (container) {
      const scrollAmount = 240;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const selectCourse = (courseId: string) => {
    setCourse(courseId);
    setIsDropdownOpen(false);
  };

  return (
    <section className="course-bar">
      {/* Desktop View: Tabs with Chevrons */}
      <div className="course-tabs-desktop-container desktop-only">
        {showLeftChevron && (
          <button className="scroll-chevron-btn left" onClick={() => scroll('left')} aria-label="Scroll left">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        
        {showLeftChevron && <div className="scroll-fade-left"></div>}

        <div className="course-tabs" ref={tabsRef} onScroll={handleScroll}>
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

        {showRightChevron && <div className="scroll-fade-right"></div>}

        {showRightChevron && (
          <button className="scroll-chevron-btn right" onClick={() => scroll('right')} aria-label="Scroll right">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Mobile View: Custom Dropdown Menu */}
      <div className="course-dropdown-container mobile-only" ref={dropdownRef}>
        <button className="course-dropdown-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <span className="dropdown-label">📁 Course: <strong>{activeCourse ? activeCourse.title : 'Select...'}</strong></span>
          <span className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
        
        {isDropdownOpen && (
          <div className="course-dropdown-menu">
            {courses.map((course) => (
              <button
                key={course.id}
                className={`course-dropdown-item ${course.id === selectedCourseId ? 'active' : ''}`}
                onClick={() => selectCourse(course.id)}
              >
                📁 {course.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Admin Panel (Shared layout but responsive behavior) */}
      {canEdit && (
        <div className="admin-panel add-course-inline">
          {/* Mobile Admin Expand Button */}
          <button className="mobile-admin-toggle mobile-only secondary-btn" onClick={() => setIsAdminPaneOpen(!isAdminPaneOpen)}>
            ⚙️ {isAdminPaneOpen ? 'Hide Course Options' : 'Manage Courses'}
          </button>

          {/* Action fields container */}
          <div className={`admin-fields-wrapper ${isAdminPaneOpen ? 'mobile-open' : ''}`}>
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
        </div>
      )}
    </section>
  );
};

