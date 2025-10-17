// Narrative list component

import { useNarratives } from '../../hooks/useNarratives';
import { NarrativeCard } from './NarrativeCard';

export function NarrativeList() {
  const { narratives, loading, error } = useNarratives();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading narratives...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>
          Error loading narratives: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700 }}>
          HUMMBL Narratives
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}>
          {narratives.length} cognitive narratives loaded
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px',
        }}
      >
        {narratives.map((narrative) => (
          <NarrativeCard
            key={narrative.narrative_id}
            narrative={narrative}
            onClick={() => console.log('Navigate to:', narrative.narrative_id)}
          />
        ))}
      </div>
    </div>
  );
}
