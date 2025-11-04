/**
 * Search Bar Component
 * 
 * Provides search input with debouncing and clear functionality.
 * Supports keyboard shortcuts and accessibility features.
 * 
 * @module components/SearchBar
 * @version 1.0.0
 */

import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  className?: string;
}

// Using DE4 (Interface Specification) for clear search contract
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search mental models by code, name, or tags...',
  resultCount,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  // Using RE6 (Feedback Loops) for debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(debouncedValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedValue, onChange]);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = (): void => {
    setDebouncedValue('');
    onChange('');
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDebouncedValue(e.target.value);
  };

  const hasValue = debouncedValue.trim().length > 0;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={debouncedValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 py-4 rounded-lg border-2 border-gray-300',
            'text-gray-900 placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-hummbl-primary focus:border-hummbl-primary',
            'transition-colors'
          )}
          aria-label="Search mental models"
          aria-describedby={hasValue && resultCount !== undefined ? 'search-results-count' : undefined}
        />

        {/* Clear Button */}
        {hasValue && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'text-gray-400 hover:text-gray-600 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-hummbl-primary rounded'
            )}
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Keyboard Shortcut Hint */}
        {!hasValue && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs text-gray-400">
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">K</kbd>
          </div>
        )}
      </div>

      {/* Results Count */}
      {hasValue && resultCount !== undefined && (
        <div
          id="search-results-count"
          className="mt-2 text-sm text-gray-600"
          role="status"
          aria-live="polite"
        >
          {resultCount === 0 ? (
            <span className="text-amber-600">No models found matching "{debouncedValue}"</span>
          ) : (
            <span>
              Found <span className="font-bold text-gray-900">{resultCount}</span> model{resultCount !== 1 ? 's' : ''} matching "{debouncedValue}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};
