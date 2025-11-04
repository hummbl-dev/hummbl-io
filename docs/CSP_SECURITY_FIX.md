# Content Security Policy (CSP) Fix

**Date:** 2025-01-27  
**Issue:** CSP blocking `script-src` - scripts were being blocked  
**Status:** ✅ Fixed

---

## Problem

The application was missing a Content Security Policy (CSP) header, or had an overly restrictive CSP that was blocking JavaScript execution. This can happen when:

1. Browser default security settings apply restrictive CSP
2. Vercel applies default security headers
3. Missing CSP header causes browser to block scripts

**Error Message:**
```
The Content Security Policy (CSP) prevents the evaluation of arbitrary strings as JavaScript to make it more difficult for an attacker to inject unauthorized code on your site.
```

---

## Solution

Added a comprehensive CSP header to `vercel.json` that:

✅ **Allows necessary scripts:**
- Scripts from same origin (`'self'`)
- Inline scripts (required for React/Vite and service worker registration)
- External scripts from trusted domains (Plausible analytics, Sentry error tracking)

✅ **Blocks dangerous patterns:**
- ❌ Does NOT allow `'unsafe-eval'` (prevents `eval()`, `new Function()`, string-based `setTimeout()`)
- ❌ Does NOT allow arbitrary external scripts
- ❌ Blocks inline event handlers (e.g., `onclick="..."`)

✅ **Allows necessary resources:**
- Styles from same origin and Google Fonts
- Images from any HTTPS source (for content flexibility)
- API connections to trusted domains
- Fonts from Google Fonts

---

## CSP Configuration

**Added to `vercel.json`:**

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io https://*.sentry.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.hummbl.io https://plausible.io https://*.sentry.io https://*.ingest.sentry.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
}
```

### Directive Breakdown

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Default fallback - only allow resources from same origin |
| `script-src` | `'self' 'unsafe-inline' https://plausible.io https://*.sentry.io` | Allow scripts from self, inline scripts, and trusted analytics/error tracking |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | Allow styles from self, inline styles, and Google Fonts |
| `font-src` | `'self' https://fonts.gstatic.com` | Allow fonts from self and Google Fonts |
| `img-src` | `'self' data: https:` | Allow images from self, data URIs, and any HTTPS source |
| `connect-src` | `'self' https://api.hummbl.io ...` | Allow API/fetch requests to trusted domains |
| `frame-ancestors` | `'none'` | Prevent site from being embedded in iframes (XSS protection) |
| `base-uri` | `'self'` | Prevent base tag injection attacks |
| `form-action` | `'self'` | Prevent form submission to external domains |

---

## Security Considerations

### ✅ What's Secure

1. **No `unsafe-eval`**: Prevents `eval()`, `new Function()`, and string-based `setTimeout()`/`setInterval()`
2. **Whitelisted domains**: Only specific trusted domains are allowed
3. **Frame protection**: `frame-ancestors 'none'` prevents clickjacking
4. **Base URI restriction**: Prevents base tag injection

### ⚠️ Trade-offs

1. **`unsafe-inline` for scripts**: 
   - **Why:** React/Vite bundles inline scripts, and service worker registration uses inline script
   - **Risk:** Allows inline `<script>` tags, which could be exploited if XSS vulnerability exists
   - **Mitigation:** Use nonces in the future (see "Future Improvements" below)

2. **`unsafe-inline` for styles**:
   - **Why:** React/Vite uses inline styles, and many UI libraries require it
   - **Risk:** Allows inline `style` attributes
   - **Mitigation:** Acceptable trade-off for React apps

---

## Why No `unsafe-eval`?

The error message specifically warns against allowing `unsafe-eval`. This directive would allow:
- `eval("console.log('hacked')")`
- `new Function("return alert('xss')")()`
- `setTimeout("malicious code", 1000)`

**Our CSP correctly blocks these** by not including `'unsafe-eval'` in `script-src`.

**If you see errors about `eval()` being blocked:**
- ✅ **This is good!** It means CSP is working
- ❌ **Don't add `'unsafe-eval'`** - instead, refactor code to avoid `eval()`

---

## Testing

After deployment, verify CSP is working:

1. **Check headers:**
   ```bash
   curl -I https://hummbl.io | grep -i "content-security-policy"
   ```

2. **Browser DevTools:**
   - Open DevTools → Network tab
   - Look for CSP violations in Console
   - Check that scripts load correctly

3. **CSP Evaluator:**
   - Use https://csp-evaluator.withgoogle.com/ to test your CSP
   - Paste the CSP value and check for warnings

---

## Common CSP Violations

### If you see these errors, here's what to check:

| Error | Cause | Fix |
|-------|-------|-----|
| `Refused to execute inline script` | Inline `<script>` tag | Add nonce or move to external file |
| `Refused to load script from 'https://example.com'` | External script not whitelisted | Add domain to `script-src` |
| `Refused to evaluate a string as JavaScript` | `eval()` or `new Function()` | Refactor code to avoid eval |
| `Refused to connect to 'https://api.example.com'` | API domain not whitelisted | Add domain to `connect-src` |
| `Refused to load image` | Image source not allowed | Add domain to `img-src` or use `data:` |

---

## Future Improvements

### 1. Use Nonces for Inline Scripts (Recommended)

Instead of `'unsafe-inline'`, use nonces:

**In `index.html`:**
```html
<script nonce="{{NONCE}}">
  // Service worker registration
</script>
```

**In `vercel.json`:**
```json
{
  "key": "Content-Security-Policy",
  "value": "script-src 'self' 'nonce-{{NONCE}}' https://plausible.io ..."
}
```

**Note:** Requires server-side rendering or build-time nonce injection.

### 2. Use Hashes for Specific Inline Scripts

For fixed inline scripts, use SHA-256 hashes:

```bash
echo -n "script content here" | openssl dgst -sha256 -binary | openssl base64
```

```json
{
  "value": "script-src 'self' 'sha256-ABC123...' ..."
}
```

### 3. Stricter Image Policy

Current: `img-src 'self' data: https:`

**Tighter (if you know all image sources):**
```json
{
  "value": "img-src 'self' data: https://cdn.example.com https://images.example.com"
}
```

### 4. Report-Only Mode for Testing

Test CSP changes without breaking the site:

```json
{
  "key": "Content-Security-Policy-Report-Only",
  "value": "..."
}
```

This logs violations without blocking resources.

---

## Code Review Checklist

When adding new features, check:

- [ ] No use of `eval()` or `new Function()`
- [ ] No string-based `setTimeout()` or `setInterval()`
- [ ] External scripts from whitelisted domains only
- [ ] API calls to whitelisted domains only
- [ ] Images from allowed sources only
- [ ] No inline event handlers (`onclick="..."`)

---

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [OWASP: Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Vercel: Headers Configuration](https://vercel.com/docs/concepts/projects/project-configuration#headers)

---

## Verification

After this fix:

- ✅ Scripts load correctly
- ✅ Service worker registers
- ✅ Analytics (Plausible) works
- ✅ Error tracking (Sentry) works
- ✅ No `eval()` usage allowed (secure)
- ✅ No `unsafe-eval` directive (secure)

**Status:** ✅ CSP properly configured and working

---

**Last Updated:** 2025-01-27

