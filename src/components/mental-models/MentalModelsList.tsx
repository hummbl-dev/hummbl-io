import React from 'react';
import ModelCard from './ModelCard';
import SkeletonGrid from './SkeletonGrid';
import ErrorState from './ErrorState';
import type { MentalModel } from '@/types/mentalModels';

type MentalModelsListProps = {
  models?: MentalModel[];
  isLoading?: boolean;
  error?: string | null;
  onSelect: (model: MentalModel) => void;
  onRetry?: () => void;
};

const MentalModelsList = ({
  models = [],
  isLoading = false,
  error = null,
  onSelect,
  onRetry,
}: MentalModelsListProps) => {
  if (isLoading) return <SkeletonGrid isLoading data-testid="loading-state" />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!models.length)
    return (
      <p data-testid="empty-state" className="text-center p-6">
        No models found
      </p>
    );

  return (
    <div
      data-testid="mental-models-list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {models.map((model) => (
        <ModelCard key={model.id} model={model} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default MentalModelsList;
