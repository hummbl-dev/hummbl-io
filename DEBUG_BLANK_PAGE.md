# Debugging Blank Page Issue

## Quick Checklist

### 1. Check Browser Console (F12)
**Most likely issue**: JavaScript error preventing render

**What to look for:**
- Red error messages
- Failed module imports
- TypeScript compilation errors

**Common errors:**
- `Cannot find module './components/...'`
- `Unexpected token`
- `TypeError: Cannot read property...`

### 2. Check Network Tab
**What to look for:**
- 404 errors for modules
- 500 errors from server
- Failed chunk loading

**Files that should load:**
- `/src/main.tsx`
- `/src/App.tsx`
- `/src/index.css`
- React dependencies

### 3. React Root Check
**Verify:** Browser console should show React app mounted

**In console, run:**
```javascript
// Check if root element exists
document.getElementById('root')

// Check if React app rendered
document.querySelector('#root').innerHTML
```

---

## Quick Fixes

### Fix 1: Clear Cache
```bash
# In browser, open DevTools (F12)
# Go to Application > Storage > Clear site data
# Or: Cmd+Shift+R to hard refresh
```

### Fix 2: Check for Build Errors
```bash
# Stop current server
pkill -f vite

# Rebuild dependencies
pnpm install

# Restart server
pnpm dev
```

### Fix 3: Check for Import Errors
```bash
# Look for compilation errors
curl http://localhost:5173/src/App.tsx

# Should return source code, not error
```

### Fix 4: Browser Compatibility
- Try different browser (Chrome, Firefox, Safari)
- Try incognito mode
- Check if extensions are blocking

---

## Most Likely Causes

1. **Module Import Error**: A file we changed isn't importing correctly
2. **TypeScript Error**: Build-time error causing blank page
3. **React Root Error**: Component crashing on mount
4. **Cascade Types Issue**: The .d.ts files we generated

---

## Diagnostic Commands

Run these to see what's wrong:

```bash
# Check if server is running
curl http://localhost:5173

# Check if main file loads
curl http://localhost:5173/src/main.tsx

# Check if App loads
curl http://localhost:5173/src/App.tsx

# Check browser console
# (Open F12 in browser)
```

---

## Expected Console Output

If everything works, you should see in browser console:
```
vite: connecting... ✓
App.tsx loaded
Mental models fetching...
No errors
```

---

## Next Steps

**Please share:**
1. Any errors from browser console (F12)
2. Any errors from network tab
3. Screenshot of blank page
4. What you see when you inspect the page (right-click > Inspect)

Then I can fix the specific issue!





