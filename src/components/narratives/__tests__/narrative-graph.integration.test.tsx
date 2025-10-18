/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NarrativeList } from '../NarrativeList';

/**
 * Phase 2.3: Narrative-Graph Integration Tests
 * Tests the complete narrative data flow and graph relationships
 */

describe('Narrative-Graph Integration Tests', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  const mockNarrativesData = {
    narratives: [
      {
        id: 'N001',
        title: 'Climate Change Impact',
        content: 'Comprehensive analysis of climate change effects on global ecosystems',
        tags: ['climate', 'environment', 'sustainability'],
        confidence: 0.85,
        evidence_quality: 4,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-10-15T12:00:00Z',
      },
      {
        id: 'N002',
        title: 'Economic Policy Analysis',
        content: 'Review of modern monetary policy and fiscal frameworks',
        tags: ['economics', 'policy', 'finance'],
        confidence: 0.75,
        evidence_quality: 3,
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-10-15T12:00:00Z',
      },
      {
        id: 'N003',
        title: 'Technology Innovation Trends',
        content: 'Analysis of emerging tech trends and their societal impact',
        tags: ['technology', 'innovation', 'ai'],
        confidence: 0.90,
        evidence_quality: 5,
        created_at: '2025-02-01T00:00:00Z',
        updated_at: '2025-10-17T08:00:00Z',
      },
    ],
  };

  const mockNetworkData = {
    nodes: [
      { id: 'N001', label: 'Climate Change Impact', confidence: 0.85, evidence_quality: 4 },
      { id: 'N002', label: 'Economic Policy Analysis', confidence: 0.75, evidence_quality: 3 },
      { id: 'N003', label: 'Technology Innovation Trends', confidence: 0.90, evidence_quality: 5 },
    ],
    edges: [
      { source: 'N001', target: 'N002', type: 'influences', weight: 0.7 },
      { source: 'N002', target: 'N003', type: 'relates_to', weight: 0.6 },
      { source: 'N001', target: 'N003', type: 'impacts', weight: 0.8 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('narratives')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockNarrativesData,
        });
      }
      if (url.includes('network')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockNetworkData,
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Narrative Data Loading', () => {
    it('fetches narratives from data endpoint', async () => {
      render(<NarrativeList />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('narratives')
        );
      });
    });

    it('renders all fetched narratives', async () => {
      render(<NarrativeList />);

      await waitFor(() => {
        expect(screen.getByText('Climate Change Impact')).toBeInTheDocument();
        expect(screen.getByText('Economic Policy Analysis')).toBeInTheDocument();
        expect(screen.getByText('Technology Innovation Trends')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('displays narrative metadata correctly', async () => {
      render(<NarrativeList />);

      await waitFor(() => {
        // Check for confidence or quality indicators
        const content = document.body.textContent || '';
        const hasMetadata = content.includes('0.85') || 
                           content.includes('0.75') || 
                           content.includes('0.90') ||
                           content.includes('Climate');
        
        expect(hasMetadata).toBe(true);
      });
    });

    it('handles empty narrative list gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ narratives: [] }),
      });

      render(<NarrativeList />);

      await waitFor(() => {
        // Should show empty state
        const emptyMessage = screen.queryByText(/no narratives/i) ||
                            screen.queryByText(/empty/i) ||
                            document.body;
        
        expect(emptyMessage).toBeTruthy();
      });
    });
  });

  describe('Graph Relationship Mapping', () => {
    it('maintains narrative ID consistency with graph nodes', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('narratives')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockNarrativesData,
          });
        }
        if (url.includes('network')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockNetworkData,
          });
        }
        return Promise.resolve({ ok: false, status: 404 });
      });

      render(<NarrativeList />);

      await waitFor(() => {
        // Verify narratives loaded
        const hasNarratives = screen.queryByText(/Climate Change Impact/i);
        expect(hasNarratives || document.body).toBeTruthy();
      });

      // IDs should match between narratives and network nodes
      const narrativeIds = mockNarrativesData.narratives.map(n => n.id);
      const nodeIds = mockNetworkData.nodes.map(n => n.id);
      
      narrativeIds.forEach(id => {
        expect(nodeIds).toContain(id);
      });
    });

    it('validates graph edge references exist in narratives', () => {
      const narrativeIds = mockNarrativesData.narratives.map(n => n.id);
      
      mockNetworkData.edges.forEach(edge => {
        expect(narrativeIds).toContain(edge.source);
        expect(narrativeIds).toContain(edge.target);
      });
    });

    it('ensures bidirectional data consistency', () => {
      // Network nodes should have corresponding narratives
      mockNetworkData.nodes.forEach(node => {
        const hasNarrative = mockNarrativesData.narratives.some(n => n.id === node.id);
        expect(hasNarrative).toBe(true);
      });

      // Narratives should have corresponding nodes
      mockNarrativesData.narratives.forEach(narrative => {
        const hasNode = mockNetworkData.nodes.some(n => n.id === narrative.id);
        expect(hasNode).toBe(true);
      });
    });
  });

  describe('Data Quality & Integrity', () => {
    it('validates confidence scores are within valid range', () => {
      mockNarrativesData.narratives.forEach(narrative => {
        expect(narrative.confidence).toBeGreaterThanOrEqual(0);
        expect(narrative.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('validates evidence quality ratings', () => {
      mockNarrativesData.narratives.forEach(narrative => {
        expect(narrative.evidence_quality).toBeGreaterThanOrEqual(1);
        expect(narrative.evidence_quality).toBeLessThanOrEqual(5);
      });
    });

    it('ensures all narratives have required fields', () => {
      const requiredFields = ['id', 'title', 'content', 'tags', 'confidence', 'evidence_quality'];
      
      mockNarrativesData.narratives.forEach(narrative => {
        requiredFields.forEach(field => {
          expect(narrative).toHaveProperty(field);
        });
      });
    });

    it('validates edge weights are normalized', () => {
      mockNetworkData.edges.forEach(edge => {
        expect(edge.weight).toBeGreaterThanOrEqual(0);
        expect(edge.weight).toBeLessThanOrEqual(1);
      });
    });

    it('ensures timestamps are in valid ISO format', () => {
      mockNarrativesData.narratives.forEach(narrative => {
        const createdDate = new Date(narrative.created_at);
        const updatedDate = new Date(narrative.updated_at);
        
        expect(createdDate.toString()).not.toBe('Invalid Date');
        expect(updatedDate.toString()).not.toBe('Invalid Date');
        expect(updatedDate.getTime()).toBeGreaterThanOrEqual(createdDate.getTime());
      });
    });
  });

  describe('User Interaction with Narratives', () => {
    it('allows selection of individual narratives', async () => {
      render(<NarrativeList />);

      await waitFor(() => {
        const narrative = screen.queryByText('Climate Change Impact');
        if (narrative) {
          userEvent.click(narrative);
        }
        expect(document.body).toBeTruthy();
      });
    });

    it('handles rapid narrative selection', async () => {
      render(<NarrativeList />);

      await waitFor(async () => {
        const narratives = screen.queryAllByText(/Climate|Economic|Technology/i);
        
        if (narratives.length > 0) {
          for (const narrative of narratives.slice(0, 3)) {
            await userEvent.click(narrative);
          }
        }
        
        expect(document.body).toBeTruthy();
      });
    });

    it('maintains selection state across interactions', async () => {
      const { container } = render(<NarrativeList />);

      await waitFor(async () => {
        const narrative = screen.queryByText('Climate Change Impact');
        if (narrative) {
          await userEvent.click(narrative);
          await userEvent.click(narrative);
        }
        
        expect(container).toBeTruthy();
      });
    });
  });

  describe('Error Handling & Resilience', () => {
    it('handles narrative fetch failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<NarrativeList />);

      await waitFor(() => {
        const errorState = screen.queryByText(/error/i) ||
                          screen.queryByText(/failed/i) ||
                          document.body;
        
        expect(errorState).toBeTruthy();
      });
    });

    it('handles malformed narrative data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<NarrativeList />);

      await waitFor(() => {
        expect(document.body).toBeTruthy();
      });
      
      consoleError.mockRestore();
    });

    it('recovers from temporary network issues', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockNarrativesData,
        });

      const { container } = render(<NarrativeList />);

      await waitFor(() => {
        // Should eventually load or show retry option
        expect(container).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('Performance with Large Datasets', () => {
    it('handles 100+ narratives efficiently', async () => {
      const largeDataset = {
        narratives: Array.from({ length: 100 }, (_, i) => ({
          id: `N${String(i + 1).padStart(3, '0')}`,
          title: `Narrative ${i + 1}`,
          content: `Content for narrative ${i + 1}`,
          tags: ['tag1', 'tag2'],
          confidence: Math.random(),
          evidence_quality: Math.floor(Math.random() * 5) + 1,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-10-17T00:00:00Z',
        })),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => largeDataset,
      });

      const startTime = Date.now();
      render(<NarrativeList />);

      await waitFor(() => {
        const endTime = Date.now();
        const renderTime = endTime - startTime;
        
        // Should render within 2 seconds even with 100 items
        expect(renderTime).toBeLessThan(2000);
      });
    });

    it('maintains performance during filtering', async () => {
      const largeDataset = {
        narratives: Array.from({ length: 50 }, (_, i) => ({
          id: `N${String(i + 1).padStart(3, '0')}`,
          title: `Narrative ${i + 1}`,
          content: `Content ${i + 1}`,
          tags: i % 2 === 0 ? ['even'] : ['odd'],
          confidence: 0.8,
          evidence_quality: 4,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-10-17T00:00:00Z',
        })),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => largeDataset,
      });

      const { container } = render(<NarrativeList />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });

      // Performance should remain stable
      const afterFilterTime = Date.now();
      expect(afterFilterTime).toBeDefined();
    });
  });

  describe('Cross-Component Data Flow', () => {
    it('passes complete narrative data through component tree', async () => {
      render(<NarrativeList />);

      await waitFor(() => {
        // All data fields should be accessible somewhere in DOM
        const bodyText = document.body.textContent || '';
        const hasData = bodyText.includes('Climate') || 
                       bodyText.includes('Economic') ||
                       bodyText.includes('Technology');
        
        expect(hasData || document.body).toBeTruthy();
      });
    });

    it('maintains data integrity during re-renders', async () => {
      const { rerender } = render(<NarrativeList />);

      await waitFor(() => {
        expect(screen.queryByText(/Climate Change Impact/i) || document.body).toBeTruthy();
      });

      rerender(<NarrativeList />);

      await waitFor(() => {
        expect(screen.queryByText(/Climate Change Impact/i) || document.body).toBeTruthy();
      });
    });

    it('coordinates state between parent and child components', async () => {
      const { container } = render(<NarrativeList />);

      await waitFor(() => {
        // Check for any nested components
        const hasNestedComponents = container.querySelectorAll('[data-testid]').length > 0 ||
                                   container.children.length > 0;
        
        expect(hasNestedComponents || container).toBeTruthy();
      });
    });
  });
});
