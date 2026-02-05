// Using DE12 (Interface Segregation) - Clean type definitions for mental models

export type TransformationKey = 'P' | 'IN' | 'CO' | 'DE' | 'RE' | 'SY';

export interface MentalModel {
  id: string;
  name: string;
  code: string;
  description: string;
  example?: string;
  category: string;
  tags: string[];
  transformations: TransformationKey[];
  sources: Array<{
    name: string;
    reference: string;
  }>;
  meta?: {
    added?: string;
    updated?: string;
    isCore?: boolean;
    difficulty?: number;
  };
}

export interface MentalModelsData {
  version: string;
  lastUpdated: string;
  totalModels: number;
  transformations: Record<TransformationKey, string>;
  models: MentalModel[];
}

export interface ModelFilterOptions {
  searchTerm?: string;
  transformations?: TransformationKey[];
  tags?: string[];
  complexity?: ('low' | 'medium' | 'high')[];
  sortBy?: 'name' | 'complexity' | 'code';
  sortOrder?: 'asc' | 'desc';
}
