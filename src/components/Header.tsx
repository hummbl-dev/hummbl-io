/**
 * Header Component
 * 
 * Main navigation header for HUMMBL website.
 * Displays logo, navigation links, and CTA button.
 * 
 * @module components/Header
 * @version 1.0.0
 */

import React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../utils/cn';

interface HeaderProps {
  className?: string;
  onNavigate?: (view: 'home' | 'models') => void;
  currentView?: 'home' | 'models';
}

export const Header: React.FC<HeaderProps> = ({ className, onNavigate, currentView = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <div className="w-8 h-8 bg-hummbl-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HUMMBL</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#framework" className="text-gray-600 hover:text-hummbl-primary transition-colors">
              Framework
            </a>
            <a href="#transformations" className="text-gray-600 hover:text-hummbl-primary transition-colors">
              Transformations
            </a>
            <button
              onClick={() => onNavigate?.('models')}
              className={cn(
                "text-gray-600 hover:text-hummbl-primary transition-colors",
                currentView === 'models' && "text-hummbl-primary font-semibold"
              )}
            >
              Models
            </button>
            <a href="#about" className="text-gray-600 hover:text-hummbl-primary transition-colors">
              About
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => onNavigate?.('models')}
              className="px-6 py-2 bg-hummbl-primary text-white rounded-lg hover:bg-hummbl-secondary transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-hummbl-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <a
              href="#framework"
              className="block text-gray-600 hover:text-hummbl-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Framework
            </a>
            <a
              href="#transformations"
              className="block text-gray-600 hover:text-hummbl-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Transformations
            </a>
            <button
              onClick={() => {
                onNavigate?.('models');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-hummbl-primary transition-colors"
            >
              Models
            </button>
            <a
              href="#about"
              className="block text-gray-600 hover:text-hummbl-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <button
              onClick={() => {
                onNavigate?.('models');
                setIsMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-hummbl-primary text-white rounded-lg hover:bg-hummbl-secondary transition-colors"
            >
              Get Started
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
