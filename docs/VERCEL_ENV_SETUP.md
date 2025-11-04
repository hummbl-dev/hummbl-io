# Vercel Environment Variables Setup

## Required Environment Variables

### Supabase (Required for Auth & Data)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### OpenAI (Optional - for Chat Widget)
```bash
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

### Other Optional Variables
```bash
VITE_ADMIN_PASSWORD=your-secure-password  # For admin features
VITE_USE_STATIC_DATA=true                 # Use static data instead of API
VITE_BUILD_OUTPUT_DIR=/data              # Data directory
```

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
4. Click **Save**
5. Repeat for each variable

## Important Notes

### ⚠️ Variable Prefix
- **All client-side variables MUST start with `VITE_`**
- Vite only exposes variables with this prefix to the browser
- Variables without `VITE_` prefix won't be accessible in `import.meta.env`

### 🔄 Redeploy Required
After adding/changing environment variables:
1. **Redeploy** your project (automatic redeploy happens on next push)
2. Or manually trigger: **Deployments** → **Redeploy**

### ✅ Verification
After redeploying, verify variables are available:
1. Open your deployed site
2. Open browser console (F12)
3. Run: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. Should see your URL (not `undefined`)

## Environment-Specific Setup

### Production
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_OPENAI_API_KEY=sk-production-key
```

### Preview/Staging
```bash
# Can use same keys or separate staging project
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
```

### Development (Local)
Create `.env.local`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-your-key
```

## Security Best Practices

1. **Never commit** `.env.local` files to git
2. **Use different keys** for production vs staging
3. **Rotate keys** periodically
4. **Limit anon key permissions** in Supabase dashboard
5. **Use row-level security (RLS)** in Supabase

## Troubleshooting

### Variables not working after redeploy?
- ✅ Check variable names start with `VITE_`
- ✅ Verify environment scope (Production/Preview/Development)
- ✅ Check for typos in variable names
- ✅ Clear browser cache and hard refresh

### Supabase still showing as not configured?
- ✅ Verify both `VITE_SUPABASE_URL` AND `VITE_SUPABASE_ANON_KEY` are set
- ✅ Check values don't have trailing spaces
- ✅ Ensure redeploy completed successfully
- ✅ Check Vercel deployment logs for errors

### Variables showing in browser console?
- ⚠️ **This is normal** - `VITE_*` variables are exposed to client
- ✅ This is why we use Supabase **anon key** (not service role key)
- ✅ Anon key should have RLS (Row Level Security) enabled in Supabase
