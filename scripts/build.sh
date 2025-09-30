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
