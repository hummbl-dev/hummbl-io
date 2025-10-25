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
  ReconstructionInput, 
  ReconstructionOutput, 
  ReconstructionConfig, 
  DEFAULT_CONFIG as DEFAULT_RECONSTRUCTION_CONFIG,
  ReconstructionComponent,
  ReconstructionRelationship,
  ReconstructionEvent
} from './types';
import { version } from './constants';

/**
 * ${modelId}: Reconstruction Model
 * 
 * This model implements the Reconstruction mental model by reassembling
 * components into a coherent system with improved structure and relationships.
 */
export const create${modelId}Model = (config: Partial<ReconstructionConfig> = {}) => {
  // Merge default config with user config
  const {
    name = '${modelId}',
    version: modelVersion = version,
    eventEmitter = new EventEmitter(),
    telemetryEnabled = false,
    logger = console,
  } = { ...DEFAULT_RECONSTRUCTION_CONFIG, ...config };

  /**
   * Reconstruct a system from its components
   */
  const reconstruct = async (input: ReconstructionInput): Promise<ReconstructionOutput> => {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      // Input validation
      if (!input || typeof input !== 'object') {
        throw new Error('Input must be an object');
      }
      
      if (!input.components || !Array.isArray(input.components) || input.components.length === 0) {
        throw new Error('Input must contain a non-empty "components" array');
      }
      
      // Core Reconstruction logic
      const reconstructedSystem = {
        id: input.systemId || 'system_' + uuidv4(),
        name: input.name || 'Reconstructed System',
        components: [...input.components],
        relationships: input.relationships || [],
        metadata: {
          ...input.metadata,
          reconstructedAt: new Date().toISOString(),
          reconstructedBy: '${modelId}'
        }
      };

      // Apply any transformations or improvements
      if (input.strategy === 'optimize') {
        // Apply optimization logic
        reconstructedSystem.components = reconstructedSystem.components.map(comp => ({
          ...comp,
          optimized: true,
          lastOptimized: new Date().toISOString()
        }));
        
        if (reconstructedSystem.relationships.length === 0 && reconstructedSystem.components.length > 1) {
          // Create default relationships if none provided
          reconstructedSystem.relationships = [];
          for (let i = 0; i < reconstructedSystem.components.length - 1; i++) {
            reconstructedSystem.relationships.push({
              id: 'rel_' + uuidv4(),
              source: reconstructedSystem.components[i].id,
              target: reconstructedSystem.components[i + 1].id,
              type: 'depends_on',
              weight: 1.0
            });
          }
        }
      }

      const result: ReconstructionOutput = {
        id: requestId,
        system: reconstructedSystem,
        metrics: {
          componentCount: reconstructedSystem.components.length,
          relationshipCount: reconstructedSystem.relationships.length,
          reconstructionTimeMs: Date.now() - startTime,
          improvement: 0.75 // Placeholder for actual improvement metric
        },
        metadata: {
          modelVersion,
          timestamp: new Date().toISOString(),
          executionTimeMs: Date.now() - startTime,
          telemetry: telemetryEnabled ? {
            inputComponentCount: input.components.length,
            inputRelationshipCount: input.relationships ? input.relationships.length : 0,
            strategy: input.strategy || 'default'
          } : undefined,
        },
      };

      // Emit success event
      eventEmitter.emit('reconstructionComplete', {
        requestId,
        result,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during reconstruction';
      
      // Emit error event
      eventEmitter.emit('reconstructionError', {
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
    reconstruct
  };
};

export default create${modelId}Model;`;

// Template for types.ts
const typesTemplate = (modelId) => `import { EventEmitter } from 'events';

export interface ReconstructionComponent {
  /** Unique identifier for the component */
  id: string;
  
  /** Type/category of the component */
  type: string;
  
  /** Properties of the component */
  properties: Record<string, any>;
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}

export interface ReconstructionRelationship {
  /** Unique identifier for the relationship */
  id: string;
  
  /** Type of relationship */
  type: string;
  
  /** IDs of the source and target components */
  source: string;
  target: string;
  
  /** Properties of the relationship */
  properties?: Record<string, any>;
}

export interface ReconstructionInput {
  /** Unique identifier for the system being reconstructed */
  systemId?: string;
  
  /** Name of the system */
  name?: string;
  
  /** Components to be reconstructed */
  components: ReconstructionComponent[];
  
  /** Relationships between components */
  relationships?: ReconstructionRelationship[];
  
  /** Strategy for reconstruction */
  strategy?: 'default' | 'optimize' | 'minimal' | 'comprehensive';
  
  /** Additional context for the reconstruction */
  context?: Record<string, any>;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface ReconstructionMetrics {
  /** Number of components in the reconstructed system */
  componentCount: number;
  
  /** Number of relationships in the reconstructed system */
  relationshipCount: number;
  
  /** Time taken for reconstruction in milliseconds */
  reconstructionTimeMs: number;
  
  /** Improvement metric (0-1) */
  improvement: number;
  
  /** Any additional metrics */
  [key: string]: any;
}

export interface ReconstructionOutput {
  /** Unique identifier for this reconstruction */
  id: string;
  
  /** The reconstructed system */
  system: {
    id: string;
    name: string;
    components: ReconstructionComponent[];
    relationships: ReconstructionRelationship[];
    metadata: Record<string, any>;
  };
  
  /** Metrics about the reconstruction */
  metrics: ReconstructionMetrics;
  
  /** Additional metadata */
  metadata: {
    /** Version of the model */
    modelVersion: string;
    
    /** When the reconstruction was performed */
    timestamp: string;
    
    /** How long the reconstruction took in milliseconds */
    executionTimeMs: number;
    
    /** Telemetry data (if enabled) */
    telemetry?: {
      /** Number of input components */
      inputComponentCount: number;
      
      /** Number of input relationships */
      inputRelationshipCount: number;
      
      /** Reconstruction strategy used */
      strategy: string;
      
      /** Any additional telemetry data */
      [key: string]: any;
    };
  };
}

export interface ReconstructionConfig {
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

export const DEFAULT_CONFIG: ReconstructionConfig = {
  name: '${modelId}',
  version: '1.0.0',
  eventEmitter: new EventEmitter(),
  telemetryEnabled: false,
  logger: console,
};

// Event types
export interface ReconstructionCompleteEvent {
  requestId: string;
  result: ReconstructionOutput;
  timestamp: string;
}

export interface ReconstructionErrorEvent {
  requestId: string;
  error: string;
  timestamp: string;
}

export type ReconstructionEventHandler<T> = (event: T) => void;

declare global {
  interface Window {
    ${modelId}Analytics?: {
      onReconstructionComplete: (handler: ReconstructionEventHandler<ReconstructionCompleteEvent>) => void;
      onReconstructionError: (handler: ReconstructionEventHandler<ReconstructionErrorEvent>) => void;
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
  name: '${modelId} Reconstruction Model',
  description: 'Reassemblies components into a coherent system with improved structure and relationships',
  version: '1.0.0',
  author: 'HUMMBL',
  createdAt: '2025-10-23',
  updatedAt: '2025-10-23'
};

/** Default component types */
export const COMPONENT_TYPES = [
  'service',
  'data',
  'ui',
  'api',
  'database',
  'cache',
  'queue',
  'storage'
];

/** Default relationship types */
export const RELATIONSHIP_TYPES = [
  'depends_on',
  'uses',
  'extends',
  'implements',
  'calls',
  'references',
  'contains',
  'belongs_to'
];

/** Error messages */
export const ERRORS = {
  INVALID_INPUT: 'Input must be an object',
  MISSING_COMPONENTS: 'Input must contain a non-empty "components" array',
  RECONSTRUCTION_FAILED: 'Failed to reconstruct system'
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
      telemetryEnabled: true
    });
  });
  
  it('should create a model with default config', () => {
    expect(model).toBeDefined();
    expect(model.id).toBe('${modelId}');
    expect(model.name).toBe('${modelId}');
    expect(model.version).toBe('1.0.0');
    expect(typeof model.reconstruct).toBe('function');
  });
  
  it('should reconstruct a system from components', async () => {
    const input = {
      systemId: 'test-system',
      name: 'Test System',
      components: [
        { id: 'c1', type: 'service', properties: { name: 'Service A' } },
        { id: 'c2', type: 'database', properties: { name: 'Database A' } }
      ],
      relationships: [
        { id: 'r1', source: 'c1', target: 'c2', type: 'uses' }
      ]
    };
    
    const result = await model.reconstruct(input);
    
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.system.id).toBe('test-system');
    expect(result.system.name).toBe('Test System');
    expect(result.system.components).toHaveLength(2);
    expect(result.system.relationships).toHaveLength(1);
    expect(result.metrics.componentCount).toBe(2);
    expect(result.metrics.relationshipCount).toBe(1);
    expect(mockEventEmit).toHaveBeenCalledWith('reconstructionComplete', expect.anything());
  });
  
  it('should generate relationships if none provided', async () => {
    const input = {
      components: [
        { id: 'c1', type: 'service', properties: { name: 'Service A' } },
        { id: 'c2', type: 'database', properties: { name: 'Database A' } },
        { id: 'c3', type: 'cache', properties: { name: 'Cache A' } }
      ],
      strategy: 'optimize'
    };
    
    const result = await model.reconstruct(input);
    
    expect(result.system.relationships.length).toBeGreaterThan(0);
    expect(result.system.relationships[0]).toHaveProperty('source');
    expect(result.system.relationships[0]).toHaveProperty('target');
  });
  
  it('should include telemetry when enabled', async () => {
    const input = {
      components: [
        { id: 'c1', type: 'service', properties: { name: 'Service A' } },
        { id: 'c2', type: 'database', properties: { name: 'Database A' } }
      ],
      context: { userId: 'test-user' }
    };
    
    const result = await model.reconstruct(input);
    
    expect(result.metadata.telemetry).toBeDefined();
    expect(result.metadata.telemetry.inputComponentCount).toBe(2);
    expect(result.metadata.telemetry.strategy).toBe('default');
  });
  
  it('should handle errors for invalid input', async () => {
    // Test with missing components
    await expect(model.reconstruct({})).rejects.toThrow('must contain a non-empty "components" array');
    
    // Test with empty components array
    await expect(model.reconstruct({ components: [] })).rejects.toThrow('must contain a non-empty "components" array');
  });
  
  it('should emit error events on failure', async () => {
    const testEmitter = new EventEmitter();
    const errorSpy = vi.fn();
    testEmitter.on('reconstructionError', errorSpy);
    
    const failingModel = create${modelId}Model({
      eventEmitter: testEmitter,
    });
    
    await expect(failingModel.reconstruct({})).rejects.toThrow();
    
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const eventData = errorSpy.mock.calls[0][0];
    expect(eventData).toHaveProperty('error');
    expect(eventData).toHaveProperty('requestId');
    expect(eventData).toHaveProperty('timestamp');
    expect(typeof eventData.error).toBe('string');
    expect(eventData.error).toContain('must contain a non-empty "components" array');
  });
});`;

// Template for README.md
const readmeTemplate = (modelId) => `# ${modelId}: Reconstruction Model

## Overview
This model implements the Reconstruction mental model by reassembling components into a coherent system with improved structure and relationships.

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

// Reconstruct a system from components
const result = await model.reconstruct({
  systemId: 'example-system',
  name: 'Example System',
  components: [
    { 
      id: 'auth-service',
      type: 'service',
      properties: { 
        name: 'Authentication Service',
        language: 'TypeScript',
        repository: 'https://github.com/example/auth-service'
      }
    },
    {
      id: 'user-db',
      type: 'database',
      properties: {
        name: 'User Database',
        type: 'PostgreSQL',
        version: '13.0'
      }
    }
  ],
  relationships: [
    {
      id: 'auth-to-db',
      source: 'auth-service',
      target: 'user-db',
      type: 'uses',
      properties: {
        description: 'Stores and retrieves user authentication data',
        authentication: 'credentials'
      }
    }
  ],
  strategy: 'optimize',
  context: {
    environment: 'production',
    team: 'identity'
  },
  metadata: {
    source: 'user-request',
    priority: 'high'
  }
});

console.log('Reconstructed System:', result.system);
console.log('Metrics:', result.metrics);
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
- \`reconstruct\` (function): The reconstruction function

### reconstruct(input)

Reconstructs a system from its components and relationships.

**Parameters:**
- \`input\` (object): The input to reconstruct
  - \`systemId\` (string, optional): Unique identifier for the system
  - \`name\` (string, optional): Name of the system
  - \`components\` (ReconstructionComponent[]): Components to be reconstructed
  - \`relationships\` (ReconstructionRelationship[], optional): Relationships between components
  - \`strategy\` (string, optional): Reconstruction strategy ('default', 'optimize', 'minimal', 'comprehensive')
  - \`context\` (object, optional): Additional context
  - \`metadata\` (object, optional): Additional metadata

**Returns:**
A Promise that resolves to a reconstruction result object.

## Events

The model emits the following events:

### reconstructionComplete
Emitted when reconstruction is successfully completed.

**Event Data:**
- \`requestId\` (string): Unique ID for the request
- \`result\` (object): The reconstruction result
- \`timestamp\` (string): ISO timestamp of when the event was emitted

### reconstructionError
Emitted when an error occurs during reconstruction.

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

// Generate models RE3-RE20
async function generateReconstructionModels() {
  const startTime = Date.now();
  const models = [];
  
  // Generate model IDs RE3 through RE20
  for (let i = 3; i <= 20; i++) {
    const modelId = `RE${i.toString().padStart(2, '0')}`;
    models.push(modelId);
  }
  
  console.log(`Generating ${models.length} Reconstruction models (RE3-RE20)...`);
  
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
    await generateReconstructionModels();
    console.log('\n🎉 Reconstruction model generation complete!');
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
