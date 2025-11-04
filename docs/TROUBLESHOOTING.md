# Troubleshooting Guide

## Browser Extension Console Warnings

### Keplr Wallet Injection Errors

**Error Message:**
```
injectedScript.bundle.js:2 Failed to inject getOfflineSigner from keplr. Probably, other wallet is trying to intercept Keplr
```

**What it is:**
- This is a harmless warning from browser extensions (cryptocurrency wallets)
- Occurs when multiple wallet extensions (Keplr, MetaMask, Trust Wallet, etc.) try to inject scripts simultaneously
- **Not related to your codebase** - your app doesn't use Keplr or any wallet extensions

**Impact:**
- ✅ **None** - Your app works perfectly fine
- ✅ **Performance** - No impact on bundle size or loading speed
- ✅ **Functionality** - Doesn't affect any features

**Solutions:**

1. **Ignore it** (Recommended)
   - It's just console noise
   - Doesn't affect your application
   - Safe to ignore

2. **Disable wallet extensions** (If it bothers you)
   - Chrome: Extensions → Disable unused wallet extensions
   - Keep only the wallet you actually use

3. **Filter console logs** (For cleaner debugging)
   - Chrome DevTools → Console → Settings → Filter
   - Add filter: `-keplr -injectedScript`

4. **Use Incognito/Private mode**
   - Extensions are disabled by default
   - Good for testing without extension noise

**Verification:**
This is NOT an error in your code if:
- ✅ Your app loads and works correctly
- ✅ No functionality is broken
- ✅ Bundle sizes are correct
- ✅ Performance metrics are good

## Other Common Issues
