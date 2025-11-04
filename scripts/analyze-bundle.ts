#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes build output and provides bundle size insights
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { gzipSync } from 'zlib';

interface BundleInfo {
  name: string;
  path: string;
  size: number;
  gzippedSize: number;
  type: 'js' | 'css' | 'html' | 'asset' | 'other';
}

async function getFileSize(filePath: string): Promise<number> {
  const stats = await stat(filePath);
  return stats.size;
}

function getGzippedSize(content: Buffer): number {
  return gzipSync(content).length;
}

async function analyzeDirectory(dir: string, baseDir: string = dir): Promise<BundleInfo[]> {
  const files: BundleInfo[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await analyzeDirectory(fullPath, baseDir);
      files.push(...subFiles);
    } else {
      const size = await getFileSize(fullPath);
      const content = await import('fs').then((fs) => fs.readFileSync(fullPath));
      const gzippedSize = getGzippedSize(content);

      const extension = entry.name.split('.').pop()?.toLowerCase() || '';
      let type: BundleInfo['type'] = 'other';
      if (extension === 'js' || extension === 'mjs') type = 'js';
      else if (extension === 'css') type = 'css';
      else if (extension === 'html') type = 'html';
      else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot'].includes(extension)) type = 'asset';

      files.push({
        name: entry.name,
        path: fullPath.replace(baseDir, ''),
        size,
        gzippedSize,
        type,
      });
    }
  }

  return files;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function getCompressionRatio(original: number, compressed: number): number {
  return Math.round((1 - compressed / original) * 100);
}

async function main() {
  const distDir = join(process.cwd(), 'dist');

  console.log('📦 Analyzing bundle...\n');
  console.log(`Looking in: ${distDir}\n`);

  try {
    const files = await analyzeDirectory(distDir);

    // Group by type
    const byType = files.reduce(
      (acc, file) => {
        acc[file.type] = acc[file.type] || [];
        acc[file.type].push(file);
        return acc;
      },
      {} as Record<string, BundleInfo[]>
    );

    // Calculate totals
    const totals = {
      js: { size: 0, gzippedSize: 0, count: 0 },
      css: { size: 0, gzippedSize: 0, count: 0 },
      html: { size: 0, gzippedSize: 0, count: 0 },
      asset: { size: 0, gzippedSize: 0, count: 0 },
      other: { size: 0, gzippedSize: 0, count: 0 },
    };

    files.forEach((file) => {
      totals[file.type].size += file.size;
      totals[file.type].gzippedSize += file.gzippedSize;
      totals[file.type].count += 1;
    });

    // Display results
    console.log('📊 Bundle Analysis Results\n');
    console.log('═'.repeat(80));

    // JS Files
    if (byType.js && byType.js.length > 0) {
      console.log('\n📜 JavaScript Files:');
      console.log('-'.repeat(80));
      byType.js
        .sort((a, b) => b.size - a.size)
        .forEach((file) => {
          const ratio = getCompressionRatio(file.size, file.gzippedSize);
          console.log(
            `  ${file.path.padEnd(50)} ${formatBytes(file.size).padStart(10)} → ${formatBytes(file.gzippedSize).padStart(10)} (${ratio}% smaller)`
          );
        });
      console.log(
        `\n  Total JS: ${formatBytes(totals.js.size)} → ${formatBytes(totals.js.gzippedSize)} (${totals.js.count} files)`
      );
    }

    // CSS Files
    if (byType.css && byType.css.length > 0) {
      console.log('\n🎨 CSS Files:');
      console.log('-'.repeat(80));
      byType.css
        .sort((a, b) => b.size - a.size)
        .forEach((file) => {
          const ratio = getCompressionRatio(file.size, file.gzippedSize);
          console.log(
            `  ${file.path.padEnd(50)} ${formatBytes(file.size).padStart(10)} → ${formatBytes(file.gzippedSize).padStart(10)} (${ratio}% smaller)`
          );
        });
      console.log(
        `\n  Total CSS: ${formatBytes(totals.css.size)} → ${formatBytes(totals.css.gzippedSize)} (${totals.css.count} files)`
      );
    }

    // Total
    const totalSize = Object.values(totals).reduce((sum, t) => sum + t.size, 0);
    const totalGzippedSize = Object.values(totals).reduce((sum, t) => sum + t.gzippedSize, 0);
    const totalFiles = Object.values(totals).reduce((sum, t) => sum + t.count, 0);

    console.log('\n' + '═'.repeat(80));
    console.log('\n📈 Summary:');
    console.log(`  Total Size: ${formatBytes(totalSize)}`);
    console.log(`  Total Gzipped: ${formatBytes(totalGzippedSize)}`);
    console.log(`  Total Files: ${totalFiles}`);
    console.log(`  Compression Ratio: ${getCompressionRatio(totalSize, totalGzippedSize)}%`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (totals.js.size > 500 * 1024) {
      console.log('  ⚠️  JavaScript bundle is large. Consider code splitting.');
    }
    if (totals.js.gzippedSize > 300 * 1024) {
      console.log('  ⚠️  Gzipped JS bundle exceeds 300KB. Consider lazy loading.');
    }
    if (totals.css.size > 100 * 1024) {
      console.log('  ⚠️  CSS bundle is large. Consider CSS code splitting.');
    }
    if (byType.js && byType.js.length === 1) {
      console.log('  💡 Only one JS chunk found. Consider splitting into vendor/app chunks.');
    }

    console.log('\n');
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error);
    process.exit(1);
  }
}

main();
