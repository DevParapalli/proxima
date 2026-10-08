#!/usr/bin/env bash
# Runs the deck theme's checks. Run from deck/ after `pnpm install`.
# Needs node 22, pnpm, uv, pdftotext and a Chromium that playwright-chromium can
# launch. When the installed Playwright cannot find its own browser, point
# SLIDEV_CHROME at one, for example /opt/pw-browsers/chromium-1194/chrome-linux/chrome.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v pdftotext >/dev/null || { echo "pdftotext is required (poppler-utils)"; exit 1; }
[ -d node_modules ] || pnpm install --ignore-scripts
uv run scripts/tokens.py --check
node --test tests/*.test.mjs
