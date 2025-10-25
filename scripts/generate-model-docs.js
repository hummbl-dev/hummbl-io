import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_DIR = path.join(__dirname, '..', 'src', 'models');
const OUTPUT_FILE = path.join(__dirname, '..', 'MODELS_REFERENCE.md');

// Categories and their descriptions
const CATEGORIES = [
  { 
    prefix: 'p', 
    name: 'Perspective',
    description: 'Models for viewing situations from different angles and perspectives.'
  },
  { 
    prefix: 'in', 
    name: 'Inversion',
    description: 'Models for thinking backwards or considering the opposite of what you want.'
  },
  { 
    prefix: 'co', 
    name: 'Composition',
    description: 'Models for combining elements to form a coherent whole.'
  },
  { 
    prefix: 'de', 
    name: 'Deconstruction',
    description: 'Models for breaking down complex systems into their component parts.'
  },
  { 
    prefix: 're', 
    name: 'Reconstruction',
    description: 'Models for rebuilding and reassembling systems in new ways.'
  },
  { 
    prefix: 'sy', 
    name: 'Synthesis',
    description: 'Models for integrating multiple perspectives into a unified understanding.'
  }
];

// Get model metadata from README
function getModelMetadata(modelDir) {
  const readmePath = path.join(MODELS_DIR, modelDir, 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    return {
      name: modelDir.toUpperCase(),
      description: 'No description available.',
      usage: 'Refer to the model documentation for usage instructions.'
    };
  }
  
  const readme = fs.readFileSync(readmePath, 'utf-8');
  const nameMatch = readme.match(/#\s+(.+?)\n/);
  const descMatch = readme.split('## Overview')[1]?.split('##')[0] || '';
  
  return {
    name: nameMatch ? nameMatch[1] : modelDir.toUpperCase(),
    description: descMatch.trim() || 'No description available.',
    usage: 'Refer to the model documentation for usage instructions.'
  };
}

// Generate markdown for a single model
function generateModelMarkdown(modelDir, modelId) {
  const metadata = getModelMetadata(modelDir);
  return `
### ${modelId.toUpperCase()}: ${metadata.name}

${metadata.description}

**Usage:**

\`\`\`typescript
import { create${modelId.charAt(0).toUpperCase() + modelId.slice(1)}Model } from './${modelId}';

const model = create${modelId.charAt(0).toUpperCase() + modelId.slice(1)}Model({
  // Configuration options
});
\`\`\`
`;
}

// Main function to generate the documentation
async function generateDocs() {
  let markdown = `# HUMMBL Base120 Models Reference

This document provides a comprehensive reference for all 120 mental models in the HUMMBL framework, organized by category.

## Table of Contents
`;

  // Add table of contents
  for (const category of CATEGORIES) {
    markdown += `- [${category.name} Models (${category.prefix.toUpperCase()}1-${category.prefix.toUpperCase()}20)](#${category.name.toLowerCase()}-models-${category.prefix}1-${category.prefix}20)\n`;
  }

  // Add content for each category
  for (const { prefix, name, description } of CATEGORIES) {
    markdown += `\n## ${name} Models (${prefix.toUpperCase()}1-${prefix.toUpperCase()}20)\n\n${description}\n`;
    
    // Find all model directories for this category
    const modelDirs = fs.readdirSync(MODELS_DIR)
      .filter(dir => dir.startsWith(prefix) && dir !== 'types')
      .sort((a, b) => {
        // Sort by number at the end
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

    // Add models for this category
    for (const modelDir of modelDirs) {
      markdown += generateModelMarkdown(modelDir, modelDir);
    }
  }

  // Write the documentation file
  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`✅ Documentation generated at: ${OUTPUT_FILE}`);
}

// Run the generation
generateDocs().catch(console.error);
