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
  DeconstructionInput, 
  DeconstructionOutput, 
  DeconstructionConfig, 
  DEFAULT_CONFIG as DEFAULT_DECONSTRUCTION_CONFIG 
} from './types';
import { version } from './constants';

/**
 * ${modelId}: Deconstruction Model
 * 
 * This model implements the Deconstruction mental model by breaking down
 * complex systems into their fundamental components and relationships.
 */
export const create${modelId}Model = (config: Partial<DeconstructionConfig> = {}) => {
  // Merge default config with user config
  const {
    name = '${modelId}',
    version: modelVersion = version,
    eventEmitter = new EventEmitter(),
    telemetryEnabled = false,
    logger = console,
  } = { ...DEFAULT_DECONSTRUCTION_CONFIG, ...config };

  /**
   * Analyze input using the Deconstruction model
   */
  const analyze = async (input: DeconstructionInput): Promise<DeconstructionOutput> => {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      // Input validation
      if (!input || typeof input !== 'object') {
        throw new Error('Input must be an object');
      }
      
      if (!input.system) {
        throw new Error('Input must contain a "system" property to deconstruct');
      }
      
      // Core Deconstruction logic
      const components = [];
      const relationships = [];
      
      // Simple deconstruction based on input type
      if (typeof input.system === 'object' && !Array.isArray(input.system)) {
        // Deconstruct object into its properties
        components.push(...Object.keys(input.system).map(key => ({
          id: key,
          type: typeof input.system[key],
          properties: { value: input.system[key] }
        })));
        
        // Add relationships if there are multiple components
        if (components.length > 1) {
          for (let i = 0; i < components.length - 1; i++) {
            relationships.push({
              type: 'related',
              source: components[i].id,
              target: components[i + 1].id,
              properties: { type: 'sequential' }
            });
          }
        }
      } else if (Array.isArray(input.system)) {
        // Deconstruct array into items with indices
        components.push(...input.system.map((item, index) => ({
          id: 'item_' + index,
          type: 'array_item',
          properties: { 
            index,
            value: item,
            valueType: typeof item
          }
        })));
      } else {
        // Simple value deconstruction
        components.push({
          id: 'value',
          type: 'primitive',
          properties: {
            type: typeof input.system,
            value: input.system
          }
        });
      }

      const result: DeconstructionOutput = {
        id: requestId,
        analysis: {
          components,
          relationships,
          insights: [
            'Deconstructed system into ' + components.length + ' components',
            relationships.length > 0 ? 'Identified ' + relationships.length + ' relationships' : 'No relationships identified',
            'Applied basic deconstruction patterns'
          ].filter(Boolean) as string[]
        },
        confidence: 0.8,
        metadata: {
          modelVersion,
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
          telemetry: telemetryEnabled ? {
            componentCount: components.length,
            relationshipCount: relationships.length,
            inputType: Array.isArray(input.system) ? 'array' : typeof input.system,
            inputSize: typeof input.system === 'string' ? input.system.length : 
                     Array.isArray(input.system) ? input.system.length :
                     typeof input.system === 'object' ? Object.keys(input.system).length : 1
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

export interface Component {
  /** Unique identifier for the component */
  id: string;
  
  /** Type/category of the component */
  type: string;
  
  /** Properties of the component */
  properties: Record<string, any>;
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}

export interface Relationship {
  /** Type of relationship */
  type: string;
  
  /** IDs of the source and target components */
  source: string;
  target: string;
  
  /** Properties of the relationship */
  properties?: Record<string, any>;
}

export interface DeconstructionInput {
  /** The system to deconstruct (object, array, or primitive) */
  system: any;
  
  /** Additional context for the deconstruction */
  context?: Record<string, any>;
  
  /** Options for the deconstruction */
  options?: {
    /** Whether to include detailed reasoning in the output */
    includeReasoning?: boolean;
    
    /** Maximum depth to deconstruct */
    maxDepth?: number;
    
    /** Whether to include potential issues in the output */
    includeIssues?: boolean;
  };
}

export interface DeconstructionAnalysis {
  /** The deconstructed components */
  components: Component[];
  
  /** Relationships between components */
  relationships: Relationship[];
  
  /** Key insights from the deconstruction */
  insights: string[];
  
  /** Any additional metadata about the analysis */
  metadata?: Record<string, any>;
}

export interface DeconstructionOutput {
  /** Unique identifier for this analysis */
  id: string;
  
  /** The analysis results */
  analysis: DeconstructionAnalysis;
  
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
      /** Number of components */
      componentCount: number;
      
      /** Number of relationships */
      relationshipCount: number;
      
      /** Type of input */
      inputType: string;
      
      /** Size of input */
      inputSize: number;
      
      /** Any additional telemetry data */
      [key: string]: any;
    };
  };
}

export interface DeconstructionConfig {
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

export const DEFAULT_CONFIG: DeconstructionConfig = {
  name: '${modelId}',
  version: '1.0.0',
  eventEmitter: new EventEmitter(),
  telemetryEnabled: false,
  logger: console,
};

// Event types
export interface AnalysisCompleteEvent {
  requestId: string;
  result: DeconstructionOutput;
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
  name: '${modelId} Deconstruction Model',
  description: 'Breaks down complex systems into their fundamental components and relationships',
  version: '1.0.0',
  author: 'HUMMBL',
  createdAt: '2025-10-23',
  updatedAt: '2025-10-23'
};

/** Default component types */
export const COMPONENT_TYPES = [
  'primitive',
  'object',
  'array',
  'function',
  'class',
  'module',
  'service',
  'data'
];

/** Default relationship types */
export const RELATIONSHIP_TYPES = [
  'contains',
  'dependsOn',
  'uses',
  'extends',
  'implements',
  'calls',
  'references'
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
  
  it('should deconstruct an object into components', async () => {
    const input = { 
      system: {
        name: 'Test System',
        version: '1.0.0',
        config: {
          enabled: true,
          maxItems: 10
        }
      }
    };
    
    const result = await model.analyze(input);
    
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.analysis.components.length).toBeGreaterThan(0);
    expect(result.analysis.components.some(c => c.id === 'name')).toBe(true);
    expect(result.analysis.components.some(c => c.id === 'version')).toBe(true);
    expect(result.analysis.components.some(c => c.id === 'config')).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(mockEventEmit).toHaveBeenCalledWith('analysisComplete', expect.anything());
  });
  
  it('should deconstruct an array into components', async () => {
    const input = { 
      system: ['item1', 'item2', 'item3']
    };
    
    const result = await model.analyze(input);
    
    expect(result).toBeDefined();
    expect(result.analysis.components.length).toBe(3);
    expect(result.analysis.components[0].id).toBe('item_0');
    expect(result.analysis.components[1].id).toBe('item_1');
    expect(result.analysis.components[2].id).toBe('item_2');
    expect(result.metadata.telemetry.inputType).toBe('array');
    expect(result.metadata.telemetry.inputSize).toBe(3);
  });
  
  it('should include telemetry when enabled', async () => {
    const input = { 
      system: {
        name: 'Test',
        value: 123
      },
      context: { userId: 'test-user' }
    };
    
    const result = await model.analyze(input);
    
    expect(result.metadata.telemetry).toBeDefined();
    expect(result.metadata.telemetry.componentCount).toBe(2);
    expect(result.metadata.telemetry.inputType).toBe('object');
  });
  
  it('should handle errors for invalid input', async () => {
    // Test with missing system
    await expect(model.analyze({})).rejects.toThrow('must contain a "system" property');
    
    // Test with null/undefined system
    await expect(model.analyze({ system: null })).rejects.toThrow('must contain a "system" property');
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
    expect(eventData.error).toContain('must contain a "system" property');
  });
});`;

// Template for README.md
const readmeTemplate = (modelId) => `# ${modelId}: Deconstruction Model

## Overview
This model implements the Deconstruction mental model by breaking down complex systems into their fundamental components and relationships.

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

// Analyze a system by deconstructing it
const result = await model.analyze({
  system: {
    // The system to deconstruct (can be any value)
    name: 'Example System',
    version: '1.0.0',
    components: ['UI', 'API', 'Database'],
    config: {
      debug: true,
      logLevel: 'info'
    }
  },
  context: {
    // Additional context can be provided here
    userId: 'user123',
    environment: 'development'
  },
  options: {
    // Model-specific options
    maxDepth: 3,
    includeReasoning: true
  }
});

// Use the deconstructed components and relationships
console.log('Components:', result.analysis.components);
console.log('Relationships:', result.analysis.relationships);
console.log('Insights:', result.analysis.insights);
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

Deconstructs the input system into its fundamental components and relationships.

**Parameters:**
- \`input\` (object): The input to analyze
  - \`system\` (any): The system to deconstruct (object, array, or primitive)
  - \`context\` (object, optional): Additional context
  - \`options\` (object, optional): Analysis options
    - \`includeReasoning\` (boolean): Whether to include detailed reasoning
    - \`maxDepth\` (number): Maximum depth to deconstruct
    - \`includeIssues\` (boolean): Whether to include potential issues

**Returns:**
A Promise that resolves to a deconstruction result object.

## Events

The model emits the following events:

### analysisComplete
Emitted when analysis is successfully completed.

**Event Data:**
- \`requestId\` (string): Unique ID for the request
- \`result\` (object): The deconstruction result
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

// Generate models DE3-DE20
async function generateDeconstructionModels() {
  const startTime = Date.now();
  const models = [];
  
  // Generate model IDs DE3 through DE20
  for (let i = 3; i <= 20; i++) {
    const modelId = `DE${i.toString().padStart(2, '0')}`;
    models.push(modelId);
  }
  
  console.log(`Generating ${models.length} Deconstruction models (DE3-DE20)...`);
  
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
    await generateDeconstructionModels();
    console.log('\n🎉 Deconstruction model generation complete!');
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
