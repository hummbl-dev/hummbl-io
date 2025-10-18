// Narrative list component

import { useState } from 'react';
import { useNarratives } from '../../hooks/useNarratives';
import { NarrativeCard } from './NarrativeCard';
import { NarrativeCardSkeleton } from './NarrativeCardSkeleton';
import { NarrativeHero } from './NarrativeHero';
import { NarrativeDetailModal } from './NarrativeDetailModal';
import type { Narrative } from '../../types/narrative';
import './NarrativeList.css';

export function NarrativeList() {
  const { narratives, loading, error, refetch } = useNarratives();
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (narrative: Narrative) => {
    setSelectedNarrative(narrative);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Wait for animation to complete before clearing selected narrative
    setTimeout(() => setSelectedNarrative(null), 200);
  };

  if (loading) {
    return (
      <>
        <NarrativeHero narrativeCount={0} />
        <div className="narrative-list-container">
          <div className="narrative-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <NarrativeCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </>
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
              onClick={() => handleCardClick(narrative)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <NarrativeDetailModal
        narrative={selectedNarrative}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
