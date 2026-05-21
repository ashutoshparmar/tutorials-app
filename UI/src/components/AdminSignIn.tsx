import React from 'react';
import { User } from '../types';

interface AdminSignInProps {
  users: User[];
  loginUserId: string;
  setLoginUserId: (id: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginError: string;
  handleLogin: () => void;
  navigateTo: (path: string) => void;
}

export const AdminSignIn: React.FC<AdminSignInProps> = ({
  users,
  loginUserId,
  setLoginUserId,
  loginPassword,
  setLoginPassword,
  loginError,
  handleLogin,
  navigateTo
}) => {
  const adminUsers = users.filter((u) => u.role === 'admin');

  return (
    <div className="login-screen">
      <div className="login-card panel">
        <div className="login-logo">🔒</div>
        <h1>Admin Sign-In</h1>
        <p className="muted">Sign in to access course editing, order re-arrangement, and tutorials customization.</p>

        <div className="login-form">
          <label htmlFor="user-select">Select Administrator</label>
          <select
            id="user-select"
            value={loginUserId}
            onChange={(e) => setLoginUserId(e.target.value)}
          >
            <option value="" disabled>-- Select User --</option>
            {adminUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter admin password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />

          {loginError && <div className="login-error">⚠️ {loginError}</div>}

          <div className="login-actions">
            <button className="primary" onClick={handleLogin}>
              Sign In
            </button>
            <button type="button" className="secondary" onClick={() => navigateTo('/')}>
              Cancel / Browse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
