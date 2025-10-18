// Narrative filtering and search component

import { useState, useEffect } from 'react';
import type { FilterOptions } from '../../hooks/useNarrativeFilters';
import './NarrativeFilters.css';

interface NarrativeFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  resultCount: number;
  totalCount: number;
  categories: string[];
}

export function NarrativeFilters({
  filters,
  onFiltersChange,
  resultCount,
  totalCount,
  categories,
}: NarrativeFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.searchTerm) {
        onFiltersChange({ ...filters, searchTerm: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput('');
    onFiltersChange({ ...filters, searchTerm: '' });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      category: e.target.value || null,
    });
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      evidenceGrade: e.target.value || null,
    });
  };

  const handleComplexityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      complexityLevel: e.target.value || null,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      sortBy: e.target.value as FilterOptions['sortBy'],
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      searchTerm: '',
      category: null,
      evidenceGrade: null,
      complexityLevel: null,
      sortBy: 'default',
      sortDirection: 'desc',
    });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.category ||
    filters.evidenceGrade ||
    filters.complexityLevel ||
    filters.sortBy !== 'default';

  const removeFilter = (filterKey: keyof FilterOptions) => {
    if (filterKey === 'searchTerm') {
      setSearchInput('');
    }
    onFiltersChange({
      ...filters,
      [filterKey]: filterKey === 'sortBy' ? 'default' : null,
    });
  };

  return (
    <div className="narrative-filters">
      {/* Search Bar */}
      <div className="filter-search">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search narratives by title, tags, or domain..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search narratives"
          />
          {searchInput && (
            <button
              className="search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">Category</label>
          <select
            id="category-filter"
            className="filter-select"
            value={filters.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="grade-filter" className="filter-label">Evidence Grade</label>
          <select
            id="grade-filter"
            className="filter-select"
            value={filters.evidenceGrade || ''}
            onChange={handleGradeChange}
          >
            <option value="">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="complexity-filter" className="filter-label">Complexity</label>
          <select
            id="complexity-filter"
            className="filter-select"
            value={filters.complexityLevel || ''}
            onChange={handleComplexityChange}
          >
            <option value="">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter" className="filter-label">Sort By</label>
          <select
            id="sort-filter"
            className="filter-select"
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            <option value="default">Default</option>
            <option value="title">Title (A-Z)</option>
            <option value="confidence">Confidence</option>
            <option value="citations">Citations</option>
          </select>
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="filter-status">
        <div className="filter-results">
          <span className="results-count">
            Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong> narratives
          </span>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            {filters.searchTerm && (
              <button
                className="filter-chip"
                onClick={() => removeFilter('searchTerm')}
                aria-label={`Remove search filter: ${filters.searchTerm}`}
              >
                Search: "{filters.searchTerm.substring(0, 20)}..." ✕
              </button>
            )}
            {filters.category && (
              <button
                className="filter-chip"
                onClick={() => removeFilter('category')}
                aria-label={`Remove category filter: ${filters.category}`}
              >
                {filters.category} ✕
              </button>
            )}
            {filters.evidenceGrade && (
              <button
                className="filter-chip"
                onClick={() => removeFilter('evidenceGrade')}
                aria-label={`Remove grade filter: ${filters.evidenceGrade}`}
              >
                Grade {filters.evidenceGrade} ✕
              </button>
            )}
            {filters.complexityLevel && (
              <button
                className="filter-chip"
                onClick={() => removeFilter('complexityLevel')}
                aria-label={`Remove complexity filter: ${filters.complexityLevel}`}
              >
                {filters.complexityLevel} complexity ✕
              </button>
            )}
            {filters.sortBy !== 'default' && (
              <button
                className="filter-chip"
                onClick={() => removeFilter('sortBy')}
                aria-label={`Remove sort: ${filters.sortBy}`}
              >
                Sort: {filters.sortBy} ✕
              </button>
            )}
            <button className="clear-all-button" onClick={handleClearFilters}>
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
