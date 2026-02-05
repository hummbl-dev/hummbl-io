// Using SY8 (Systems) - Sample narratives data

import type { EvidenceQuality } from '@hummbl/shared';

export interface SampleNarrative {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  evidenceQuality: EvidenceQuality;
  confidence: number;
  tags: string[];
  domain: string[];
  complexity?: {
    cognitiveLoad: 'Low' | 'Medium' | 'High';
    timeToElicit: string;
    expertiseRequired: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  citations?: { author: string; year: number; title: string; source: string }[];
}

export const SAMPLE_NARRATIVES: SampleNarrative[] = [
  {
    id: 'nar1',
    title: 'Decision Making Under Uncertainty',
    summary: 'Evidence-based frameworks for making decisions when outcomes are uncertain and information is incomplete.',
    content: `Decision making under uncertainty is a fundamental challenge in both personal and professional contexts.

Key frameworks include:
• Expected Value Analysis - Weighing outcomes by their probabilities
• Scenario Planning - Developing multiple plausible futures
• Real Options Thinking - Treating decisions as options to exercise, delay, or abandon
• Bayesian Updating - Continuously revising beliefs with new information

The evidence suggests that embracing uncertainty and using probabilistic thinking leads to better predictions and decisions than expressing overconfident certainty.`,
    category: 'Decision Science',
    evidenceQuality: 'A',
    confidence: 0.85,
    tags: ['decision-making', 'uncertainty', 'probability', 'risk'],
    domain: ['Business', 'Psychology', 'Economics'],
    complexity: {
      cognitiveLoad: 'Medium',
      timeToElicit: '15-30 minutes',
      expertiseRequired: 'Intermediate',
    },
    citations: [
      { author: 'Kahneman, D.', year: 2011, title: 'Thinking, Fast and Slow', source: 'Farrar, Straus and Giroux' },
      { author: 'Tetlock, P.', year: 2015, title: 'Superforecasting', source: 'Crown Publishing' },
    ],
  },
  {
    id: 'nar2',
    title: 'Cognitive Biases in Judgment',
    summary: 'Understanding systematic errors in thinking and how to mitigate their effects on decision quality.',
    category: 'Psychology',
    evidenceQuality: 'A',
    confidence: 0.92,
    tags: ['biases', 'psychology', 'decision-making', 'awareness'],
    domain: ['Psychology', 'Behavioral Economics'],
  },
  {
    id: 'nar3',
    title: 'Risk Assessment Frameworks',
    summary: 'Structured approaches to identifying, analyzing, and prioritizing risks in complex environments.',
    category: 'Risk Management',
    evidenceQuality: 'B',
    confidence: 0.78,
    tags: ['risk', 'assessment', 'frameworks', 'planning'],
    domain: ['Business', 'Engineering', 'Finance'],
  },
  {
    id: 'nar4',
    title: 'Strategic Planning Principles',
    summary: 'Core principles for developing effective long-term strategies in uncertain environments.',
    category: 'Strategy',
    evidenceQuality: 'B',
    confidence: 0.75,
    tags: ['strategy', 'planning', 'leadership', 'business'],
    domain: ['Business', 'Management'],
  },
  {
    id: 'nar5',
    title: 'Learning and Skill Acquisition',
    summary: 'Evidence-based methods for accelerating skill development and knowledge retention.',
    category: 'Education',
    evidenceQuality: 'A',
    confidence: 0.88,
    tags: ['learning', 'skills', 'practice', 'education'],
    domain: ['Education', 'Psychology', 'Performance'],
  },
  {
    id: 'nar6',
    title: 'Team Dynamics and Collaboration',
    summary: 'Research-backed insights on building effective teams and fostering productive collaboration.',
    category: 'Management',
    evidenceQuality: 'B',
    confidence: 0.72,
    tags: ['teams', 'collaboration', 'leadership', 'culture'],
    domain: ['Business', 'Psychology', 'Management'],
  },
  {
    id: 'nar7',
    title: 'Innovation and Creative Problem Solving',
    summary: 'Methods for generating novel solutions and fostering innovation in organizations.',
    category: 'Innovation',
    evidenceQuality: 'B',
    confidence: 0.68,
    tags: ['innovation', 'creativity', 'problem-solving', 'design'],
    domain: ['Business', 'Design', 'Technology'],
  },
  {
    id: 'nar8',
    title: 'Effective Communication Patterns',
    summary: 'Research on communication strategies that improve understanding and influence.',
    category: 'Communication',
    evidenceQuality: 'A',
    confidence: 0.82,
    tags: ['communication', 'persuasion', 'clarity', 'influence'],
    domain: ['Psychology', 'Business', 'Leadership'],
  },
];

export const getNarrativesByCategory = (category: string): SampleNarrative[] => {
  return SAMPLE_NARRATIVES.filter((n) => n.category === category);
};

export const getNarrativesByEvidence = (quality: EvidenceQuality): SampleNarrative[] => {
  return SAMPLE_NARRATIVES.filter((n) => n.evidenceQuality === quality);
};

export const getNarrativeById = (id: string): SampleNarrative | undefined => {
  return SAMPLE_NARRATIVES.find((n) => n.id === id);
};

export const searchNarratives = (query: string): SampleNarrative[] => {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_NARRATIVES.filter(
    (n) =>
      n.title.toLowerCase().includes(lowerQuery) ||
      n.summary.toLowerCase().includes(lowerQuery) ||
      n.category.toLowerCase().includes(lowerQuery) ||
      n.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
};

export const getCategories = (): string[] => {
  return [...new Set(SAMPLE_NARRATIVES.map((n) => n.category))];
};
