#!/bin/bash
# Clean script for monorepo
echo "🧹 Cleaning Grow Fitness monorepo..."

# Clean all packages
pnpm --recursive run clean

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install

echo "✅ Clean complete!"
