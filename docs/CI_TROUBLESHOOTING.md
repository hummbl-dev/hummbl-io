# CI/CD Troubleshooting Guide

## Quick Reference: Common Failures

### Test Failures

**Symptom:** `test-*` jobs failing

**Common Causes:**
- Flaky tests
- Missing test data
- Environment variable issues
- Memory issues (OOM errors)

**Fix:**
```bash
# Run tests locally first
pnpm test

# Check specific test
pnpm test -- test-name

# Run with more memory
NODE_OPTIONS='--max-old-space-size=4096' pnpm test
```

---

### Build Failures

**Symptom:** `build` job failing

**Common Causes:**
- TypeScript errors
- Missing dependencies
- Build script issues
- Vite configuration errors

**Fix:**
```bash
# Clean and rebuild
pnpm run clean
pnpm install
pnpm run build

# Check TypeScript errors
pnpm run typecheck
```

---

### Bundle Size Failures

**Symptom:** `bundle-size` job failing (over limit)

**Common Causes:**
- Large dependencies added
- Code splitting issues
- Source maps included

**Fix:**
```bash
# Analyze bundle
pnpm run analyze:bundle

# Check bundle size
pnpm run build
ls -lh dist/assets/*.js
```

---

### Infrastructure Build Failures

**Symptom:** `test-infrastructure` or infrastructure build failing

**Common Causes:**
- Missing TypeScript compilation
- Missing bin/infrastructure.js file
- CDK dependencies missing

**Fix:**
```bash
# Build infrastructure
cd infrastructure
pnpm install
pnpm run build

# Verify bin exists
ls -la bin/infrastructure.js
```

---

### Deployment Failures

**Symptom:** `deploy-staging` or `deploy-production` failing

**Common Causes:**
- Missing Vercel secrets
- Invalid Vercel configuration
- Build artifacts missing
- Network/timeout issues

**Fix:**
1. Check Vercel secrets in GitHub Settings → Secrets
2. Verify `vercel.json` syntax
3. Check build artifacts exist:
   ```bash
   ls -la dist/index.html
   ```

---

### Linting Failures

**Symptom:** Pre-commit hooks or lint checks failing

**Common Causes:**
- ESLint errors
- Prettier formatting issues
- TypeScript errors

**Fix:**
```bash
# Auto-fix linting
pnpm run lint

# Format code
pnpm run format

# Type check
pnpm run typecheck
```

---

## Job-Specific Troubleshooting

### test-base
- **Purpose:** Setup test environment
- **Failure:** Usually dependency installation or cache issues
- **Fix:** Clear cache and reinstall

### test-analytics
- **Purpose:** Analytics utility tests
- **Failure:** Missing mock data or environment variables
- **Fix:** Ensure `compliance-report.json` exists

### test-code-quality
- **Purpose:** Code quality checks
- **Failure:** Linting or type checking errors
- **Fix:** Run `pnpm run lint` and `pnpm run typecheck`

### test-infrastructure
- **Purpose:** Infrastructure package tests
- **Failure:** Missing build output or CDK issues
- **Fix:** Build infrastructure first: `cd infrastructure && pnpm run build`

### build
- **Purpose:** Production build
- **Failure:** Build errors or missing files
- **Fix:** Clean install and rebuild

### bundle-size
- **Purpose:** Check bundle size limits
- **Failure:** Bundle exceeds size limit
- **Fix:** Analyze bundle and optimize imports

### deploy-staging / deploy-production
- **Purpose:** Deploy to Vercel
- **Failure:** Vercel API errors or missing secrets
- **Fix:** Check Vercel secrets and configuration

---

## Quick Diagnostic Commands

```bash
# Check all potential issues
pnpm run typecheck
pnpm run lint
pnpm run build

# Check infrastructure
cd infrastructure && pnpm run build

# Verify build output
ls -la dist/index.html
ls -la infrastructure/bin/infrastructure.js

# Check for missing dependencies
pnpm install --frozen-lockfile
```

---

## Getting Help

If issues persist:

1. **Check GitHub Actions logs:**
   - Go to Actions tab
   - Click on failing workflow
   - Expand failing job
   - Check error messages

2. **Run locally:**
   - Reproduce the failure locally
   - Fix the issue
   - Test before pushing

3. **Common fixes:**
   - Clear caches: `pnpm run clean && pnpm install`
   - Update dependencies: `pnpm update`
   - Check environment: Node version, pnpm version

---

**Last Updated:** 2025-01-27
