#!/bin/bash

# ===========================================
# GROW FITNESS MONOREPO SETUP SCRIPT
# ===========================================

echo "🚀 Setting up Grow Fitness Monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

print_status "pnpm is installed"

# Remove old lock files and node_modules
print_warning "Cleaning up old dependencies..."

if [ -f "client/pnpm-lock.yaml" ]; then
    rm client/pnpm-lock.yaml
    print_status "Removed client/pnpm-lock.yaml"
fi

if [ -f "server/package-lock.json" ]; then
    rm server/package-lock.json
    print_status "Removed server/package-lock.json"
fi

if [ -d "client/node_modules" ]; then
    rm -rf client/node_modules
    print_status "Removed client/node_modules"
fi

if [ -d "server/node_modules" ]; then
    rm -rf server/node_modules
    print_status "Removed server/node_modules"
fi

# Create .env file from example if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        print_status "Created .env file from env.example"
    else
        print_warning "No env.example found. Please create .env file manually."
    fi
fi

# Install dependencies
print_status "Installing dependencies with pnpm..."
pnpm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Verify workspace setup
print_status "Verifying workspace setup..."
pnpm list --depth=0

print_status "🎉 Monorepo setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy env.example to .env and configure your environment variables"
echo "2. Run 'pnpm dev' to start all services"
echo "3. Run 'pnpm dev:client' to start only the client"
echo "4. Run 'pnpm dev:server' to start only the server"
echo ""
echo "Available scripts:"
echo "  pnpm dev          - Start all services"
echo "  pnpm build        - Build all packages"
echo "  pnpm lint         - Lint all packages"
echo "  pnpm test         - Test all packages"
echo "  pnpm clean        - Clean all build artifacts"
