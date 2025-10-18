import type { MentalModel } from '@/models/mentalModels';

type ModelCardProps = {
  model: MentalModel;
  onSelect: (model: MentalModel) => void;
};

const ModelCard = ({ model, onSelect }: ModelCardProps) => (
  <div
    data-testid="model-card"
    onClick={() => onSelect(model)}
    className="model-card"
  >
    <div className="model-header">
      <span className="model-code">{model.code}</span>
      {model.transformations && model.transformations.length > 0 && (
        <span className="model-transformation">{model.transformations[0]}</span>
      )}
    </div>
    <h3 className="model-name" data-testid="model-name">{model.name}</h3>
    {model.description && (
      <p className="model-definition" data-testid="model-description">{model.description}</p>
    )}
    {model.example && (
      <span className="model-example">{model.example}</span>
    )}
  </div>
);

export default ModelCard;
