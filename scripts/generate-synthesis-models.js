import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.join(process.cwd(), 'src/models');

// Template for index.ts
const indexTemplate = (modelId) => `import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

/**
 * ${modelId}: Advanced Synthesis Model
 * 
 * This model provides advanced synthesis capabilities for combining
 * multiple mental models into cohesive solutions with enhanced analysis.
 */

export interface ${modelId}Config {
  /** Unique identifier for this model instance */
  id?: string;
  
  /** Display name of the model */
  name?: string;
  
  /** Version of the model */
  version?: string;
  
  /** Event emitter for analytics and monitoring */
  eventEmitter?: EventEmitter;
  
  /** Whether to enable telemetry */
  telemetryEnabled?: boolean;
  
  /** Logger instance */
  logger?: Console;
  
  /** Model-specific configuration */
  options?: {
    /** Maximum depth for synthesis */
    maxDepth?: number;
    
    /** Whether to include examples in the output */
    includeExamples?: boolean;
    
    /** Whether to include detailed reasoning */
    includeReasoning?: boolean;
    
    /** Confidence threshold for including results */
    confidenceThreshold?: number;
  };
}

export interface SynthesisInput {
  /** Array of model outputs to synthesize */
  models: any[];
  
  /** Additional context for the synthesis */
  context?: Record<string, any>;
  
  /** Options for this synthesis operation */
  options?: {
    /** Depth of synthesis to perform */
    depth?: number;
    
    /** Whether to include examples in the output */
    includeExamples?: boolean;
    
    /** Whether to include potential issues */
    includeIssues?: boolean;
    
    /** Whether to include related models */
    includeRelated?: boolean;
  };
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface SynthesisOutput {
  /** Unique identifier for this synthesis */
  id: string;
  
  /** The synthesized result */
  synthesizedResult: any;
  
  /** Key insights from the synthesis */
  insights: string[];
  
  /** Confidence score (0-1) */
  confidence: number;
  
  /** Additional metadata */
  metadata: {
    /** Version of the model */
    modelVersion: string;
    
    /** When the synthesis was performed */
    timestamp: string;
    
    /** How long the synthesis took in milliseconds */
    executionTimeMs: number;
    
    /** Telemetry data (if enabled) */
    telemetry?: {
      /** Number of models synthesized */
      modelCount: number;
      
      /** Keys in the context object */
      contextKeys: string[];
      
      /** Any additional telemetry data */
      [key: string]: any;
    };
  };
}

const DEFAULT_CONFIG: Required<${modelId}Config> = {
  id: '${modelId.toLowerCase()}',
  name: '${modelId} Synthesis Model',
  version: '1.0.0',
  eventEmitter: new EventEmitter(),
  telemetryEnabled: false,
  logger: console,
  options: {
    maxDepth: 3,
    includeExamples: true,
    includeReasoning: true,
    confidenceThreshold: 0.7
  }
};

/**
 * Creates a new instance of the ${modelId} Synthesis Model
 */
export const create${modelId}Model = (config: Partial<${modelId}Config> = {}) => {
  // Merge default config with user config
  const {
    id,
    name,
    version,
    eventEmitter,
    telemetryEnabled,
    logger,
    options: {
      maxDepth,
      includeExamples,
      includeReasoning,
      confidenceThreshold
    }
  } = { ...DEFAULT_CONFIG, ...config, options: { ...DEFAULT_CONFIG.options, ...(config.options || {}) } };

  /**
   * Synthesize multiple model outputs into a cohesive result
   */
  const synthesize = async (input: SynthesisInput): Promise<SynthesisOutput> => {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      // Input validation
      if (!input || typeof input !== 'object') {
        throw new Error('Input must be an object');
      }
      
      if (!input.models || !Array.isArray(input.models) || input.models.length === 0) {
        throw new Error('At least one model output is required for synthesis');
      }
      
      // Core synthesis logic
      const modelCount = input.models.length;
      const context = input.context || {};
      const options = {
        depth: Math.min(maxDepth, input.options?.depth || 2),
        includeExamples: input.options?.includeExamples ?? includeExamples,
        includeIssues: input.options?.includeIssues ?? false,
        includeRelated: input.options?.includeRelated ?? true
      };
      
      // Analyze the models
      const analysis = {
        modelTypes: [...new Set(input.models.map(m => m?.type || typeof m))],
        modelCount,
        hasConfidenceScores: input.models.every(m => 'confidence' in m),
        hasMetadata: input.models.every(m => 'metadata' in m)
      };
      
      // Generate insights
      const insights: string[] = [
        'Synthesized ' + modelCount + ' models',
        'Included models: ' + analysis.modelTypes.join(', ')
      ];
      
      if (options.includeExamples) {
        insights.push('Example synthesis completed');
      }
      
      // Create the synthesized result
      const synthesizedResult = {
        models: input.models,
        context,
        analysis: {
          ...analysis,
          synthesisDepth: options.depth,
          timestamp: new Date().toISOString()
        },
        recommendations: [
          'Consider combining ' + analysis.modelTypes.slice(0, 2).join(' and ') + ' for deeper insights',
          'Review related models for additional context'
        ]
      };
      
      // Calculate confidence (simple average if available, otherwise default)
      const confidence = analysis.hasConfidenceScores
        ? input.models.reduce((sum, m) => sum + (m.confidence || 0), 0) / modelCount
        : 0.8;
      
      const result: SynthesisOutput = {
        id: requestId,
        synthesizedResult,
        insights,
        confidence: Math.min(Math.max(confidence, 0), 1), // Ensure between 0 and 1
        metadata: {
          modelVersion: version,
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
          telemetry: telemetryEnabled ? {
            modelCount,
            contextKeys: Object.keys(context),
            synthesisDepth: options.depth,
            optionsUsed: options
          } : undefined,
        },
      };
      
      // Filter by confidence threshold if needed
      if (confidenceThreshold > 0 && result.confidence < confidenceThreshold) {
        result.insights.push('Low confidence result (below threshold)');
      }
      
      // Emit success event
      eventEmitter.emit('synthesisComplete', {
        requestId,
        result,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during synthesis';
      
      // Emit error event
      eventEmitter.emit('synthesisError', {
        requestId,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  };

  return {
    id,
    name,
    version,
    synthesize,
    // Add any additional methods or properties here
  };
};

// Default export for easier imports
export default {
  create${modelId}Model,
};`;

// Template for types.ts
const typesTemplate = (modelId) => `/**
 * ${modelId} Types
 * 
 * This file contains type definitions for the ${modelId} Synthesis Model.
 */

import { EventEmitter } from 'events';

/**
 * Configuration for the ${modelId} model
 */
export interface ${modelId}Config {
  /** Unique identifier for this model instance */
  id?: string;
  
  /** Display name of the model */
  name?: string;
  
  /** Version of the model */
  version?: string;
  
  /** Event emitter for analytics and monitoring */
  eventEmitter?: EventEmitter;
  
  /** Whether to enable telemetry */
  telemetryEnabled?: boolean;
  
  /** Logger instance */
  logger?: Console;
  
  /** Model-specific configuration */
  options?: {
    /** Maximum depth for synthesis */
    maxDepth?: number;
    
    /** Whether to include examples in the output */
    includeExamples?: boolean;
    
    /** Whether to include detailed reasoning */
    includeReasoning?: boolean;
    
    /** Confidence threshold for including results */
    confidenceThreshold?: number;
  };
}

/**
 * Input for the synthesis operation
 */
export interface SynthesisInput {
  /** Array of model outputs to synthesize */
  models: any[];
  
  /** Additional context for the synthesis */
  context?: Record<string, any>;
  
  /** Options for this synthesis operation */
  options?: {
    /** Depth of synthesis to perform */
    depth?: number;
    
    /** Whether to include examples in the output */
    includeExamples?: boolean;
    
    /** Whether to include potential issues */
    includeIssues?: boolean;
    
    /** Whether to include related models */
    includeRelated?: boolean;
  };
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Output from the synthesis operation
 */
export interface SynthesisOutput {
  /** Unique identifier for this synthesis */
  id: string;
  
  /** The synthesized result */
  synthesizedResult: any;
  
  /** Key insights from the synthesis */
  insights: string[];
  
  /** Confidence score (0-1) */
  confidence: number;
  
  /** Additional metadata */
  metadata: {
    /** Version of the model */
    modelVersion: string;
    
    /** When the synthesis was performed */
    timestamp: string;
    
    /** How long the synthesis took in milliseconds */
    executionTimeMs: number;
    
    /** Telemetry data (if enabled) */
    telemetry?: {
      /** Number of models synthesized */
      modelCount: number;
      
      /** Keys in the context object */
      contextKeys: string[];
      
      /** Any additional telemetry data */
      [key: string]: any;
    };
  };
}

/**
 * Event emitted when synthesis completes successfully
 */
export interface SynthesisCompleteEvent {
  /** Unique identifier for the request */
  requestId: string;
  
  /** The synthesis result */
  result: SynthesisOutput;
  
  /** When the event was emitted */
  timestamp: string;
}

/**
 * Event emitted when an error occurs during synthesis
 */
export interface SynthesisErrorEvent {
  /** Unique identifier for the request */
  requestId: string;
  
  /** Error message */
  error: string;
  
  /** When the error occurred */
  timestamp: string;
}

/**
 * Type for synthesis event handlers
 */
export type SynthesisEventHandler<T> = (event: T) => void;

// Extend the global Window interface for browser usage
declare global {
  interface Window {
    ${modelId}Analytics?: {
      onSynthesisComplete: (handler: SynthesisEventHandler<SynthesisCompleteEvent>) => void;
      onSynthesisError: (handler: SynthesisEventHandler<SynthesisErrorEvent>) => void;
    };
  }
}`;

// Template for constants.ts
const constantsTemplate = (modelId) => `/**
 * ${modelId} Constants
 * 
 * This file contains constants used by the ${modelId} model.
 */

/** Current version of the model */
export const version = '1.0.0';

/** Default configuration values */
export const DEFAULT_OPTIONS = {
  maxDepth: 3,
  includeExamples: true,
  includeReasoning: true,
  confidenceThreshold: 0.7
};

/** Model metadata */
export const MODEL_METADATA = {
  id: '${modelId.toLowerCase()}',
  name: '${modelId} Synthesis Model',
  description: 'Advanced synthesis capabilities for combining multiple mental models',
  version: '1.0.0',
  author: 'HUMMBL',
  createdAt: '2025-10-23',
  updatedAt: '2025-10-23'
};

/** Default model types that work well with this synthesizer */
export const COMPATIBLE_MODEL_TYPES = [
  'perspective',
  'inversion',
  'composition',
  'deconstruction',
  'reconstruction',
  'synthesis',
  'analysis',
  'prediction'
];

/** Error messages */
export const ERRORS = {
  INVALID_INPUT: 'Input must be an object',
  NO_MODELS: 'At least one model output is required for synthesis',
  SYNTHESIS_FAILED: 'Failed to synthesize models'
};

/** Event names */
export const EVENTS = {
  SYNTHESIS_COMPLETE: 'synthesisComplete',
  SYNTHESIS_ERROR: 'synthesisError'
};`;

// Template for test file
const testTemplate = (modelId) => `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create${modelId}Model } from '../index';
import { EventEmitter } from 'events';

describe('${modelId}', () => {
  let model;
  let mockEventEmit;
  
  beforeEach(() => {
    const eventEmitter = new EventEmitter();
    mockEventEmit = vi.fn();
    eventEmitter.emit = mockEventEmit;
    
    model = create${modelId}Model({
      eventEmitter,
      telemetryEnabled: true,
      options: {
        maxDepth: 2,
        includeExamples: true,
        includeReasoning: true,
        confidenceThreshold: 0.5
      }
    });
  });
  
  it('should create a model with default config', () => {
    expect(model).toBeDefined();
    expect(model.id).toBe('${modelId.toLowerCase()}');
    expect(model.name).toBe('${modelId} Synthesis Model');
    expect(model.version).toBe('1.0.0');
    expect(typeof model.synthesize).toBe('function');
  });
  
  it('should synthesize multiple models', async () => {
    const input = {
      models: [
        { type: 'perspective', id: 'p1', analysis: 'Analysis 1', confidence: 0.8 },
        { type: 'inversion', id: 'i1', analysis: 'Analysis 2', confidence: 0.9 }
      ],
      context: { userId: 'test-user' },
      options: {
        depth: 2,
        includeExamples: true
      }
    };
    
    const result = await model.synthesize(input);
    
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.synthesizedResult.models).toHaveLength(2);
    expect(result.insights.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(mockEventEmit).toHaveBeenCalledWith('synthesisComplete', expect.anything());
  });
  
  it('should handle confidence threshold', async () => {
    // Create a model with a very high confidence threshold
    const highThresholdModel = create${modelId}Model({
      options: {
        confidenceThreshold: 0.99 // Very high threshold that will trigger low confidence
      }
    });
    
    // Input with models that have confidence below the threshold
    const input = {
      models: [
        { type: 'perspective', id: 'p1', analysis: 'Analysis 1', confidence: 0.5 },
        { type: 'inversion', id: 'i1', analysis: 'Analysis 2', confidence: 0.6 }
      ],
      // Add context to ensure the test is more realistic
      context: { test: 'confidence-threshold-test' },
      // Explicitly enable telemetry for this test
      options: {
        includeExamples: true
      }
    };
    
    const result = await highThresholdModel.synthesize(input);
    
    // Verify the low confidence message is in the insights
    expect(result.insights.some(insight => 
      typeof insight === 'string' && insight.includes('Low confidence result')
    )).toBe(true);
    
    // Also verify the confidence is below the threshold
    expect(result.confidence).toBeLessThan(0.7);
  });
  
  it('should include telemetry when enabled', async () => {
    const input = {
      models: [
        { type: 'perspective', id: 'p1', analysis: 'Analysis 1' },
        { type: 'inversion', id: 'i1', analysis: 'Analysis 2' }
      ],
      context: { userId: 'test-user' }
    };
    
    const result = await model.synthesize(input);
    
    expect(result.metadata.telemetry).toBeDefined();
    expect(result.metadata.telemetry.modelCount).toBe(2);
    expect(result.metadata.telemetry.contextKeys).toContain('userId');
  });
  
  it('should handle errors for invalid input', async () => {
    // Test with missing models
    await expect(model.synthesize({})).rejects.toThrow('At least one model output is required');
    
    // Test with empty models array
    await expect(model.synthesize({ models: [] })).rejects.toThrow('At least one model output is required');
  });
  
  it('should emit error events on failure', async () => {
    const testEmitter = new EventEmitter();
    const errorSpy = vi.fn();
    testEmitter.on('synthesisError', errorSpy);
    
    const failingModel = create${modelId}Model({
      eventEmitter: testEmitter,
    });
    
    await expect(failingModel.synthesize({})).rejects.toThrow();
    
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const eventData = errorSpy.mock.calls[0][0];
    expect(eventData).toHaveProperty('error');
    expect(eventData).toHaveProperty('requestId');
    expect(eventData).toHaveProperty('timestamp');
    expect(typeof eventData.error).toBe('string');
    expect(eventData.error).toContain('At least one model output is required');
  });
});`;

// Template for README.md
const readmeTemplate = (modelId) => `# ${modelId}: Synthesis Model

## Overview
This model implements advanced synthesis capabilities for combining multiple mental models into cohesive solutions. It provides a structured way to integrate insights from various perspectives and generate comprehensive analyses.

## Installation

\`\`\`bash
npm install @hummbl/models
\`\`\`

## Usage

\`\`\`typescript
import { create${modelId}Model } from '@hummbl/models/${modelId.toLowerCase()}';

// Create an instance of the model
const model = create${modelId}Model({
  telemetryEnabled: true,
  options: {
    maxDepth: 3,
    includeExamples: true,
    includeReasoning: true,
    confidenceThreshold: 0.7
  }
});

// Synthesize multiple model outputs
const result = await model.synthesize({
  models: [
    {
      type: 'perspective',
      id: 'p1',
      analysis: 'Analysis from perspective model',
      confidence: 0.85,
      metadata: {
        source: 'user-input',
        timestamp: new Date().toISOString()
      }
    },
    {
      type: 'inversion',
      id: 'i1',
      analysis: 'Analysis from inversion model',
      confidence: 0.78,
      metadata: {
        source: 'api-call',
        timestamp: new Date().toISOString()
      }
    }
  ],
  context: {
    userId: 'user123',
    environment: 'production',
    requestId: 'req_' + Math.random().toString(36).substr(2, 9)
  },
  options: {
    depth: 2,
    includeExamples: true,
    includeIssues: true,
    includeRelated: true
  },
  metadata: {
    priority: 'high',
    tags: ['analysis', 'synthesis']
  }
});

console.log('Synthesis Result:', result.synthesizedResult);
console.log('Key Insights:', result.insights);
console.log('Confidence:', result.confidence);
\`\`\`

## API Reference

### create${modelId}Model(config?)

Creates a new instance of the ${modelId} model.

**Parameters:**
- \`config\` (Optional): Configuration object
  - \`id\` (string): Unique identifier for this model instance (default: '${modelId.toLowerCase()}')
  - \`name\` (string): Display name of the model (default: '${modelId} Synthesis Model')
  - \`version\` (string): Version of the model (default: '1.0.0')
  - \`eventEmitter\` (EventEmitter): Custom event emitter (default: new EventEmitter())
  - \`telemetryEnabled\` (boolean): Whether to enable telemetry (default: false)
  - \`logger\` (object): Custom logger (default: console)
  - \`options\` (object): Model-specific options
    - \`maxDepth\` (number): Maximum depth for synthesis (default: 3)
    - \`includeExamples\` (boolean): Whether to include examples in the output (default: true)
    - \`includeReasoning\` (boolean): Whether to include detailed reasoning (default: true)
    - \`confidenceThreshold\` (number): Confidence threshold (0-1) for including results (default: 0.7)

**Returns:**
An object with the following properties:
- \`id\` (string): The model ID
- \`name\` (string): The model name
- \`version\` (string): The model version
- \`synthesize\` (function): The synthesis function

### synthesize(input)

Synthesizes multiple model outputs into a cohesive result.

**Parameters:**
- \`input\` (object): The input to synthesize
  - \`models\` (any[]): Array of model outputs to synthesize
  - \`context\` (object, optional): Additional context for the synthesis
  - \`options\` (object, optional): Options for this synthesis operation
    - \`depth\` (number, optional): Depth of synthesis to perform
    - \`includeExamples\` (boolean, optional): Whether to include examples
    - \`includeIssues\` (boolean, optional): Whether to include potential issues
    - \`includeRelated\` (boolean, optional): Whether to include related models
  - \`metadata\` (object, optional): Additional metadata

**Returns:**
A Promise that resolves to a synthesis result object with the following structure:
- \`id\` (string): Unique identifier for this synthesis
- \`synthesizedResult\` (any): The synthesized result
- \`insights\` (string[]): Key insights from the synthesis
- \`confidence\` (number): Confidence score (0-1)
- \`metadata\` (object): Additional metadata including timing and telemetry

## Events

The model emits the following events:

### synthesisComplete
Emitted when synthesis is successfully completed.

**Event Data:**
- \`requestId\` (string): Unique ID for the request
- \`result\` (object): The synthesis result
- \`timestamp\` (string): ISO timestamp of when the event was emitted

### synthesisError
Emitted when an error occurs during synthesis.

**Event Data:**
- \`requestId\` (string): Unique ID for the request
- \`error\` (string): Error message
- \`timestamp\` (string): ISO timestamp of when the error occurred

## Testing

Run tests with:

\`\`\`bash
npm test ${modelId.toLowerCase()}
\`\`\`

## License

MIT
`;

// Function to create directory if it doesn't exist
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Function to generate a single model
async function generateModel(modelId) {
  const modelDir = path.join(ROOT_DIR, modelId.toLowerCase());
  const testDir = path.join(modelDir, '__tests__');
  
  // Create directories
  await ensureDir(modelDir);
  await ensureDir(testDir);
  
  // Generate files
  const files = [
    { path: path.join(modelDir, 'index.ts'), content: indexTemplate(modelId) },
    { path: path.join(modelDir, 'types.ts'), content: typesTemplate(modelId) },
    { path: path.join(modelDir, 'constants.ts'), content: constantsTemplate(modelId) },
    { path: path.join(testDir, `${modelId.toLowerCase()}.test.ts`), content: testTemplate(modelId) },
    { path: path.join(modelDir, 'README.md'), content: readmeTemplate(modelId) }
  ];
  
  // Write files
  for (const file of files) {
    await fs.writeFile(file.path, file.content, 'utf8');
    console.log(`Created: ${file.path}`);
  }
  
  return files.length;
}

// Generate models SY5-SY20
async function generateSynthesisModels() {
  const startTime = Date.now();
  const models = [];
  
  // Generate model IDs SY5 through SY20
  for (let i = 5; i <= 20; i++) {
    const modelId = `SY${i.toString().padStart(2, '0')}`;
    models.push(modelId);
  }
  
  console.log(`Generating ${models.length} Synthesis models (SY5-SY20)...`);
  
  // Generate each model
  let totalFiles = 0;
  for (const modelId of models) {
    console.log(`\nGenerating ${modelId}...`);
    const filesGenerated = await generateModel(modelId);
    totalFiles += filesGenerated;
    console.log(`✓ ${modelId} generated (${filesGenerated} files)`);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Successfully generated ${models.length} models (${totalFiles} files) in ${duration}s`);
  console.log('Models generated:', models.join(', '));
  
  return models.length;
}

// Run the generation
async function run() {
  try {
    await generateSynthesisModels();
    console.log('\n🎉 Synthesis model generation complete!');
    console.log('Next steps:');
    console.log('1. Run tests: npm test');
    console.log('2. Build the project: npm run build');
    console.log('3. Commit the changes');
  } catch (error) {
    console.error('\n❌ Error generating models:', error);
    process.exit(1);
  }
}

run();
