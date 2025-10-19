// Scalable content import pipeline for narratives and mental models

import type { Narrative } from '../types/narrative';
import type { MentalModel } from '../types/mentalModel';

export interface ImportResult<T> {
  success: boolean;
  data?: T[];
  errors: ImportError[];
  stats: ImportStats;
}

export interface ImportError {
  file?: string;
  line?: number;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  duration: number;
}

export interface ValidationRule<T> {
  field: keyof T;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validator?: (value: unknown) => boolean;
}

/**
 * Content Import Pipeline
 */
export class ContentImportPipeline {
  private errors: ImportError[] = [];

  /**
   * Import narratives from JSON
   */
  async importNarratives(data: unknown[]): Promise<ImportResult<Narrative>> {
    const startTime = Date.now();
    this.errors = [];

    const stats: ImportStats = {
      total: data.length,
      imported: 0,
      skipped: 0,
      failed: 0,
      duration: 0,
    };

    const validNarratives: Narrative[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      try {
        const validated = this.validateNarrative(item, i);
        
        if (validated) {
          validNarratives.push(validated);
          stats.imported++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        stats.failed++;
        this.errors.push({
          line: i + 1,
          message: error instanceof Error ? error.message : 'Validation failed',
          severity: 'error',
        });
      }
    }

    stats.duration = Date.now() - startTime;

    return {
      success: stats.failed === 0,
      data: validNarratives,
      errors: this.errors,
      stats,
    };
  }

  /**
   * Import mental models from JSON
   */
  async importMentalModels(data: unknown[]): Promise<ImportResult<MentalModel>> {
    const startTime = Date.now();
    this.errors = [];

    const stats: ImportStats = {
      total: data.length,
      imported: 0,
      skipped: 0,
      failed: 0,
      duration: 0,
    };

    const validModels: MentalModel[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      try {
        const validated = this.validateMentalModel(item, i);
        
        if (validated) {
          validModels.push(validated);
          stats.imported++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        stats.failed++;
        this.errors.push({
          line: i + 1,
          message: error instanceof Error ? error.message : 'Validation failed',
          severity: 'error',
        });
      }
    }

    stats.duration = Date.now() - startTime;

    return {
      success: stats.failed === 0,
      data: validModels,
      errors: this.errors,
      stats,
    };
  }

  /**
   * Validate narrative object
   */
  private validateNarrative(data: unknown, index: number): Narrative | null {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid narrative object');
    }

    const item = data as Record<string, unknown>;

    // Required fields
    const required = [
      'narrative_id',
      'title',
      'summary',
      'category',
      'evidence_quality',
      'confidence_level',
    ];

    for (const field of required) {
      if (!item[field]) {
        this.errors.push({
          line: index + 1,
          field,
          message: `Missing required field: ${field}`,
          severity: 'error',
        });
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Type validation
    if (typeof item.narrative_id !== 'string') {
      throw new Error('narrative_id must be string');
    }

    if (typeof item.title !== 'string') {
      throw new Error('title must be string');
    }

    if (typeof item.summary !== 'string') {
      throw new Error('summary must be string');
    }

    // Validate evidence_quality enum
    const validQualities = ['High', 'Medium', 'Low', 'Preliminary'];
    if (!validQualities.includes(item.evidence_quality as string)) {
      this.errors.push({
        line: index + 1,
        field: 'evidence_quality',
        message: `Invalid evidence_quality. Must be one of: ${validQualities.join(', ')}`,
        severity: 'warning',
      });
    }

    // Optional fields with validation
    if (item.tags && !Array.isArray(item.tags)) {
      this.errors.push({
        line: index + 1,
        field: 'tags',
        message: 'tags must be an array',
        severity: 'warning',
      });
    }

    return item as Narrative;
  }

  /**
   * Validate mental model object
   */
  private validateMentalModel(data: unknown, index: number): MentalModel | null {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid mental model object');
    }

    const item = data as Record<string, unknown>;

    // Required fields
    const required = ['id', 'name', 'category'];

    for (const field of required) {
      if (!item[field]) {
        this.errors.push({
          line: index + 1,
          field,
          message: `Missing required field: ${field}`,
          severity: 'error',
        });
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Type validation
    if (typeof item.id !== 'string') {
      throw new Error('id must be string');
    }

    if (typeof item.name !== 'string') {
      throw new Error('name must be string');
    }

    // Optional fields with validation
    if (item.tags && !Array.isArray(item.tags)) {
      this.errors.push({
        line: index + 1,
        field: 'tags',
        message: 'tags must be an array',
        severity: 'warning',
      });
    }

    if (item.difficulty) {
      const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
      if (!validDifficulties.includes(item.difficulty as string)) {
        this.errors.push({
          line: index + 1,
          field: 'difficulty',
          message: `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`,
          severity: 'warning',
        });
      }
    }

    return item as MentalModel;
  }

  /**
   * Import from file
   */
  async importFromFile(file: File, type: 'narratives' | 'mentalModels'): Promise<ImportResult<Narrative | MentalModel>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);

          if (!Array.isArray(data)) {
            reject(new Error('File must contain an array of items'));
            return;
          }

          const result = type === 'narratives'
            ? await this.importNarratives(data)
            : await this.importMentalModels(data);

          resolve(result as ImportResult<Narrative | MentalModel>);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Batch import from multiple files
   */
  async batchImport(
    files: File[],
    type: 'narratives' | 'mentalModels'
  ): Promise<ImportResult<Narrative | MentalModel>> {
    const allData: (Narrative | MentalModel)[] = [];
    const allErrors: ImportError[] = [];
    const combinedStats: ImportStats = {
      total: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
      duration: 0,
    };

    const startTime = Date.now();

    for (const file of files) {
      try {
        const result = await this.importFromFile(file, type);

        if (result.data) {
          allData.push(...result.data);
        }

        allErrors.push(...result.errors.map(err => ({ ...err, file: file.name })));
        
        combinedStats.total += result.stats.total;
        combinedStats.imported += result.stats.imported;
        combinedStats.skipped += result.stats.skipped;
        combinedStats.failed += result.stats.failed;
      } catch (error) {
        allErrors.push({
          file: file.name,
          message: error instanceof Error ? error.message : 'Import failed',
          severity: 'error',
        });
        combinedStats.failed++;
      }
    }

    combinedStats.duration = Date.now() - startTime;

    return {
      success: combinedStats.failed === 0,
      data: allData,
      errors: allErrors,
      stats: combinedStats,
    };
  }

  /**
   * Export content to JSON
   */
  exportToJSON(data: Narrative[] | MentalModel[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Merge imported content with existing
   */
  mergeContent<T extends { id?: string; narrative_id?: string }>(
    existing: T[],
    imported: T[],
    strategy: 'replace' | 'skip' | 'merge' = 'replace'
  ): T[] {
    const existingMap = new Map<string, T>();

    existing.forEach((item) => {
      const id = 'id' in item ? item.id : item.narrative_id;
      if (id) {
        existingMap.set(id, item);
      }
    });

    const merged: T[] = [...existing];

    imported.forEach((item) => {
      const id = 'id' in item ? item.id : item.narrative_id;
      if (!id) return;

      if (existingMap.has(id)) {
        switch (strategy) {
          case 'replace':
            // Replace existing item
            const index = merged.findIndex((m) => {
              const mId = 'id' in m ? m.id : m.narrative_id;
              return mId === id;
            });
            if (index !== -1) {
              merged[index] = item;
            }
            break;

          case 'skip':
            // Skip, keep existing
            break;

          case 'merge':
            // Merge properties
            const index2 = merged.findIndex((m) => {
              const mId = 'id' in m ? m.id : m.narrative_id;
              return mId === id;
            });
            if (index2 !== -1) {
              merged[index2] = { ...merged[index2], ...item };
            }
            break;
        }
      } else {
        // New item, add it
        merged.push(item);
      }
    });

    return merged;
  }

  /**
   * Get import errors
   */
  getErrors(): ImportError[] {
    return this.errors;
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errors = [];
  }
}

/**
 * Singleton instance
 */
let pipelineInstance: ContentImportPipeline | null = null;

export function getImportPipeline(): ContentImportPipeline {
  if (!pipelineInstance) {
    pipelineInstance = new ContentImportPipeline();
  }
  return pipelineInstance;
}

export function resetImportPipeline(): void {
  pipelineInstance = null;
}
