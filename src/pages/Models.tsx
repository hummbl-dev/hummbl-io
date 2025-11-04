/**
 * Models Page
 * 
 * Main page for browsing all 120 mental models.
 * Includes filtering by transformation and navigation to individual models.
 * 
 * @module pages/Models
 * @version 1.0.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { TransformationType } from '../types/models';
import { MENTAL_MODELS } from '../data/mentalModels';
import { BetaBanner } from '../components/BetaBanner';
import { SearchBar } from '../components/SearchBar';
import { TransformationFilter } from '../components/TransformationFilter';
import { ModelsGrid } from '../components/ModelsGrid';
import { ModelDetail } from './ModelDetail';
import { useSearch } from '../hooks/useSearch';

interface ModelsPageProps {
  className?: string;
  onNavigateHome?: () => void;
}

// Using SY19 (Meta-Model Selection) to manage view state
export const ModelsPage: React.FC<ModelsPageProps> = ({ className, onNavigateHome }) => {
  const [selectedTransformation, setSelectedTransformation] = React.useState<TransformationType | 'ALL'>('ALL');
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);
  
  // Using P4 (Lens Shifting) for search-based filtering
  const { query, setQuery, results, resultCount, hasQuery } = useSearch(MENTAL_MODELS);

  const handleModelClick = (code: string): void => {
    setSelectedModel(code);
    // Scroll to top when viewing model detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = (): void => {
    setSelectedModel(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show model detail if one is selected
  if (selectedModel) {
    return (
      <ModelDetail
        modelCode={selectedModel}
        onBack={handleBack}
        onModelClick={handleModelClick}
        className={className}
      />
    );
  }

  // Show grid view with filter
  return (
    <div className={className}>
      {/* Back to Home Button */}
      {onNavigateHome && (
        <section className="max-w-7xl mx-auto px-4 pt-6">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-hummbl-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
        </section>
      )}

      {/* Page Header */}
      <section className="bg-gradient-to-b from-hummbl-light to-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Mental Models Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse all 120 mental models from the HUMMBL Base120 framework.
            Filter by transformation or explore them all.
          </p>
        </div>
      </section>

      {/* Beta Banner */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <BetaBanner />
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          resultCount={hasQuery ? resultCount : undefined}
        />
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <TransformationFilter
          selected={selectedTransformation}
          onSelect={setSelectedTransformation}
        />
      </section>

      {/* Models Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <ModelsGrid
          models={results.map(r => r.model)}
          selectedTransformation={selectedTransformation}
          onModelClick={handleModelClick}
        />
      </section>
    </div>
  );
};
