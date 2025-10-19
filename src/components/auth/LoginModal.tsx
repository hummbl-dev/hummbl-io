// Login modal for admin access

import { useState } from 'react';
import { authenticate } from '../../utils/auth';
import type { Role } from '../../utils/auth';
import './LoginModal.css';

interface LoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  requiredRole?: Role;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onSuccess,
  onCancel,
  requiredRole = 'admin',
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = authenticate(password, requiredRole);

      if (success) {
        onSuccess();
      } else {
        setError('Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onCancel}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>Admin Access Required</h2>
          <button className="login-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="login-actions">
            <button
              type="button"
              onClick={onCancel}
              className="login-btn secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="login-btn primary"
              disabled={loading || !password}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="login-info">
          <p>Required role: <strong>{requiredRole}</strong></p>
          <p className="login-note">Session expires after 24 hours</p>
        </div>
      </div>
    </div>
  );
};
