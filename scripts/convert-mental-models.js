#!/usr/bin/env node
/**
 * Convert models.json format to mental-models.json format
 * This populates the mental models data with all 120 models
 */

const fs = require('fs');
const path = require('path');

// Read the source file (120 models)
const sourcePath = path.join(__dirname, '../public/models.json');
const destPath = path.join(__dirname, '../public/data/mental-models.json');

console.log('🔄 Converting mental models...');
console.log(`📖 Reading from: ${sourcePath}`);

const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Transform the data format
const transformedModels = sourceData.models.map((model) => {
  // Generate ID from code
  const id = model.code.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Map to new format
  return {
    id: id,
    name: model.name,
    code: model.code,
    description: model.definition,
    example: model.example,
    category: getCategoryFromTransformation(model.transformation),
    tags: getTagsFromModel(model),
    transformations: [model.transformation],
    sources: [],
    meta: {
      isCore: true,
      difficulty: getDifficultyFromCode(model.code),
      added: '2025-01-01',
      updated: sourceData.lastUpdated,
    },
  };
});

// Create the output structure
const output = {
  version: sourceData.version,
  lastUpdated: sourceData.lastUpdated,
  totalModels: sourceData.totalModels,
  models: transformedModels,
};

// Write to destination
fs.writeFileSync(destPath, JSON.stringify(output, null, 2));

console.log(`✅ Converted ${transformedModels.length} mental models`);
console.log(`💾 Written to: ${destPath}`);
console.log('');
console.log(`📊 Summary:`);
console.log(`   Total models: ${transformedModels.length}`);
console.log(`   Categories: ${new Set(transformedModels.map((m) => m.category)).size}`);
console.log(
  `   Transformations: ${new Set(transformedModels.map((m) => m.transformations[0])).size}`
);

// Helper functions
function getCategoryFromTransformation(transformation) {
  const categoryMap = {
    P: 'Perspective & Identity',
    IN: 'Inversion & Reversal',
    CO: 'Composition & Integration',
    DE: 'Decomposition & Analysis',
    RE: 'Recursion & Self-Reference',
    SY: 'Meta-Systems & Emergence',
  };
  return categoryMap[transformation] || 'General';
}

function getTagsFromModel(model) {
  const tags = [];

  // Add transformation as tag
  tags.push(model.transformation.toLowerCase());

  // Extract key terms from definition
  const keywords = extractKeywords(model.definition);
  tags.push(...keywords.slice(0, 3));

  return tags;
}

function extractKeywords(text) {
  // Simple keyword extraction
  const common = [
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
  ];
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !common.includes(w));

  return [...new Set(words)].slice(0, 3);
}

function getDifficultyFromCode(code) {
  // Extract number from code (P1, P2, etc)
  const match = code.match(/\d+/);
  if (!match) return 3;

  const num = parseInt(match[0]);
  if (num <= 5) return 2;
  if (num <= 10) return 3;
  if (num <= 15) return 4;
  return 5;
}
