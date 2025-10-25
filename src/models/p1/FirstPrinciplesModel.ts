import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import {
  FirstPrinciplesModel,
  FirstPrinciplesConfig,
  FirstPrinciplesInput,
  FirstPrinciplesOutput,
  TelemetryData,
  LedgerEntry,
  LedgerEntryType,
  QualityMetrics,
  ComponentRelationship,
  TemporalSequence
} from './types';
import { P1_CONSTANTS } from './constants';

// ============================================================================
// VALIDATION
// ============================================================================

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: Required<FirstPrinciplesConfig> = {
  id: 'p1',
  name: P1_CONSTANTS.MODEL_NAME,
  description: 'First Principles Model for breaking down complex problems into fundamental truths',
  version: '1.0.0',
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    fallbackModel: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY || ''
  },
  sla: {
    timeoutMs: 5000,
    maxRetries: 3,
    requiredSuccessRate: 0.95
  },
  logger: console,
  eventEmitter: new EventEmitter(),
  telemetryEnabled: true
};

// ============================================================================
// AI PROVIDER INTERFACE
// ============================================================================

interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
  
  getState(): string {
    return this.state;
  }
}

// ============================================================================
// MAIN IMPLEMENTATION
// ============================================================================

export class FirstPrinciplesModelImpl implements FirstPrinciplesModel {
  private config: Required<FirstPrinciplesConfig>;
  private eventEmitter: EventEmitter;
  private telemetryQueue: TelemetryData[] = [];
  private requestCount = 0;
  private errorCount = 0;
  private ledgerEntries: LedgerEntry[] = [];
  private circuitBreaker: CircuitBreaker;
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  // Pattern synonyms for relationship detection
  private patternSynonyms = {
    temporal: ['first', 'then', 'next', 'finally', 'before', 'after', 'during', 'while', 'until', 'since', 'starting from', 'beginning with'],
    causal: ['because', 'since', 'therefore', 'thus', 'as a result', 'leads to', 'causes', 'due to', 'results in'],
    constraint: ['must', 'should', 'cannot', 'need to', 'have to', 'required to', 'constraint', 'limit', 'restriction']
  };

  // Temporal markers for sequence detection
  private temporalMarkers = [
    { pattern: /first|initially|start/i, order: 0 },
    { pattern: /then|next|after that|following that/i, order: 1 },
    { pattern: /finally|last|in the end|ultimately/i, order: 2 },
    { pattern: /before|prior to|ahead of/i, order: -1 },
    { pattern: /after|following|subsequent to/i, order: 1 },
    { pattern: /during|while|whilst|at the same time/i, order: 0 },
    { pattern: /until|till|up to/i, order: 1 },
    { pattern: /since|starting from|beginning with/i, order: 0 },
    { 
      pattern: /(\d+)(?:st|nd|rd|th)?\s+(?:step|phase|stage|part)/i, 
      order: (match: RegExpMatchArray) => parseInt(match[1]) - 1 
    }
  ];

  /**
   * Checks if the given text matches any of the patterns for the specified type
   * @param text The text to check
   * @param patternType The type of pattern to check against (temporal, causal, constraint)
   * @returns True if any pattern matches, false otherwise
   */
  private matchesPattern(text: string, patternType: keyof typeof this.patternSynonyms): boolean {
    const patterns = this.patternSynonyms[patternType];
    const lowerText = text.toLowerCase();
    return patterns.some(pattern => lowerText.includes(pattern));
  }

  /**
   * Checks if a word is a common word or too short to be significant
   * @param word The word to check
   * @returns True if the word is common or too short, false otherwise
   */
  private isCommonWord(word: string): boolean {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return commonWords.includes(word.toLowerCase()) || word.length < 3;
  }

  /**
   * Analyzes sentences in a problem statement to identify their types and confidence levels
   * @param problem The problem statement to analyze
   * @returns Array of objects containing sentence text, type, and confidence
   */
  private analyzeSentences(problem: string): Array<{text: string, type: string, confidence: number}> {
    // Split the problem into sentences using common sentence terminators
    const sentences = problem.split(/(?<=[.!?])\s+/);
    const results = [];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      let type = 'fact';
      let confidence = 0.7; // Base confidence for neutral/factual statements

      // Check for different patterns that indicate specific types
      if (this.matchesPattern(trimmed, 'temporal')) {
        type = 'temporal';
        confidence = 0.85;
      } else if (this.matchesPattern(trimmed, 'causal')) {
        type = 'causal';
        confidence = 0.8;
      } else if (this.matchesPattern(trimmed, 'constraint')) {
        type = 'constraint';
        confidence = 0.9;
      }

      // Adjust confidence based on sentence length and complexity
      const wordCount = trimmed.split(/\s+/).length;
      if (wordCount > 15) {
        confidence = Math.min(0.95, confidence + 0.1);
      } else if (wordCount < 5) {
        confidence = Math.max(0.5, confidence - 0.2);
      }

      results.push({
        text: trimmed,
        type,
        confidence: Math.round(confidence * 100) / 100 // Round to 2 decimal places
      });
    }

    return results;
  }

  /**
   * Assesses the complexity and 'wickedness' of a problem by analyzing its components and assumptions
   * @param problem The original problem statement
   * @param components Decomposed components of the problem
   * @param assumptions Identified assumptions about the problem
   * @returns QualityMetrics object with various complexity scores
   */
  private assessWickedness(
    problem: string,
    components: string[],
    assumptions: string[]
  ): QualityMetrics {
    // 1. Calculate alignment between problem and components
    const alignmentScore = this.calculateAlignmentScore(components, problem);
    
    // 2. Calculate trace fidelity (how well components map to the problem)
    const traceFidelity = this.calculateTraceFidelity(components);
    
    // 3. Calculate entropy delta (reduction in uncertainty from problem to components)
    const entropyDelta = this.calculateEntropyDelta(problem, components);
    
    // 4. Analyze relationships between components
    const relationships = this.detectRelationships(components, problem) || [];
    const relationshipCoverage = components.length > 0 
      ? relationships.length / components.length 
      : 0;
    
    // 5. Analyze temporal sequence if present
    const temporalSequence = this.extractTemporalSequence(components) || [];
    const temporalConsistency = this.analyzeTemporalConsistency(temporalSequence);
    
    // 6. Calculate wickedness score based on various factors
    const wickednessScore = this.calculateWickednessScore(
      problem, 
      components, 
      assumptions,
      relationships,
      temporalSequence
    );
    
    return {
      alignmentScore,
      traceFidelity,
      entropyDelta,
      relationshipCoverage,
      temporalConsistency,
      wickednessScore
    };
  }

  /**
   * Helper method to analyze temporal consistency of components
   */
  private analyzeTemporalConsistency(sequence: TemporalSequence[]): number {
    if (sequence.length === 0) return 1.0; // No temporal constraints means perfect consistency
    
    // Check if sequence is properly ordered
    const sorted = [...sequence].sort((a, b) => a.order - b.order);
    let inconsistencies = 0;
    
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].order > sorted[i + 1].order) {
        inconsistencies++;
      }
    }
    
    // Calculate consistency score (1.0 is perfect, 0.0 is completely inconsistent)
    return Math.max(0, 1 - (inconsistencies / (sequence.length - 1)));
  }

  /**
   * Calculates an overall wickedness score for the problem
   */
  private calculateWickednessScore(
    problem: string,
    components: string[],
    assumptions: string[],
    relationships: ComponentRelationship[],
    temporalSequence: TemporalSequence[]
  ): number {
    // Base score starts at 0.5 (neutral)
    let score = 0.5;
    
    // Adjust based on number of components (more components = more complex)
    score += Math.min(0.3, components.length * 0.05);
    
    // Adjust based on number of assumptions (more assumptions = more uncertainty)
    score += Math.min(0.3, assumptions.length * 0.05);
    
    // Adjust based on relationship complexity
    const relationshipScore = relationships.length > 0 
      ? relationships.filter(r => r.type === 'conflict').length / relationships.length
      : 0;
    score += relationshipScore * 0.2;
    
    // Normalize to 0-1 range
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculates the confidence score for the analysis based on problem complexity and solution quality
   * @param problem The original problem statement
   * @param components Decomposed components of the problem
   * @param assumptions Identified assumptions about the problem
   * @param fundamentalTruths Extracted fundamental truths
   * @returns A confidence score between 0 and 1 (1 = highest confidence)
   */
  private calculateConfidence(
    problem: string,
    components: string[],
    assumptions: string[],
    fundamentalTruths: string[]
  ): number {
    // Get quality metrics from assessWickedness
    const metrics = this.assessWickedness(problem, components, assumptions);
    
    // Base confidence starts with alignment score (how well components match the problem)
    let confidence = metrics.alignmentScore * 0.4; // 40% weight
    
    // Add component quality factor (more components can mean better decomposition but also more complexity)
    const componentFactor = Math.min(1, components.length / 5); // Normalize by max expected components
    confidence += componentFactor * 0.2; // 20% weight
    
    // Consider assumption coverage (fewer assumptions = higher confidence)
    const assumptionCoverage = assumptions.length > 0 
      ? 1 / (1 + Math.log(assumptions.length + 1)) 
      : 1.0;
    confidence += assumptionCoverage * 0.2; // 20% weight
    
    // Factor in fundamental truths (more truths = higher confidence)
    const truthFactor = Math.min(1, fundamentalTruths.length / 3); // Normalize
    confidence += truthFactor * 0.2; // 20% weight
    
    // Apply entropy delta (reduction in uncertainty)
    confidence *= (1 + metrics.entropyDelta) / 2;
    
    // Apply temporal consistency factor
    confidence *= metrics.temporalConsistency;
    
    // Apply relationship coverage factor
    confidence *= 0.5 + (metrics.relationshipCoverage / 2);
    
    // Final normalization and bounds checking
    confidence = Math.max(0, Math.min(1, confidence));
    
    // Round to 2 decimal places for cleaner output
    return Math.round(confidence * 100) / 100;
  }

  /**
   * Analyzes components to detect relationships between them
   * @param components Array of decomposed problem components
   * @param originalProblem The original problem statement for context
   * @returns Array of detected relationships with confidence scores
   */
  private detectRelationships(
    components: string[],
    originalProblem: string
  ): ComponentRelationship[] {
    const relationships: ComponentRelationship[] = [];
    
    // If we don't have enough components, return empty array
    if (components.length < 2) {
      return [];
    }

    // Look for relationships between each pair of components
    for (let i = 0; i < components.length; i++) {
      for (let j = 0; j < components.length; j++) {
        if (i === j) continue; // Skip self-comparison

        const fromComp = components[i];
        const toComp = components[j];
        let relationship: Omit<ComponentRelationship, 'from' | 'to'> | null = null;

        // Check for temporal relationships (before/after)
        if (this.matchesPattern(fromComp, 'temporal')) {
          relationship = {
            type: 'temporal',
            confidence: 0.85,
            evidence: `Temporal marker found in component ${i + 1}`
          };
        }
        // Check for causal relationships (because, leads to, results in)
        else if (this.matchesPattern(fromComp, 'causal')) {
          relationship = {
            type: 'causal',
            confidence: 0.8,
            evidence: `Causal indicator found in component ${i + 1}`
          };
        }
        // Check for constraint relationships (must, should, cannot)
        else if (this.matchesPattern(fromComp, 'constraint')) {
          relationship = {
            type: 'enabler', // Constraints often enable or block other components
            confidence: 0.75,
            evidence: `Constraint found in component ${i + 1}`
          };
        }
        // Check for direct references between components
        else if (this.componentsReferenceEachOther(fromComp, toComp)) {
          relationship = {
            type: 'dependency',
            confidence: 0.9,
            evidence: `Direct reference between components ${i + 1} and ${j + 1}`
          };
        }

        // If we found a relationship, add it to the results
        if (relationship) {
          relationships.push({
            from: i,
            to: j,
            ...relationship
          });
        }
      }
    }

    // Check for conflicts (components that seem to contradict each other)
    this.detectConflicts(components, relationships);

    return relationships;
  }

  /**
   * Helper method to detect if two components reference each other
   */
  private componentsReferenceEachOther(comp1: string, comp2: string): boolean {
    // Simple implementation: check if any significant words from one component appear in the other
    const words1 = comp1.split(/\s+/).filter(word => !this.isCommonWord(word));
    const words2 = comp2.split(/\s+/).filter(word => !this.isCommonWord(word));
    
    return words1.some(word => 
      words2.some(otherWord => 
        word.length > 3 && otherWord.toLowerCase().includes(word.toLowerCase())
      )
    );
  }

  /**
   * Detects conflicts between components and adds them to the relationships array
   */
  private detectConflicts(components: string[], relationships: ComponentRelationship[]): void {
    const conflictWords = ['but', 'however', 'although', 'despite', 'whereas'];
    
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const hasConflict = conflictWords.some(word => 
          components[i].toLowerCase().includes(word) || 
          components[j].toLowerCase().includes(word)
        );
        
        if (hasConflict) {
          relationships.push({
            from: i,
            to: j,
            type: 'conflict',
            confidence: 0.8,
            evidence: `Conflict indicator found between components ${i + 1} and ${j + 1}`
          });
        }
      }
    }
  }

  /**
   * Extracts and orders temporal sequences from components
   * @param components Array of decomposed problem components
   * @returns Array of temporal sequences with order and timing information
   */
  private extractTemporalSequence(components: string[]): TemporalSequence[] {
    const sequences: TemporalSequence[] = [];
    
    // If no components, return empty array
    if (!components.length) {
      return [];
    }

    // Process each component for temporal markers
    components.forEach((component, index) => {
      const lowerComponent = component.toLowerCase();
      let order = -1; // Default order for components without explicit markers
      let timing: string | undefined;

      // Check each temporal marker pattern
      for (const marker of this.temporalMarkers) {
        const match = lowerComponent.match(marker.pattern);
        if (match) {
          // If the order is a function, call it with the match
          order = typeof marker.order === 'function' 
            ? marker.order(match) 
            : marker.order;
          
          // Extract timing information if present
          const timingMatch = component.match(/(within|by|before|after|in)\s+([^.?!]+)([.?!]|$)/i);
          if (timingMatch) {
            timing = timingMatch[0].trim();
          }
          break; // Stop checking other markers once one is found
        }
      }

      // If no explicit order but it's the first component, assume it's first
      if (order === -1 && index === 0) {
        order = 0;
      }
      // If still no order and not first component, assign incremental order
      else if (order === -1) {
        order = sequences.length > 0 
          ? Math.max(...sequences.map(s => s.order)) + 1 
          : 0;
      }

      sequences.push({
        component: index, // Reference to the component index
        order,
        timing
      });
    });

    // Sort sequences by their order
    return sequences.sort((a, b) => a.order - b.order);
  }

  constructor(config: FirstPrinciplesConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.eventEmitter = this.config.eventEmitter || new EventEmitter();
    this.circuitBreaker = new CircuitBreaker(5, 60000);
    
    // Start cleanup interval for memory management
    this.startCleanupInterval();
  }

  // ============================================================================
  // PUBLIC INTERFACE
  // ============================================================================

  get id(): string {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  get version(): string {
    return this.config.version;
  }

  // ============================================================================
  // EVENT HANDLING
  // ============================================================================

  public on(event: 'analysis:start', listener: (input: FirstPrinciplesInput) => void): this;
  public on(event: 'analysis:complete', listener: (output: FirstPrinciplesOutput) => void);
  public on(event: 'error', listener: (error: Error) => void): this;
  public on(event: 'telemetry', listener: (data: TelemetryData) => void): this;
  public on(event: string, listener: (...args: any[]) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }

  public removeListener(event: string, listener: (...args: any[]) => void): this {
    this.eventEmitter.removeListener(event, listener);
    return this;
  }

  // ============================================================================
  // VISUALIZATION
  // ============================================================================

  public async generateVisualization(data: FirstPrinciplesOutput): Promise<string> {
    try {
      // Simple text-based visualization
      const visualization = [
        'First Principles Analysis:',
        '=========================',
        `Problem: ${data.problem}`,
        '',
        'Decomposed:',
        ...data.decomposed.map((item, i) => `  ${i + 1}. ${item}`),
        '',
        'Assumptions:',
        ...data.assumptions.map((item, i) => `  ${i + 1}. ${item}`),
        '',
        'Fundamental Truths:',
        ...data.fundamentalTruths.map((item, i) => `  ${i + 1}. ${item}`),
        '',
        'Solution:',
        data.solution,
        '',
        `Generated at: ${new Date().toISOString()}`
      ].join('\n');

      return visualization;
    } catch (error) {
      this.config.logger?.error('Error generating visualization:', error);
      throw new Error('Failed to generate visualization');
    }
  }

  public async analyze(input: unknown): Promise<FirstPrinciplesOutput> {
    const startTime = process.hrtime();
    let requestId: string;
    
    try {
      // Validate input synchronously before any async operations
      this.validateInput(input);
      
      // At this point, TypeScript knows input is FirstPrinciplesInput
      const validatedInput = input as FirstPrinciplesInput;
      requestId = (validatedInput as any).metadata?.requestId || uuidv4();
      // Log analysis start
      await this.logToLedger('analysis_start', {
        ...validatedInput,
        metadata: { ...validatedInput.metadata, requestId }
      });

      this.requestCount++;
      
      // Emit analysis start event
      this.eventEmitter.emit('analysis:start', { 
        ...validatedInput, 
        metadata: { 
          ...validatedInput.metadata, 
          requestId,
          timestamp: new Date().toISOString()
        } 
      });
      
      // Execute with SLA enforcement
      const result = await this.withSLA(async () => {
        // Emit analysis progress event
        this.eventEmitter.emit('analysis:progress', {
          stage: 'decomposing',
          progress: 0.25,
          metadata: { requestId }
        });
        
        // Decompose the problem
        // Decompose the problem
        const { components, telemetry: decomposeTelemetry } = await this.decomposeProblem(
          validatedInput.problem,
          validatedInput.context
        );
        
        // Emit progress update
        this.eventEmitter.emit('analysis:progress', {
          stage: 'identifying_assumptions',
          progress: 0.5,
          metadata: { 
            requestId,
            componentsCount: components.length 
          }
        });
        
        // Identify assumptions
        const { assumptions, telemetry: assumptionsTelemetry } = await this.identifyAssumptions(
          input.problem,
          components
        );
        
        // Emit progress update
        this.eventEmitter.emit('analysis:progress', {
          stage: 'extracting_truths',
          progress: 0.75,
          metadata: { 
            requestId,
            assumptionsCount: assumptions.length 
          }
        });
        
        // Extract fundamental truths
        const { truths, telemetry: truthsTelemetry } = await this.extractFundamentalTruths(
          input.problem,
          components,
          assumptions
        );
        
        // Rebuild solution
        const { solution, telemetry: solutionTelemetry } = await this.rebuildSolution(
          input.problem,
          truths,
          input.context
        );
        
        // Assess problem wickedness and get quality metrics
        const qualityMetrics = this.assessWickedness(
          input.problem,
          components,
          assumptions
        );
        
        // Generate visualization if requested
        let visualization: string | undefined;
        if (input.options?.includeVisualization) {
          visualization = await this.generateVisualization({
            id: requestId,
            problem: input.problem,
            decomposed: components,
            assumptions,
            fundamentalTruths: truths,
            solution,
            metadata: {
              modelVersion: this.version,
              timestamp: new Date().toISOString(),
              executionTimeMs: this.calculateElapsedTime(startTime),
              telemetry: this.aggregateTelemetry([
                decomposeTelemetry,
                assumptionsTelemetry,
                truthsTelemetry,
                solutionTelemetry
              ])
            }
          });
        }
        
        // Prepare the result object with all analysis data
        const result = {
          id: requestId,
          problem: input.problem,
          decomposed: components,
          assumptions,
          fundamentalTruths: truths,
          solution,
          wickednessScore: qualityMetrics.wickednessScore,
          ...(visualization && { visualization }),
          metadata: {
            modelVersion: this.version,
            timestamp: new Date().toISOString(),
            executionTimeMs: this.calculateElapsedTime(startTime),
            qualityMetrics, // Include full quality metrics in metadata
            telemetry: this.aggregateTelemetry([
              decomposeTelemetry,
              assumptionsTelemetry,
              truthsTelemetry,
              solutionTelemetry
            ])
          }
        };
        
        return result;
      }, requestId);
      
      // Log successful completion
      await this.logToLedger('analysis_complete', {
        ...result,
        metadata: {
          ...result.metadata,
          requestId,
          executionTimeMs: result.metadata.executionTimeMs
        }
      });

      this.eventEmitter.emit('analysis:complete', result);
      this.emitTelemetry(result.metadata.telemetry);
      
      return result;
      
    } catch (error) {
      this.errorCount++;
      
      // Get requestId from input if available
      let errorRequestId = uuidv4();
      if (input && typeof input === 'object' && input !== null && 'metadata' in input) {
        const metadata = (input as { metadata?: unknown }).metadata;
        if (metadata && typeof metadata === 'object' && 'requestId' in metadata) {
          const requestId = (metadata as { requestId?: unknown }).requestId;
          if (typeof requestId === 'string') {
            errorRequestId = requestId;
          }
        }
      }
      
      // Log the error to the ledger
      await this.logToLedger('analysis_error', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        requestId: errorRequestId,
        executionTimeMs: this.calculateElapsedTime(startTime)
      });
      
      // Emit error event
      const errorToEmit = error instanceof Error ? error : new Error(String(error));
      this.eventEmitter.emit('analysis:error', errorToEmit);
      
      throw errorToEmit;
    }
  }
  
  public async decomposeProblem(
    problem: string,
    context?: Record<string, any>
  ): Promise<{ components: string[]; telemetry: TelemetryData }> {
    const startTime = process.hrtime();
    
    try {
      await this.logToLedger('decompose_problem', { problem, context });
      
      const prompt = this.buildDecomposePrompt(problem, context);
      const aiResponse = await this.callAIWithFallback(prompt);
      
      // Parse AI response to extract components
      const components = this.parseDecomposeResponse(aiResponse.content);
      
      const telemetry: TelemetryData = {
        alignmentScore: this.calculateAlignmentScore(components, problem),
        traceFidelity: this.calculateTraceFidelity(components),
        entropyDelta: this.calculateEntropyDelta(problem, components),
        executionTimeMs: this.calculateElapsedTime(startTime),
        memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
        timestamp: new Date().toISOString()
      };
      
      this.emitTelemetry(telemetry);
      
      return { components, telemetry };
      
    } catch (error) {
      this.errorCount++;
      this.eventEmitter.emit('error', error);
      throw error;
    }
  }
  
  public async identifyAssumptions(
    problem: string,
    components: string[]
  ): Promise<{ assumptions: string[]; telemetry: TelemetryData }> {
    const startTime = process.hrtime();
    
    try {
      await this.logToLedger('identify_assumptions', { problem, components });
      
      const prompt = this.buildAssumptionsPrompt(problem, components);
      const aiResponse = await this.callAIWithFallback(prompt);
      
      // Parse AI response to extract assumptions
      const assumptions = this.parseAssumptionsResponse(aiResponse.content);
      
      const telemetry: TelemetryData = {
        alignmentScore: this.calculateAlignmentScore(assumptions, problem),
        traceFidelity: this.calculateTraceFidelity(assumptions),
        entropyDelta: this.calculateEntropyDelta(components.join(' '), assumptions),
        executionTimeMs: this.calculateElapsedTime(startTime),
        memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
        timestamp: new Date().toISOString()
      };
      
      this.emitTelemetry(telemetry);
      
      return { assumptions, telemetry };
      
    } catch (error) {
      this.errorCount++;
      this.eventEmitter.emit('error', error);
      throw error;
    }
  }
  
  public async extractFundamentalTruths(
    problem: string,
    components: string[],
    assumptions: string[]
  ): Promise<{ truths: string[]; telemetry: TelemetryData }> {
    const startTime = process.hrtime();
    
    try {
      await this.logToLedger('extract_truths', { problem, components, assumptions });
      
      const prompt = this.buildTruthsPrompt(problem, components, assumptions);
      const aiResponse = await this.callAIWithFallback(prompt);
      
      // Parse AI response to extract fundamental truths
      const truths = this.parseTruthsResponse(aiResponse.content);
      
      const telemetry: TelemetryData = {
        alignmentScore: this.calculateAlignmentScore(truths, problem),
        traceFidelity: this.calculateTraceFidelity(truths),
        entropyDelta: this.calculateEntropyDelta(assumptions.join(' '), truths),
        executionTimeMs: this.calculateElapsedTime(startTime),
        memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
        timestamp: new Date().toISOString()
      };
      
      this.emitTelemetry(telemetry);
      
      return { truths, telemetry };
      
    } catch (error) {
      this.errorCount++;
      this.eventEmitter.emit('error', error);
      throw error;
    }
  }
  
  public async rebuildSolution(
    problem: string,
    truths: string[],
    context?: Record<string, any>
  ): Promise<{ solution: string; telemetry: TelemetryData }> {
    const startTime = process.hrtime();
    
    try {
      await this.logToLedger('rebuild_solution', { problem, truths, context });
      
      const prompt = this.buildSolutionPrompt(problem, truths, context);
      const aiResponse = await this.callAIWithFallback(prompt);
      
      const solution = aiResponse.content.trim();
      
      const telemetry: TelemetryData = {
        alignmentScore: this.calculateAlignmentScore([solution], problem),
        traceFidelity: this.calculateTraceFidelity([solution]),
        entropyDelta: this.calculateEntropyDelta(truths.join(' '), [solution]),
        executionTimeMs: this.calculateElapsedTime(startTime),
        memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
        timestamp: new Date().toISOString()
      };
      
      this.emitTelemetry(telemetry);
      
      return { solution, telemetry };
      
    } catch (error) {
      this.errorCount++;
      this.cleanupInterval = null;
    }
    
    this.flushTelemetry();
    this.ledgerEntries = [];
    this.eventEmitter.removeAllListeners();
  }

  // ============================================================================
  // PRIVATE METHODS - AI INTEGRATION
  // ============================================================================

  private async callAIWithFallback(prompt: string): Promise<AIResponse> {
    return this.circuitBreaker.execute(async () => {
      try {
        return await this.callAI(prompt, this.config.ai.model);
      } catch (error) {
        if (this.config.ai.fallbackModel) {
          this.config.logger?.warn(`Primary model failed, using fallback: ${this.config.ai.fallbackModel}`);
          return await this.callAI(prompt, this.config.ai.fallbackModel);
        }
        throw error;
      }
    });
  }

  private async callAI(prompt: string, model: string): Promise<AIResponse> {
    const { provider, apiKey, temperature, maxTokens } = this.config.ai;
    
    if (!apiKey) {
      // Deterministic fallback when no API key
      return this.deterministicFallback(prompt, model);
    }
    
    switch (provider) {
      case 'openai':
        return this.callOpenAI(prompt, model, temperature, maxTokens, apiKey);
      case 'anthropic':
        return this.callAnthropic(prompt, model, temperature, maxTokens, apiKey);
      case 'cohere':
        return this.callCohere(prompt, model, temperature, maxTokens, apiKey);
      case 'local':
        return this.deterministicFallback(prompt, model);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private async callOpenAI(
    prompt: string,
    model: string,
    temperature?: number,
    maxTokens?: number,
    apiKey?: string
  ): Promise<AIResponse> {
    // OpenAI API call implementation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens ?? 2048
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
      model: data.model
    };
  }

  private async callAnthropic(
    prompt: string,
    model: string,
    temperature?: number,
    maxTokens?: number,
    apiKey?: string
  ): Promise<AIResponse> {
    // Anthropic API call implementation
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens ?? 2048
      })
    });
    
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.content[0].text,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      model: data.model
    };
  }

  private async callCohere(
    prompt: string,
    model: string,
    temperature?: number,
    maxTokens?: number,
    apiKey?: string
  ): Promise<AIResponse> {
    // Cohere API call implementation
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens ?? 2048
      })
    });
    
    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.generations[0].text,
      tokensUsed: data.meta.billed_units.input_tokens + data.meta.billed_units.output_tokens,
      model: model
    };
  }

  private deterministicFallback(_prompt: string, model: string): AIResponse {
    // Simple fallback implementation
    return {
      content: `I'm unable to process this request at the moment. Please try again later.`,
      tokensUsed: 0,
      model: model || 'fallback-model'
    };
  }

  // ============================================================================
  // PRIVATE METHODS - PROMPT BUILDING
  // ============================================================================

  private buildDecomposePrompt(problem: string, context?: Record<string, any>): string {
    return `Decompose the following problem into its fundamental components:

Problem: ${problem}
${context ? `Context: ${JSON.stringify(context, null, 2)}` : ''}

Break this down into 3-7 core components. Each component should be a distinct aspect of the problem.
Return ONLY a JSON array of strings, no additional text.

Example format: ["component 1", "component 2", "component 3"]`;
  }

  private buildAssumptionsPrompt(problem: string, components: string[]): string {
    return `Identify the hidden assumptions in the following problem:

Problem: ${problem}

Components:
${components.map((c, i) => `${i + 1}. ${c}`).join('\n')}

List 3-7 assumptions that are being made about this problem or its components.
Return ONLY a JSON array of strings, no additional text.

Example format: ["assumption 1", "assumption 2", "assumption 3"]`;
  }

  private buildTruthsPrompt(problem: string, components: string[], assumptions: string[]): string {
    return `Extract the fundamental truths from the following:

Problem: ${problem}

Components:
${components.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Assumptions:
${assumptions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Identify 3-7 fundamental truths - facts or principles that are universally true and not dependent on assumptions.
Return ONLY a JSON array of strings, no additional text.

Example format: ["truth 1", "truth 2", "truth 3"]`;
  }

  private buildSolutionPrompt(problem: string, truths: string[], context?: Record<string, any>): string {
    return `Build a solution from first principles:

Original Problem: ${problem}

Fundamental Truths:
${truths.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${context ? `Context: ${JSON.stringify(context, null, 2)}` : ''}

Create a solution based ONLY on the fundamental truths listed above. Do not rely on conventional approaches or assumptions.
Provide a clear, actionable solution in 2-4 paragraphs.`;
  }

  // ============================================================================
  // PRIVATE METHODS - RESPONSE PARSING
  // ============================================================================

  private parseDecomposeResponse(response: string): string[] {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Fallback: extract bullet points or numbered lists
      const lines = response.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .map(l => l.replace(/^[-*\d.)\]]\s*/, ''))
        .filter(l => l.length > 10);
      
      return lines.slice(0, 7);
    }
    
    return ['Component extraction failed'];
  }

  private parseAssumptionsResponse(response: string): string[] {
    return this.parseDecomposeResponse(response); // Same parsing logic
  }

  private parseTruthsResponse(response: string): string[] {
    return this.parseDecomposeResponse(response); // Same parsing logic
  }

  // ============================================================================
  // PRIVATE METHODS - TELEMETRY CALCULATIONS
  // ============================================================================

  private calculateAlignmentScore(outputs: string[], input: string): number {
    // Calculate semantic alignment between output and input
    const inputWords = new Set(input.toLowerCase().split(/\s+/));
    const outputWords = new Set(outputs.join(' ').toLowerCase().split(/\s+/));
    
    const intersection = new Set([...inputWords].filter(x => outputWords.has(x)));
    const union = new Set([...inputWords, ...outputWords]);
    
    return intersection.size / union.size;
  }

  private calculateTraceFidelity(outputs: string[]): number {
    // Measure completeness and coherence of output
    const avgLength = outputs.reduce((sum, o) => sum + o.length, 0) / outputs.length;
    const lengthScore = Math.min(avgLength / 100, 1); // Normalize to 0-1
    
    return lengthScore * 0.9 + 0.1; // Base score 0.1 + length contribution
  }

  private calculateEntropyDelta(before: string | string[], after: string[]): number {
    // Measure reduction in uncertainty/complexity
    const beforeText = Array.isArray(before) ? before.join(' ') : before;
    const afterText = after.join(' ');
    
    const beforeEntropy = this.calculateEntropy(beforeText);
    const afterEntropy = this.calculateEntropy(afterText);
    
    return beforeEntropy - afterEntropy;
  }

  private calculateEntropy(text: string): number {
    const freq: Record<string, number> = {};
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });
    
    let entropy = 0;
    const total = words.length;
    
    Object.values(freq).forEach(count => {
      const p = count / total;
      entropy -= p * Math.log2(p);
    });
    
    return entropy;
  }

  // ============================================================================
  // PRIVATE METHODS - SLA ENFORCEMENT
  // ============================================================================

  private async withSLA<T>(
    fn: () => Promise<T>,
    requestId: string
  ): Promise<T> {
    const { timeoutMs, maxRetries = 3 } = this.config.sla;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`SLA timeout: ${timeoutMs}ms exceeded`)), timeoutMs);
        });
        
        // Race between function and timeout
        return await Promise.race([fn(), timeoutPromise]);
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < maxRetries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          this.config.logger?.warn(
            `Retry ${attempt}/${maxRetries} after ${backoffMs}ms for request ${requestId}`
          );
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  // ============================================================================
  // PRIVATE METHODS - LEDGER & TELEMETRY
  // ============================================================================

  private async logToLedger(
    type: LedgerEntryType,
    data: any,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const entry: LedgerEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        modelId: this.id,
        modelVersion: this.version,
        type,
        data,
        metadata: {
          ...metadata,
          requestId: data.metadata?.requestId || data.requestId || uuidv4()
        }
      };

      this.ledgerEntries.push(entry);
      this.eventEmitter.emit('ledgerEntry', entry);

      if (this.config.logger) {
        this.config.logger.debug(`[LEDGER] ${type}`, {
          id: entry.id,
          timestamp: entry.timestamp,
          modelId: entry.modelId,
          type: entry.type
        });
      }
    } catch (error) {
      // Never let ledger logging break the main flow
      this.config.logger?.error('Ledger logging failed:', error);
    }
  }

  private calculateElapsedTime(startTime: [number, number]): number {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    return seconds * 1000 + nanoseconds / 1e6;
  }

  private aggregateTelemetry(telemetryData: TelemetryData[]): TelemetryData {
    const total = telemetryData.length;
    
    return {
      alignmentScore: telemetryData.reduce((sum, t) => sum + t.alignmentScore, 0) / total,
      traceFidelity: telemetryData.reduce((sum, t) => sum + t.traceFidelity, 0) / total,
      entropyDelta: telemetryData.reduce((sum, t) => sum + t.entropyDelta, 0) / total,
      executionTimeMs: telemetryData.reduce((sum, t) => sum + t.executionTimeMs, 0),
      memoryUsageMb: Math.max(...telemetryData.map(t => t.memoryUsageMb)),
      timestamp: new Date().toISOString()
    };
  }

  private emitTelemetry(telemetry: TelemetryData): void {
    if (this.config.telemetryEnabled) {
      this.telemetryQueue.push(telemetry);
      this.eventEmitter.emit('telemetry', telemetry);
      
      if (this.telemetryQueue.length >= 100) {
        this.flushTelemetry();
      }
    }
  }

  private flushTelemetry(): void {
    if (this.config.logger && this.telemetryQueue.length > 0) {
      this.config.logger.debug(`Flushing ${this.telemetryQueue.length} telemetry records`);
      this.telemetryQueue = [];
    }
  }

  // ============================================================================
  // PRIVATE METHODS - VALIDATION & CONFIGURATION
  // ============================================================================

  public validateInput(input: unknown): asserts input is FirstPrinciplesInput {
    // Check if input is an object
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
      throw new Error('Input must be an object');
    }

    // Type assertion since we've checked it's a non-null object
    const inputObj = input as Record<string, unknown>;
    
    // Check if problem exists and is a string
    if (typeof inputObj.problem !== 'string') {
      throw new Error('Problem statement must be a string with at least 10 characters');
    }
    
    // Check if problem has at least 10 characters
    if (inputObj.problem.trim().length < 10) {
      throw new Error('Problem statement must be a string with at least 10 characters');
    }
  }

  public getConfig(): Readonly<FirstPrinciplesConfig> {
    // Create a deep frozen copy of the config
    const frozenConfig = JSON.parse(JSON.stringify(this.config));
    
    // Make it read-only
    Object.freeze(frozenConfig);
    
    // Also freeze nested objects
    if (frozenConfig.ai) Object.freeze(frozenConfig.ai);
    if (frozenConfig.sla) Object.freeze(frozenConfig.sla);
    
    return frozenConfig as Readonly<FirstPrinciplesConfig>;
  }

  public configure(config: Partial<FirstPrinciplesConfig>): void {
    // Merge the new config with the existing one
    this.config = { ...this.config, ...config };
    
    // Emit configuration changed event
    this.eventEmitter.emit('configChanged', this.getConfig());
  }

  private startCleanupInterval(): void {
    // Clean up old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const maxAge = 5 * 60 * 1000; // 5 minutes
      const now = Date.now();
      
      // Keep only recent ledger entries
      this.ledgerEntries = this.ledgerEntries.filter(entry => {
        const entryTime = new Date(entry.timestamp).getTime();
        return (now - entryTime) < maxAge;
      });
      
      // Flush telemetry
      if (this.telemetryQueue.length > 0) {
        this.flushTelemetry();
      }
    }, 5 * 60 * 1000);
    
    // Don't keep process alive just for cleanup
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export const createFirstPrinciplesModel = (
  config: FirstPrinciplesConfig = {}
): FirstPrinciplesModel => {
  return new FirstPrinciplesModelImpl(config);
};

export default createFirstPrinciplesModel;
