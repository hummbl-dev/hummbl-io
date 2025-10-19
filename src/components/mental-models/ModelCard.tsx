import { useState } from 'react';
import type { MentalModel } from '@/models/mentalModels';

type ModelCardProps = {
  model: MentalModel;
  onSelect: (model: MentalModel) => void;
};

const ModelCard = ({ model, onSelect }: ModelCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const difficultyStars = model.meta?.difficulty
    ? '●'.repeat(model.meta.difficulty) + '○'.repeat(5 - model.meta.difficulty)
    : null;

  return (
    <div
      data-testid="model-card"
      onClick={() => onSelect(model)}
      className="model-card"
    >
      {/* Header with code */}
      <div className="model-header">
        <span className="model-code">{model.code}</span>
      </div>

      {/* Title */}
      <h3 className="model-name" data-testid="model-name">{model.name}</h3>

      {/* Category */}
      <div className="model-category">{model.category}</div>

      {/* Description */}
      {model.description && (
        <p className="model-definition" data-testid="model-description">
          {model.description}
        </p>
      )}

      {/* Tags */}
      {model.tags && model.tags.length > 0 && (
        <div className="model-tags">
          {model.tags.slice(0, isExpanded ? model.tags.length : 3).map((tag, i) => (
            <span key={i} className="model-tag">{tag}</span>
          ))}
          {!isExpanded && model.tags.length > 3 && (
            <button
              className="model-tag-more"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              +{model.tags.length - 3}
            </button>
          )}
        </div>
      )}

      {/* Example */}
      {model.example && (
        <div className="model-example">{model.example}</div>
      )}

      {/* Footer with metadata */}
      <div className="model-footer">
        <div className="model-meta">
          {difficultyStars && (
            <span className="model-difficulty" title={`Difficulty: ${model.meta?.difficulty}/5`}>
              {difficultyStars}
            </span>
          )}
          {model.sources && model.sources.length > 0 && (
            <span className="model-sources" title={model.sources.map(s => s.name).join(', ')}>
              {model.sources.length} {model.sources.length === 1 ? 'source' : 'sources'}
            </span>
          )}
        </div>
        <button
          className="model-action"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(model);
          }}
          aria-label={`View details for ${model.name}`}
        >
          Details →
        </button>
      </div>
    </div>
  );
};

export default ModelCard;
