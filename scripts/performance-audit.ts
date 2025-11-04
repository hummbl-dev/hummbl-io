#!/usr/bin/env node

/**
 * Performance Audit Script
 * Runs Lighthouse audits and measures Web Vitals
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  fcp?: number;
  lcp?: number;
  cls?: number;
  tbt?: number;
  si?: number;
  ttfb?: number;
}

interface AuditResult {
  timestamp: string;
  url: string;
  scores: LighthouseMetrics;
  bundleSize?: {
    total: number;
    js: number;
    css: number;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function walkDir(dir: string, readdir: typeof import('fs/promises').readdir, stat: typeof import('fs/promises').stat, pathJoin: typeof import('path').join, totals: { total: number; js: number; css: number }) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = pathJoin(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, readdir, stat, pathJoin, totals);
    } else {
      const stats = await stat(fullPath);
      const size = stats.size;
      totals.total += size;

      if (entry.name.endsWith('.js')) {
        totals.js += size;
      } else if (entry.name.endsWith('.css')) {
        totals.css += size;
      }
    }
  }
}

async function getBundleSize(): Promise<{ total: number; js: number; css: number }> {
  const distDir = join(process.cwd(), 'dist');
  const totals = {
    total: 0,
    js: 0,
    css: 0,
  };

  try {
    const { readdir, stat } = await import('fs/promises');
    const { join: pathJoin } = await import('path');

    if (existsSync(distDir)) {
      await walkDir(distDir, readdir, stat, pathJoin, totals);
    }
  } catch (error) {
    console.warn('Could not calculate bundle size:', error);
  }

  return { total: totals.total, js: totals.js, css: totals.css };
}

async function runLighthouse(url: string): Promise<LighthouseMetrics> {
  try {
    // Try to import lighthouse
    const lighthouse = await import('lighthouse');
    const chromeLauncher = await import('chrome-launcher');

    console.log(`\n🔍 Running Lighthouse audit for: ${url}\n`);

    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

    const options = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse.default(url, options);

    await chrome.kill();

    const lhr = runnerResult?.lhr;
    if (!lhr) {
      throw new Error('Lighthouse run failed');
    }

    const audits = lhr.audits;
    const metrics = {
      performance: Math.round((lhr.categories.performance?.score || 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((lhr.categories.seo?.score || 0) * 100),
      fcp: audits['first-contentful-paint']?.numericValue,
      lcp: audits['largest-contentful-paint']?.numericValue,
      cls: audits['cumulative-layout-shift']?.numericValue,
      tbt: audits['total-blocking-time']?.numericValue,
      si: audits['speed-index']?.numericValue,
      ttfb: audits['server-response-time']?.numericValue,
    };

    return metrics;
  } catch (error) {
    console.warn('⚠️  Lighthouse not available, using fallback metrics');
    console.warn('   Install lighthouse and chrome-launcher for full audit:');
    console.warn('   pnpm add -D lighthouse chrome-launcher');

    // Return fallback metrics
    return {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    };
  }
}

function displayResults(result: AuditResult) {
  console.log('\n' + '═'.repeat(80));
  console.log('📊 Performance Audit Results\n');
  console.log(`URL: ${result.url}`);
  console.log(`Timestamp: ${result.timestamp}\n`);

  console.log('Lighthouse Scores:');
  console.log(`  Performance:    ${result.scores.performance}/100 ${getScoreEmoji(result.scores.performance)}`);
  console.log(`  Accessibility:  ${result.scores.accessibility}/100 ${getScoreEmoji(result.scores.accessibility)}`);
  console.log(`  Best Practices: ${result.scores.bestPractices}/100 ${getScoreEmoji(result.scores.bestPractices)}`);
  console.log(`  SEO:            ${result.scores.seo}/100 ${getScoreEmoji(result.scores.seo)}`);

  if (result.scores.fcp) {
    console.log('\nCore Web Vitals:');
    console.log(`  FCP (First Contentful Paint): ${result.scores.fcp.toFixed(0)}ms ${getVitalEmoji(result.scores.fcp, 1800)}`);
  }
  if (result.scores.lcp) {
    console.log(`  LCP (Largest Contentful Paint): ${result.scores.lcp.toFixed(0)}ms ${getVitalEmoji(result.scores.lcp, 2500)}`);
  }
  if (result.scores.cls !== undefined) {
    console.log(`  CLS (Cumulative Layout Shift): ${result.scores.cls.toFixed(3)} ${getVitalEmoji(result.scores.cls, 0.1, true)}`);
  }
  if (result.scores.tbt) {
    console.log(`  TBT (Total Blocking Time): ${result.scores.tbt.toFixed(0)}ms ${getVitalEmoji(result.scores.tbt, 300)}`);
  }
  if (result.scores.ttfb) {
    console.log(`  TTFB (Time to First Byte): ${result.scores.ttfb.toFixed(0)}ms ${getVitalEmoji(result.scores.ttfb, 800)}`);
  }

  if (result.bundleSize) {
    console.log('\nBundle Sizes:');
    console.log(`  JavaScript: ${formatBytes(result.bundleSize.js)}`);
    console.log(`  CSS:        ${formatBytes(result.bundleSize.css)}`);
    console.log(`  Total:      ${formatBytes(result.bundleSize.total)}`);
  }

  console.log('\n' + '═'.repeat(80) + '\n');

  // Recommendations
  const recommendations: string[] = [];
  if (result.scores.performance < 90) {
    recommendations.push('Performance score is below 90. Consider optimizing bundle size and lazy loading.');
  }
  if (result.scores.lcp && result.scores.lcp > 2500) {
    recommendations.push('LCP exceeds 2.5s. Optimize largest content element and server response time.');
  }
  if (result.scores.cls !== undefined && result.scores.cls > 0.1) {
    recommendations.push('CLS exceeds 0.1. Prevent layout shifts by setting dimensions on images and content.');
  }
  if (result.bundleSize && result.bundleSize.js > 500 * 1024) {
    recommendations.push('JavaScript bundle exceeds 500KB. Implement code splitting and lazy loading.');
  }

  if (recommendations.length > 0) {
    console.log('💡 Recommendations:');
    recommendations.forEach((rec) => console.log(`  • ${rec}`));
    console.log('');
  }
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return '✅';
  if (score >= 50) return '⚠️';
  return '❌';
}

function getVitalEmoji(value: number, threshold: number, lowerIsBetter: boolean = false): string {
  if (lowerIsBetter) {
    return value <= threshold ? '✅' : '⚠️';
  }
  return value <= threshold ? '✅' : '⚠️';
}

async function main() {
  const url = process.argv[2] || 'http://localhost:5173';
  const outputFile = process.argv[3] || join(process.cwd(), 'perfMetrics.json');

  console.log('🚀 Starting performance audit...\n');

  const [scores, bundleSize] = await Promise.all([runLighthouse(url), getBundleSize()]);

  const result: AuditResult = {
    timestamp: new Date().toISOString(),
    url,
    scores,
    bundleSize,
  };

  displayResults(result);

  // Save results
  let historicalResults: AuditResult[] = [];
  if (existsSync(outputFile)) {
    try {
      const existing = JSON.parse(readFileSync(outputFile, 'utf-8'));
      if (Array.isArray(existing.history)) {
        historicalResults = existing.history;
      }
    } catch (error) {
      console.warn('Could not read existing metrics file:', error);
    }
  }

  historicalResults.push(result);

  const output = {
    latest: result,
    history: historicalResults.slice(-10), // Keep last 10 audits
  };

  writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`📝 Results saved to: ${outputFile}\n`);
}

main().catch((error) => {
  console.error('❌ Error running performance audit:', error);
  process.exit(1);
});
