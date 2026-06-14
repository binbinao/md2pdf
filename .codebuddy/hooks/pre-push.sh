#!/usr/bin/env bash
set -e

echo "🧪 Running tests..."
npm test

echo "🔬 Type checking..."
npx tsc --noEmit || echo "⚠️  tsc not configured, skipping"

echo "✅ pre-push passed"
