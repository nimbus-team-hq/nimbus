#!/usr/bin/env bash
# What the client's engineer gets: committed files only, a clean `npm ci`, no personal ~/.npmrc.
# Usage: scripts/verify-fresh-clone.sh [repo path or URL, default: this repo] [branch, tag or sha, default: HEAD]
set -euo pipefail
SRC="${1:-$(git rev-parse --show-toplevel)}"; REF="${2:-$(git rev-parse HEAD)}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
git clone -q --no-local "$SRC" "$TMP/r"; cd "$TMP/r"
# In the clone a branch exists only as origin/<name>; a sha or a tag resolves as it is.
SHA="$(git rev-parse -q --verify "origin/$REF^{commit}" || git rev-parse -q --verify "$REF^{commit}")" || { echo "not found in $SRC: $REF"; exit 1; }
git checkout -q --detach "$SHA"
export NPM_CONFIG_USERCONFIG=/dev/null
[ "$(node -p 'process.versions.node.split(".")[0]')" = "$(cut -d. -f1 .nvmrc)" ] || echo "note: node $(node -v), .nvmrc says $(cat .nvmrc)"
# One command per line: under `set -e` a failure inside an `a && b && c` chain does NOT stop the script.
# The same steps as `npm run check`, plus `npm ls` (the installed tree matches package.json and the lockfile).
step() { echo "── $*"; "$@"; }
step npm ci --no-audit --no-fund
step npm ls
step npm run lint
step npm run typecheck
step npm run build
echo "fresh clone: all checks passed @ $(git rev-parse --short HEAD)"
