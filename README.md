# Grow Fitness Monorepo

This is a monorepo containing the Grow Fitness application with both client and server components.

## Project Structure

```
core/
├── client/          # React frontend application
├── server/         # NestJS backend API
├── admin/          # Admin dashboard (if applicable)
└── package.json    # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Quick Setup

```bash
# Run the automated setup script
pnpm setup

# Or manually:
# 1. Copy environment template
cp env.example .env

# 2. Install all dependencies (single node_modules)
pnpm install

# 3. Configure your .env file with your specific values
```

### Environment Configuration

This monorepo uses a **single `.env` file** at the root level that serves both client and server:

```bash
# Copy the template
cp env.example .env

# Edit with your values
nano .env
```

**Key Environment Variables:**
- `CLIENT_URL` - Frontend URL (default: http://localhost:5173)
- `SERVER_PORT` - Backend port (default: 3000)
- `API_BASE_URL` - API endpoint for client (default: http://localhost:3000/api)
- `MONGO_URI` - Database connection string
- `JWT_SECRET` - JWT signing secret

### Development

```bash
# Start all services in development mode
pnpm dev

# Start only the client
pnpm dev:client

# Start only the server
pnpm dev:server
```

### Building

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:client
pnpm build:server
```

### Scripts

- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `pnpm test` - Run tests for all packages
- `pnpm clean` - Clean all build artifacts

## Package Management

This monorepo uses pnpm workspaces for efficient dependency management. Each package has its own `package.json` but shares common dependencies at the root level.

## Development Guidelines

1. Always run `pnpm install` after pulling changes
2. Use `pnpm` instead of `npm` or `yarn`
3. Add shared dependencies to the root `package.json`
4. Keep package-specific dependencies in their respective `package.json` files
