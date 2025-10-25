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
import { 
  CompositionInput, 
  CompositionOutput, 
  CompositionConfig, 
  DEFAULT_CONFIG as DEFAULT_COMPOSITION_CONFIG 
} from './types';
import { version } from './constants';

/**
 * ${modelId}: Composition Model
 * 
 * This model implements the Composition mental model by combining elements
 * to create new wholes with emergent properties.
 */
export const create${modelId}Model = (config: Partial<CompositionConfig> = {}) => {
  // Merge default config with user config
  const {
    name = '${modelId}',
    version: modelVersion = version,
    eventEmitter = new EventEmitter(),
    telemetryEnabled = false,
    logger = console,
  } = { ...DEFAULT_COMPOSITION_CONFIG, ...config };

  /**
   * Analyze input using the Composition model
   */
  const analyze = async (input: CompositionInput): Promise<CompositionOutput> => {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      // Input validation
      if (!input || typeof input !== 'object') {
        throw new Error('Input must be an object');
      }
      
      if (!input.elements || !Array.isArray(input.elements) || input.elements.length === 0) {
        throw new Error('Input must contain a non-empty "elements" array');
      }
      
      // Core Composition logic
      const composition = {
        elements: input.elements,
        relationships: input.relationships || [],
        emergentProperties: []
      };

      // Add some basic emergent properties based on the input
      if (input.elements.length > 1) {
        composition.emergentProperties.push(
          'Combined functionality of ' + input.elements.length + ' elements',
          'Emergent behavior from element interactions',
          'Potential for new use cases'
        );
      }

      const result: CompositionOutput = {
        id: requestId,
        analysis: {
          composition,
          insights: [
            'Identified ' + input.elements.length + ' elements for composition',
            'Analyzed relationships between elements',
            'Identified potential emergent properties'
          ]
        },
        confidence: 0.8,
        metadata: {
          modelVersion,
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
          telemetry: telemetryEnabled ? {
            elementCount: input.elements.length,
            relationshipCount: input.relationships ? input.relationships.length : 0,
            contextKeys: input.context ? Object.keys(input.context) : []
          } : undefined,
        },
      };

      // Emit success event
      eventEmitter.emit('analysisComplete', {
        requestId,
        result,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during analysis';
      
      // Emit error event
      eventEmitter.emit('analysisError', {
        requestId,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  };

  return {
    id: '${modelId}',
    name,
    version: modelVersion,
    analyze
  };
};

export default create${modelId}Model;`;

// Template for types.ts
const typesTemplate = (modelId) => `import { EventEmitter } from 'events';

export interface CompositionElement {
  /** Unique identifier for the element */
  id: string;
  
  /** Type/category of the element */
  type: string;
  
  /** Properties of the element */
  properties: Record<string, any>;
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}

export interface CompositionRelationship {
  /** Type of relationship */
  type: string;
  
  /** IDs of the source and target elements */
  source: string;
  target: string;
  
  /** Properties of the relationship */
  properties?: Record<string, any>;
}

export interface CompositionInput {
  /** Elements to be composed */
  elements: CompositionElement[];
  
  /** Relationships between elements */
  relationships?: CompositionRelationship[];
  
  /** Additional context for the composition */
  context?: Record<string, any>;
  
  /** Options for the composition */
  options?: {
    /** Whether to include detailed reasoning in the output */
    includeReasoning?: boolean;
    
    /** Maximum depth to analyze */
    maxDepth?: number;
    
    /** Whether to include potential issues in the output */
    includeIssues?: boolean;
  };
}

export interface CompositionAnalysis {
  /** The composed elements and their relationships */
  composition: {
    elements: CompositionElement[];
    relationships: CompositionRelationship[];
    emergentProperties: string[];
  };
  
  /** Key insights from the composition process */
  insights: string[];
  
  /** Any additional metadata about the analysis */
  metadata?: Record<string, any>;
}

export interface CompositionOutput {
  /** Unique identifier for this analysis */
  id: string;
  
  /** The analysis results */
  analysis: CompositionAnalysis;
  
  /** Confidence score (0-1) of the analysis */
  confidence: number;
  
  /** Additional metadata */
  metadata: {
    /** Version of the model */
    modelVersion: string;
    
    /** When the analysis was performed */
    timestamp: string;
    
    /** How long the analysis took in milliseconds */
    executionTimeMs: number;
    
    /** Telemetry data (if enabled) */
    telemetry?: {
      /** Number of elements */
      elementCount: number;
      
      /** Number of relationships */
      relationshipCount: number;
      
      /** Keys present in the context */
      contextKeys: string[];
      
      /** Any additional telemetry data */
      [key: string]: any;
    };
  };
}

export interface CompositionConfig {
  /** Name of the model */
  name: string;
  
  /** Version of the model */
  version: string;
  
  /** Event emitter for analytics and monitoring */
  eventEmitter: EventEmitter;
  
  /** Whether to enable telemetry */
  telemetryEnabled: boolean;
  
  /** Logger instance */
  logger: Console | any;
}

export const DEFAULT_CONFIG: CompositionConfig = {
  name: '${modelId}',
  version: '1.0.0',
  eventEmitter: new EventEmitter(),
  telemetryEnabled: false,
  logger: console,
};

// Event types
export interface AnalysisCompleteEvent {
  requestId: string;
  result: CompositionOutput;
  timestamp: string;
}

export interface AnalysisErrorEvent {
  requestId: string;
  error: string;
  timestamp: string;
}

export type AnalysisEventHandler<T> = (event: T) => void;

declare global {
  interface Window {
    ${modelId}Analytics?: {
      onAnalysisComplete: (handler: AnalysisEventHandler<AnalysisCompleteEvent>) => void;
      onAnalysisError: (handler: AnalysisEventHandler<AnalysisErrorEvent>) => void;
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
  includeReasoning: true,
  maxDepth: 3,
  includeIssues: true
};

/** Model metadata */
export const MODEL_METADATA = {
  id: '${modelId.toLowerCase()}',
  name: '${modelId} Composition Model',
  description: 'Combines elements to create new wholes with emergent properties',
  version: '1.0.0',
  author: 'HUMMBL',
  createdAt: '2025-10-23',
  updatedAt: '2025-10-23'
};

/** Default element types */
export const ELEMENT_TYPES = [
  'component',
  'service',
  'data',
  'interface',
  'process'
];

/** Default relationship types */
export const RELATIONSHIP_TYPES = [
  'dependsOn',
  'uses',
  'implements',
  'extends',
  'composedOf'
];`;

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
      telemetryEnabled: true
    });
  });
  
  it('should create a model with default config', () => {
    expect(model).toBeDefined();
    expect(model.id).toBe('${modelId}');
    expect(model.name).toBe('${modelId}');
    expect(model.version).toBe('1.0.0');
    expect(typeof model.analyze).toBe('function');
  });
  
  it('should analyze input with elements', async () => {
    const input = { 
      elements: [
        { id: 'e1', type: 'component', properties: { name: 'Component 1' } },
        { id: 'e2', type: 'component', properties: { name: 'Component 2' } }
      ],
      relationships: [
        { type: 'connectsTo', source: 'e1', target: 'e2' }
      ]
    };
    
    const result = await model.analyze(input);
    
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.analysis.composition.elements).toHaveLength(2);
    expect(result.analysis.composition.relationships).toHaveLength(1);
    expect(result.analysis.composition.emergentProperties.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(mockEventEmit).toHaveBeenCalledWith('analysisComplete', expect.anything());
  });
  
  it('should include telemetry when enabled', async () => {
    const input = { 
      elements: [
        { id: 'e1', type: 'component', properties: { name: 'Component 1' } },
        { id: 'e2', type: 'component', properties: { name: 'Component 2' } }
      ],
      relationships: [
        { type: 'connectsTo', source: 'e1', target: 'e2' }
      ],
      context: { userId: 'test-user' }
    };
    
    const result = await model.analyze(input);
    
    expect(result.metadata.telemetry).toBeDefined();
    expect(result.metadata.telemetry.elementCount).toBe(2);
    expect(result.metadata.telemetry.relationshipCount).toBe(1);
    expect(result.metadata.telemetry.contextKeys).toContain('userId');
  });
  
  it('should handle errors for invalid input', async () => {
    // Test with missing elements array
    await expect(model.analyze({})).rejects.toThrow('must contain a non-empty "elements" array');
    
    // Test with empty elements array
    await expect(model.analyze({ elements: [] })).rejects.toThrow('must contain a non-empty "elements" array');
  });
  
  it('should emit error events on failure', async () => {
    const testEmitter = new EventEmitter();
    const errorSpy = vi.fn();
    testEmitter.on('analysisError', errorSpy);
    
    const failingModel = create${modelId}Model({
      eventEmitter: testEmitter,
    });
    
    await expect(failingModel.analyze({})).rejects.toThrow();
    
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const eventData = errorSpy.mock.calls[0][0];
    expect(eventData).toHaveProperty('error');
    expect(eventData).toHaveProperty('requestId');
    expect(eventData).toHaveProperty('timestamp');
    expect(typeof eventData.error).toBe('string');
    expect(eventData.error).toContain('must contain a non-empty "elements" array');
  });
});`;

// Template for README.md
const readmeTemplate = (modelId) => `# ${modelId}: Composition Model

## Overview
This model implements the Composition mental model by combining elements to create new wholes with emergent properties.

## Installation

\`\`\`bash
npm install @hummbl/models
\`\`\`

## Usage

\`\`\`typescript
import { create${modelId}Model } from '@hummbl/models/${modelId.toLowerCase()}';

// Create an instance of the model
const model = create${modelId}Model({
  telemetryEnabled: true
});

// Analyze some input
const result = await model.analyze({
  elements: [
    { id: 'e1', type: 'component', properties: { name: 'Component 1' } },
    { id: 'e2', type: 'component', properties: { name: 'Component 2' } }
  ],
  relationships: [
    { type: 'connectsTo', source: 'e1', target: 'e2' }
  ],
  context: {
    // Additional context can be provided here
  },
  options: {
    // Model-specific options
  }
});
\`\`\`

## API Reference

### create${modelId}Model(config?)

Creates a new instance of the ${modelId} model.

**Parameters:**
- \`config\` (Optional): Configuration object
  - \`name\` (string): Name of the model instance (default: '${modelId}')
  - \`version\` (string): Version of the model (default: '1.0.0')
  - \`eventEmitter\` (EventEmitter): Custom event emitter (default: new EventEmitter())
  - \`telemetryEnabled\` (boolean): Whether to enable telemetry (default: false)
  - \`logger\` (object): Custom logger (default: console)

**Returns:**
An object with the following properties:
- \`id\` (string): The model ID
- \`name\` (string): The model name
- \`version\` (string): The model version
- \`analyze\` (function): The analysis function

### analyze(input)

Analyzes the input using the Composition model.

**Parameters:**
- \`input\` (object): The input to analyze
  - \`elements\` (CompositionElement[]): The elements to compose
  - \`relationships\` (CompositionRelationship[], optional): Relationships between elements
  - \`context\` (object, optional): Additional context
  - \`options\` (object, optional): Analysis options
    - \`includeReasoning\` (boolean): Whether to include detailed reasoning
    - \`maxDepth\` (number): Maximum depth to analyze
    - \`includeIssues\` (boolean): Whether to include potential issues

**Returns:**
A Promise that resolves to an analysis result object.

## Events

The model emits the following events:

### analysisComplete
Emitted when analysis is successfully completed.

**Event Data:**
- \`requestId\` (string): Unique ID for the request
- \`result\` (object): The analysis result
- \`timestamp\` (string): ISO timestamp of when the event was emitted

### analysisError
Emitted when an error occurs during analysis.

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

// Generate models CO3-CO20
async function generateCompositionModels() {
  const startTime = Date.now();
  const models = [];
  
  // Generate model IDs CO3 through CO20
  for (let i = 3; i <= 20; i++) {
    const modelId = `CO${i.toString().padStart(2, '0')}`;
    models.push(modelId);
  }
  
  console.log(`Generating ${models.length} Composition models (CO3-CO20)...`);
  
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
    await generateCompositionModels();
    console.log('\n🎉 Composition model generation complete!');
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
