import { TransformationKey } from './transformation';

/**
 * Core mental model interface
 */
declare interface MentalModel {
  /** Unique identifier for the model */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Short code/abbreviation */
  code: string;
  
  /** Detailed description */
  description: string;
  
  /** Optional example usage */
  example?: string;
  
  /** Primary category */
  category: string;
  
  /** Related categories and tags */
  tags: string[];
  
  /** Associated transformation keys */
  transformations: TransformationKey[];
  
  /** Source references */
  sources: {
    /** Source name */
    name: string;
    /** URL or citation */
    reference: string;
  }[];
  
  /** Additional metadata */
  meta?: {
    /** When this model was added */
    added?: string;
    /** Last updated timestamp */
    updated?: string;
    /** Whether this is a core model */
    isCore?: boolean;
    /** Difficulty level (1-5) */
    difficulty?: number;
  };
}

declare module 'models/mentalModels' {
  export const mentalModelsRegistry: Record<string, MentalModel>;
  export function registerMentalModel(model: MentalModel): void;
  export function getAllMentalModels(): MentalModel[];
  export function getMentalModelsByTransformation(transformation: TransformationKey): MentalModel[];
  export function getMentalModelById(id: string): MentalModel | undefined;
  export type { MentalModel };
}

declare module '*.json' {
  const value: {
    models: MentalModel[];
  };
  export default value;
}
