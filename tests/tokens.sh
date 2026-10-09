#!/usr/bin/env bash
# Checks scripts/tokens.py --check against copies of the repository files. Run from the root.
set -euo pipefail
cd "$(dirname "$0")/.."
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
fail=0

# setup DECK_VERSION: a scratch tree with the real tokens and stylesheet and the given deck version.
setup() {
  rm -rf "$work/tree"
  mkdir -p "$work/tree/scripts" "$work/tree/css" "$work/tree/deck"
  cp scripts/tokens.py "$work/tree/scripts/"
  cp tokens.toml "$work/tree/"
  cp css/proxima.css "$work/tree/css/"
  printf '{ "version": "%s" }\n' "$1" > "$work/tree/deck/package.json"
}

# expect CODE DECK_VERSION: --check exits with CODE.
expect() {
  setup "$2"
  code=0
  uv run --quiet "$work/tree/scripts/tokens.py" --check 2>"$work/err" || code=$?
  if [ "$code" = "$1" ]; then echo "ok    deck $2 exits $1"; else echo "FAIL  deck $2 exits $code, want $1"; cat "$work/err"; fail=1; fi
}

xy=$(sed -n 's/^version = "\([0-9]*\.[0-9]*\)\..*"$/\1/p' tokens.toml)
expect 0 "$xy.0"
expect 0 "$xy.17"
expect 1 "${xy%.*}.$(( ${xy#*.} + 1 )).0"
expect 1 "$(( ${xy%.*} + 1 )).${xy#*.}.0"
exit "$fail"
