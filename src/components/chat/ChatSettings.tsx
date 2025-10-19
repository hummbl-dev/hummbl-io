// Chat settings menu component

import './ChatSettings.css';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onViewHistory: () => void;
  messageCount: number;
  conversationCount: number;
}

export function ChatSettings({
  isOpen,
  onClose,
  onClearAll,
  onViewHistory,
  messageCount,
  conversationCount,
}: ChatSettingsProps) {
  if (!isOpen) return null;

  const handleClearAll = () => {
    if (window.confirm(
      `Are you sure you want to delete all ${conversationCount} conversations? This cannot be undone.`
    )) {
      onClearAll();
      onClose();
    }
  };

  return (
    <div className="chat-settings-overlay" onClick={onClose}>
      <div className="chat-settings" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <h3>Chat Settings</h3>
          <button
            className="settings-close-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="settings-stats">
          <div className="stat-item">
            <span className="stat-label">Total Conversations</span>
            <span className="stat-value">{conversationCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Messages</span>
            <span className="stat-value">{messageCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-actions">
          <button className="settings-action-button" onClick={onViewHistory}>
            <span className="action-icon">📜</span>
            <div className="action-content">
              <span className="action-title">View History</span>
              <span className="action-description">Browse past conversations</span>
            </div>
          </button>

          <button
            className="settings-action-button danger"
            onClick={handleClearAll}
            disabled={conversationCount === 0}
          >
            <span className="action-icon">🗑️</span>
            <div className="action-content">
              <span className="action-title">Clear All History</span>
              <span className="action-description">Delete all conversations</span>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="settings-info">
          <p>💾 Conversations are stored locally in your browser</p>
          <p>🔒 Your data never leaves your device</p>
        </div>
      </div>
    </div>
  );
}
