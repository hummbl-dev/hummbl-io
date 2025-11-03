# Situation Report Generator

## Overview

The Situation Report Generator is a comprehensive analysis tool that scans the codebase to identify risks, critical errors, and gaps that need to be filled. It provides a prioritized list of issues to help development teams focus on the most critical problems first.

## Features

- **🔴 Critical Issues**: Problems that block production deployment or compromise system integrity
- **🟠 High Priority**: Significant issues that should be addressed soon
- **🟡 Medium Priority**: Issues that should be addressed eventually
- **🟢 Low Priority**: Nice-to-have improvements

### Analysis Categories

1. **Build System**: TypeScript compilation errors, build failures
2. **Testing**: Test failures, missing test coverage
3. **Models**: Missing implementations, incomplete features
4. **Security**: Potential vulnerabilities, exposed secrets
5. **Code Quality**: Large files, technical debt
6. **Documentation**: Missing or outdated documentation

## Usage

### Generate a Report

```bash
# Using npm/pnpm script (recommended)
pnpm sitrep

# Or run directly
node scripts/generate-situation-report.mjs
```

### Exit Codes

- `0`: No critical issues found
- `1`: Critical issues detected (requires immediate attention)

### Output

The script generates three types of output:

1. **Console Output**: Human-readable report printed to terminal
2. **JSON Report**: Detailed structured data saved to `reports/situation-report-{timestamp}.json`
3. **Latest Report**: Always available at `reports/situation-report-latest.json`

## Report Structure

### Metadata

```json
{
  "metadata": {
    "generatedAt": "2025-11-03T13:39:41.423Z",
    "totalIssues": 6,
    "criticalCount": 3,
    "highCount": 2,
    "mediumCount": 0,
    "lowCount": 1
  }
}
```

### Executive Summary

```json
{
  "summary": {
    "status": "CRITICAL",
    "immediateActions": ["TypeScript compilation errors: 51 errors in 5 files"],
    "topRisks": ["No complete model implementations"],
    "recommendation": "IMMEDIATE ACTION REQUIRED: Address all critical issues before proceeding with development."
  }
}
```

### Detailed Issues

Each issue includes:

- **ID**: Unique identifier
- **Category**: Classification (Build System, Testing, Models, Security, etc.)
- **Title**: Brief description
- **Priority**: CRITICAL, HIGH, MEDIUM, or LOW
- **Description**: Detailed explanation
- **Impact**: Business/technical impact
- **Recommendation**: Suggested action
- **Details**: Additional context (optional)

Example:

```json
{
  "id": 1,
  "category": "Build System",
  "title": "TypeScript compilation errors: 51 errors in 5 files",
  "priority": "CRITICAL",
  "description": "Type safety is compromised. 51 TypeScript errors across 5 files prevent production builds.",
  "impact": "Cannot build for production, type safety compromised, runtime errors likely",
  "recommendation": "Fix TypeScript errors starting with most critical files",
  "details": {
    "errorCount": 51,
    "fileCount": 5,
    "topFiles": [...]
  }
}
```

## Priority Levels

### 🔴 CRITICAL

- **Weight**: 4
- **Description**: Immediate action required
- **Examples**:
  - TypeScript compilation errors preventing builds
  - Test failures indicating broken functionality
  - Missing core implementations
  - Security vulnerabilities

### 🟠 HIGH

- **Weight**: 3
- **Description**: Should be addressed soon
- **Examples**:
  - Incomplete implementations
  - Missing test coverage
  - High-impact bugs

### 🟡 MEDIUM

- **Weight**: 2
- **Description**: Should be addressed eventually
- **Examples**:
  - Missing documentation
  - Outdated dependencies
  - Minor technical debt

### 🟢 LOW

- **Weight**: 1
- **Description**: Nice to have
- **Examples**:
  - Large files that could be refactored
  - Optional improvements
  - Enhancement suggestions

## Integration with CI/CD

### GitHub Actions

Add to your workflow:

```yaml
- name: Generate Situation Report
  run: pnpm sitrep
  continue-on-error: true # Don't fail the build, just report

- name: Upload Report
  uses: actions/upload-artifact@v3
  with:
    name: situation-report
    path: reports/situation-report-latest.json
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Generate situation report
pnpm sitrep || true
```

## Customization

### Adding New Analysis

To add a new analysis category:

1. Create a new method in `SituationReportGenerator` class:

```javascript
analyzeCustomCategory() {
  // Your analysis logic
  this.addIssue({
    category: 'Custom Category',
    title: 'Issue title',
    priority: 'CRITICAL', // or HIGH, MEDIUM, LOW
    description: 'Detailed description',
    impact: 'What happens if not fixed',
    recommendation: 'How to fix it'
  });
}
```

2. Call your method in the `generate()` method:

```javascript
generate() {
  // ... existing analyses
  this.analyzeCustomCategory();
  // ...
}
```

### Adjusting Thresholds

Edit the analysis methods to adjust thresholds:

```javascript
// Example: Change test failure threshold
const priority = failedCount > 50 ? 'CRITICAL' : failedCount > 25 ? 'HIGH' : 'MEDIUM';
```

## Files Analyzed

The script analyzes:

- `typescript-errors.txt`: TypeScript compilation errors
- `test-failures.txt`: Test execution results
- `model-validation-report.json`: Model implementation status
- `src/`: Source code (for security keywords, large files)
- `package.json`: Dependency analysis
- Git repository: Version control status

## Best Practices

1. **Run Regularly**: Generate reports daily or before major deployments
2. **Track Progress**: Compare reports over time to see improvement
3. **Focus on Critical**: Always address critical issues first
4. **Document Decisions**: If you choose not to fix an issue, document why
5. **Automate**: Integrate into CI/CD for continuous monitoring

## Troubleshooting

### "File not found" warnings

If analysis files are missing, the script will note this as a medium-priority issue. Generate these files:

```bash
# Generate TypeScript errors
pnpm typecheck 2> typescript-errors.txt

# Generate test failures
pnpm test 2>&1 > test-failures.txt

# Generate model validation
pnpm validate:models
```

### Report not saving

Ensure the `reports/` directory exists and is writable:

```bash
mkdir -p reports
chmod 755 reports
```

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SITUATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: 2025-11-03T13:39:41.423Z
Total Issues: 6
  🔴 Critical: 3
  🟠 High: 2
  🟡 Medium: 0
  🟢 Low: 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: CRITICAL

IMMEDIATE ACTION REQUIRED: Address all critical issues before proceeding.

⚠️  IMMEDIATE ACTIONS REQUIRED:
   1. TypeScript compilation errors: 51 errors in 5 files
   2. 45 test failures detected
   3. 10 models missing implementations
```

## Related Documentation

- [Contributing Guide](../CONTRIBUTING.md)
- [Development Guide](./DEVELOPMENT.md)
- [Testing Guide](./TESTING.md)
- [CI/CD Guide](../.github/workflows/README.md)

## Support

For issues or questions about the Situation Report Generator:

1. Check this documentation
2. Review existing reports for similar issues
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
