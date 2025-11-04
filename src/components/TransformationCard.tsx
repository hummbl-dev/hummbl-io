/**
 * Transformation Card Component
 * 
 * Displays a single transformation with icon, name, and description.
 * Used in the transformations showcase grid.
 * 
 * @module components/TransformationCard
 * @version 1.0.0
 */

import React from 'react';
import * as Icons from 'lucide-react';
import type { Transformation } from '../types/models';
import { cn } from '../utils/cn';

interface TransformationCardProps {
  transformation: Transformation;
  className?: string;
}

export const TransformationCard: React.FC<TransformationCardProps> = ({
  transformation,
  className,
}) => {
  // Using SY19 (Meta-Model Selection) to dynamically select icon component
  const IconComponent = Icons[transformation.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div
      className={cn(
        'p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1',
        className
      )}
      style={{
        borderColor: transformation.color,
        backgroundColor: `${transformation.color}10`,
      }}
    >
      <div className="flex items-start space-x-4">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: transformation.color }}
        >
          {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className="text-xs font-mono font-bold px-2 py-1 rounded"
              style={{
                backgroundColor: transformation.color,
                color: 'white',
              }}
            >
              {transformation.code}
            </span>
            <h3 className="text-lg font-bold text-gray-900">
              {transformation.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {transformation.description}
          </p>
          <p className="text-xs text-gray-500">
            {transformation.modelCount} mental models
          </p>
        </div>
      </div>
    </div>
  );
};
