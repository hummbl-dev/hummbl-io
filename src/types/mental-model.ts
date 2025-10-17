import { TransformationKey } from './transformation';

export interface MentalModel {
  code: string;          // e.g., "P1", "IN3", "CO5"
  name: string;          // Name of the mental model
  definition: string;    // Brief definition/description
  example: string;       // Practical example
  transformation: TransformationKey;  // Which transformation it belongs to
  tags?: string[];       // Optional tags for filtering
  relatedModels?: string[]; // Codes of related models
  complexity?: 'low' | 'medium' | 'high';
  confidence?: number;   // 0-1 confidence score
  lastUpdated?: string;  // ISO date string
  sources?: Array<{
    title: string;
    author?: string;
    url?: string;
    year?: number;
  }>;
}

// Type for the mental models data structure
export interface MentalModelsData {
  version: string;
  lastUpdated: string;
  totalModels: number;
  transformations: Record<TransformationKey, string>;
  models: MentalModel[];
}

// Type for the API response when fetching models
export interface MentalModelsResponse {
  success: boolean;
  data: {
    models: MentalModel[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
}

// Type for model filtering options
export interface ModelFilterOptions {
  searchTerm?: string;
  transformations?: TransformationKey[];
  tags?: string[];
  complexity?: ('low' | 'medium' | 'high')[];
  minConfidence?: number;
  sortBy?: 'name' | 'complexity' | 'confidence' | 'code';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Type for the model detail view
export interface ModelDetailProps {
  model: MentalModel;
  relatedModels: MentalModel[];
  onClose: () => void;
  onModelSelect: (code: string) => void;
}

// Type for the model card component
export interface ModelCardProps {
  model: MentalModel;
  onClick: () => void;
  compact?: boolean;
  showTransformation?: boolean;
}
