import React from 'react';
import { ViewType } from '../../types/view';
import './ViewSwitcher.css';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ 
  currentView, 
  onViewChange,
  className = '' 
}) => {
  return (
    <div className={`view-switcher ${className}`}>
      <button
        type="button"
        className={`view-button ${currentView === 'narratives' ? 'active' : ''}`}
        onClick={() => onViewChange('narratives')}
        aria-pressed={currentView === 'narratives'}
        aria-label="View Transformation Narratives"
      >
        <span className="view-button-text">Transformation Narratives</span>
        <span className="view-button-badge">6</span>
      </button>
      <button
        type="button"
        className={`view-button ${currentView === 'models' ? 'active' : ''}`}
        onClick={() => onViewChange('models')}
        aria-pressed={currentView === 'models'}
        aria-label="View Mental Models"
      >
        <span className="view-button-text">Mental Models</span>
        <span className="view-button-badge">120</span>
      </button>
    </div>
  );
};
