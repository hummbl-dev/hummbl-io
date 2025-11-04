/**
 * Model Card Component
 * 
 * Displays a single mental model in card format.
 * Clickable card that navigates to model detail page.
 * 
 * @module components/ModelCard
 * @version 1.0.0
 */

import React from 'react';
import type { MentalModel } from '../types/models';
import { TRANSFORMATION_MAP } from '../constants/transformations';
import { cn } from '../utils/cn';

interface ModelCardProps {
  model: MentalModel;
  onClick: (code: string) => void;
  className?: string;
}

// Using CO8 (Layered Abstraction) for component hierarchy
export const ModelCard: React.FC<ModelCardProps> = ({ model, onClick, className }) => {
  const transformation = TRANSFORMATION_MAP[model.transformation];
  
  const handleClick = (): void => {
    onClick(model.code);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(model.code);
    }
  };

  return (
    <div
      className={cn(
        'group cursor-pointer rounded-lg border-2 p-4 transition-all',
        'hover:shadow-lg hover:-translate-y-1',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hummbl-primary focus-visible:ring-offset-2',
        className
      )}
      style={{
        borderColor: transformation.color,
        backgroundColor: `${transformation.color}10`,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${model.name} mental model`}
    >
      {/* Code Badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="inline-block rounded px-2 py-1 text-xs font-mono font-bold text-white"
          style={{ backgroundColor: transformation.color }}
        >
          {model.code}
        </span>
        <span className="text-xs text-gray-500 capitalize">{model.difficulty}</span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-hummbl-primary transition-colors">
        {model.name}
      </h3>

      {/* Tags */}
      {model.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
