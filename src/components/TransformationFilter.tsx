/**
 * Transformation Filter Component
 * 
 * Provides filtering UI for mental models by transformation type.
 * Displays tabs/buttons for each transformation with counts.
 * 
 * @module components/TransformationFilter
 * @version 1.0.0
 */

import React from 'react';
import type { TransformationType } from '../types/models';
import { TRANSFORMATIONS } from '../constants/transformations';
import { cn } from '../utils/cn';

interface TransformationFilterProps {
  selected: TransformationType | 'ALL';
  onSelect: (transformation: TransformationType | 'ALL') => void;
  className?: string;
}

// Using P4 (Lens Shifting) to enable different views of the data
export const TransformationFilter: React.FC<TransformationFilterProps> = ({
  selected,
  onSelect,
  className,
}) => {
  const handleSelect = (transformation: TransformationType | 'ALL'): void => {
    onSelect(transformation);
  };

  const handleKeyDown = (event: React.KeyboardEvent, transformation: TransformationType | 'ALL'): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(transformation);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Using CO7 (Hierarchy Construction) for filter organization */}
      <div className="flex flex-wrap gap-3">
        {/* All filter */}
        <button
          onClick={() => handleSelect('ALL')}
          onKeyDown={(e) => handleKeyDown(e, 'ALL')}
          className={cn(
            'px-6 py-3 rounded-lg font-semibold transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hummbl-primary focus-visible:ring-offset-2',
            selected === 'ALL'
              ? 'bg-hummbl-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          aria-pressed={selected === 'ALL' ? 'true' : 'false'}
        >
          All Models
          <span className="ml-2 text-sm opacity-80">(120)</span>
        </button>

        {/* Transformation filters */}
        {TRANSFORMATIONS.map((transformation) => (
          <button
            key={transformation.code}
            onClick={() => handleSelect(transformation.code)}
            onKeyDown={(e) => handleKeyDown(e, transformation.code)}
            className={cn(
              'px-6 py-3 rounded-lg font-semibold transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              selected === transformation.code
                ? 'text-white shadow-md'
                : 'bg-white border-2 hover:shadow-md'
            )}
            style={{
              ...(selected === transformation.code
                ? { backgroundColor: transformation.color }
                : {
                    borderColor: transformation.color,
                    color: transformation.color,
                  }),
              ...(selected === transformation.code
                ? {}
                : { ':hover': { borderColor: transformation.color } }),
            }}
            aria-pressed={selected === transformation.code ? 'true' : 'false'}
          >
            <span className="font-mono font-bold">{transformation.code}</span>
            <span className="mx-2">—</span>
            <span>{transformation.shortName}</span>
            <span className="ml-2 text-sm opacity-80">({transformation.modelCount})</span>
          </button>
        ))}
      </div>

      {/* Description of selected transformation */}
      {selected !== 'ALL' && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          {TRANSFORMATIONS.map(
            (t) =>
              t.code === selected && (
                <div key={t.code}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: t.color }}>
                    {t.name} ({t.code})
                  </h3>
                  <p className="text-gray-700">{t.description}</p>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
