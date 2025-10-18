# GitHub Actions: Best-practices Checklist

This checklist converts GitHub-maintained best practices for Actions into actionable items you can add to your repository CONTRIBUTING.md or CI runbook.

Security (highest priority)
- [ ] Use least privilege: restrict token scopes and cloud roles; rotate credentials regularly.
- [ ] Never print secrets in logs; store sensitive values in GitHub Secrets.
- [ ] Use OpenID Connect (OIDC) for cloud auth instead of long-lived credentials.
- [ ] Pin third-party actions to a specific commit SHA (avoid floating refs).
- [ ] Establish provenance and artifact attestations for critical builds.

Workflow design & reliability
- [ ] Keep jobs small and single-purpose so failures are quicker to diagnose and can run in parallel.
- [ ] Use reusable workflows and composite actions to reduce duplication and enforce consistency.
- [ ] Use `concurrency` to prevent conflicting or simultaneous runs for dangerous operations (e.g., deployments).
- [ ] Add descriptive job names and use step-level `name:` fields to improve readability.

Performance, cost control & caching
- [ ] Cache dependencies with `actions/cache` (or language-specific cache action) for slow installs.
- [ ] Limit triggers: configure branch/path filters, schedule runs, or require manual dispatch where appropriate.
- [ ] Reuse runners where it makes sense and choose hosted vs self-hosted based on cost/performance.

Secrets, artifacts & observability
- [ ] Store secrets in GitHub Secrets and never commit secrets to the repo.
- [ ] Upload logs and debug artifacts on failures with `actions/upload-artifact`.
- [ ] Add clear failure annotations and use `continue-on-error:` sparingly for non-blocking checks.
- [ ] Enable and monitor Actions usage metrics and failure trends.

Deployment hardening
- [ ] Use least-privilege cloud roles and OIDC for deployment workflows.
- [ ] Use protected branches, required checks, and environment protection rules for production deployments.
- [ ] Require manual approvals or wait timers for sensitive production jobs (environments > protection rules).

Maintenance & publishing actions
- [ ] Publish actions with semantic versioning; use major/minor/patch tags and document breaking changes.
- [ ] Respond promptly to security reports for actions and dependencies.
- [ ] Prefer Marketplace or well-audited sources and include a SECURITY.md for published actions.

Operational tips & workflow hygiene
- [ ] Test workflows iteratively in branches and small PRs before merging to main.
- [ ] Add job-level and workflow-level timeouts and retries where appropriate.
- [ ] Avoid long-running monolithic workflows — break into smaller, composable pieces.
- [ ] Document workflow purpose, inputs, outputs, and expected runtimes in the workflow file header or repo docs.

Quick links
- GitHub Actions security guide: https://docs.github.com/actions/security-guides
- Reusable workflows: https://docs.github.com/actions/using-workflows/reusing-workflows
- Concurrency: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#concurrency
- Caching: https://docs.github.com/actions/using-workflows/caching-dependencies-to-speed-up-workflows

How to use this checklist
- Add this file to the repository root or link to it from CONTRIBUTING.md.
- Use it as part of CI reviews and PR checklists: require authors to confirm the items that apply.
- Update periodically as your CI process matures or GitHub Docs change.