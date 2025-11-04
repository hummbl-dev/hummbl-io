/**
 * Main Application Component
 * 
 * HUMMBL landing page showcasing the Base120 framework.
 * Features hero section, transformations grid, and framework overview.
 * 
 * @module App
 * @version 1.0.0
 */

import React from 'react';
import { ArrowRight, Brain, Zap } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TransformationCard } from './components/TransformationCard';
import { ModelsPage } from './pages/Models';
import { TRANSFORMATIONS, TOTAL_MODELS, FRAMEWORK_VERSION } from './constants/transformations';

// Using SY19 (Meta-Model Selection) for view management
export const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'home' | 'models'>('home');

  const handleNavigate = (view: 'home' | 'models'): void => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show Models page
  if (currentView === 'models') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20">
          <ModelsPage />
        </div>
        <Footer />
      </div>
    );
  }

  // Show Home page
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-hummbl-light rounded-full text-sm text-hummbl-primary font-medium">
              <Zap className="w-4 h-4" />
              <span>Framework Version {FRAMEWORK_VERSION}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Think Better with
              <br />
              <span className="text-hummbl-primary">HUMMBL Base120</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive framework of {TOTAL_MODELS} mental models organized across 6 fundamental transformations. 
              Enhance decision-making, problem-solving, and strategic thinking.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => handleNavigate('models')}
                className="px-8 py-4 bg-hummbl-primary text-white rounded-lg font-semibold hover:bg-hummbl-secondary transition-colors flex items-center space-x-2"
              >
                <span>Explore Framework</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleNavigate('models')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-hummbl-primary hover:text-hummbl-primary transition-colors flex items-center space-x-2"
              >
                <Brain className="w-5 h-5" />
                <span>Browse Models</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-hummbl-primary mb-2">{TOTAL_MODELS}</div>
              <div className="text-gray-600">Mental Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-hummbl-primary mb-2">{TRANSFORMATIONS.length}</div>
              <div className="text-gray-600">Transformations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-hummbl-primary mb-2">20</div>
              <div className="text-gray-600">Models per Transformation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section id="transformations" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The 6 Transformations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each transformation represents a fundamental pattern of thinking, 
              containing 20 carefully curated mental models.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRANSFORMATIONS.map((transformation) => (
              <TransformationCard
                key={transformation.code}
                transformation={transformation}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Framework Overview */}
      <section id="framework" className="py-20 bg-gray-900 text-white px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                What is HUMMBL Base120?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  HUMMBL Base120 is a systematic framework for understanding and applying mental models. 
                  It organizes 120 proven thinking patterns into 6 fundamental transformations.
                </p>
                <p>
                  Each mental model is a tool for better thinking—a lens through which to view problems, 
                  make decisions, and understand complex systems.
                </p>
                <p>
                  By mastering these models across all transformations, you develop a comprehensive 
                  toolkit for tackling any challenge with clarity and confidence.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Perspective (P)</h3>
                <p className="text-gray-300 text-sm">Frame problems from different viewpoints</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Inversion (IN)</h3>
                <p className="text-gray-300 text-sm">Work backward to find solutions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Systems (SY)</h3>
                <p className="text-gray-300 text-sm">Understand patterns and emergence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
