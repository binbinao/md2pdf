#!/usr/bin/env bash
set -e
OUT_DIR="dist/pdf"
mkdir -p "$OUT_DIR"

for file in "$@"; do
  if [ ! -f "$file" ]; then
    echo "SKIP: $file not found"
    continue
  fi
  output="$OUT_DIR/$(basename "$file" .md).pdf"
  npx md2pdf "$file" --out "$OUT_DIR/"
  echo "OK: $output"
done
