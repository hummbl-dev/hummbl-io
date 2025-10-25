import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_DIR = path.join(__dirname, '..', 'src', 'models');

// Categories and their prefixes
const CATEGORIES = [
  { prefix: 'p', name: 'Perspective' },
  { prefix: 'in', name: 'Inversion' },
  { prefix: 'co', name: 'Composition' },
  { prefix: 'de', name: 'Deconstruction' },
  { prefix: 're', name: 'Reconstruction' },
  { prefix: 'sy', name: 'Synthesis' }
];

// Generate export statements for a single model
function generateModelExport(modelDir, modelId) {
  const modelName = modelId.toUpperCase();
  const modelVar = modelId.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()) + 'Model';
  
  return `// ${modelName} - ${modelId.startsWith('p') ? 'Perspective' : 
    modelId.startsWith('in') ? 'Inversion' : 
    modelId.startsWith('co') ? 'Composition' : 
    modelId.startsWith('de') ? 'Deconstruction' :
    modelId.startsWith('re') ? 'Reconstruction' : 'Synthesis'} Model
export { create${modelVar} } from './${modelId}';
`;
}

// Main function to generate the exports file
async function generateExports() {
  let exportContent = `/**
 * HUMMBL Base120 Models
 * 
 * This file serves as the central export point for all 120 mental models in the HUMMBL framework.
 * Models are organized by their categories and can be imported from here for use throughout the application.
 * 
 * Categories:
 * - P: Perspective Models (P1-P20)
 * - IN: Inversion Models (IN1-IN20)
 * - CO: Composition Models (CO1-CO20)
 * - DE: Deconstruction Models (DE1-DE20)
 * - RE: Reconstruction Models (RE1-RE20)
 * - SY: Synthesis Models (SY1-SY20)
 */

`;

  // Process each category
  for (const { prefix, name } of CATEGORIES) {
    exportContent += `// ====== ${name} Models (${prefix.toUpperCase()}1-${prefix.toUpperCase()}20) ======\n`;
    
    // Find all model directories for this category
    const modelDirs = fs.readdirSync(MODELS_DIR)
      .filter(dir => dir.startsWith(prefix) && dir !== 'types')
      .sort((a, b) => {
        // Sort by number at the end
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

    // Generate exports for each model
    for (const modelDir of modelDirs) {
      const modelId = modelDir;
      exportContent += `\n` + generateModelExport(modelDir, modelId);
    }
    
    exportContent += '\n';
  }

  // Write the exports file
  const outputPath = path.join(MODELS_DIR, 'index.ts');
  fs.writeFileSync(outputPath, exportContent);
  
  console.log(`✅ Successfully generated exports in ${outputPath}`);
}

// Run the generation
generateExports().catch(console.error);
