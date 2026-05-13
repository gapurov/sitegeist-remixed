#!/bin/bash

# Start all development servers for sitegeist and its dependencies
# Usage: ./dev.sh

set -e

echo "Starting development servers..."
echo ""

# Check if required workspace packages exist
if [ ! -d "../../packages/pi-mono" ]; then
    echo "Error: pi-mono not found at ../../packages/pi-mono"
    exit 1
fi

if [ ! -d "../../packages/mini-lit" ]; then
    echo "Error: mini-lit not found at ../../packages/mini-lit"
    exit 1
fi

# Kill all child processes on exit
trap 'echo ""; echo "Stopping all dev servers..."; kill 0' EXIT INT TERM

# Start dev servers
echo "Starting mini-lit dev server..."
vp run @mariozechner/mini-lit#dev:tsc &
MINI_LIT_PID=$!

echo "Starting pi-mono dev server..."
vp run -r --parallel dev:tsc --filter @earendil-works/pi-ai --filter @earendil-works/pi-web-ui &
PI_MONO_PID=$!

# Wait a moment for dependencies to start building
sleep 2

echo "Starting sitegeist dev server..."
vp run dev &
SITEGEIST_PID=$!

echo "Starting sitegeist site dev server..."
(cd ../sitegeist-site && ./run.sh dev) &
SITE_PID=$!

echo ""
echo "All dev services started"
echo "  mini-lit: watching"
echo "  pi-mono: watching"
echo "  sitegeist: watching"
echo "  site backend: http://localhost:3000"
echo "  site frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background jobs
wait
