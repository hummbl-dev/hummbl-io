# Staging Deployment Fix

**Issue:** `https://staging-hummbl.vercel.app/` returns 404: DEPLOYMENT_NOT_FOUND  
**Date:** 2025-01-27  
**Status:** ✅ Fixed (with setup instructions)

---

## Problem

The staging URL shows a 404 error because:
1. ❌ No `staging` branch exists in the repository
2. ❌ No deployment has been created for staging
3. ⚠️ Vercel doesn't natively support a "staging" environment (only `production` and `preview`)

---

## Solution Options

### Option 1: Use Preview Environment (Recommended for Now)

**Simplest approach** - Use Vercel's built-in preview deployments:

1. **Already configured:** The workflow now uses `--environment=preview` and deploys to `staging-hummbl.vercel.app`
2. **Create staging branch:**
   ```bash
   git checkout -b staging
   git push origin staging
   ```
3. **Deployment will trigger automatically** when you push to `staging` branch

**Pros:**
- ✅ Works immediately (no Vercel configuration needed)
- ✅ Uses preview environment variables
- ✅ Automatic deployments on push

**Cons:**
- ⚠️ Preview deployments are typically for PRs, not staging

---

### Option 2: Create Staging Branch & Configure

**Better long-term solution:**

#### Step 1: Create Staging Branch

```bash
# Create staging branch from main
git checkout main
git pull origin main
git checkout -b staging
git push origin staging
```

#### Step 2: Configure Vercel Preview URL

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Ensure `staging` branch is connected
3. Go to Settings → Domains
4. Add `staging-hummbl.vercel.app` as a preview domain
5. Or use a custom domain like `staging.hummbl.io`

#### Step 3: Configure Environment Variables for Preview

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add staging-specific variables with environment = "Preview"
3. Example:
   ```
   VITE_PLAUSIBLE_DOMAIN = staging.hummbl.io (Preview)
   VITE_API_URL = https://staging-api.hummbl.io (Preview)
   ```

#### Step 4: Verify Deployment

```bash
# Push to staging branch
git checkout staging
# Make a small change
echo "# Staging branch" >> README.md
git add README.md
git commit -m "chore: setup staging branch"
git push origin staging
```

The CI/CD workflow will automatically:
1. Run tests
2. Build the project
3. Deploy to staging-hummbl.vercel.app

---

### Option 3: Manual Deployment (Quick Fix)

If you need staging up immediately:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview with staging alias
vercel deploy --prod=false --alias=staging-hummbl.vercel.app
```

**Note:** This creates a one-time deployment. For automatic deployments, use Option 1 or 2.

---

## Current Configuration

The CI/CD workflow (`deploy-staging` job) is configured to:

- ✅ Trigger on pushes to `staging` branch
- ✅ Use `preview` environment (Vercel's built-in)
- ✅ Deploy to `staging-hummbl.vercel.app` alias
- ✅ Verify build artifacts before deployment
- ✅ Include deployment notifications

**What's needed:**
- ❌ Create `staging` branch
- ⚠️ Configure domain alias in Vercel (if using custom domain)

---

## Workflow Configuration

**Current setup in `.github/workflows/ci.yml`:**

```yaml
deploy-staging:
  name: Deploy to Staging
  needs: [build, bundle-size]
  if: github.ref == 'refs/heads/staging'  # Triggers on staging branch
  environment:
    name: staging  # GitHub environment (for protection rules)
    url: https://staging-hummbl.vercel.app
  steps:
    - name: Pull Vercel Environment Information
      run: vercel pull --yes --environment=preview  # Uses preview env
    - name: Deploy to Vercel (Staging/Preview)
      run: vercel deploy --prebuilt --alias=staging-hummbl.vercel.app
```

**Key Points:**
- Uses `preview` environment (Vercel's default)
- Deploys to `staging-hummbl.vercel.app` alias
- Requires `staging` branch to exist

---

## Quick Setup (Recommended)

**Fastest way to get staging working:**

```bash
# 1. Create staging branch
git checkout main
git checkout -b staging
git push origin staging

# 2. Wait for CI/CD to deploy (automatic)
# Or manually trigger deployment:
vercel deploy --prebuilt --alias=staging-hummbl.vercel.app
```

---

## Vercel Environment Types

Vercel supports three environment types:

| Type | Usage | When to Use |
|------|-------|-------------|
| `production` | Main production site | Deploys from `main` branch |
| `preview` | Preview deployments | PRs, feature branches, staging |
| `development` | Local development | `vercel dev` only |

**Note:** There's no separate "staging" environment type. Use `preview` for staging.

---

## Environment Variables

### Current Setup

- **Production:** Variables set for `Production` environment
- **Preview/Staging:** Variables set for `Preview` environment

### Recommended Configuration

In Vercel Dashboard → Settings → Environment Variables:

```
Variable                    Production        Preview (Staging)
─────────────────────────────────────────────────────────────
VITE_PLAUSIBLE_DOMAIN      hummbl.io         staging.hummbl.io
VITE_API_URL               api.hummbl.io     staging-api.hummbl.io
VITE_ADMIN_PASSWORD        [prod password]   [staging password]
```

---

## Troubleshooting

### Issue: Staging URL still shows 404

**Solution:**
1. Check if `staging` branch exists: `git branch -a | grep staging`
2. Check Vercel dashboard for deployments from `staging` branch
3. Verify domain alias is set: Vercel Dashboard → Domains
4. Check deployment logs in GitHub Actions

### Issue: Environment variables not loading

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Ensure variables are set for "Preview" environment
3. Redeploy: Push a new commit to `staging` branch

### Issue: Deployment fails

**Solution:**
1. Check GitHub Actions logs for `deploy-staging` job
2. Verify build artifacts exist
3. Check Vercel CLI output for errors
4. Ensure VERCEL secrets are set in GitHub

---

## Verification Checklist

After setup, verify:

- [ ] `staging` branch exists and is pushed to remote
- [ ] GitHub Actions workflow runs on push to staging
- [ ] Deployment succeeds (check Actions logs)
- [ ] `https://staging-hummbl.vercel.app` loads correctly
- [ ] Environment variables load correctly (check browser console)
- [ ] Build artifacts are correct (check network tab)

---

## Next Steps

1. **Create staging branch** (if it doesn't exist)
2. **Configure preview environment variables** in Vercel
3. **Push to staging branch** to trigger deployment
4. **Verify staging URL works**
5. **Update documentation** with actual staging URL if different

---

## References

- [Vercel: Environments](https://vercel.com/docs/concepts/projects/environments)
- [Vercel: Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments)
- [Vercel CLI: Deploy](https://vercel.com/docs/cli/deploy)

---

**Last Updated:** 2025-01-27  
**Status:** ✅ Workflow configured, staging branch needs to be created
