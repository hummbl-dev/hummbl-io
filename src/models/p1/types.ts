// Event types
type EventMap = {
  'analysis:start': (input: { problem: string; context?: Record<string, unknown> }) => void;
  'analysis:complete': (result: FirstPrinciplesAnalysis) => void;
  'analysis:error': (error: Error) => void;
  [key: string]: (...args: any[]) => void;
};

export interface FirstPrinciplesModel {
  // Core properties
  id: string;
  name: string;
  description: string;
  transformation: string;
  tier: number;
  keyCharacteristics: string[];
  relatedModels: string[];
  example: {
    problem: string;
    traditionalApproach: string;
    firstPrinciplesApproach: string;
  };
  
  // Core methods
  methods: {
    decomposeProblem: (problem: string) => string[];
    identifyAssumptions: (problem: string) => string[];
    extractFundamentalTruths: (problem: string) => string[];
    rebuildSolution: (truths: string[]) => string;
  };
  
  // Main analysis method
  analyze: (input: { problem: string; context?: Record<string, unknown> }) => Promise<FirstPrinciplesAnalysis>;
  
  // Event handling methods (optional)
  on?: <K extends keyof EventMap>(event: K, listener: EventMap[K]) => void;
  removeListener?: <K extends keyof EventMap>(event: K, listener: EventMap[K]) => void;
  emit?: <K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>) => boolean;
}

export interface FirstPrinciplesAnalysis {
  problem: string;
  decomposed: string[];
  assumptions: string[];
  fundamentalTruths: string[];
  solution: string;
  relationships?: ComponentRelationship[];
  temporalSequence?: TemporalSequence[];
  qualityMetrics?: QualityMetrics;
  wickednessScore: number;
  metadata: {
    modelVersion: string;
    timestamp: string | number;
    executionTimeMs: number;
    qualityMetrics: QualityMetrics & {
      alignmentScore: number;
      traceFidelity: number;
      entropyDelta: number;
    };
  };
}

export interface ComponentRelationship {
  from: number;
  to: number;
  type: 'dependency' | 'conflict' | 'enabler' | 'temporal' | 'causal';
  confidence: number;
  evidence?: string;
}

export interface TemporalSequence {
  component: number;
  order: number;
  timing?: string;
}

export interface QualityMetrics {
  alignmentScore: number;
  traceFidelity: number;
  entropyDelta: number;
  relationshipCoverage: number;
  temporalConsistency: number;
  wickednessScore: number;
}