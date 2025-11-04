/**
 * Models Grid Component
 * 
 * Displays all mental models in a responsive grid layout.
 * Supports filtering by transformation type.
 * 
 * @module components/ModelsGrid
 * @version 1.0.0
 */

import React from 'react';
import type { MentalModel, TransformationType } from '../types/models';
import { ModelCard } from './ModelCard';
import { cn } from '../utils/cn';

interface ModelsGridProps {
  models: MentalModel[];
  selectedTransformation: TransformationType | 'ALL';
  onModelClick: (code: string) => void;
  className?: string;
}

// Using DE3 (Modularization) to separate grid layout from individual cards
export const ModelsGrid: React.FC<ModelsGridProps> = ({
  models,
  selectedTransformation,
  onModelClick,
  className,
}) => {
  // Using DE2 (Constraint-Driven Design) for filtered models
  const filteredModels = selectedTransformation === 'ALL'
    ? models
    : models.filter(model => model.transformation === selectedTransformation);

  if (filteredModels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No models found for this filter.</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-bold text-gray-900">{filteredModels.length}</span> mental models
          {selectedTransformation !== 'ALL' && (
            <span> in <span className="font-bold text-hummbl-primary">{selectedTransformation}</span> transformation</span>
          )}
        </p>
      </div>

      {/* Grid - Using CO7 (Hierarchy Construction) for responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.code}
            model={model}
            onClick={onModelClick}
          />
        ))}
      </div>
    </div>
  );
};
