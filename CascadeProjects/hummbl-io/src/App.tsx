import { useState, useEffect } from 'react';
import './App.css';

// Type definitions
interface Model {
  code: string;
  name: string;
  definition: string;
  example: string;
  transformation: string;
}

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransformation, setSelectedTransformation] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  // Load models from JSON file
  useEffect(() => {
    fetch('/models.json')
      .then(response => response.json())
      .then(data => {
        setModels(data.models || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading models:', error);
        setLoading(false);
      });
  }, []);

  // Filter models based on search and transformation
  const filteredModels = models.filter(model => {
    const matchesSearch = searchTerm === '' || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTransformation = selectedTransformation === 'all' || 
      model.transformation === selectedTransformation;
    
    return matchesSearch && matchesTransformation;
  });

  // Group models by transformation
  const transformations = ['P', 'IN', 'CO', 'DE', 'RE', 'SY'];
  const transformationNames: Record<string, string> = {
    'P': 'Perspective',
    'IN': 'Inversion',
    'CO': 'Composition',
    'DE': 'Decomposition',
    'RE': 'Recursion',
    'SY': 'Meta-Systems'
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading HUMMBL models...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">HUMMBL</h1>
          <p className="tagline">120 Mental Models for Strategic Thinking</p>
        </div>
      </header>

      {/* Search & Filter Section */}
      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search models by name, code, or definition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filter-buttons">
          <button
            className={selectedTransformation === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setSelectedTransformation('all')}
          >
            All ({models.length})
          </button>
          {transformations.map(t => (
            <button
              key={t}
              className={selectedTransformation === t ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedTransformation(t)}
            >
              {t} - {transformationNames[t]} ({models.filter(m => m.transformation === t).length})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredModels.length} of {models.length} models
      </div>

      {/* Model Grid */}
      <div className="model-grid">
        {filteredModels.map(model => (
          <div
            key={model.code}
            className="model-card"
            onClick={() => setSelectedModel(model)}
          >
            <div className="model-code">{model.code}</div>
            <h3 className="model-name">{model.name}</h3>
            <p className="model-definition">
              {model.definition.length > 120 
                ? model.definition.substring(0, 120) + '...' 
                : model.definition}
            </p>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="no-results">
          No models found matching your search. Try different keywords.
        </div>
      )}

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="modal-overlay" onClick={() => setSelectedModel(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedModel(null)}>×</button>
            <div className="modal-header">
              <span className="modal-code">{selectedModel.code}</span>
              <h2 className="modal-name">{selectedModel.name}</h2>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h3>Definition</h3>
                <p>{selectedModel.definition}</p>
              </div>
              <div className="modal-section">
                <h3>Example Application</h3>
                <p>{selectedModel.example}</p>
              </div>
              <div className="modal-section">
                <h3>Transformation</h3>
                <p>{selectedModel.transformation} - {transformationNames[selectedModel.transformation]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>HUMMBL Mental Models Framework v1.0</p>
        <p>Base120 Complete Collection</p>
      </footer>
    </div>
  );
}

export default App;
