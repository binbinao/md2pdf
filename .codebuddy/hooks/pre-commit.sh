#!/usr/bin/env bash
set -e

echo "🔍 Running ESLint..."
npx eslint src/ bin/ --max-warnings=0

echo "🎨 Checking Prettier formatting..."
npx prettier --check "src/**/*.js" "bin/**/*.js"

echo "✅ pre-commit passed"
