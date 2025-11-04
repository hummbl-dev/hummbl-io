# Vercel Setup Audit Report

**Repository:** hummbl-io  
**Audit Date:** 2025-01-27  
**Focus:** Vercel deployment configuration and setup  
**Status:** ⚠️ Issues Found - Action Required

---

## Executive Summary

The Vercel setup is **functional but has several security and configuration issues** that need to be addressed:

- 🔴 **CRITICAL:** Environment files (`.env.production`, `.env.staging`) are tracked in git
- 🟠 **HIGH:** Staging deployment uses incorrect environment type
- 🟠 **HIGH:** Missing security best practices (action pinning, OIDC)
- 🟡 **MEDIUM:** Missing deployment safeguards (concurrency, timeouts)
- 🟡 **MEDIUM:** Missing SPA routing configuration

**Overall Grade:** B- (Functional but needs improvement)

---

## 🔴 Critical Issues

### 1. Environment Files Committed to Git

**Issue:** Environment configuration files are tracked in version control:

```bash
$ git ls-files | grep -E "\.env$|^\.env\."
.env.production
.env.staging
```

**Risk Level:** 🔴 CRITICAL  
**Security Impact:** High - May contain sensitive configuration or secrets

**Details:**
- `.env.production` contains staging database credentials
- `.env.staging` contains configuration that should be in Vercel dashboard
- While these don't appear to contain actual secrets (based on content), they should not be in git

**Recommendation:**
1. Remove from git history:
   ```bash
   git rm --cached .env.production .env.staging
   git commit -m "chore: remove environment files from git"
   ```
2. Add to `.gitignore` (verify already present):
   ```gitignore
   .env.production
   .env.staging
   ```
3. Use Vercel Dashboard for environment variables instead
4. Keep `.env.example` as template only

**Status:** ⚠️ Needs immediate action

---

### 2. `.env` File in Repository

**Issue:** A `.env` file exists in the root directory (not in `.gitignore` check)

**Risk Level:** 🔴 CRITICAL  
**Security Impact:** High - Contains actual secrets (API keys, passwords)

**Details:**
- File contains redacted values for:
  - `VITE_PLAUSIBLE_API_KEY`
  - `VITE_OPENAI_API_KEY`
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - `VITE_ADMIN_PASSWORD`

**Current State:**
- `.env` is correctly in `.gitignore` pattern (`.env*`)
- But file still exists locally (may be committed accidentally)

**Recommendation:**
1. Verify `.env` is NOT tracked:
   ```bash
   git check-ignore .env
   # Should output: .env
   ```
2. If tracked, remove immediately:
   ```bash
   git rm --cached .env
   git commit -m "chore: remove .env from git"
   ```
3. Add to `.gitignore` explicitly if needed
4. Regenerate any exposed secrets

**Status:** ✅ Likely safe (in .gitignore) but verify

---

## 🟠 High Priority Issues

### 3. Incorrect Staging Environment Configuration

**Issue:** Staging deployment uses `--environment=preview` instead of `--environment=staging`

**Location:** `.github/workflows/ci.yml` - `deploy-staging` job

**Current Code:**
```yaml
- name: Pull Vercel Environment Information
  run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL }}
```

**Risk Level:** 🟠 HIGH  
**Impact:** Staging may pull wrong environment variables or configuration

**Recommendation:**
```yaml
- name: Pull Vercel Environment Information
  run: vercel pull --yes --environment=staging --token=${{ secrets.VERCEL }}
  env:
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Note:** Vercel supports three environment types:
- `production` - Production deployments
- `preview` - Preview deployments (PRs, feature branches)
- `staging` - Staging environment (if configured in Vercel)

**Status:** ⚠️ Needs fix

---

### 4. Missing Environment URL for Staging

**Issue:** Staging deployment job doesn't define environment URL (production has it)

**Current:**
```yaml
deploy-staging:
  environment:
    # Missing 'name' and 'url' fields

deploy-production:
  environment:
    name: production
    url: https://hummbl.io
```

**Risk Level:** 🟠 HIGH  
**Impact:** Missing protection rules, approval gates, and environment visibility

**Recommendation:**
```yaml
deploy-staging:
  environment:
    name: staging
    url: https://staging-hummbl.vercel.app
```

**Status:** ⚠️ Should be added

---

### 5. GitHub Actions Not Pinned to Commit SHAs

**Issue:** All GitHub Actions use version tags (`@v4`) instead of commit SHAs

**Risk Level:** 🟠 HIGH  
**Security Impact:** Potential supply chain attack if action is compromised

**Current Pattern:**
```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
```

**Best Practice:**
```yaml
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4
- uses: actions/setup-node@1e60f620b9541d2be82c8b0db6bc2f4d65d4b8e0 # v4
```

**Recommendation:**
1. Pin all actions to commit SHAs
2. Use a tool like [`actionlint`](https://github.com/rhymond/actionlint) to check
3. Update actions periodically and test

**Status:** ⚠️ Should implement

---

### 6. No OIDC Authentication for Vercel

**Issue:** Using long-lived tokens (`VERCEL` secret) instead of OpenID Connect

**Risk Level:** 🟠 HIGH  
**Security Impact:** Long-lived tokens are more vulnerable if exposed

**Current:**
```yaml
run: vercel deploy --prebuilt --token=${{ secrets.VERCEL }}
```

**Best Practice:**
- Use Vercel's OIDC provider
- Short-lived tokens automatically rotated
- Better security posture

**Recommendation:**
1. Configure OIDC in Vercel:
   - Project Settings → General → Security
   - Enable "OpenID Connect"
2. Update workflow to use OIDC:
   ```yaml
   - uses: vercel/actions/auth@v1
     with:
       vercel-token: ${{ secrets.VERCEL }}
   ```
3. Phase out long-lived tokens

**Status:** ⚠️ Should implement (enhanced security)

---

## 🟡 Medium Priority Issues

### 7. Missing Deployment Concurrency Controls

**Issue:** No `concurrency` group for deployment jobs

**Risk Level:** 🟡 MEDIUM  
**Impact:** Multiple deployments could run simultaneously, causing conflicts

**Recommendation:**
Add to deployment jobs:
```yaml
deploy-staging:
  concurrency:
    group: deploy-staging
    cancel-in-progress: false  # Wait for current deployment

deploy-production:
  concurrency:
    group: deploy-production
    cancel-in-progress: false  # Never cancel production
```

**Status:** ⚠️ Should add

---

### 8. Missing Workflow-Level Timeouts

**Issue:** No timeout specified for deployment jobs (default is 360 minutes)

**Risk Level:** 🟡 MEDIUM  
**Impact:** Failed deployments could hang for hours

**Recommendation:**
Add timeouts:
```yaml
deploy-staging:
  timeout-minutes: 15

deploy-production:
  timeout-minutes: 20
```

**Status:** ⚠️ Should add

---

### 9. Missing SPA Routing Configuration

**Issue:** `vercel.json` doesn't include redirects for Single Page Application routing

**Risk Level:** 🟡 MEDIUM  
**Impact:** Direct navigation to routes (e.g., `/dashboard`) may return 404

**Current `vercel.json`:**
- Has headers configuration ✓
- Has rewrites for service-worker ✓
- **Missing:** SPA fallback redirect

**Recommendation:**
Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/service-worker.js",
      "destination": "/service-worker.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Note:** This should be the **last** rewrite rule (fallback)

**Status:** ⚠️ Should add if SPA

---

### 10. Inconsistent Build Verification

**Issue:** Production deployment doesn't verify build artifacts before deploying

**Risk Level:** 🟡 MEDIUM  
**Impact:** Could deploy broken builds

**Current Flow:**
```
build job → bundle-size → deploy (no verification)
```

**Recommendation:**
Add verification step:
```yaml
- name: Verify build artifacts
  run: |
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
      echo "❌ Build artifacts missing!"
      exit 1
    fi
    echo "✅ Build artifacts verified"
```

**Status:** ⚠️ Should add

---

### 11. No Deployment Notifications

**Issue:** Only production has success notification; staging has none; no failure notifications

**Risk Level:** 🟡 MEDIUM  
**Impact:** Team not aware of deployment status

**Recommendation:**
1. Add notifications for both environments
2. Add failure notifications (Slack/Discord webhook)
3. Include deployment URL and commit info

**Status:** ⚠️ Nice to have

---

## ✅ Good Practices Found

### Security Headers

**Excellent:** `vercel.json` includes comprehensive security headers:

- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy` configured
- ✅ `X-DNS-Prefetch-Control`

**Status:** ✅ Excellent

---

### Cache Configuration

**Excellent:** Optimized cache headers:

- ✅ Static assets: `max-age=31536000, immutable`
- ✅ models.json: `max-age=3600, stale-while-revalidate=86400`
- ✅ Different strategies for different content types

**Status:** ✅ Excellent

---

### Build Configuration

**Good:**
- ✅ Correct build command: `pnpm run build`
- ✅ Frozen lockfile: `pnpm install --frozen-lockfile`
- ✅ Correct output directory: `dist`
- ✅ Framework detection disabled (explicit config)

**Status:** ✅ Good

---

### Environment Variable Documentation

**Good:**
- ✅ `.env.example` exists as template
- ✅ Documentation in `docs/PRODUCTION_SETUP.md`
- ✅ Clear instructions for secrets management

**Status:** ✅ Good

---

### Deployment Workflow

**Good:**
- ✅ Separate jobs for staging and production
- ✅ Conditional deployment (branch-based)
- ✅ Environment-specific configurations
- ✅ Pre-deployment checks (build, bundle-size)

**Status:** ✅ Good structure

---

## 📊 Configuration Summary

### Current Vercel Configuration

**File:** `vercel.json`

```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": null,
  "outputDirectory": "dist",
  "headers": [ /* Comprehensive security headers */ ],
  "rewrites": [
    {
      "source": "/service-worker.js",
      "destination": "/service-worker.js"
    }
  ]
}
```

**Status:** ✅ Good base, needs SPA routing

---

### Deployment Jobs

| Job | Branch | Environment | URL | Status |
|-----|--------|-------------|-----|--------|
| `deploy-staging` | `staging` | `preview` ❌ | Missing | ⚠️ Needs fix |
| `deploy-production` | `main` | `production` ✅ | `https://hummbl.io` | ✅ Good |

---

## 🔧 Recommended Actions

### Immediate (Critical)

1. **Remove environment files from git:**
   ```bash
   git rm --cached .env.production .env.staging
   git commit -m "chore: remove environment files from git"
   ```

2. **Fix staging environment:**
   - Change `--environment=preview` to `--environment=staging`
   - Add environment URL to staging job

3. **Verify `.env` is not tracked:**
   ```bash
   git ls-files | grep "^\.env$"
   # Should return nothing
   ```

### High Priority (This Week)

4. **Pin GitHub Actions to commit SHAs**
5. **Add deployment concurrency controls**
6. **Add workflow timeouts**
7. **Implement OIDC authentication** (if supported)

### Medium Priority (This Month)

8. **Add SPA routing fallback** (if needed)
9. **Add build verification steps**
10. **Add deployment notifications**

---

## 📝 Testing Checklist

After fixes, verify:

- [ ] Staging deploys to correct environment
- [ ] Production deploys successfully
- [ ] Environment variables load correctly
- [ ] Direct routes work (SPA routing)
- [ ] Security headers are present
- [ ] Cache headers work correctly
- [ ] Rollback procedure works
- [ ] No environment files in git

---

## 🔗 Related Documentation

- [Vercel Configuration Reference](https://vercel.com/docs/concepts/projects/project-configuration)
- [GitHub Actions Security Best Practices](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
- [Vercel OIDC Setup](https://vercel.com/docs/security/integrations/oidc)

---

## 📊 Audit Score

| Category | Score | Notes |
|----------|-------|-------|
| **Security** | 6/10 | Environment files in git, unpinned actions |
| **Configuration** | 7/10 | Good base, staging config issue |
| **Best Practices** | 6/10 | Missing safeguards, OIDC |
| **Documentation** | 8/10 | Well documented |
| **Overall** | **6.75/10** | **B-** |

---

**Report Generated:** 2025-01-27  
**Next Review:** After fixes implemented
