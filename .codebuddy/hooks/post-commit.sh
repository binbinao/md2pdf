#!/usr/bin/env bash
set -e

COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_HASH=$(git rev-parse --short HEAD)

TYPE=$(echo "$COMMIT_MSG" | grep -oE '^(feat|fix|docs|style|refactor|perf|test|chore)' | head -1)

if [ -n "$TYPE" ]; then
  echo "- [\`$COMMIT_HASH\`] $COMMIT_MSG" >> CHANGELOG.md
  git add CHANGELOG.md
  git commit --amend --no-edit
  echo "✅ CHANGELOG updated"
fi
