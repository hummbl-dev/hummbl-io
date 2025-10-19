import { useState, useEffect } from 'react';
import { NarrativeList } from './components/narratives/NarrativeList';
import { MentalModelsList } from './components/mental-models/MentalModelsList';
import { Hero } from './components/Hero/Hero';
import { ViewType } from './types/view';
import type { MentalModel } from './models/mentalModels';
import { fetchMentalModels, clearMentalModelsCache } from './services/mentalModelsService';
import './App.css';

// Types for persisted state
interface MentalModelsState {
  searchTerm: string;
  selectedTransformations: string[];
  sortBy: string;
  showExamples: boolean;
}

// Default state
const DEFAULT_MENTAL_MODELS_STATE: MentalModelsState = {
  searchTerm: '',
  selectedTransformations: [],
  sortBy: 'name-asc',
  showExamples: true
};

// LocalStorage keys
const LOCAL_STORAGE_KEYS = {
  VIEW: 'hummbl:view',
  MENTAL_MODELS_STATE: 'hummbl:mental-models-state'
};

function App() {
  // State for the current view
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // Initialize from localStorage or default to 'narratives'
    const savedView = localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW) as ViewType;
    return savedView || 'narratives';
  });

  // State for mental models data
  const [mentalModels, setMentalModels] = useState<MentalModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for mental models UI state
  const [mentalModelsState] = useState<MentalModelsState>(() => {
    // Initialize from localStorage or use defaults
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEYS.MENTAL_MODELS_STATE);
    return savedState ? JSON.parse(savedState) : DEFAULT_MENTAL_MODELS_STATE;
  });

  // Load mental models data
  useEffect(() => {
    const loadMentalModels = async () => {
      if (currentView !== 'models') return;

      setIsLoading(true);
      setError(null);

      try {
        const models = await fetchMentalModels();
        setMentalModels(models);
      } catch (err) {
        console.error('Failed to load mental models:', err);
        setError('Failed to load mental models. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMentalModels();
  }, [currentView]);

  // Save view to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

  // Save mental models state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.MENTAL_MODELS_STATE,
      JSON.stringify(mentalModelsState)
    );
  }, [mentalModelsState]);

  // Static tagline
  const getTagline = () => {
    return 'Cognitive Operating System';
  };

  // Handle model selection
  const handleModelSelect = (model: MentalModel) => {
    // TODO: Implement model detail view or navigation
    console.log('Selected model:', model);
  };

  // Handle mental models state updates (inline where used)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">HUMMBL</h1>
          <p className="tagline">{getTagline()}</p>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onViewChange={setCurrentView} currentView={currentView} />

      <main className="main-content">
        {currentView === 'narratives' ? (
          <NarrativeList />
        ) : (
          <div className="mental-models-wrapper">
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
              <button
                onClick={async () => {
                  clearMentalModelsCache();
                  setIsLoading(true);
                  try {
                    const models = await fetchMentalModels();
                    setMentalModels(models);
                    setError(null);
                  } catch (err) {
                    console.error('Failed to refresh mental models:', err);
                    setError('Failed to load mental models. Please try again later.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="button refresh-button"
                aria-label="Refresh data"
                title="Refresh data"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="loading">Loading mental models...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <MentalModelsList
                models={mentalModels}
                onSelect={handleModelSelect}
                onRetry={async () => {
                  clearMentalModelsCache();
                  setIsLoading(true);
                  try {
                    const models = await fetchMentalModels();
                    setMentalModels(models);
                    setError(null);
                  } catch (err) {
                    console.error('Retry failed:', err);
                    setError('Failed to load mental models. Please try again later.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>HUMMBL Cognitive Framework v1.0</p>
        <p>Production Certified - 2025-10-17</p>
      </footer>
    </div>
  );
}

export default App;
