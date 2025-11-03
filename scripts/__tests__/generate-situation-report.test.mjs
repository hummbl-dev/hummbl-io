/**
 * Tests for Situation Report Generator
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the class
import SituationReportGenerator from '../generate-situation-report.mjs';

describe('SituationReportGenerator', () => {
  let generator;
  let testReportDir;

  beforeEach(() => {
    generator = new SituationReportGenerator();
    testReportDir = path.join(process.cwd(), 'reports', 'test');
    
    // Create test directory
    if (!fs.existsSync(testReportDir)) {
      fs.mkdirSync(testReportDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testReportDir)) {
      fs.rmSync(testReportDir, { recursive: true, force: true });
    }
  });

  describe('Basic Functionality', () => {
    it('should create an instance successfully', () => {
      expect(generator).toBeDefined();
      expect(generator.issues).toEqual([]);
    });

    it('should have timestamp set', () => {
      expect(generator.timestamp).toBeDefined();
      expect(typeof generator.timestamp).toBe('string');
    });

    it('should have rootDir set', () => {
      expect(generator.rootDir).toBeDefined();
      expect(typeof generator.rootDir).toBe('string');
    });
  });

  describe('Issue Management', () => {
    it('should add issues correctly', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Test Issue',
        priority: 'HIGH',
        description: 'Test description',
        impact: 'Test impact',
        recommendation: 'Test recommendation'
      });

      expect(generator.issues.length).toBe(1);
      expect(generator.issues[0].title).toBe('Test Issue');
      expect(generator.issues[0].priority).toBe('HIGH');
      expect(generator.issues[0].priorityWeight).toBe(3);
    });

    it('should assign correct priority weights', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Critical Issue',
        priority: 'CRITICAL',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      generator.addIssue({
        category: 'Testing',
        title: 'Low Issue',
        priority: 'LOW',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      expect(generator.issues[0].priorityWeight).toBe(4);
      expect(generator.issues[1].priorityWeight).toBe(1);
    });

    it('should assign sequential IDs', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Issue 1',
        priority: 'HIGH',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      generator.addIssue({
        category: 'Testing',
        title: 'Issue 2',
        priority: 'HIGH',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      expect(generator.issues[0].id).toBe(1);
      expect(generator.issues[1].id).toBe(2);
    });
  });

  describe('Report Generation', () => {
    it('should generate a report with metadata', () => {
      const report = generator.generate();

      expect(report).toBeDefined();
      expect(report.metadata).toBeDefined();
      expect(report.metadata.totalIssues).toBeGreaterThanOrEqual(0);
      expect(report.metadata.criticalCount).toBeGreaterThanOrEqual(0);
      expect(report.metadata.highCount).toBeGreaterThanOrEqual(0);
      expect(report.metadata.mediumCount).toBeGreaterThanOrEqual(0);
      expect(report.metadata.lowCount).toBeGreaterThanOrEqual(0);
    });

    it('should generate a report with summary', () => {
      const report = generator.generate();

      expect(report.summary).toBeDefined();
      expect(report.summary.status).toBeDefined();
      expect(['CRITICAL', 'AT_RISK', 'STABLE']).toContain(report.summary.status);
      expect(report.summary.recommendation).toBeDefined();
    });

    it('should generate a report with sorted issues', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Low Issue',
        priority: 'LOW',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      generator.addIssue({
        category: 'Testing',
        title: 'Critical Issue',
        priority: 'CRITICAL',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      const report = generator.generate();

      // Issues should be sorted by priority (CRITICAL first)
      expect(report.issues[0].priority).toBe('CRITICAL');
      expect(report.issues[report.issues.length - 1].priority).toBe('LOW');
    });
  });

  describe('Summary Generation', () => {
    it('should set status to CRITICAL when critical issues exist', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Critical Issue',
        priority: 'CRITICAL',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      // Sort issues and generate summary without running full analysis
      generator.issues.sort((a, b) => b.priorityWeight - a.priorityWeight);
      const summary = generator.generateSummary();
      expect(summary.status).toBe('CRITICAL');
    });

    it('should set status to AT_RISK when many high priority issues exist', () => {
      for (let i = 0; i < 4; i++) {
        generator.addIssue({
          category: 'Testing',
          title: `High Issue ${i}`,
          priority: 'HIGH',
          description: 'Test',
          impact: 'Test',
          recommendation: 'Test'
        });
      }

      generator.issues.sort((a, b) => b.priorityWeight - a.priorityWeight);
      const summary = generator.generateSummary();
      expect(summary.status).toBe('AT_RISK');
    });

    it('should set status to STABLE when no critical or many high issues exist', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Low Issue',
        priority: 'LOW',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      generator.issues.sort((a, b) => b.priorityWeight - a.priorityWeight);
      const summary = generator.generateSummary();
      expect(summary.status).toBe('STABLE');
    });

    it('should list immediate actions for critical issues', () => {
      generator.addIssue({
        category: 'Testing',
        title: 'Critical Issue 1',
        priority: 'CRITICAL',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      generator.addIssue({
        category: 'Testing',
        title: 'Critical Issue 2',
        priority: 'CRITICAL',
        description: 'Test',
        impact: 'Test',
        recommendation: 'Test'
      });

      generator.issues.sort((a, b) => b.priorityWeight - a.priorityWeight);
      const summary = generator.generateSummary();
      expect(summary.immediateActions.length).toBe(2);
      expect(summary.immediateActions[0]).toBe('Critical Issue 1');
    });
  });

  describe('Priority Ranking', () => {
    it('should rank critical issues first', () => {
      generator.addIssue({ category: 'A', title: 'Medium', priority: 'MEDIUM', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'Critical', priority: 'CRITICAL', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'High', priority: 'HIGH', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'Low', priority: 'LOW', description: 'Test', impact: 'Test', recommendation: 'Test' });

      // Sort manually to avoid running full analysis
      generator.issues.sort((a, b) => b.priorityWeight - a.priorityWeight);

      expect(generator.issues[0].priority).toBe('CRITICAL');
      expect(generator.issues[1].priority).toBe('HIGH');
      expect(generator.issues[2].priority).toBe('MEDIUM');
      expect(generator.issues[3].priority).toBe('LOW');
    });
  });

  describe('Report Output', () => {
    it('should have all required report fields', () => {
      const report = generator.generate();

      expect(report.metadata).toBeDefined();
      expect(report.metadata.generatedAt).toBeDefined();
      expect(report.metadata.totalIssues).toBeDefined();
      expect(report.metadata.criticalCount).toBeDefined();
      expect(report.metadata.highCount).toBeDefined();
      expect(report.metadata.mediumCount).toBeDefined();
      expect(report.metadata.lowCount).toBeDefined();

      expect(report.issues).toBeDefined();
      expect(Array.isArray(report.issues)).toBe(true);

      expect(report.summary).toBeDefined();
      expect(report.summary.status).toBeDefined();
      expect(report.summary.immediateActions).toBeDefined();
      expect(report.summary.topRisks).toBeDefined();
      expect(report.summary.recommendation).toBeDefined();
    });

    it('should count issues correctly', () => {
      generator.addIssue({ category: 'A', title: 'Critical 1', priority: 'CRITICAL', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'Critical 2', priority: 'CRITICAL', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'High', priority: 'HIGH', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'Medium', priority: 'MEDIUM', description: 'Test', impact: 'Test', recommendation: 'Test' });
      generator.addIssue({ category: 'A', title: 'Low', priority: 'LOW', description: 'Test', impact: 'Test', recommendation: 'Test' });

      const report = generator.generate();

      expect(report.metadata.totalIssues).toBeGreaterThanOrEqual(5);
      expect(report.metadata.criticalCount).toBeGreaterThanOrEqual(2);
      expect(report.metadata.highCount).toBeGreaterThanOrEqual(1);
      expect(report.metadata.mediumCount).toBeGreaterThanOrEqual(1);
      expect(report.metadata.lowCount).toBeGreaterThanOrEqual(1);
    });
  });
});
