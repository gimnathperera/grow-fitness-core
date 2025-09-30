#!/bin/bash

# ===========================================
# COMPREHENSIVE MONOREPO CONSOLIDATION
# ===========================================

echo "🔧 Consolidating monorepo configuration files..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ===========================================
# 1. CONSOLIDATE PRETTIER CONFIGURATION
# ===========================================
print_info "Consolidating Prettier configuration..."

# Remove duplicate prettier configs
if [ -f "client/.prettierrc" ]; then
    rm client/.prettierrc
    print_status "Removed client/.prettierrc"
fi

# Ensure root prettier config is comprehensive
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 100,
        "proseWrap": "always"
      }
    }
  ]
}
EOF

print_status "Updated root .prettierrc with comprehensive configuration"

# ===========================================
# 2. CONSOLIDATE ESLINT CONFIGURATION
# ===========================================
print_info "Consolidating ESLint configuration..."

# Remove duplicate eslint configs
if [ -f "client/eslint.config.js" ]; then
    rm client/eslint.config.js
    print_status "Removed client/eslint.config.js"
fi

# Update root eslint config to handle both client and server
cat > eslint.config.js << 'EOF'
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import importAlias from 'eslint-plugin-import-alias';

export default tseslint.config([
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
  
  // Base configuration for all files
  js.configs.recommended,
  
  // TypeScript files (both client and server)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  
  // Client-specific configuration (React)
  {
    files: ['client/**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: pluginImport,
      'import-alias': importAlias,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './client/src']],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
    },
  },
  
  // Server-specific configuration (Node.js)
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-console': 'off', // Allow console in server
    },
  },
]);
EOF

print_status "Updated root eslint.config.js for monorepo"

# ===========================================
# 3. OPTIMIZE TYPESCRIPT CONFIGURATION
# ===========================================
print_info "Optimizing TypeScript configuration..."

# Update root tsconfig.json for monorepo
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@server/*": ["./server/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": [
    "client/src/**/*",
    "server/src/**/*",
    "shared/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ],
  "references": [
    { "path": "./client" },
    { "path": "./server" }
  ]
}
EOF

print_status "Updated root tsconfig.json for monorepo"

# ===========================================
# 4. CREATE SHARED DIRECTORY STRUCTURE
# ===========================================
print_info "Creating shared directory structure..."

# Create shared directory for common code
mkdir -p shared/{types,utils,constants}
mkdir -p shared/types/{api,common}
mkdir -p shared/utils/{validation,formatting}

# Create shared package.json
cat > shared/package.json << 'EOF'
{
  "name": "@grow-fitness/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts",
  "exports": {
    ".": "./index.ts",
    "./types": "./types/index.ts",
    "./utils": "./utils/index.ts",
    "./constants": "./constants/index.ts"
  }
}
EOF

# Create shared index files
cat > shared/index.ts << 'EOF'
// Shared utilities and types for the Grow Fitness monorepo
export * from './types';
export * from './utils';
export * from './constants';
EOF

cat > shared/types/index.ts << 'EOF'
// Shared types for the Grow Fitness monorepo
export * from './api';
export * from './common';
EOF

cat > shared/utils/index.ts << 'EOF'
// Shared utilities for the Grow Fitness monorepo
export * from './validation';
export * from './formatting';
EOF

cat > shared/constants/index.ts << 'EOF'
// Shared constants for the Grow Fitness monorepo
export const APP_NAME = 'Grow Fitness';
export const APP_VERSION = '1.0.0';
EOF

print_status "Created shared directory structure"

# ===========================================
# 5. UPDATE PACKAGE.JSON FOR WORKSPACES
# ===========================================
print_info "Updating root package.json for workspaces..."

# Update root package.json to include shared package
cat >> package.json << 'EOF'
  },
  "workspaces": [
    "client",
    "server", 
    "shared"
  ]
}
EOF

# Remove the last } and add workspaces
sed -i '' 's/}$//' package.json
cat >> package.json << 'EOF'
  },
  "workspaces": [
    "client",
    "server", 
    "shared"
  ]
}
EOF

print_status "Updated root package.json with workspaces"

# ===========================================
# 6. CREATE MONOREPO MANAGEMENT SCRIPTS
# ===========================================
print_info "Creating monorepo management scripts..."

# Create comprehensive scripts
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
# Development script for monorepo
echo "🚀 Starting Grow Fitness development environment..."

# Start all services in parallel
pnpm --parallel --recursive run dev &
DEV_PID=$!

# Wait for user interrupt
trap "kill $DEV_PID; exit" INT
wait $DEV_PID
EOF

cat > scripts/build.sh << 'EOF'
#!/bin/bash
# Build script for monorepo
echo "🔨 Building Grow Fitness monorepo..."

# Build shared package first
echo "Building shared package..."
cd shared && pnpm build && cd ..

# Build client and server
echo "Building client and server..."
pnpm --recursive run build

echo "✅ Build complete!"
EOF

cat > scripts/test.sh << 'EOF'
#!/bin/bash
# Test script for monorepo
echo "🧪 Running tests for Grow Fitness monorepo..."

# Run tests for all packages
pnpm --recursive run test

echo "✅ Tests complete!"
EOF

cat > scripts/clean.sh << 'EOF'
#!/bin/bash
# Clean script for monorepo
echo "🧹 Cleaning Grow Fitness monorepo..."

# Clean all packages
pnpm --recursive run clean

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install

echo "✅ Clean complete!"
EOF

# Make scripts executable
chmod +x scripts/*.sh

print_status "Created monorepo management scripts"

# ===========================================
# 7. UPDATE PNPM WORKSPACE CONFIGURATION
# ===========================================
print_info "Updating pnpm workspace configuration..."

cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'client'
  - 'server'
  - 'shared'
  - 'admin'
EOF

print_status "Updated pnpm-workspace.yaml"

# ===========================================
# 8. CREATE MONOREPO DOCUMENTATION
# ===========================================
print_info "Creating comprehensive monorepo documentation..."

cat > MONOREPO.md << 'EOF'
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
EOF

print_status "Created comprehensive monorepo documentation"

# ===========================================
# 9. FINAL CLEANUP
# ===========================================
print_info "Performing final cleanup..."

# Remove any remaining duplicate configs
find . -name ".prettierrc" -not -path "./.prettierrc" -delete 2>/dev/null || true
find . -name "eslint.config.js" -not -path "./eslint.config.js" -delete 2>/dev/null || true

print_status "Removed remaining duplicate configuration files"

# ===========================================
# COMPLETION
# ===========================================
print_status "🎉 Monorepo consolidation complete!"
echo ""
echo "📁 New structure:"
echo "  ├── client/          # React frontend"
echo "  ├── server/          # NestJS backend"
echo "  ├── shared/          # Shared code"
echo "  ├── scripts/         # Management scripts"
echo "  └── package.json     # Root workspace config"
echo ""
echo "🚀 Next steps:"
echo "  1. Run 'pnpm install' to install dependencies"
echo "  2. Copy 'env.example' to '.env' and configure"
echo "  3. Run 'pnpm dev' to start all services"
echo ""
echo "📚 Documentation:"
echo "  - See MONOREPO.md for detailed information"
echo "  - Use 'pnpm run <script>' for monorepo commands"
