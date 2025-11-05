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
import { ScrollToTop } from './components/ScrollToTop';
import { FeedbackButton } from './components/FeedbackButton';
import { ContactForm } from './components/ContactForm';
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
        <Header onNavigate={handleNavigate} currentView="models" />
        <div className="pt-20">
          <ModelsPage onNavigateHome={() => handleNavigate('home')} />
        </div>
        <Footer />
        <ScrollToTop />
        <FeedbackButton />
      </div>
    );
  }

  // Show Home page
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} currentView="home" />
      
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

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About HUMMBL Base120
            </h2>
            <p className="text-xl text-gray-600">
              A systematic approach to thinking and decision-making
            </p>
          </div>
          
          <div className="space-y-8 text-gray-700">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="leading-relaxed">
                HUMMBL Systems provides frameworks and tools that enhance cognitive capability through 
                systematic application of mental models. We believe better thinking leads to better decisions, 
                better solutions, and better outcomes across all domains of human endeavor.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Framework</h3>
              <p className="leading-relaxed mb-4">
                Base120 represents a carefully curated collection of 120 mental models organized across 
                6 fundamental transformations. Each model has been validated through real-world application 
                and refined through systematic usage analysis.
              </p>
              <p className="leading-relaxed">
                The framework progresses from Base6 foundational models through Base42 critical mass 
                collection to the complete Base120 taxonomy, enabling users to engage at the depth 
                appropriate to their needs and expertise level.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <p className="leading-relaxed">
                Unlike theoretical frameworks that collect mental models for comprehensiveness, HUMMBL 
                Base120 prioritizes empirically validated utility. Each model in the Base42 critical mass 
                collection demonstrates consistent application value across diverse problem-solving contexts.
              </p>
            </div>
            
            <div className="text-center pt-8">
              <button
                onClick={() => handleNavigate('models')}
                className="px-8 py-4 bg-hummbl-primary text-white rounded-lg font-semibold hover:bg-hummbl-secondary transition-colors inline-flex items-center space-x-2"
              >
                <span>Explore the Framework</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-3">Perspective (P)</h3>
                <p className="text-gray-300 text-sm">Frame problems from different viewpoints</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-3">Inversion (IN)</h3>
                <p className="text-gray-300 text-sm">Work backward to find solutions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-3">Composition (CO)</h3>
                <p className="text-gray-300 text-sm">Build up and integrate elements</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-3">Decomposition (DE)</h3>
                <p className="text-gray-300 text-sm">Break down and analyze complexity</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-3">Recursion (RE)</h3>
                <p className="text-gray-300 text-sm">Apply patterns iteratively</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold mb-3">Systems (SY)</h3>
                <p className="text-gray-300 text-sm">Understand patterns and emergence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions about the framework? Want to share feedback or collaborate? We'd love to hear from you.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <FeedbackButton />
    </div>
  );
};
