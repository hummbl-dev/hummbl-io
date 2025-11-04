/**
 * ScrollToTop Component
 * 
 * Floating button that appears when user scrolls down.
 * Smoothly scrolls back to top of page when clicked.
 * 
 * @module components/ScrollToTop
 * @version 1.0.0
 */

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface ScrollToTopProps {
  className?: string;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ className }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-40 p-3 bg-hummbl-primary text-white rounded-full shadow-lg hover:bg-hummbl-secondary transition-all duration-300 hover:scale-110',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none',
        className
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};
