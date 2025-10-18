// Narrative card component

import type { Narrative } from '../../types/narrative';

interface NarrativeCardProps {
  narrative: Narrative;
  onClick?: () => void;
}

export function NarrativeCard({ narrative, onClick }: NarrativeCardProps) {
  // Early return if narrative is incomplete
  if (!narrative || !narrative.title) {
    return null;
  }

  const evidenceColors = {
    A: '#10B981', // Green
    B: '#F59E0B', // Orange
    C: '#EF4444', // Red
  };

  const categoryColors = {
    perspective: '#3B82F6',
    transformation: '#EF4444',
    construction: '#10B981',
    analysis: '#F59E0B',
    structure: '#8B5CF6',
    'meta-cognition': '#EC4899',
  };

  return (
    <div
      onClick={onClick}
      className="narrative-card"
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        backgroundColor: '#fff',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {narrative.title}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
            {narrative.narrative_id}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              backgroundColor: evidenceColors[narrative.evidence_quality],
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {narrative.evidence_quality}
          </span>
          <span
            style={{
              backgroundColor: categoryColors[narrative.category as keyof typeof categoryColors] || '#6b7280',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            {narrative.category}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
        {narrative.summary}
      </p>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Confidence</span>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
            {narrative.confidence ? (narrative.confidence * 100).toFixed(0) : '0'}%
          </div>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Signals</span>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
            {narrative.linked_signals ? narrative.linked_signals.length : 0}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Relations</span>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
            {narrative.relationships ? narrative.relationships.length : 0}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {(narrative.tags || []).slice(0, 4).map((tag) => (
          <span
            key={tag}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            {tag}
          </span>
        ))}
        {narrative.tags && narrative.tags.length > 4 && (
          <span
            style={{
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            +{narrative.tags.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
