# Grow Fitness Monorepo

This is a properly structured monorepo for the Grow Fitness application.

## Architecture

```
core/
├── client/          # React frontend application
├── server/          # NestJS backend API  
├── shared/          # Shared types, utilities, and constants
├── admin/           # Admin dashboard (if applicable)
├── scripts/         # Monorepo management scripts
└── package.json    # Root workspace configuration
```

## Shared Code

The `shared/` directory contains code that can be used by both client and server:

- `shared/types/` - TypeScript type definitions
- `shared/utils/` - Utility functions
- `shared/constants/` - Application constants

## Scripts

- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all packages
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `pnpm clean` - Clean all build artifacts

## Configuration

- **Single `.env` file** - All environment variables
- **Single `node_modules`** - Unified dependency management
- **Shared TypeScript config** - Consistent compilation
- **Shared ESLint config** - Consistent code quality
- **Shared Prettier config** - Consistent formatting

## Development

1. Install dependencies: `pnpm install`
2. Copy environment: `cp env.example .env`
3. Start development: `pnpm dev`
4. Build for production: `pnpm build`

## Package Structure

Each package has its own `package.json` but shares:
- Dependencies (hoisted to root)
- Configuration files
- Environment variables
- Build tools
