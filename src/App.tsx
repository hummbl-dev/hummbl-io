import { useState, useEffect } from 'react';
import { NarrativeList } from './components/narratives/NarrativeList';
import { MentalModelsList } from './components/mental-models/MentalModelsList';
import { ViewSwitcher } from './components/view/ViewSwitcher';
import { ViewType } from './types/view';
import { MentalModel } from './types/mental-model';
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
  const [mentalModelsState, setMentalModelsState] = useState<MentalModelsState>(() => {
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
        const response = await fetch('/data/models.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMentalModels(data.models || []);
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

  // Update header tagline based on current view
  const getTagline = () => {
    return currentView === 'narratives' 
      ? 'Cognitive Framework - 6 Core Narratives' 
      : 'Cognitive Framework - 120 Mental Models';
  };

  // Handle model selection
  const handleModelSelect = (model: MentalModel) => {
    // TODO: Implement model detail view or navigation
    console.log('Selected model:', model);
  };

  // Handle mental models state updates
  const handleMentalModelsStateChange = (updates: Partial<MentalModelsState>) => {
    setMentalModelsState(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">HUMMBL</h1>
          <p className="tagline">{getTagline()}</p>
          
          {/* View Switcher */}
          <ViewSwitcher 
            currentView={currentView}
            onViewChange={setCurrentView}
            className="header-view-switcher"
          />
        </div>
      </header>

      <main className="main-content">
        {currentView === 'narratives' ? (
          <NarrativeList />
        ) : (
          <div className="mental-models-wrapper">
            {isLoading ? (
              <div className="loading">Loading mental models...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <MentalModelsList
                models={mentalModels}
                onModelSelect={handleModelSelect}
                initialState={mentalModelsState}
                onStateChange={handleMentalModelsStateChange}
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
