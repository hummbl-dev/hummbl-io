/**
 * Mental Model Type Definitions
 * 
 * Core type definitions for HUMMBL Base120 mental models framework.
 * Defines the structure of mental models, transformations, and related types.
 * 
 * @module types/models
 * @version 1.0.0
 */

// Using P1 (First Principles Framing) to define core types
export type TransformationType = 'P' | 'IN' | 'CO' | 'DE' | 'RE' | 'SY';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MentalModel {
  code: string;              // P1, IN5, DE12, etc.
  name: string;              // "First Principles Framing"
  transformation: TransformationType;
  description: string;       // Clear definition
  example: string;           // Practical application
  tags: string[];           // Categories for search/filter
  difficulty: DifficultyLevel;
  relatedModels: string[];  // Cross-references to other model codes
  version: string;          // "1.0-beta"
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}

export interface Transformation {
  code: TransformationType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  modelCount: number;
}

// Using RE7 (Error Correction) pattern for explicit error handling
export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
