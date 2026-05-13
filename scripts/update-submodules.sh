#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if git -C packages/pi-mono rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	./scripts/apply-patches.sh --reverse
fi

git submodule update --init --recursive
git submodule update --remote packages/mini-lit packages/pi-mono
./scripts/apply-patches.sh
vp install
