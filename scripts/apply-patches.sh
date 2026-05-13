#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATCH_DIR="$ROOT_DIR/patches"
MODE="${1:-apply}"

if [[ "$MODE" != "apply" && "$MODE" != "--reverse" ]]; then
	echo "Usage: $0 [--reverse]" >&2
	exit 2
fi

apply_submodule_patch() {
	local submodule_path="$1"
	local patch_file="$2"
	local touched_path="${3:-}"
	local submodule_dir="$ROOT_DIR/$submodule_path"
	local patch_path="$PATCH_DIR/$patch_file"

	if git -C "$submodule_dir" apply --check "$patch_path" >/dev/null 2>&1; then
		git -C "$submodule_dir" apply "$patch_path"
		echo "Applied patch: $patch_file"
		return
	fi

	if git -C "$submodule_dir" apply --reverse --check "$patch_path" >/dev/null 2>&1; then
		echo "Patch already applied: $patch_file"
		return
	fi

	git -C "$submodule_dir" apply --3way "$patch_path"
	if [[ -n "$touched_path" ]]; then
		git -C "$submodule_dir" reset --quiet HEAD -- "$touched_path"
	fi
	echo "Applied patch with 3-way merge: $patch_file"
}

reverse_submodule_patch() {
	local submodule_path="$1"
	local patch_file="$2"
	local submodule_dir="$ROOT_DIR/$submodule_path"
	local patch_path="$PATCH_DIR/$patch_file"

	if git -C "$submodule_dir" diff --quiet; then
		echo "No local patch to reverse: $patch_file"
		return
	fi

	if git -C "$submodule_dir" apply --reverse --check "$patch_path" >/dev/null 2>&1; then
		git -C "$submodule_dir" apply --reverse "$patch_path"
		echo "Reversed patch: $patch_file"
		return
	fi

	if git -C "$submodule_dir" apply --check "$patch_path" >/dev/null 2>&1; then
		echo "Patch not applied: $patch_file"
		return
	fi

	echo "Patch state unclear, refusing to continue: $patch_file" >&2
	exit 1
}

if [[ "$MODE" == "--reverse" ]]; then
	reverse_submodule_patch "packages/pi-mono" "pi-mono/web-ui-agentinterface-streaming.patch"
	exit 0
fi

apply_submodule_patch "packages/pi-mono" "pi-mono/web-ui-agentinterface-streaming.patch" "packages/web-ui/src/components/AgentInterface.ts"
