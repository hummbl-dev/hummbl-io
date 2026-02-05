# HUMMBL Mobile

Mobile application for HUMMBL - Mental Models for Better Thinking.

Built with Expo SDK 50 and React Native, leveraging Base120 mental model transformations for structured thinking frameworks.

## Structure

```
hummbl-mobile/
├── mobile/          # Expo mobile app
│   ├── app/         # Expo Router screens
│   │   ├── (tabs)/  # Tab navigation
│   │   ├── mental-models/  # Model detail screens
│   │   └── narratives/     # Narrative detail screens
│   └── theme/       # Design system
├── shared/          # Platform-agnostic code
│   ├── src/types/   # TypeScript interfaces
│   ├── src/stores/  # Zustand state management
│   ├── src/hooks/   # React hooks
│   └── src/utils/   # Utilities (fuzzy search, etc.)
└── package.json     # Monorepo root
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build shared types
pnpm build:shared

# Run linting
pnpm lint

# Type checking
pnpm typecheck
```

## Features

- **Mental Models** - Browse 120 mental models organized by transformation type
- **Narratives** - Evidence-based thinking frameworks with citations
- **Search** - Fuzzy search across all content
- **Bookmarks** - Save and organize favorites
- **Offline Support** - Zustand persistence with AsyncStorage

## Base120 Transformations

Six transformation domains, 20 models each:

| Code | Domain | Focus |
|------|--------|-------|
| P | Perspective | Reframing viewpoints |
| IN | Inversion | Thinking backwards |
| CO | Composition | Building up from parts |
| DE | Decomposition | Breaking down complexity |
| RE | Recursion | Patterns at multiple levels |
| SY | Systems | Interconnections and feedback |

## Tech Stack

- **Expo SDK 50** - Cross-platform mobile development
- **React Native 0.73** - Native mobile UI
- **Expo Router** - File-based navigation
- **Zustand** - Lightweight state management
- **TypeScript** - Type safety throughout

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- Expo Go app (for device testing)

### Workspace Commands

```bash
# Mobile app
pnpm --filter @hummbl/mobile <command>

# Shared package
pnpm --filter @hummbl/shared <command>

# All packages
pnpm -r <command>
```

## License

Proprietary - HUMMBL
