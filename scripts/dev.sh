#!/bin/bash
# Development script for monorepo
echo "🚀 Starting Grow Fitness development environment..."

# Start all services in parallel
pnpm --parallel --recursive run dev &
DEV_PID=$!

# Wait for user interrupt
trap "kill $DEV_PID; exit" INT
wait $DEV_PID
