import { NarrativeList } from './components/narratives/NarrativeList';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">HUMMBL</h1>
          <p className="tagline">Cognitive Framework - 6 Core Narratives</p>
        </div>
      </header>

      {/* Narrative List */}
      <NarrativeList />

      {/* Footer */}
      <footer className="footer">
        <p>HUMMBL Cognitive Framework v1.0</p>
        <p>Production Certified - 2025-10-17</p>
      </footer>
    </div>
  );
}

export default App;
