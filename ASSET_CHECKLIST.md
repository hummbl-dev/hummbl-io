# Asset Creation Checklist - Quick Reference

**Status**: PRE-DEPLOYMENT  
**Date**: 2025-11-05  
**Team**: Chief Engineer + Claude Sonnet 4.5 + Windsurf Cascade

---

## 📋 REQUIRED ASSETS (3 files)

### 1. og-image.png ⚠️ REQUIRED
- [ ] **Dimensions**: 1200 × 630 pixels (exact)
- [ ] **Format**: PNG or JPEG
- [ ] **File size**: < 1 MB (optimized)
- [ ] **Content**: HUMMBL branding + value proposition
- [ ] **Text legible**: Readable at 200px width
- [ ] **Saved as**: `og-image.png`
- [ ] **Location**: Will go in `/public/og-image.png`

**Quick Design**:
- Background: HUMMBL blue (#2563eb) or gradient
- Text: "HUMMBL BASE120" (large, white, bold)
- Subtitle: "120 Mental Models • 6 Transformations"
- Footer: "hummbl.io"
- Optional: Geometric shapes or transformation icons

### 2. apple-touch-icon.png ⚠️ REQUIRED
- [ ] **Dimensions**: 180 × 180 pixels (exact)
- [ ] **Format**: PNG
- [ ] **File size**: < 100 KB
- [ ] **Design**: Simple "H" logo or brand mark
- [ ] **Background**: Solid (no transparency issues)
- [ ] **Saved as**: `apple-touch-icon.png`
- [ ] **Location**: Will go in `/public/apple-touch-icon.png`

**Quick Option**: Export current `favicon.svg` at 180×180px

### 3. logo.png 📋 RECOMMENDED
- [ ] **Dimensions**: 512 × 512 pixels (or higher)
- [ ] **Format**: PNG with transparency
- [ ] **File size**: < 500 KB
- [ ] **Content**: Full HUMMBL logo/wordmark
- [ ] **Centered**: Logo centered with padding
- [ ] **Saved as**: `logo.png`
- [ ] **Location**: Will go in `/public/logo.png`

**Purpose**: Google structured data rich snippets

---

## 🎨 BRAND REFERENCE

### Colors
```
Primary Blue: #2563eb
White: #ffffff
Dark Gray: #1f2937
Light Gray: #6b7280
```

### Current Assets
- ✅ `favicon.svg` exists (white "H" on blue background)
- ✅ Can be used as basis for apple-touch-icon

---

## 🛠️ RECOMMENDED TOOLS

### Design
- **Figma** (free): https://figma.com
- **Canva** (free): https://canva.com  
- **Adobe Express**: Quick templates

### Optimization
- **TinyPNG**: https://tinypng.com
- **Squoosh**: https://squoosh.app

### SVG to PNG
- **SVG to PNG**: https://svgtopng.com
- **CloudConvert**: https://cloudconvert.com/svg-to-png

---

## ✅ VALIDATION CHECKLIST

### Before Submission
- [ ] All three files created
- [ ] Dimensions verified (use image tool to check)
- [ ] File sizes within limits
- [ ] File names exactly as specified
- [ ] No spelling/grammar errors in designs
- [ ] Brand colors consistent

### Files to Submit to Cascade
```
og-image.png (1200×630px, < 1MB)
apple-touch-icon.png (180×180px, < 100KB)
logo.png (512×512px+, < 500KB)
```

---

## 🚀 DEPLOYMENT WORKFLOW

### Phase 1: Asset Creation (Chief Engineer + Claude)
1. Design og-image.png using Figma/Canva
2. Export favicon.svg → apple-touch-icon.png (180×180)
3. Create logo.png with HUMMBL wordmark
4. Optimize all images (TinyPNG)
5. Verify dimensions and file sizes

### Phase 2: Handoff to Cascade
- Share three files with Cascade
- Cascade will place in `/public/` directory
- Cascade will commit to repository
- Cascade will deploy to staging

### Phase 3: Validation (All Agents)
- Test Facebook sharing preview
- Test Twitter card display
- Test iOS home screen icon (if possible)
- Validate Google structured data
- Verify production deployment

### Phase 4: Production Go-Live
- All validations passing
- Assets displaying correctly
- Deploy to production
- Clear social media caches

---

## ⏱️ TIME ESTIMATE

**Total**: 2-4 hours

- og-image.png design: 60-90 minutes
- apple-touch-icon.png: 15-30 minutes (if exporting from favicon)
- logo.png creation: 30-60 minutes
- Optimization & validation: 30-45 minutes
- Cascade deployment: 15-30 minutes

---

## 🆘 QUICK HELP

### I don't have design skills
- Use Canva templates (search "social media" or "Facebook post")
- Text-only designs can be very effective if well-executed
- Commission on Fiverr ($10-50 for simple work)

### I need the exact dimensions
```
og-image.png: 1200 × 630 pixels
apple-touch-icon.png: 180 × 180 pixels  
logo.png: 512 × 512 pixels (minimum)
```

### What should og-image include?
**Must have**:
- "HUMMBL" or "HUMMBL BASE120" (large)
- Value proposition tagline
- High contrast (white text on blue, or vice versa)

**Good to have**:
- "hummbl.io" domain
- Geometric elements
- Transformation symbols (P, IN, CO, DE, RE, SY)

### Can I use the existing favicon?
Yes! For apple-touch-icon.png:
1. Open `public/favicon.svg`
2. Export/convert to PNG at 180×180 pixels
3. Save as `apple-touch-icon.png`

---

## 📤 HOW TO SUBMIT TO CASCADE

### Option 1: File Sharing
Place files in a shared location and provide path to Cascade

### Option 2: Direct Upload
If working in same workspace, place in temporary directory:
```
/Users/others/Downloads/hummbl-assets/
├── og-image.png
├── apple-touch-icon.png
└── logo.png
```

Cascade will retrieve and place in `/public/`

---

## ✅ COMPLETION CRITERIA

**Ready for Production when**:
- [ ] All 3 asset files created
- [ ] Cascade has placed files in `/public/`
- [ ] Git committed and pushed to staging
- [ ] Facebook Sharing Debugger validates og-image
- [ ] Twitter Card Validator shows correct card
- [ ] No errors in Google Rich Results Test
- [ ] Team approves visual quality

**Then**: Deploy to production 🚀

---

## 📞 SUPPORT

**Full Documentation**: See `ASSET_CREATION_GUIDE.md` for:
- Detailed design templates
- Step-by-step workflows
- Troubleshooting common issues
- Tool recommendations
- Testing procedures

**Questions**: Ask Cascade or Claude for assistance

---

**Status**: AWAITING ASSET CREATION  
**Blocker**: Need 3 image files to proceed  
**Next**: Design session with Chief Engineer + Claude  
**ETA to Production**: 2-4 hours after asset creation begins
