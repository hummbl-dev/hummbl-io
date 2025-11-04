/**
 * Model Detail Page
 * 
 * Displays complete information about a single mental model.
 * Shows code, name, description, examples, tags, difficulty, and related models.
 * 
 * @module pages/ModelDetail
 * @version 1.0.0
 */

import React from 'react';
import { ArrowLeft, Tag, TrendingUp } from 'lucide-react';
import { TRANSFORMATION_MAP } from '../constants/transformations';
import { MENTAL_MODELS } from '../data/mentalModels';
import { cn } from '../utils/cn';

interface ModelDetailProps {
  modelCode: string;
  onBack: () => void;
  onModelClick: (code: string) => void;
  className?: string;
}

// Using P1 (First Principles Framing) to structure model information clearly
export const ModelDetail: React.FC<ModelDetailProps> = ({
  modelCode,
  onBack,
  onModelClick,
  className,
}) => {
  // Using RE5 (Graceful Degradation) for missing models
  const model = MENTAL_MODELS.find(m => m.code === modelCode);

  if (!model) {
    return (
      <div className={cn('max-w-4xl mx-auto py-12 px-4', className)}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Model Not Found</h1>
          <p className="text-gray-600 mb-6">The mental model "{modelCode}" could not be found.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-hummbl-primary text-white rounded-lg hover:bg-hummbl-secondary transition-colors"
          >
            Back to Models
          </button>
        </div>
      </div>
    );
  }

  const transformation = TRANSFORMATION_MAP[model.transformation];

  return (
    <div className={cn('max-w-4xl mx-auto py-12 px-4', className)}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-hummbl-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to All Models</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span
            className="inline-block rounded-lg px-4 py-2 text-lg font-mono font-bold text-white"
            style={{ backgroundColor: transformation.color }}
          >
            {model.code}
          </span>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: `${transformation.color}20`, color: transformation.color }}
          >
            {transformation.name}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{model.name}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span className="capitalize">{model.difficulty}</span>
          </span>
          <span>•</span>
          <span>Version {model.version}</span>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{model.description}</p>
      </section>

      {/* Example */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Example</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700">{model.example}</p>
        </div>
      </section>

      {/* Tags */}
      {model.tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Tag className="w-6 h-6" />
            <span>Tags</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Related Models */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Models</h2>
        {model.relatedModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.relatedModels.map((relatedCode) => {
              const relatedModel = MENTAL_MODELS.find(m => m.code === relatedCode);
              if (!relatedModel) return null;
              const relatedTransformation = TRANSFORMATION_MAP[relatedModel.transformation];
              
              return (
                <button
                  key={relatedCode}
                  onClick={() => onModelClick(relatedCode)}
                  className="text-left p-4 rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ borderColor: relatedTransformation.color }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className="text-xs font-mono font-bold px-2 py-1 rounded text-white"
                      style={{ backgroundColor: relatedTransformation.color }}
                    >
                      {relatedModel.code}
                    </span>
                    <span className="font-semibold text-gray-900">{relatedModel.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600">No related models have been defined yet.</p>
          </div>
        )}
      </section>

      {/* Metadata */}
      <section className="border-t pt-6">
        <div className="text-sm text-gray-500 space-y-1">
          <p>Created: {new Date(model.createdAt).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(model.updatedAt).toLocaleDateString()}</p>
        </div>
      </section>
    </div>
  );
};
