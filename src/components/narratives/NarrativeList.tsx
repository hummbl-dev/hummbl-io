// Narrative list component

import { useNarratives } from '../../hooks/useNarratives';
import { NarrativeCard } from './NarrativeCard';
import { NarrativeHero } from './NarrativeHero';
import './NarrativeList.css';

export function NarrativeList() {
  const { narratives, loading, error, refetch } = useNarratives();

  if (loading) {
    return (
      <div className="narrative-loading">
        <div className="loading-spinner" role="status" aria-label="Loading"></div>
        <p className="loading-text">Loading narratives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="narrative-error">
        <div className="error-icon" aria-hidden="true">⚠️</div>
        <h2 className="error-title">Unable to Load Narratives</h2>
        <p className="error-message">
          {error.message || 'An unexpected error occurred while loading the narratives.'}
        </p>
        <button className="error-retry-button" onClick={refetch}>
          Try Again
        </button>
      </div>
    );
  }

  if (narratives.length === 0) {
    return (
      <>
        <NarrativeHero narrativeCount={0} />
        <div className="narrative-empty">
          <div className="empty-state-icon" aria-hidden="true">📚</div>
          <h2 className="empty-state-title">No Narratives Found</h2>
          <p className="empty-state-description">
            There are currently no narratives available. Please check back later.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <NarrativeHero narrativeCount={narratives.length} />

      {/* Narrative List */}
      <div className="narrative-list-container">
        <div className="narrative-grid">
          {narratives.map((narrative) => (
            <NarrativeCard
              key={narrative.narrative_id}
              narrative={narrative}
              onClick={() => console.log('Navigate to:', narrative.narrative_id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
