import React from 'react';
import type { MentalModel } from '@/types/mentalModels';

type ModelCardProps = {
  model: MentalModel;
  onSelect: (model: MentalModel) => void;
};

const ModelCard = ({ model, onSelect }: ModelCardProps) => (
  <div
    data-testid="model-card"
    onClick={() => onSelect(model)}
    className="cursor-pointer rounded-2xl p-4 border hover:bg-muted transition"
  >
    <h3 data-testid="model-name">{model.name}</h3>
    {model.category && <p data-testid="model-category">{model.category}</p>}
    {model.description && (
      <p data-testid="model-description">{model.description}</p>
    )}
  </div>
);

export default ModelCard;
