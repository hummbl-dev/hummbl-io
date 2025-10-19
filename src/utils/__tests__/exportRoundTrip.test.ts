// Round-trip tests for export/import functionality

import { describe, it, expect } from 'vitest';
import type { Narrative } from '../../types/narrative';
import { exportToJSON, exportToCSV, exportToMarkdown } from '../exportNarratives';
import { parseJSONImport, parseCSVImport, parseMarkdownImport, compareNarratives } from '../importParsers';
import { validateJSONExport, validateCSVExport, validateMarkdownExport } from '../exportValidation';

// Test data
const mockNarratives: Narrative[] = [
  {
    narrative_id: 'N001',
    title: 'Test Narrative One',
    summary: 'This is a test summary with "quotes" and special chars: <>&',
    category: 'Test Category',
    evidence_quality: 'A',
    confidence: 0.95,
    domain: ['Testing', 'Validation'],
    tags: ['test', 'validation', 'round-trip'],
    linked_signals: [],
    relationships: [],
    citations: [
      {
        author: 'Test Author',
        year: 2024,
        title: 'Test Paper',
        source: 'Test Journal',
      },
    ],
    examples: [],
    elicitation_methods: [],
    complexity: {
      cognitive_load: 'medium',
      time_to_elicit: '15-30 minutes',
      expertise_required: 'intermediate',
    },
  },
  {
    narrative_id: 'N002',
    title: 'Test Narrative Two',
    summary: 'Another test with commas, semicolons; and newlines\nin the text',
    category: 'Another Category',
    evidence_quality: 'B',
    confidence: 0.87,
    domain: ['Testing'],
    tags: ['test'],
    linked_signals: [],
    relationships: [],
    citations: [],
    examples: [],
    elicitation_methods: [],
  },
];

describe('Export Validation', () => {
  it('validates valid JSON export', () => {
    const result = validateJSONExport(mockNarratives);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects invalid JSON structure', () => {
    const result = validateJSONExport({ invalid: 'structure' });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('detects missing required fields', () => {
    const invalid = [{ narrative_id: 'N001' }]; // Missing other required fields
    const result = validateJSONExport(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('Missing required field'))).toBe(true);
  });
});

describe('JSON Round-Trip', () => {
  it('exports and imports JSON without data loss', () => {
    // Export
    const exported = JSON.stringify(mockNarratives, null, 2);
    
    // Validate export
    const validation = validateJSONExport(JSON.parse(exported));
    expect(validation.isValid).toBe(true);
    
    // Import
    const parseResult = parseJSONImport(exported);
    expect(parseResult.success).toBe(true);
    expect(parseResult.data).toBeDefined();
    
    // Compare
    if (parseResult.data) {
      expect(parseResult.data.length).toBe(mockNarratives.length);
      
      mockNarratives.forEach((original, index) => {
        const parsed = parseResult.data![index];
        const differences = compareNarratives(original, parsed);
        expect(differences).toHaveLength(0);
      });
    }
  });

  it('handles special characters in JSON', () => {
    const specialChars: Narrative[] = [{
      ...mockNarratives[0],
      title: 'Test with "quotes" and \'apostrophes\'',
      summary: 'Contains <tags>, &amp; ampersands, and unicode: café',
    }];

    const exported = JSON.stringify(specialChars, null, 2);
    const parseResult = parseJSONImport(exported);
    
    expect(parseResult.success).toBe(true);
    expect(parseResult.data?.[0].title).toBe(specialChars[0].title);
    expect(parseResult.data?.[0].summary).toBe(specialChars[0].summary);
  });
});

describe('CSV Round-Trip', () => {
  it('validates CSV format', () => {
    // Create a mock CSV export
    const csvContent = `ID,Title,Category,Evidence Grade,Confidence,Summary
N001,"Test Title","Test Category",A,95,"Test summary"`;
    
    const result = validateCSVExport(csvContent);
    expect(result.isValid).toBe(true);
  });

  it('detects CSV format errors', () => {
    const invalidCSV = 'Not a valid CSV';
    const result = validateCSVExport(invalidCSV);
    expect(result.isValid).toBe(false);
  });

  it('handles quoted values in CSV', () => {
    const csvContent = `ID,Title,Category,Evidence Grade,Confidence,Summary
N001,"Title with ""quotes""","Category",A,95,"Summary with, comma"`;
    
    const parseResult = parseCSVImport(csvContent);
    expect(parseResult.success).toBe(true);
    expect(parseResult.data?.[0].title).toBe('Title with "quotes"');
    expect(parseResult.data?.[0].summary).toBe('Summary with, comma');
  });

  it('parses CSV arrays correctly', () => {
    const csvContent = `ID,Title,Category,Evidence Grade,Confidence,Summary,Domains,Tags
N001,"Test","Category",A,95,"Summary","Domain1, Domain2","tag1, tag2"`;
    
    const parseResult = parseCSVImport(csvContent);
    expect(parseResult.success).toBe(true);
    expect(parseResult.data?.[0].domain).toEqual(['Domain1', 'Domain2']);
    expect(parseResult.data?.[0].tags).toEqual(['tag1', 'tag2']);
  });
});

describe('Markdown Round-Trip', () => {
  it('validates Markdown format', () => {
    const markdownContent = `# HUMMBL Narratives Export

**Generated:** 2024-01-01
**Total Narratives:** 1

# Test Title

**ID:** \`N001\`
**Category:** Test

## Summary

This is a summary.`;

    const result = validateMarkdownExport(markdownContent);
    expect(result.isValid).toBe(true);
  });

  it('parses Markdown metadata', () => {
    const markdownContent = `# HUMMBL Narratives Export

**Generated:** 2024-01-01
**Total Narratives:** 1

# Test Title

**ID:** \`N001\`
**Category:** Test Category
**Evidence Grade:** A
**Confidence:** 95%

## Summary

This is a test summary.

## Domains

- Testing
- Validation

## Tags

\`test\`, \`validation\``;

    const parseResult = parseMarkdownImport(markdownContent);
    expect(parseResult.success).toBe(true);
    expect(parseResult.data?.[0].narrative_id).toBe('N001');
    expect(parseResult.data?.[0].title).toBe('Test Title');
    expect(parseResult.data?.[0].category).toBe('Test Category');
    expect(parseResult.data?.[0].evidence_quality).toBe('A');
    expect(parseResult.data?.[0].confidence).toBe(0.95);
    expect(parseResult.data?.[0].domain).toEqual(['Testing', 'Validation']);
    expect(parseResult.data?.[0].tags).toEqual(['test', 'validation']);
  });
});

describe('Edge Cases', () => {
  it('handles empty arrays', () => {
    const emptyExport = JSON.stringify([]);
    const parseResult = parseJSONImport(emptyExport);
    expect(parseResult.success).toBe(true);
    expect(parseResult.data).toHaveLength(0);
  });

  it('handles malformed JSON', () => {
    const malformed = '{ invalid json }';
    const parseResult = parseJSONImport(malformed);
    expect(parseResult.success).toBe(false);
    expect(parseResult.error).toBeDefined();
  });

  it('handles empty CSV', () => {
    const parseResult = parseCSVImport('');
    expect(parseResult.success).toBe(false);
  });

  it('handles empty Markdown', () => {
    const parseResult = parseMarkdownImport('');
    expect(parseResult.success).toBe(false);
  });
});

describe('Compare Narratives', () => {
  it('detects no differences in identical narratives', () => {
    const differences = compareNarratives(mockNarratives[0], mockNarratives[0]);
    expect(differences).toHaveLength(0);
  });

  it('detects differences in narratives', () => {
    const modified = {
      ...mockNarratives[0],
      title: 'Modified Title',
    };
    const differences = compareNarratives(mockNarratives[0], modified);
    expect(differences.length).toBeGreaterThan(0);
    expect(differences.some((d) => d.includes('Title'))).toBe(true);
  });
});
