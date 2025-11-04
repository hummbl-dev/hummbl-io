# HUMMBL.io

**Version 1.0.0** | **Framework Version 1.0-beta**

Official website for HUMMBL Base120 - A comprehensive framework of 120 mental models organized across 6 fundamental transformations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hummbl/hummbl-io)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit [http://localhost:5173](http://localhost:5173) to view the site.

---

## Architecture

### Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 3
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

### Project Structure

```
src/
├── components/          # React components (named exports)
│   ├── Header.tsx      # Main navigation
│   ├── Footer.tsx      # Site footer
│   └── TransformationCard.tsx  # Transformation showcase cards
├── constants/          # Application constants
│   └── transformations.ts      # 6 transformations data
├── types/              # TypeScript type definitions
│   └── models.ts       # Mental model types
├── utils/              # Utility functions
│   └── cn.ts           # ClassName merger
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles + Tailwind
```

---

## HUMMBL Framework

### The 6 Transformations

1. **P (Perspective)**: Frame, name, shift POV
2. **IN (Inversion)**: Reverse assumptions, work backward
3. **CO (Composition)**: Build up, combine, integrate parts
4. **DE (Decomposition)**: Break down, modularize, separate
5. **RE (Recursion)**: Self-reference, repetition, iteration
6. **SY (Systems)**: Meta-systems, patterns, emergence

Each transformation contains exactly 20 mental models, totaling 120 models in the Base120 framework.

---

## Code Standards

### TypeScript

- **Strict Mode**: All code uses TypeScript strict mode
- **No `any` Types**: Use `unknown` or proper types
- **Interfaces**: For object shapes
- **Named Exports**: No default exports

### React

- **Functional Components**: Only functional components with `React.FC`
- **Typed Props**: All props have interfaces
- **Named Exports**: `export const Component: React.FC<Props>`
- **Hooks**: Proper typing with loading/error states

### Example Component

```typescript
interface CardProps {
  title: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, onClick }) => {
  return <div onClick={onClick}>{title}</div>;
};
```

---

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Variables

No environment variables required for development. For production deployment, Vercel Analytics is automatically configured.

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure domain: `hummbl.io`
4. Deploy automatically

### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework Preset**: Vite

---

## Features

### ✅ Implemented

- Hero section with framework overview
- 6 transformations showcase grid
- Responsive header with mobile menu
- Footer with company info and links
- Vercel Analytics integration
- TypeScript strict mode
- TailwindCSS styling
- Named exports throughout

### 🚧 Planned

- Mental models explorer/grid
- Individual transformation pages
- Model detail pages
- Search functionality
- Interactive model relationships
- Case studies section

---

## Company

**HUMMBL Systems (HUMMBL, LLC)**

- Website: [hummbl.io](https://hummbl.io)
- Domain: hummbl.io
- Phase: Phase 0 commercialization (Oct 2025)
- Goal: 10 WAU + 3 case studies by 2025-11-25

---

## License

© 2025 HUMMBL Systems (HUMMBL, LLC). All rights reserved.

---

## Troubleshooting

### Build Issues

**TypeScript Errors**: Ensure all files use proper types, no `any`
```bash
npm run build
```

**CSS Not Loading**: Verify Tailwind is configured
```bash
# Check tailwind.config.js exists
# Check @tailwind directives in index.css
```

### Development Issues

**Port Already in Use**: Change port in `vite.config.ts`
```typescript
export default defineConfig({
  server: { port: 3000 }
})
```

---

## Changelog

### v1.0.0 (2025-11-04)

- Initial production release
- React 18 + Vite setup
- TypeScript strict mode
- TailwindCSS integration
- Header, Footer, TransformationCard components
- Landing page with hero, stats, transformations showcase
- Vercel Analytics integration
- Comprehensive documentation
- Ready for Vercel deployment
