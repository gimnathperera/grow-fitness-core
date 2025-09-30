#!/bin/bash
# Test script for monorepo
echo "🧪 Running tests for Grow Fitness monorepo..."

# Run tests for all packages
pnpm --recursive run test

echo "✅ Tests complete!"
