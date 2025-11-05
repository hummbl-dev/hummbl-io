# Asset Creation Guide - HUMMBL Production Deployment

**Version**: 1.0.0  
**Last Updated**: 2025-11-05  
**Status**: PRE-DEPLOYMENT REQUIREMENTS  
**Priority**: HIGH - Required before production launch

---

## Overview

This guide provides comprehensive specifications for creating the visual assets required for HUMMBL's production deployment. These assets support social media sharing, mobile installation, search engine rich snippets, and brand consistency across platforms.

---

## Asset Requirements Summary

| Asset | Status | Dimensions | Format | Priority | Purpose |
|-------|--------|------------|--------|----------|---------|
| og-image.png | ⚠️ REQUIRED | 1200×630px | PNG | HIGH | Social sharing |
| apple-touch-icon.png | ⚠️ REQUIRED | 180×180px | PNG | HIGH | iOS home screen |
| logo.png | 📋 RECOMMENDED | 512×512px | PNG | MEDIUM | Search rich snippets |
| favicon.svg | ✅ EXISTS | Vector | SVG | - | Browser tab icon |

**Current Status**: 1 of 4 assets complete (favicon.svg exists)

---

## 1. SOCIAL SHARING IMAGE (og-image.png)

### Priority: 🔴 HIGH - REQUIRED FOR LAUNCH

**Purpose**: This image appears when users share HUMMBL links on social media platforms (Facebook, LinkedIn, Twitter, Slack, Discord, WhatsApp, etc.). It's the first visual impression for potential users discovering the framework through social channels.

### Technical Specifications

```
Filename: og-image.png
Location: /public/og-image.png
Dimensions: 1200 × 630 pixels (EXACT)
Format: PNG (recommended) or JPEG
Color Mode: RGB
File Size: < 8 MB (target < 1 MB for fast loading)
Aspect Ratio: 1.91:1 (fixed by Open Graph standard)
Resolution: 72 DPI minimum
Safe Zone: Keep critical elements within center 1200×600px
```

### Design Requirements

#### Brand Elements
- **Primary Color**: #2563eb (HUMMBL blue - already in favicon)
- **Typography**: Bold, modern sans-serif (Arial, Helvetica, or custom)
- **Logo/Icon**: Large "H" or full "HUMMBL" wordmark
- **Consistency**: Should visually align with favicon design

#### Content Requirements
**Must Include**:
1. **Framework Name**: "HUMMBL" or "HUMMBL Base120" prominently displayed
2. **Value Proposition**: Short tagline (e.g., "120 Mental Models Across 6 Transformations")
3. **Visual Interest**: Not just text - needs compelling visual elements

**Optional but Recommended**:
- Transformation icons or symbols (P, IN, CO, DE, RE, SY)
- Number "120" prominently featured
- Grid/framework visualization
- Subtle texture or gradient background
- Website URL: "hummbl.io"

#### Design Principles
- **Clarity at Small Size**: Image displays as small as 200px wide on mobile
- **Text Legibility**: High contrast, large text (minimum 48px for headlines)
- **Visual Hierarchy**: Most important element should be immediately visible
- **Professional Quality**: Represents brand credibility and polish
- **Mobile-First**: Most social sharing happens on mobile devices

### Design Templates

#### Option A: Bold Typography Focused
```
+--------------------------------------------------+
|                                                  |
|               HUMMBL BASE120                     |
|                                                  |
|     120 Mental Models • 6 Transformations        |
|                                                  |
|        [Optional: Simple geometric shapes]       |
|                                                  |
|                    hummbl.io                     |
+--------------------------------------------------+
Background: HUMMBL blue (#2563eb) or gradient
Text: White with subtle drop shadow
```

#### Option B: Visual Framework Grid
```
+--------------------------------------------------+
|  [H]  HUMMBL BASE120                            |
|                                                  |
|  [6x grid showing transformation icons]          |
|  P  IN  CO  DE  RE  SY                          |
|                                                  |
|  120 Mental Models for Better Thinking           |
|  hummbl.io                                       |
+--------------------------------------------------+
Background: White or light gray with blue accents
```

#### Option C: Minimal Modern
```
+--------------------------------------------------+
|                                                  |
|  HUMMBL                                          |
|                                                  |
|  120 mental models                               |
|  6 transformations                               |
|  Better decisions                                |
|                                                  |
+--------------------------------------------------+
Background: Solid HUMMBL blue
Text: Clean white typography, left-aligned
Accent: Single line or geometric element
```

### Creation Tools

#### Professional Design Software
- **Figma** (Free tier available): https://figma.com
- **Canva** (Templates available): https://canva.com
- **Adobe Photoshop**: Industry standard
- **Sketch**: Mac-only design tool
- **Affinity Designer**: One-time purchase alternative

#### Quick/AI-Assisted Options
- **Canva's AI**: Generate design from text prompt
- **Microsoft Designer**: Free AI design generation
- **Adobe Express**: Quick template-based creation

#### Code-Based Generation (If applicable)
- **HTML Canvas**: Generate programmatically
- **Puppeteer**: Screenshot of styled HTML
- **SVG to PNG**: Export from vector design

### Testing and Validation

#### Social Media Debuggers
1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Paste: https://hummbl.io
   - Click "Scrape Again" to refresh cache
   - Verify: Image displays correctly, no cropping issues

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Paste: https://hummbl.io
   - Verify: Card shows "Summary with Large Image"
   - Check: Image displays full-width

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Paste: https://hummbl.io
   - Verify: Preview looks professional

#### Preview at Different Sizes
- **Desktop**: Full 1200×630px
- **Mobile (Facebook)**: ~300px wide
- **Mobile (Twitter)**: ~280px wide
- **Slack/Discord**: ~360px wide

#### Validation Checklist
- [ ] Image is exactly 1200×630 pixels
- [ ] File size < 1 MB
- [ ] Text readable at 200px width
- [ ] No important content within 20px of edges
- [ ] High contrast (text vs. background)
- [ ] Brand colors consistent with site
- [ ] No spelling/grammar errors
- [ ] Professional appearance

---

## 2. APPLE TOUCH ICON (apple-touch-icon.png)

### Priority: 🔴 HIGH - REQUIRED FOR LAUNCH

**Purpose**: When iOS users save HUMMBL to their home screen, this icon appears. It's the app icon representation for mobile users treating the framework as an installed application.

### Technical Specifications

```
Filename: apple-touch-icon.png
Location: /public/apple-touch-icon.png
Dimensions: 180 × 180 pixels (EXACT)
Format: PNG with transparency or solid background
Color Mode: RGB
File Size: < 100 KB
Corners: iOS automatically applies rounded corners - design for square
Background: Should work on light and dark backgrounds
```

### Design Requirements

#### Visual Elements
- **Icon Design**: Simplified version of brand mark
- **No Text**: Generally too small to read on home screen
- **Bold Shapes**: Simple, recognizable at small size
- **High Contrast**: Clear silhouette even at thumbnail size
- **Current Favicon**: Large "H" on blue background (good starting point)

#### Design Approach

**Option A: Expand Current Favicon** (RECOMMENDED - Fastest)
- Take existing favicon.svg design (H on blue background)
- Export at 180×180px
- Ensure sharp edges and clear contrast
- Test visibility on various iOS background colors

**Option B: Symbol-Based Icon**
- Create geometric representation of framework
- 6 elements representing transformations
- Grid pattern suggesting mental models
- Memorable shape that works at small size

**Option C: Monogram Refinement**
- Stylized "H" with unique characteristics
- Add subtle framework elements
- Maintain simplicity for recognition

### Technical Notes

- **iOS Rendering**: Apple adds 20% corner radius automatically
- **Safe Zone**: Keep key elements away from corners
- **No Transparency**: iOS applies background if transparent (unpredictable color)
- **Size Variants**: iOS may generate smaller sizes automatically

### Creation from Existing Favicon

#### Using SVG to PNG Conversion
```bash
# If you have ImageMagick installed:
convert -background none -density 300 favicon.svg -resize 180x180 apple-touch-icon.png

# Using online tool:
# 1. Visit https://svgtopng.com
# 2. Upload public/favicon.svg
# 3. Set dimensions to 180x180
# 4. Download as apple-touch-icon.png
```

#### Manual Export (Figma/Sketch/Adobe)
1. Open favicon.svg in design tool
2. Resize artboard to 180×180px
3. Export as PNG (@1x, no compression)
4. Save as apple-touch-icon.png

### Testing and Validation

#### Visual Verification
- [ ] 180×180 pixels exactly
- [ ] File size < 100 KB
- [ ] Sharp edges (no blur from upscaling)
- [ ] Visible on light backgrounds
- [ ] Visible on dark backgrounds
- [ ] No text attempting to be readable

#### iOS Testing (Ideal)
1. Deploy to staging
2. Open site on iPhone/iPad
3. Tap Share → Add to Home Screen
4. Verify icon appears correctly
5. Check visibility against wallpaper

#### Alternative Testing
- Place 180×180 icon on various colored backgrounds
- Test at 60×60px (simulates home screen view)
- Ensure recognizable and on-brand

---

## 3. LOGO IMAGE (logo.png)

### Priority: 🟡 MEDIUM - RECOMMENDED FOR RICH SNIPPETS

**Purpose**: Used in structured data (JSON-LD) to represent the organization in Google's knowledge graph and search result rich snippets. Helps with brand recognition in search results.

### Technical Specifications

```
Filename: logo.png
Location: /public/logo.png
Dimensions: 512 × 512 pixels (RECOMMENDED) or higher
Format: PNG with transparency preferred
Color Mode: RGB
File Size: < 500 KB
Aspect Ratio: 1:1 (square)
Minimum Size: 112×112px (Google requirement)
```

### Design Requirements

#### Content Requirements
- **Full Logo**: Complete HUMMBL wordmark or combined logo+icon
- **Transparency**: PNG with transparent background (works anywhere)
- **Square Canvas**: Logo centered within square bounds
- **Padding**: Small padding around logo (10-15% of canvas)

#### Design Approach

**Option A: Wordmark Logo** (RECOMMENDED)
- "HUMMBL" in brand typography
- Potentially with "BASE120" subtitle
- Centered on transparent background
- Can include "H" icon to left of wordmark

**Option B: Icon + Text Combination**
- Large "H" icon with "HUMMBL" text
- Stacked or horizontal layout
- Suitable for various contexts

**Option C: Icon Only** (If no wordmark exists)
- Enhanced version of favicon
- More detail than home screen icon
- Works at multiple sizes

### Google Requirements (From Documentation)

From Google's Structured Data Guidelines:
- Minimum 112×112 pixels
- Must be visible and centered within image
- Transparent background preferred but not required
- Should represent the organization, not product

### Creation Strategy

#### If Full Logo Exists
1. Export at 512×512px or 1024×1024px
2. Center logo with appropriate padding
3. Use transparent background
4. Save as logo.png

#### If Creating New Logo
1. Use existing favicon "H" as starting point
2. Add "HUMMBL" wordmark
3. Balance icon and text
4. Export at high resolution

### Structured Data Update

After creating logo.png, the structured data in index.html references it:

```json
"logo": {
  "@type": "ImageObject",
  "url": "https://hummbl.io/logo.png"
}
```

This is already in place - just needs the actual file created.

### Testing and Validation

#### Structured Data Testing
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Enter URL: https://hummbl.io
3. Verify: Logo image loads without errors
4. Check: Image meets minimum size requirements

#### Visual Testing
- [ ] 512×512 pixels minimum
- [ ] Logo centered with padding
- [ ] Transparent background
- [ ] Visible when displayed small (112×112)
- [ ] Professional appearance
- [ ] Consistent with brand

---

## 4. FAVICON (favicon.svg)

### Priority: ✅ COMPLETE - EXISTS AND FUNCTIONAL

**Purpose**: Browser tab icon, bookmark icon, browser history. The most visible brand element across user browsing sessions.

### Current Status

**File**: `/public/favicon.svg` (259 bytes)  
**Design**: Large white "H" on HUMMBL blue (#2563eb) rounded rectangle  
**Status**: ✅ Adequate for launch  

### Current Design Analysis

#### Strengths
- ✅ Simple and recognizable
- ✅ Works at small sizes (16×16, 32×32)
- ✅ Brand color consistent
- ✅ Fast loading (259 bytes)
- ✅ SVG format (scales perfectly)

#### Potential Improvements (Future Iteration)
- Add subtle details that emerge at larger sizes
- Consider slight refinement of letter form
- Test visibility across different browser themes

### Verification

The favicon is already linked in index.html:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

#### Testing Checklist
- [x] File exists at /public/favicon.svg
- [x] Linked in index.html
- [x] Visible in browser tabs
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify in dark mode/light mode

### No Action Required

Current favicon is production-ready. Consider refinement only after gathering user feedback post-launch.

---

## Implementation Checklist

### Phase 1: Asset Creation (Chief Engineer + Claude)

#### Design Session Planning
- [ ] Review all three required assets (og-image, apple-touch-icon, logo)
- [ ] Decide on design direction (minimal, bold, visual, etc.)
- [ ] Allocate creation time (estimate 2-4 hours total)
- [ ] Choose creation tools (Figma, Canva, Adobe, etc.)

#### Asset Creation Workflow
1. **og-image.png** (1200×630px)
   - [ ] Gather brand assets (colors, fonts, existing designs)
   - [ ] Create design based on chosen template/direction
   - [ ] Export at exact dimensions (1200×630)
   - [ ] Optimize file size (target < 1 MB)
   - [ ] Save as: `og-image.png`

2. **apple-touch-icon.png** (180×180px)
   - [ ] Export current favicon.svg or create new design
   - [ ] Ensure 180×180 exact dimensions
   - [ ] Test visibility on light/dark backgrounds
   - [ ] Optimize file size (target < 100 KB)
   - [ ] Save as: `apple-touch-icon.png`

3. **logo.png** (512×512px+)
   - [ ] Create or export full HUMMBL logo
   - [ ] Center on square canvas with padding
   - [ ] Use transparent background
   - [ ] Export at 512×512 or higher
   - [ ] Save as: `logo.png`

### Phase 2: File Placement (Cascade)

#### Asset Installation
```bash
# Cascade will execute when assets are ready:
# 1. Receive assets from Chief Engineer
# 2. Place in /public/ directory
# 3. Verify file names and dimensions
# 4. Commit to repository
# 5. Deploy to staging for testing
```

#### Placement Locations
- `/public/og-image.png` → Social sharing
- `/public/apple-touch-icon.png` → iOS home screen
- `/public/logo.png` → Structured data

#### Git Workflow
```bash
# Cascade will execute:
git add public/og-image.png public/apple-touch-icon.png public/logo.png
git commit -m "Add production assets for social sharing, iOS, and structured data"
git push origin feature/base120-foundation
git push origin staging
```

### Phase 3: Validation (All Agents)

#### Technical Validation
- [ ] File dimensions correct (measure with image tool)
- [ ] File sizes within targets
- [ ] File formats correct (PNG for all three)
- [ ] Files placed in correct locations
- [ ] No file corruption (opens correctly)

#### Functional Validation
- [ ] Facebook Sharing Debugger shows og-image
- [ ] Twitter Card Validator displays correctly
- [ ] LinkedIn Post Inspector renders properly
- [ ] iOS home screen icon appears (if testable)
- [ ] Google Rich Results Test passes (logo.png)

#### Cross-Browser Testing
- [ ] Chrome: Favicon displays
- [ ] Firefox: Favicon displays
- [ ] Safari: Favicon and apple-touch-icon display
- [ ] Edge: Favicon displays

### Phase 4: Production Deployment

#### Pre-Deployment Final Check
- [ ] All three assets created and validated
- [ ] Assets committed to feature and staging branches
- [ ] Social sharing preview looks professional
- [ ] No errors in structured data validation
- [ ] Team consensus on asset quality

#### Deployment Trigger
Once assets are validated:
- [ ] Merge staging to main (or production branch)
- [ ] Deploy to Vercel production
- [ ] Clear social media caches (Facebook debugger)
- [ ] Verify assets load from production URL

---

## Quick Reference: Asset Specifications

### File Requirements Table

| Asset | Dimensions | Format | Max Size | Status |
|-------|------------|--------|----------|---------|
| og-image.png | 1200×630px | PNG/JPG | 8 MB | ⚠️ Required |
| apple-touch-icon.png | 180×180px | PNG | 100 KB | ⚠️ Required |
| logo.png | 512×512px+ | PNG | 500 KB | 📋 Recommended |
| favicon.svg | Vector | SVG | 10 KB | ✅ Complete |

### Color Palette

```css
Primary Blue: #2563eb (HUMMBL brand blue)
White: #ffffff (text on blue)
Text Dark: #1f2937 (body text)
Gray: #6b7280 (secondary text)
Background: #ffffff (main)
```

### Typography Reference

Current site uses system fonts:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif
```

For assets, use:
- **Bold Headlines**: Arial Bold, Helvetica Bold, or modern sans-serif
- **Body Text**: Same family regular weight (if needed)

---

## Tools and Resources

### Design Tools (Free Options)

#### Figma (Recommended)
- URL: https://figma.com
- Free tier: Unlimited files
- Templates: Search community for "open graph" or "social media"
- Export: Built-in PNG export at exact dimensions

#### Canva
- URL: https://canva.com
- Free tier: Good selection of templates
- Search: "Facebook post" or "social media" for 1200×630 templates
- Pro tip: Use "Custom dimensions" for exact sizing

#### Adobe Express
- URL: https://www.adobe.com/express
- Free tier: Template-based creation
- Quick option for social sharing images

### Export and Optimization Tools

#### Online PNG Optimization
- **TinyPNG**: https://tinypng.com (compress without quality loss)
- **Squoosh**: https://squoosh.app (advanced compression options)
- **ImageOptim**: https://imageoptim.com (Mac app, excellent results)

#### SVG to PNG Conversion
- **SVG to PNG**: https://svgtopng.com
- **CloudConvert**: https://cloudconvert.com/svg-to-png
- **Inkscape**: Desktop app (free, powerful)

### Validation Tools

#### Social Media Validators
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

#### Structured Data
- **Google Rich Results**: https://search.google.com/test/rich-results
- **Schema Validator**: https://validator.schema.org/

#### Image Analysis
- **Image Size Checker**: https://www.websiteplanet.com/webtools/imagesize/
- **Image Format Converter**: https://www.iloveimg.com/

---

## Example Workflow: Creating og-image.png

### Using Figma (Recommended Approach)

1. **Setup**
   - Open Figma (free account)
   - Create new design file
   - Set frame to 1200×630px

2. **Design**
   - Add rectangle: 1200×630, fill #2563eb (HUMMBL blue)
   - Add text: "HUMMBL BASE120" (bold, white, 96px)
   - Add text: "120 Mental Models • 6 Transformations" (regular, white, 42px)
   - Add text: "hummbl.io" (smaller, white, 32px)
   - Arrange with visual hierarchy
   - Optional: Add geometric shapes or icons

3. **Export**
   - Select frame
   - Right panel → Export
   - Format: PNG, 1x
   - Export "og-image"

4. **Optimize**
   - Upload to TinyPNG.com
   - Download optimized version
   - Verify size < 1 MB

5. **Validate**
   - Test in Facebook Sharing Debugger
   - Verify text readability at 300px wide
   - Check overall appearance

### Using Canva (Alternative)

1. **Setup**
   - Open Canva
   - "Custom dimensions" → 1200×630px
   - Start blank or choose template

2. **Design**
   - Similar to Figma approach
   - Use text tools and shapes
   - Apply HUMMBL brand colors
   - Ensure text legibility

3. **Download**
   - Click "Download"
   - Format: PNG
   - Quality: High

4. **Optimize and validate** (same as Figma)

---

## Common Questions and Troubleshooting

### Q: Can I use JPEG instead of PNG for og-image?
**A**: Yes, JPEG is acceptable for og-image.png (despite the .png in the name). However, PNG is recommended because:
- Better quality for graphics and text
- No compression artifacts around text
- Only slightly larger file size with optimization

### Q: What if I don't have design skills?
**A**: Several options:
1. Use Canva templates (search "social media" or "Facebook post")
2. Commission from Fiverr ($10-50 for simple designs)
3. Use AI tools (Microsoft Designer, Canva AI)
4. Start with text-only design (can be very effective if well-executed)

### Q: Do I need different og-images for different pages?
**A**: Not immediately. The single og-image works for the entire site initially. You can add page-specific images later if analytics show value.

### Q: Can I skip the logo.png?
**A**: It's recommended but not critical for launch. The structured data will work without it, just won't have the logo enhancement in potential rich snippets.

### Q: How do I test without deploying to production?
**A**: Deploy to staging first, then use the validation tools with the staging URL. Clear caches between tests with Facebook's "Scrape Again" button.

### Q: What if apple-touch-icon looks bad on iOS?
**A**: You can add multiple sizes if needed:
- `apple-touch-icon-120×120.png`
- `apple-touch-icon-152×152.png`
- `apple-touch-icon-180×180.png`

But start with just 180×180 - iOS handles resizing well.

---

## Next Steps After Asset Creation

### Immediate Actions
1. ✅ Chief Engineer + Claude create three assets
2. ✅ Cascade receives and places assets in /public/
3. ✅ Cascade commits assets to repository
4. ✅ Deploy to staging for validation
5. ✅ Run all validation tests
6. ✅ Fix any issues discovered
7. ✅ Deploy to production

### Post-Deployment Monitoring
- Monitor social sharing analytics
- Check for any asset loading errors
- Gather feedback on visual presentation
- Iterate based on evidence

### Future Enhancements (Optional)
- Create page-specific og-images for Models page
- Add transformation-specific social images
- Design model-specific share images (advanced)
- Create seasonal or promotional variants

---

## Conclusion

Asset creation is the final prerequisite for production deployment. The three required assets (og-image.png, apple-touch-icon.png, logo.png) establish professional visual presence across social media, mobile devices, and search results.

**Estimated Time**: 2-4 hours for design and creation  
**Tools Needed**: Figma, Canva, or similar design tool  
**Skills Required**: Basic design sense (templates available)  
**Blocking**: YES - production deployment should wait for these assets

Once assets are created, Cascade will handle placement, validation, and deployment within 30 minutes.

**The framework awaits only these visual elements to achieve full production readiness.**

---

**Document maintained by**: HUMMBL Development Team  
**Primary contact**: Chief Engineer  
**Technical implementation**: Windsurf Cascade  
**Design consultation**: Lead Development Agent (Claude Sonnet 4.5)

**Status**: READY FOR ASSET CREATION SESSION
