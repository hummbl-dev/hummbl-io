#!/usr/bin/env node
/**
 * Situation Report Generator
 * 
 * Analyzes the codebase to identify:
 * - Critical errors
 * - Security risks
 * - Technical gaps
 * - Priority rankings
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PRIORITY_LEVELS = {
  CRITICAL: { weight: 4, label: '🔴 CRITICAL', description: 'Immediate action required' },
  HIGH: { weight: 3, label: '🟠 HIGH', description: 'Should be addressed soon' },
  MEDIUM: { weight: 2, label: '🟡 MEDIUM', description: 'Should be addressed eventually' },
  LOW: { weight: 1, label: '🟢 LOW', description: 'Nice to have' }
};

// Constants for file analysis
const CODE_FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const EXCLUDED_DIRECTORIES = ['node_modules', 'dist', 'build', '__tests__'];
const LARGE_FILE_THRESHOLD = 500; // lines

class SituationReportGenerator {
  constructor() {
    this.issues = [];
    this.timestamp = new Date().toISOString();
    this.rootDir = process.cwd();
  }

  /**
   * Helper method to check if a file is a code file
   */
  isCodeFile(filename) {
    return CODE_FILE_EXTENSIONS.some(ext => filename.endsWith(ext));
  }

  /**
   * Helper method to check if a directory should be excluded
   */
  isExcludedDirectory(dirname) {
    return dirname.startsWith('.') || EXCLUDED_DIRECTORIES.includes(dirname);
  }

  /**
   * Helper method to format timestamps consistently
   */
  formatTimestamp(date = new Date()) {
    return date.toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Analyze TypeScript errors
   */
  analyzeTypeScriptErrors() {
    const errorFile = path.join(this.rootDir, 'typescript-errors.txt');
    
    if (!fs.existsSync(errorFile)) {
      this.addIssue({
        category: 'Build System',
        title: 'TypeScript error log not found',
        priority: 'MEDIUM',
        description: 'Cannot assess TypeScript compilation status',
        impact: 'Unknown type safety status',
        recommendation: 'Run typecheck to generate error log'
      });
      return;
    }

    const content = fs.readFileSync(errorFile, 'utf8');
    const errorLines = content.split('\n').filter(line => line.includes('error TS'));
    
    if (errorLines.length > 0) {
      // Group errors by file
      const errorsByFile = {};
      errorLines.forEach(line => {
        const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+):/);
        if (match) {
          const [, file, lineNum, col, errorCode] = match;
          if (!errorsByFile[file]) {
            errorsByFile[file] = [];
          }
          errorsByFile[file].push({ line: lineNum, col, code: errorCode });
        }
      });

      const fileCount = Object.keys(errorsByFile).length;
      const totalErrors = errorLines.length;

      this.addIssue({
        category: 'Build System',
        title: `TypeScript compilation errors: ${totalErrors} errors in ${fileCount} files`,
        priority: 'CRITICAL',
        description: `Type safety is compromised. ${totalErrors} TypeScript errors across ${fileCount} files prevent production builds.`,
        impact: 'Cannot build for production, type safety compromised, runtime errors likely',
        recommendation: 'Fix TypeScript errors starting with most critical files',
        details: {
          errorCount: totalErrors,
          fileCount: fileCount,
          topFiles: Object.entries(errorsByFile)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 5)
            .map(([file, errors]) => ({ file, errorCount: errors.length }))
        }
      });
    }
  }

  /**
   * Analyze test failures
   */
  analyzeTestFailures() {
    const testFile = path.join(this.rootDir, 'test-failures.txt');
    
    if (!fs.existsSync(testFile)) {
      this.addIssue({
        category: 'Testing',
        title: 'Test failure log not found',
        priority: 'MEDIUM',
        description: 'Cannot assess test coverage and quality',
        impact: 'Unknown test status',
        recommendation: 'Run test suite to generate failure log'
      });
      return;
    }

    const content = fs.readFileSync(testFile, 'utf8');
    
    // Parse test results
    const failedMatch = content.match(/(\d+)\s+failed/);
    const passedMatch = content.match(/(\d+)\s+tests?\s+\|\s+(\d+)\s+failed/);
    
    if (failedMatch) {
      const failedCount = parseInt(failedMatch[1]);
      
      // Extract test file info
      const testFileMatch = content.match(/❯\s+(.+?\.test\.ts)\s+\((\d+)\s+tests?\s+\|\s+(\d+)\s+failed\)/);
      const testFile = testFileMatch ? testFileMatch[1] : 'unknown';
      const totalTests = testFileMatch ? parseInt(testFileMatch[2]) : 0;
      
      const priority = failedCount > 20 ? 'CRITICAL' : failedCount > 10 ? 'HIGH' : 'MEDIUM';
      
      this.addIssue({
        category: 'Testing',
        title: `${failedCount} test failures detected`,
        priority,
        description: `${failedCount} out of ${totalTests} tests are failing in ${testFile}`,
        impact: 'Code quality and reliability compromised, features may not work as expected',
        recommendation: 'Fix failing tests, starting with critical functionality',
        details: {
          failedCount,
          totalTests,
          testFile,
          successRate: totalTests > 0 ? `${((totalTests - failedCount) / totalTests * 100).toFixed(1)}%` : '0%'
        }
      });
    }
  }

  /**
   * Analyze model validation report
   */
  analyzeModelValidation() {
    const reportFile = path.join(this.rootDir, 'model-validation-report.json');
    
    if (!fs.existsSync(reportFile)) {
      this.addIssue({
        category: 'Models',
        title: 'Model validation report not found',
        priority: 'MEDIUM',
        description: 'Cannot assess model implementation status',
        impact: 'Unknown model health',
        recommendation: 'Run model validation script'
      });
      return;
    }

    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    const { stats, models } = report;

    // Check for incomplete models
    if (stats.complete === 0 && stats.totalModels > 0) {
      this.addIssue({
        category: 'Models',
        title: 'No complete model implementations',
        priority: 'HIGH',
        description: `All ${stats.totalModels} models are incomplete. ${stats.partial} partial, ${stats.scaffold} scaffold only.`,
        impact: 'Core functionality not fully implemented, mental models may not work correctly',
        recommendation: 'Complete model implementations starting with P1 (First Principles)',
        details: {
          totalModels: stats.totalModels,
          complete: stats.complete,
          partial: stats.partial,
          scaffold: stats.scaffold,
          withTests: stats.withTests,
          withDocs: stats.withDocs
        }
      });
    }

    // Check for models without tests
    const modelsWithoutTests = Object.entries(models)
      .filter(([, model]) => model.tests === 0)
      .map(([id]) => id);

    if (modelsWithoutTests.length > 0) {
      this.addIssue({
        category: 'Testing',
        title: `${modelsWithoutTests.length} models without tests`,
        priority: 'HIGH',
        description: `Models ${modelsWithoutTests.join(', ')} have no test coverage`,
        impact: 'Untested code is likely to have bugs and break unexpectedly',
        recommendation: 'Add test coverage for all models',
        details: {
          modelsWithoutTests
        }
      });
    }

    // Check for models without implementations
    const modelsWithoutImpl = Object.entries(models)
      .filter(([, model]) => model.implementation === false)
      .map(([id]) => id);

    if (modelsWithoutImpl.length > 0) {
      this.addIssue({
        category: 'Models',
        title: `${modelsWithoutImpl.length} models missing implementations`,
        priority: 'CRITICAL',
        description: `Models ${modelsWithoutImpl.join(', ')} have no implementation`,
        impact: 'Mental models cannot be used, core features non-functional',
        recommendation: 'Implement missing models according to specifications',
        details: {
          modelsWithoutImpl
        }
      });
    }
  }

  /**
   * Analyze security risks
   */
  analyzeSecurityRisks() {
    // Check for .env files in version control
    try {
      const gitFiles = execSync('git ls-files', { 
        encoding: 'utf8',
        cwd: this.rootDir,
        timeout: 5000,
        maxBuffer: 10 * 1024 * 1024 // 10MB max
      });
      const files = gitFiles.split('\n').map(f => f.trim()).filter(Boolean);
      
      if (files.includes('.env')) {
        this.addIssue({
          category: 'Security',
          title: '.env file in version control',
          priority: 'CRITICAL',
          description: 'Environment file with potential secrets is committed to git',
          impact: 'Secrets may be exposed, security breach risk',
          recommendation: 'Remove .env from git, use .env.example instead'
        });
      }
    } catch (error) {
      // Git command failed, skip this check
    }

    // Check for TODO/FIXME comments indicating security issues
    const securityKeywords = ['security', 'vulnerability', 'exploit', 'XSS', 'SQL injection', 'authentication'];
    const srcDir = path.join(this.rootDir, 'src');
    
    if (fs.existsSync(srcDir)) {
      this.scanDirectoryForSecurityKeywords(srcDir, securityKeywords);
    }

    // Check package.json for outdated dependencies
    const packageFile = path.join(this.rootDir, 'package.json');
    if (fs.existsSync(packageFile)) {
      const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
      
      // Check for known vulnerable packages (simplified check)
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const oldPackages = [];
      
      // This is a simplified check - in production, use npm audit or similar
      Object.entries(deps).forEach(([name, version]) => {
        if (version.includes('^') || version.includes('~')) {
          // Has range, which is good for security updates
        } else if (!version.startsWith('>=')) {
          // Pinned version - may miss security updates
          oldPackages.push(name);
        }
      });

      if (oldPackages.length > 5) {
        this.addIssue({
          category: 'Security',
          title: 'Many pinned dependency versions',
          priority: 'MEDIUM',
          description: `${oldPackages.length} dependencies are pinned to exact versions`,
          impact: 'May miss important security patches',
          recommendation: 'Consider using version ranges for security updates, run npm audit regularly'
        });
      }
    }
  }

  /**
   * Scan directory for security keywords in comments
   */
  scanDirectoryForSecurityKeywords(dir, keywords) {
    const files = fs.readdirSync(dir);
    const filesWithIssues = new Set();
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !this.isExcludedDirectory(file)) {
        this.scanDirectoryForSecurityKeywords(filePath, keywords);
      } else if (stat.isFile() && this.isCodeFile(file)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lowerContent = content.toLowerCase();
        
        // Check if file has security-related TODOs/FIXMEs
        const hasSecurityTodo = (lowerContent.includes('todo') || lowerContent.includes('fixme'));
        if (hasSecurityTodo) {
          const foundKeywords = keywords.filter(keyword => lowerContent.includes(keyword));
          
          if (foundKeywords.length > 0 && !filesWithIssues.has(filePath)) {
            filesWithIssues.add(filePath);
            this.addIssue({
              category: 'Security',
              title: `Security-related TODO/FIXME found`,
              priority: 'HIGH',
              description: `File ${filePath.replace(this.rootDir, '.')} contains security-related comments (${foundKeywords.join(', ')})`,
              impact: 'Potential security issue not yet addressed',
              recommendation: 'Review and address security-related TODOs immediately'
            });
          }
        }
      }
    });
  }

  /**
   * Analyze technical debt
   */
  analyzeTechnicalDebt() {
    // Check for large files
    const srcDir = path.join(this.rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      const largeFiles = this.findLargeFiles(srcDir, LARGE_FILE_THRESHOLD);
      
      if (largeFiles.length > 0) {
        this.addIssue({
          category: 'Code Quality',
          title: `${largeFiles.length} files exceed recommended size`,
          priority: 'LOW',
          description: `Files with >${LARGE_FILE_THRESHOLD} lines should be refactored for maintainability`,
          impact: 'Reduced code maintainability and readability',
          recommendation: 'Consider breaking down large files into smaller modules',
          details: {
            largeFiles: largeFiles.slice(0, 5)
          }
        });
      }
    }

    // Check for missing documentation
    const requiredDocs = ['README.md', 'CONTRIBUTING.md', 'docs/'];
    const missingDocs = [];
    
    requiredDocs.forEach(doc => {
      const docPath = path.join(this.rootDir, doc);
      if (!fs.existsSync(docPath)) {
        missingDocs.push(doc);
      }
    });

    if (missingDocs.length > 0) {
      this.addIssue({
        category: 'Documentation',
        title: 'Missing documentation files',
        priority: 'LOW',
        description: `Missing: ${missingDocs.join(', ')}`,
        impact: 'Reduced developer onboarding efficiency',
        recommendation: 'Add comprehensive documentation for the project'
      });
    }
  }

  /**
   * Find large files in directory
   */
  findLargeFiles(dir, maxLines) {
    const largeFiles = [];
    
    const scan = (directory) => {
      const files = fs.readdirSync(directory);
      
      files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !this.isExcludedDirectory(file)) {
          scan(filePath);
        } else if (stat.isFile() && this.isCodeFile(file)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n').length;
          
          if (lines > maxLines) {
            largeFiles.push({
              file: filePath.replace(this.rootDir, '.'),
              lines
            });
          }
        }
      });
    };
    
    scan(dir);
    return largeFiles;
  }

  /**
   * Add an issue to the report
   */
  addIssue(issue) {
    this.issues.push({
      ...issue,
      id: this.issues.length + 1,
      priorityWeight: PRIORITY_LEVELS[issue.priority].weight,
      timestamp: this.timestamp
    });
  }

  /**
   * Generate the report
   */
  generate() {
    console.log('🔍 Generating Situation Report...\n');

    // Run all analyses
    this.analyzeTypeScriptErrors();
    this.analyzeTestFailures();
    this.analyzeModelValidation();
    this.analyzeSecurityRisks();
    this.analyzeTechnicalDebt();

    // Sort by priority
    this.issues.sort((a, b) => b.priorityWeight - a.priorityWeight);

    return {
      metadata: {
        generatedAt: this.timestamp,
        totalIssues: this.issues.length,
        criticalCount: this.issues.filter(i => i.priority === 'CRITICAL').length,
        highCount: this.issues.filter(i => i.priority === 'HIGH').length,
        mediumCount: this.issues.filter(i => i.priority === 'MEDIUM').length,
        lowCount: this.issues.filter(i => i.priority === 'LOW').length
      },
      issues: this.issues,
      summary: this.generateSummary()
    };
  }

  /**
   * Generate executive summary
   */
  generateSummary() {
    const critical = this.issues.filter(i => i.priority === 'CRITICAL');
    const high = this.issues.filter(i => i.priority === 'HIGH');
    
    return {
      status: critical.length > 0 ? 'CRITICAL' : high.length > 3 ? 'AT_RISK' : 'STABLE',
      immediateActions: critical.map(i => i.title),
      topRisks: high.slice(0, 3).map(i => i.title),
      recommendation: this.generateOverallRecommendation(critical, high)
    };
  }

  /**
   * Generate overall recommendation
   */
  generateOverallRecommendation(critical, high) {
    if (critical.length > 0) {
      return 'IMMEDIATE ACTION REQUIRED: Address all critical issues before proceeding with development.';
    } else if (high.length > 5) {
      return 'HIGH PRIORITY: Multiple high-priority issues require attention this sprint.';
    } else if (high.length > 0) {
      return 'MODERATE PRIORITY: Address high-priority issues in the next sprint.';
    }
    return 'STABLE: Continue with planned development, address medium/low priority items as time allows.';
  }

  /**
   * Print report to console
   */
  print(report) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SITUATION REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Generated: ${report.metadata.generatedAt}`);
    console.log(`Total Issues: ${report.metadata.totalIssues}`);
    console.log(`  🔴 Critical: ${report.metadata.criticalCount}`);
    console.log(`  🟠 High: ${report.metadata.highCount}`);
    console.log(`  🟡 Medium: ${report.metadata.mediumCount}`);
    console.log(`  🟢 Low: ${report.metadata.lowCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 EXECUTIVE SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Status: ${report.summary.status}`);
    console.log(`\n${report.summary.recommendation}\n`);
    
    if (report.summary.immediateActions.length > 0) {
      console.log('⚠️  IMMEDIATE ACTIONS REQUIRED:');
      report.summary.immediateActions.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action}`);
      });
      console.log();
    }

    if (report.summary.topRisks.length > 0) {
      console.log('🎯 TOP RISKS:');
      report.summary.topRisks.forEach((risk, i) => {
        console.log(`   ${i + 1}. ${risk}`);
      });
      console.log();
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔍 DETAILED ISSUES (Ranked by Priority)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    report.issues.forEach((issue, index) => {
      const priority = PRIORITY_LEVELS[issue.priority];
      console.log(`${priority.label} #${issue.id}: ${issue.title}`);
      console.log(`Category: ${issue.category}`);
      console.log(`Description: ${issue.description}`);
      console.log(`Impact: ${issue.impact}`);
      console.log(`Recommendation: ${issue.recommendation}`);
      
      if (issue.details) {
        console.log(`Details: ${JSON.stringify(issue.details, null, 2)}`);
      }
      
      console.log('─────────────────────────────────────────────────────\n');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('End of Situation Report');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Save report to file
   */
  save(report, format = 'json') {
    const reportsDir = path.join(this.rootDir, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = this.formatTimestamp();
    
    if (format === 'json') {
      const jsonPath = path.join(reportsDir, `situation-report-${timestamp}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
      console.log(`📄 JSON report saved to: ${jsonPath}`);
    }

    // Also save as latest
    const latestPath = path.join(reportsDir, 'situation-report-latest.json');
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));
    console.log(`📄 Latest report saved to: ${latestPath}\n`);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new SituationReportGenerator();
  const report = generator.generate();
  generator.print(report);
  generator.save(report);
  
  // Exit with error code if critical issues exist
  if (report.metadata.criticalCount > 0) {
    process.exit(1);
  }
}

export default SituationReportGenerator;
