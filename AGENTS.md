# AGENTS.md

## Agent Protocol

- “Make a note” => edit AGENTS.md (shortcut; not a blocker).
- Commits: Conventional Commits (feat|fix|refactor|build|ci|chore|docs|style|perf|test). Keep messages short and specific
- Prefer end-to-end verify; if blocked, say what’s missing.
- Web: search early; quote exact errors; prefer 2025–2026 sources
- Style: telegraph. Drop filler/grammar. Min tokens (global AGENTS + replies).
- VitePlus repo. Use `vp`/`vpx`, not npm/npx, for install/add/run/dev/build/check.
- Local deps live in workspace: `packages/mini-lit`, `packages/pi-mono/packages/*`. Use `vp add --workspace --filter <pkg> <dep>` for workspace links; no sibling `file:../...` deps.
- `packages/mini-lit` and `packages/pi-mono` are git submodules. Init with `git submodule update --init --recursive`; update with `git submodule update --remote packages/mini-lit packages/pi-mono`.
- Changes to submodules must be made via files in `patches/`, not by editing submodule files directly.

## Critical Thinking

- Fix root cause (not band-aid).
- Unsure: read more code; if still stuck, ask w/ short options.
- Conflicts: call out; pick safer path.
- Unrecognized changes: assume other agent; keep going; focus your changes. If it causes issues, stop + ask user.
- Always find, think, then implement the most _elegant_ solution.
- Leave breadcrumb notes in thread.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Releasing

- Before a new app release: run `vp run submodules:update`; verify whether the local patch is still needed after upstream update; then follow the app release instructions.

## Docs

- Follow links until domain makes sense; honor Read when hints.
- Keep notes short; update docs when behavior/API changes (no ship w/o docs).
- Add read_when hints on cross-cutting docs.
- Testing: install Playwright browsers with `bunx playwright install chromium`.

## Git

- Safe by default: git status/diff/log. Push only when user asks.
- Branch changes require user consent.
- Destructive ops forbidden unless explicit (reset --hard, clean, restore, rm, …).
- Don’t delete/rename unexpected stuff; stop + ask.
- No repo-wide S/R scripts; keep edits small/reviewable.
- Avoid manual git stash; if Git auto-stashes during pull/rebase, that’s fine (hint, not hard guardrail).
- No amend unless asked.
