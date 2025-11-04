import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceMonitoring } from './utils/performance';

// Initialize performance monitoring
initPerformanceMonitoring((metric) => {
  // Metrics are automatically sent to analytics via the performance utility
  // Additional custom handling can be added here if needed
  if (import.meta.env.DEV) {
    console.log('[Performance]', metric.name, metric.value);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
