#!/usr/bin/env bash
set -e

# 触发于新 PR
PR_NUMBER="$1"
PR_BODY="$2"

if [ -z "$PR_NUMBER" ]; then
  echo "Usage: on-pr.sh <pr-number> <pr-body>"
  exit 0
fi

# 自动追加测试 / review 摘要
WORDS=$(echo "$PR_BODY" | wc -w | tr -d ' ')
if [ "$WORDS" -lt 20 ]; then
  gh pr comment "$PR_NUMBER" --body "⚠️ PR 描述太短（$WORDS 词），建议补充：变更摘要 / 测试结果 / 关联 issue"
fi

echo "✅ on-pr processed PR #$PR_NUMBER"
