// Core narrative types for HUMMBL Framework

export interface Narrative {
  narrative_id: string;
  version: string;
  provenance_hash: string;
  evidence_quality: 'A' | 'B' | 'C';
  title: string;
  summary: string;
  category: string;
  tags: string[];
  domain: string[];
  confidence: number;
  complexity: Complexity;
  linked_signals: Signal[];
  relationships: Relationship[];
  citations: Citation[];
  elicitation_methods: ElicitationMethod[];
  examples: Example[];
  related_frameworks: string[];
  changelog: ChangelogEntry[];
}

export interface Complexity {
  cognitive_load: string;
  time_to_elicit: string;
  expertise_required: string;
}

export interface Signal {
  signal_id: string;
  signal_type: string;
  weight: number;
  context: string;
}

export interface Relationship {
  type: string;
  target: string;
  description: string;
}

export interface Citation {
  author: string;
  year: number | string;
  title: string;
  source: string;
}

export interface ElicitationMethod {
  method: string;
  duration: string;
  difficulty: string;
}

export interface Example {
  scenario: string;
  application: string;
  outcome: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string;
}

export interface NarrativesResponse {
  metadata: {
    version: string;
    last_updated: string;
    total_narratives: number;
  };
  narratives: Narrative[];
}
