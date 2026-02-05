// Using DE12 (Interface Segregation) - Clean type definitions for narratives

export type EvidenceQuality = 'A' | 'B' | 'C';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Narrative {
  id: string;
  narrative_id: string;
  version: string;
  provenance_hash: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  domain: string[];
  evidence_quality: EvidenceQuality;
  confidence: number;
  complexity: {
    cognitive_load: string;
    time_to_elicit: string;
    expertise_required: string;
  };
  examples: Array<
    | { scenario: string; application: string; outcome: string }
    | string
  >;
  linked_signals: Array<{
    signal_id: string;
    signal_type: string;
    weight: number;
    context: string;
  }>;
  relationships: Array<{
    type: string;
    target: string;
    description: string;
  }>;
  related_frameworks: string[];
  citations: Array<{
    author: string;
    year: number | string;
    title: string;
    source: string;
  }>;
  methods?: Array<{
    method: string;
    description: string;
    duration: string;
    difficulty: Difficulty;
  }>;
  lastUpdated?: string;
  approved?: boolean;
}

export interface NarrativesData {
  metadata: {
    version: string;
    last_updated: string;
    total_narratives: number;
  };
  narratives: Narrative[];
}

export interface NarrativeFilterOptions {
  searchTerm?: string;
  categories?: string[];
  evidenceQuality?: EvidenceQuality[];
  domains?: string[];
  sortBy?: 'title' | 'confidence' | 'evidence_quality';
  sortOrder?: 'asc' | 'desc';
}
