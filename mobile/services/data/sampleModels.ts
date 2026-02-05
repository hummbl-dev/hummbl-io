// Using SY8 (Systems) - Sample mental models data

import type { TransformationKey } from '@hummbl/shared';

export interface SampleModel {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  transformation: TransformationKey;
  difficulty: number;
  tags: string[];
  example?: string;
  sources?: { name: string; reference: string }[];
  relatedModels?: string[];
}

export const SAMPLE_MODELS: SampleModel[] = [
  // Perspective (P)
  {
    id: 'p1',
    code: 'P1',
    name: 'First Principles Thinking',
    description: 'Break down complex problems into their most basic, foundational elements. Instead of reasoning by analogy, you deconstruct the problem to its core truths and build up from there.',
    category: 'Perspective',
    transformation: 'P',
    difficulty: 3,
    tags: ['problem-solving', 'innovation', 'critical-thinking'],
    example: 'Elon Musk used first principles thinking to reduce the cost of SpaceX rockets. Instead of accepting the market price for rocket components, he broke down a rocket into its raw materials and found he could build them for a fraction of the cost.',
    sources: [
      { name: 'Aristotle', reference: 'Metaphysics' },
      { name: 'Elon Musk', reference: 'Various Interviews' },
    ],
    relatedModels: ['IN1', 'DE1', 'CO1'],
  },
  {
    id: 'p2',
    code: 'P2',
    name: 'Contrarian Thinking',
    description: 'Challenge conventional wisdom by considering the opposite of popular beliefs.',
    category: 'Perspective',
    transformation: 'P',
    difficulty: 2,
    tags: ['innovation', 'critical-thinking'],
  },
  {
    id: 'p3',
    code: 'P3',
    name: 'Steelmanning',
    description: 'Strengthen opposing arguments before critiquing them.',
    category: 'Perspective',
    transformation: 'P',
    difficulty: 3,
    tags: ['debate', 'critical-thinking', 'empathy'],
  },

  // Inversion (IN)
  {
    id: 'in1',
    code: 'IN1',
    name: 'Inversion',
    description: 'Think backwards from the desired outcome to identify obstacles.',
    category: 'Inversion',
    transformation: 'IN',
    difficulty: 2,
    tags: ['problem-solving', 'planning'],
  },
  {
    id: 'in2',
    code: 'IN2',
    name: 'Premortem Analysis',
    description: 'Imagine a project has failed and work backwards to identify why. This technique helps uncover potential issues that optimism bias might otherwise hide.',
    category: 'Inversion',
    transformation: 'IN',
    difficulty: 2,
    tags: ['risk', 'planning', 'projects'],
    example: 'Before launching a new product, a team imagines it flopped completely. They then brainstorm all the reasons for failure: poor market fit, weak marketing, technical bugs, competitor response. This surfaces risks they can address proactively.',
    sources: [
      { name: 'Gary Klein', reference: 'The Power of Intuition' },
      { name: 'Daniel Kahneman', reference: 'Thinking, Fast and Slow' },
    ],
    relatedModels: ['P1', 'IN1', 'SY2'],
  },
  {
    id: 'in3',
    code: 'IN3',
    name: 'Avoiding Stupidity',
    description: 'Focus on avoiding obvious mistakes rather than seeking brilliance.',
    category: 'Inversion',
    transformation: 'IN',
    difficulty: 1,
    tags: ['risk', 'decision-making'],
  },

  // Composition (CO)
  {
    id: 'co1',
    code: 'CO1',
    name: 'Composition',
    description: 'Combine simple elements to create complex, emergent systems.',
    category: 'Composition',
    transformation: 'CO',
    difficulty: 3,
    tags: ['systems', 'building', 'design'],
  },
  {
    id: 'co2',
    code: 'CO2',
    name: 'Layering',
    description: 'Build solutions in layers, each adding specific functionality.',
    category: 'Composition',
    transformation: 'CO',
    difficulty: 2,
    tags: ['architecture', 'design', 'abstraction'],
  },
  {
    id: 'co3',
    code: 'CO3',
    name: 'Integration',
    description: 'Combine diverse perspectives or systems into a coherent whole.',
    category: 'Composition',
    transformation: 'CO',
    difficulty: 3,
    tags: ['synthesis', 'systems'],
  },

  // Decomposition (DE)
  {
    id: 'de1',
    code: 'DE1',
    name: 'Decomposition',
    description: 'Break complex problems into smaller, manageable parts.',
    category: 'Decomposition',
    transformation: 'DE',
    difficulty: 2,
    tags: ['problem-solving', 'analysis'],
  },
  {
    id: 'de2',
    code: 'DE2',
    name: 'Root Cause Analysis',
    description: 'Dig deeper to find the fundamental cause of a problem.',
    category: 'Decomposition',
    transformation: 'DE',
    difficulty: 2,
    tags: ['debugging', 'analysis', 'problem-solving'],
  },
  {
    id: 'de3',
    code: 'DE3',
    name: 'Modular Thinking',
    description: 'Design systems with independent, interchangeable components.',
    category: 'Decomposition',
    transformation: 'DE',
    difficulty: 3,
    tags: ['architecture', 'design', 'systems'],
  },

  // Recursion (RE)
  {
    id: 're1',
    code: 'RE1',
    name: 'Recursion',
    description: 'Apply patterns at multiple levels of abstraction.',
    category: 'Recursion',
    transformation: 'RE',
    difficulty: 4,
    tags: ['patterns', 'abstraction', 'self-reference'],
  },
  {
    id: 're2',
    code: 'RE2',
    name: 'Feedback Loops',
    description: 'Identify and leverage cycles of cause and effect.',
    category: 'Recursion',
    transformation: 'RE',
    difficulty: 3,
    tags: ['systems', 'dynamics', 'improvement'],
  },
  {
    id: 're3',
    code: 'RE3',
    name: 'Fractal Patterns',
    description: 'Recognize self-similar patterns across different scales.',
    category: 'Recursion',
    transformation: 'RE',
    difficulty: 4,
    tags: ['patterns', 'nature', 'complexity'],
  },

  // Systems (SY)
  {
    id: 'sy1',
    code: 'SY1',
    name: 'Systems Thinking',
    description: 'Understand interconnections and feedback loops in complex systems.',
    category: 'Systems',
    transformation: 'SY',
    difficulty: 4,
    tags: ['complexity', 'interconnections', 'holistic'],
  },
  {
    id: 'sy2',
    code: 'SY2',
    name: 'Second-Order Effects',
    description: 'Consider the consequences of consequences.',
    category: 'Systems',
    transformation: 'SY',
    difficulty: 3,
    tags: ['foresight', 'planning', 'consequences'],
  },
  {
    id: 'sy3',
    code: 'SY3',
    name: 'Emergence',
    description: 'Recognize properties that arise from system interactions.',
    category: 'Systems',
    transformation: 'SY',
    difficulty: 4,
    tags: ['complexity', 'systems', 'patterns'],
  },
];

export const getModelsByTransformation = (transformation: TransformationKey): SampleModel[] => {
  return SAMPLE_MODELS.filter((m) => m.transformation === transformation);
};

export const getModelById = (id: string): SampleModel | undefined => {
  return SAMPLE_MODELS.find((m) => m.id === id);
};

export const searchModels = (query: string): SampleModel[] => {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.code.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery) ||
      m.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
};
