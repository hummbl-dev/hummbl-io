import React from 'react';
import { ViewType } from '../../types/view';
import './Hero.css';

interface HeroProps {
  onViewChange: (view: ViewType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-header">
          <h2 className="hero-title">Cognitive Framework for Better Thinking</h2>
          <p className="hero-subtitle">
            Master proven mental models and transformational frameworks to improve
            decision-making, solve complex problems, and think more clearly.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">120</div>
              <div className="stat-label">Mental Models</div>
              <div className="stat-description">
                Practical cognitive patterns for everyday thinking and decision-making
              </div>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
                <path d="M1 12h6m6 0h6"/>
                <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">6</div>
              <div className="stat-label">Transformations</div>
              <div className="stat-description">
                Meta-frameworks for systematic change and cognitive restructuring
              </div>
            </div>
          </div>
        </div>

        <div className="hero-cta">
          <button 
            className="btn-primary"
            onClick={() => onViewChange('models')}
            aria-label="Explore Mental Models"
          >
            <span>Explore Mental Models</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onViewChange('narratives')}
            aria-label="Learn About Transformations"
          >
            <span>Discover Transformations</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div className="hero-features">
          <div className="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Evidence-based frameworks</span>
          </div>
          <div className="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Practical examples</span>
          </div>
          <div className="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Organized by transformation type</span>
          </div>
        </div>
      </div>
    </section>
  );
};
