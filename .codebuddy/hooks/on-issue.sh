#!/usr/bin/env bash
set -e

# 触发于新 issue
ISSUE_BODY="$1"
ISSUE_NUMBER="$2"

if [ -z "$ISSUE_NUMBER" ]; then
  echo "Usage: on-issue.sh <issue-body> <issue-number>"
  exit 0
fi

# 关键词 → label 映射
if echo "$ISSUE_BODY" | grep -qi "table\|表格"; then
  gh issue edit "$ISSUE_NUMBER" --add-label "enhancement,area:converter" 2>/dev/null || true
elif echo "$ISSUE_BODY" | grep -qi "crash\|panic\|error"; then
  gh issue edit "$ISSUE_NUMBER" --add-label "bug,priority:high" 2>/dev/null || true
elif echo "$ISSUE_BODY" | grep -qi "doc\|readme"; then
  gh issue edit "$ISSUE_NUMBER" --add-label "documentation" 2>/dev/null || true
fi

WORDS=$(echo "$ISSUE_BODY" | wc -w | tr -d ' ')
if [ "$WORDS" -lt 10 ]; then
  gh issue comment "$ISSUE_NUMBER" --body "Thanks for opening this! Could you add more details (e.g., expected behavior, sample input)?" 2>/dev/null || true
fi

echo "✅ on-issue processed issue #$ISSUE_NUMBER"
