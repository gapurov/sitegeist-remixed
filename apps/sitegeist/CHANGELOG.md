# Changelog

## [Unreleased]

## [1.0.7] - 2026-05-17

### Fixed

- Fixed GitHub release builds by installing Bun before running Sitegeist tests.

## [1.0.6] - 2026-05-17

### Fixed

- Fixed local Pi patch application after upstream dependency updates.

## [1.0.5] - 2026-05-17

### Fixed

- Fixed stale skill documentation and token-count schema references to the removed `patch` action.
- Fixed chat file attachments not reaching the model in Sitegeist sessions.

## [1.0.4] - 2026-05-17

### Changed

- Changed the default fallback model to GPT-5.5 with medium reasoning on the Codex backend.
- Put the Intelligence selector before the Speed selector in the chat input.
- Renamed the reasoning selector title to Intelligence.

### Fixed

- Fixed saved GPT-5.5 chats and last-used models missing the new Speed selector after upgrading.

## [1.0.3] - 2026-05-17

### Added

- Added a separate Standard/Fast speed selector for supported GPT-5.5 models.

## [1.0.2] - 2026-05-17

### Fixed

- Fixed the thinking level selector to show model-specific levels, including xhigh for supported models.

## [1.0.1] - 2026-05-17

### Changed

- Updated Pi workspace dependencies to latest upstream after v0.74.1.

### Fixed

- Fixed Sitegeist compatibility with the updated Pi agent package exports and stricter checks.
- Fixed the About tab update check to use the maintained repo's GitHub releases page and avoid false updates when no newer release exists.

## [1.0.0] - 2026-03-15

### Added

- Browser-based OAuth login for Anthropic (Claude Pro/Max), OpenAI Codex (ChatGPT Plus/Pro), GitHub Copilot, and Google Gemini CLI
- Combined "API Keys & OAuth" settings tab with subscription login and API key entry
- Welcome setup dialog on first launch when no providers are configured
- Auto-select default model for the first provider with a key
- Provider and auth type indicator in the header bar
- Image extraction tool (`extract_image`) with selector and screenshot modes
- Subsequence-based fuzzy search in the model selector
- CORS proxy warning in OAuth sections (orange when enabled, red when disabled)
- GitHub Actions workflow for tagged releases
- `release.sh` script for version bumping and tagged releases

### Changed

- Default model changed to `claude-sonnet-4-6` with `medium` thinking level
- CORS proxy enabled by default
- Model selector only shows models from providers with configured keys
- API key prompt dialog now shows both OAuth login and API key entry for supported providers
- Tool execution set to sequential mode (parallel caused rendering issues in sidebar)
- Site converted to static (removed backend, admin, waitlist signups)
- Download links point to GitHub Releases
- License changed from MIT to AGPL-3.0

### Fixed

- Settings dialog tabs not responding to clicks (upstream `pi-web-ui` built with `tsgo` broke Lit decorator reactivity)
- CORS proxy toggle not updating (same root cause)
- Proxy not applied to API requests (esbuild bundled duplicate `streamSimple` references, breaking identity check)
- Model selector button not updating after picking a model (added `state_change` event to Agent)
- Duplicate tool component rendering during streaming (cleared streaming container on `message_end`)
- Screenshot tool capturing sidepanel instead of the webpage
