// Narrative card component

import type { Narrative } from '../../types/narrative';
import './NarrativeCard.css';

interface NarrativeCardProps {
  narrative: Narrative;
  onClick?: () => void;
}

export function NarrativeCard({ narrative, onClick }: NarrativeCardProps) {
  // Early return if narrative is incomplete
  if (!narrative || !narrative.title) {
    return null;
  }

  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  // Calculate confidence level
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  return (
    <article
      className="narrative-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${narrative.title}`}
    >
      {/* Header */}
      <header className="narrative-card-header">
        <div className="narrative-card-title-section">
          <h3 className="narrative-card-title">
            {narrative.title}
          </h3>
          <p className="narrative-card-id">
            {narrative.narrative_id}
          </p>
        </div>
        <div className="narrative-badges">
          <span className={`evidence-badge grade-${String(narrative.evidence_quality || 'C').toLowerCase()}`}>
            {narrative.evidence_quality}
          </span>
          <span className={`category-badge category-${String(narrative.category || 'perspective').toLowerCase().replace(/\s+/g, '-')}`}>
            {narrative.category}
          </span>
        </div>
      </header>

      {/* Summary */}
      <p className="narrative-card-summary">
        {narrative.summary}
      </p>

      {/* Complexity */}
      {narrative.complexity && (
        <div className="narrative-complexity">
          <span 
            className="complexity-badge" 
            data-level={narrative.complexity.cognitive_load}
            title="Cognitive Load"
          >
            {narrative.complexity.cognitive_load} load
          </span>
          <span className="complexity-time" title="Time to Elicit">
            ⏱ {narrative.complexity.time_to_elicit}
          </span>
          <span className="complexity-badge" data-level={narrative.complexity.expertise_required}>
            {narrative.complexity.expertise_required}
          </span>
        </div>
      )}

      {/* Domain Tags */}
      {narrative.domain && narrative.domain.length > 0 && (
        <div className="narrative-domains">
          {narrative.domain.slice(0, 3).map((domain) => (
            <span key={domain} className="domain-badge">
              {domain}
            </span>
          ))}
          {narrative.domain.length > 3 && (
            <span className="domain-badge" style={{ opacity: 0.7 }}>
              +{narrative.domain.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Metrics */}
      <div className="narrative-metrics">
        <div className="metric-item">
          <span className="metric-label">Confidence</span>
          <div className={`metric-value ${getConfidenceLevel(narrative.confidence || 0)}`}>
            {narrative.confidence ? (narrative.confidence * 100).toFixed(0) : '0'}%
          </div>
        </div>
        <div className="metric-item">
          <span className="metric-label">Signals</span>
          <div className="metric-value">
            {narrative.linked_signals?.length || 0}
          </div>
        </div>
        <div className="metric-item">
          <span className="metric-label">Relations</span>
          <div className="metric-value">
            {narrative.relationships ? narrative.relationships.length : 0}
          </div>
        </div>
        <div className="metric-item">
          <span className="metric-label">Citations</span>
          <div className="metric-value">
            {narrative.citations?.length || 0}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="narrative-tags">
        {(narrative.tags || []).slice(0, 5).map((tag) => (
          <span key={tag} className="narrative-tag">
            {tag}
          </span>
        ))}
        {narrative.tags && narrative.tags.length > 5 && (
          <span className="narrative-tag more-tags">
            +{narrative.tags.length - 5} more
          </span>
        )}
      </div>
    </article>
  );
}
