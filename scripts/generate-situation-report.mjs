import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

// Priority levels for issues
const PRIORITY_LEVELS = {
  CRITICAL: { weight: 4, label: 'Critical' },
  HIGH: { weight: 3, label: 'High' },
  MEDIUM: { weight: 2, label: 'Medium' },
  LOW: { weight: 1, label: 'Low' }
};

// Security keywords to scan for
const SECURITY_KEYWORDS = [
  'XSS',
  'SQL injection',
  'CSRF',
  'Authentication',
  'Authorization',
  'password',
  'secret',
  'token',
  'vulnerability'
];

const issues = [];

/**
 * Add an issue to the report
 * @param {Object} issue - The issue to add
 */
function addIssue(issue) {
  const priorityWeight = PRIORITY_LEVELS[issue.priority].weight;
  issues.push({
    ...issue,
    priorityWeight,
    timestamp: new Date().toISOString()
  });
}

/**
 * Scan directory for security keywords
 * @param {string} dir - Directory to scan
 * @param {Array<string>} keywords - Keywords to search for
 * @returns {Promise<Array>} Found issues
 */
async function scanDirectoryForSecurityKeywords(dir, keywords = SECURITY_KEYWORDS) {
  const foundIssues = [];

  async function traverse(currentDir) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Skip node_modules and hidden directories
          if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
            continue;
          }
          await traverse(fullPath);
        } else if (entry.isFile()) {
          // Only scan certain file types
          const ext = extname(entry.name);
          if (['.js', '.mjs', '.ts', '.tsx', '.jsx'].includes(ext)) {
            try {
              const content = await readFile(fullPath, 'utf8');
              const lowerContent = content.toLowerCase();

              const foundKeywords = keywords.filter(keyword =>
                lowerContent.includes(keyword)
              );

              if (foundKeywords.length > 0) {
                foundIssues.push({
                  file: fullPath,
                  keywords: foundKeywords,
                  priority: 'MEDIUM',
                  description: `Found security-related keywords: ${foundKeywords.join(', ')}`
                });
              }
            } catch (readError) {
              // Skip files that can't be read
              console.warn(`Could not read file: ${fullPath}`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error traversing directory ${currentDir}:`, error.message);
    }
  }

  await traverse(dir);
  return foundIssues;
}

/**
 * Generate a situation report
 * @param {string} directory - Root directory to analyze
 * @returns {Promise<Object>} The generated report
 */
async function generateSituationReport(directory = process.cwd()) {
  console.log(`Generating situation report for: ${directory}`);

  // Scan for security issues
  const securityIssues = await scanDirectoryForSecurityKeywords(directory);

  // Add all found issues
  for (const issue of securityIssues) {
    addIssue(issue);
  }

  // Generate report summary
  const report = {
    metadata: {
      generated_at: new Date().toISOString(),
      directory,
      total_issues: issues.length
    },
    issues: issues.sort((a, b) => b.priorityWeight - a.priorityWeight),
    summary: {
      by_priority: {
        critical: issues.filter(i => i.priority === 'CRITICAL').length,
        high: issues.filter(i => i.priority === 'HIGH').length,
        medium: issues.filter(i => i.priority === 'MEDIUM').length,
        low: issues.filter(i => i.priority === 'LOW').length
      }
    }
  };

  return report;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetDir = process.argv[2] || process.cwd();
  generateSituationReport(targetDir)
    .then(report => {
      console.log(JSON.stringify(report, null, 2));
    })
    .catch(error => {
      console.error('Error generating situation report:', error);
      process.exit(1);
    });
}

export { generateSituationReport, scanDirectoryForSecurityKeywords, addIssue };
