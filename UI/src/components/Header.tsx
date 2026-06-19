import React from 'react';
import { User } from '../types';

interface HeaderProps {
  activeUser: User | null;
  isAdmin: boolean;
  route: string;
  navigateTo: (path: string) => void;
  onSignOut: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  isAdmin,
  route,
  navigateTo,
  onSignOut,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <header className="top-bar">
      <div className="brand" onClick={() => navigateTo('/')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">📚</div>
        <strong>My Tutorials</strong>
      </div>
      
      {isAdmin && (
        <div className="route-links">
          <button 
            className={route === '/' ? 'active' : ''} 
            onClick={() => navigateTo('/')}
          >
            Browse
          </button>
          <button 
            className={route === '/admin' ? 'active' : ''} 
            onClick={() => navigateTo('/admin')}
          >
            Admin Dashboard
          </button>
          <button 
            className={route === '/converter' ? 'active' : ''} 
            onClick={() => navigateTo('/converter')}
            title="Convert Google Docs to Website HTML"
          >
            📝 Converter
          </button>
        </div>
      )}

      <div className="right-controls">
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <div className="login-panel">
          {activeUser ? (
            <div className="user-badge">
              <span className="user-name">Signed in as <strong>{activeUser.name}</strong></span>
              <span className="role-tag">{activeUser.role.toUpperCase()}</span>
              <button className="sign-out-btn" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="admin-link" onClick={() => navigateTo('/admin')}>
              Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
