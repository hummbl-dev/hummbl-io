# Performance Testing Guide

This guide helps you verify that the performance optimizations are working correctly.

## Quick Test Checklist

- [ ] Initial bundle loads in under 2 seconds
- [ ] Lazy-loaded components only load when needed
- [ ] ChatWidget loads after delay or interaction
- [ ] Bundle sizes match expected values
- [ ] Web Vitals metrics meet targets

## 1. Browser Network Tab Testing

### Test Initial Load

1. **Open DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Go to the **Network** tab
   - Check "Disable cache"
   - Set throttling to "Fast 3G" or "Slow 3G" for realistic testing

2. **Reload the page**
   - Visit: `http://localhost:4173`
   - Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

3. **Check Initial Bundle**
   - You should see these files load immediately:
     - `index-hNHUov0t.js` (~6.4 KB gzipped)
     - `vendor-react-CROeqEqQ.js` (~58 KB gzipped)
     - `vendor-DcGNa1qt.js` (~8.3 KB gzipped)
   - Total initial JS should be ~70-80 KB gzipped

### Test Lazy Loading

1. **NarrativeList Component**
   - Click to view "Narratives" view
   - **Expected**: `NarrativeList-B65WNZYg.js` loads (~7 KB gzipped)
   - Check Network tab shows it loads only after clicking

2. **MentalModelsList Component**
   - Switch to "Models" view
   - **Expected**: `MentalModelsList-DMwQKmqz.js` loads (~1 KB gzipped)
   - Should NOT load when viewing Narratives

3. **ChatWidget Component**
   - **Expected**: `ChatWidget-DcCRJSIX.js` loads after:
     - 3 seconds delay, OR
     - First user interaction (click, scroll, keypress)
   - Check Network tab - it should NOT load immediately on page load

4. **ModelDetailModal Component**
   - Click on any mental model card
   - **Expected**: `ModelDetailModal-Cs8l2W9f.js` loads (~1.3 KB gzipped)
   - Should NOT load until modal is opened

### Verify Code Splitting

1. **Check chunk separation**
   - Vendor chunks should be separate:
     - `vendor-react-CROeqEqQ.js` - React/ReactDOM
     - `vendor-supabase-CQeTyB6P.js` - Supabase client
     - `vendor-DcGNa1qt.js` - Other utilities
   
2. **CSS code splitting**
   - Each component should have its own CSS file:
     - `NarrativeList-QAPDqUV_.css`
     - `ChatWidget-CKpCUkhT.css`
     - `MentalModelsList-B5-b-1M_.css`

## 2. Performance Metrics Testing

### Using Chrome DevTools Performance Tab

1. **Record Performance**
   - Open DevTools → **Performance** tab
   - Click the record button (circle)
   - Navigate the site (load narratives, models, etc.)
   - Stop recording

2. **Check Metrics**
   - **First Contentful Paint (FCP)**: Should be < 1.5s
   - **Largest Contentful Paint (LCP)**: Should be < 2.5s
   - **Total Blocking Time (TBT)**: Should be < 300ms
   - **Cumulative Layout Shift (CLS)**: Should be < 0.1

### Using Lighthouse

```bash
# Run Lighthouse audit
pnpm audit:perf http://localhost:4173
```

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Web Vitals Console

1. **Open Console**
   - DevTools → **Console** tab
   - Look for `[Web Vitals]` messages
   - Metrics should log automatically

2. **Check Performance Marks**
   ```javascript
   // In browser console:
   performance.getEntriesByType('mark')
   performance.getEntriesByType('measure')
   ```

## 3. Bundle Size Verification

### Run Bundle Analysis

```bash
pnpm analyze:bundle
```

**Expected Results:**
- Initial JS bundle: ~6-7 KB gzipped
- Total JS: ~129 KB gzipped (across all chunks)
- Total CSS: ~17 KB gzipped (split by component)
- Compression ratio: ~70-80%

### Compare Before/After

**Before Optimization:**
- Single bundle: ~419 KB (55 KB gzipped)
- All code loaded upfront

**After Optimization:**
- Initial bundle: ~6.4 KB gzipped
- Lazy-loaded chunks: Load on demand
- Much better caching (vendor chunks change rarely)

## 4. Service Worker Testing

### Verify Caching

1. **Check Service Worker**
   - DevTools → **Application** tab → **Service Workers**
   - Should show: `service-worker.js` registered

2. **Test Offline Mode**
   - DevTools → **Network** tab
   - Select "Offline" from throttling dropdown
   - Reload page
   - **Expected**: Page should still load from cache

3. **Check Cache Storage**
   - DevTools → **Application** tab → **Cache Storage**
   - Should see caches:
     - `hummbl-v2-static`
     - `hummbl-v2-dynamic`
     - `hummbl-v2-data`
     - `hummbl-v2-runtime`

## 5. Manual Interaction Testing

### Test ChatWidget Lazy Loading

1. **Open page without interaction**
   - Load page, don't click anything
   - Wait 3 seconds
   - **Expected**: ChatWidget should appear after 3s
   - Check Network tab: `ChatWidget-*.js` should load

2. **Test interaction-based loading**
   - Reload page
   - Immediately click anywhere on the page
   - **Expected**: ChatWidget should appear immediately
   - Network tab: `ChatWidget-*.js` loads on first interaction

### Test View Switching

1. **Switch between views**
   - Start on Narratives view
   - Check Network: Only NarrativeList chunk loaded
   - Switch to Models view
   - Check Network: MentalModelsList chunk loads
   - Switch back to Narratives
   - **Expected**: NarrativeList chunk already cached, no new request

## 6. Automated Testing Script

Run the performance audit:

```bash
# Test local preview
pnpm audit:perf http://localhost:4173

# Test production build locally
pnpm preview &
pnpm audit:perf http://localhost:4173
```

## 7. Common Issues & Solutions

### Issue: Site not loading data / API errors

**Symptoms**: Blank pages, loading spinners, or API errors
**Solution**: 
- Check if external services are active (Supabase, etc.)
- Verify API keys and environment variables are set
- Check browser console for API-related errors
- **Note**: Bundle optimizations are independent of API connectivity - check Network tab for bundle sizes even if data isn't loading

### Issue: Components not lazy loading

**Symptoms**: All chunks load immediately
**Solution**: 
- Check `App.tsx` has `React.lazy()` imports
- Verify Suspense boundaries are in place
- Check browser console for errors

### Issue: Bundle size still large

**Symptoms**: Initial bundle > 100 KB
**Solution**:
- Run `pnpm build` again to ensure latest config
- Check `vite.config.ts` has manual chunks configured
- Verify no large dependencies accidentally bundled

### Issue: ChatWidget loads immediately

**Symptoms**: ChatWidget chunk in initial load
**Solution**:
- Check `LazyChatWidget` component in `App.tsx`
- Verify timer/interaction listeners are working
- Check browser console for errors

### Issue: Service Worker not caching

**Symptoms**: Network requests not cached
**Solution**:
- Check service worker registration in console
- Verify `service-worker.js` is accessible
- Check Application tab → Service Workers for errors

## 8. Performance Benchmarks

### Target Metrics

| Metric | Target | Current (After Optimization) |
|--------|--------|------------------------------|
| FCP | < 1.5s | TBD (measure with Lighthouse) |
| LCP | < 2.5s | TBD |
| TBT | < 300ms | TBD |
| CLS | < 0.1 | TBD |
| TTI | < 3.5s | TBD |
| Initial Bundle | < 100 KB | ~64 KB ✅ |
| Total JS (gzipped) | < 300 KB | ~129 KB ✅ |

## 9. Next Steps

After verifying optimizations:

1. **Measure Production Metrics**
   - Deploy to staging/production
   - Run Lighthouse audit on live site
   - Compare with baseline metrics

2. **Monitor Real User Metrics**
   - Check Web Vitals in production
   - Monitor Core Web Vitals via Google Search Console
   - Track performance trends over time

3. **Continuous Monitoring**
   - Set up performance budgets
   - Add performance regression tests
   - Monitor bundle size in CI/CD

## Quick Test Commands

```bash
# Start preview server
pnpm preview

# In another terminal:

# Analyze bundle
pnpm analyze:bundle

# Run performance audit
pnpm audit:perf http://localhost:4173

# Build with bundle visualization
ANALYZE=true pnpm build
# Then open dist/stats.html in browser
```
