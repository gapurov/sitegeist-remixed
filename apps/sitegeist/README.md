<p align="center">
  <img src="media/hero.png" alt="Sitegeist" width="400">
</p>

An AI assistant that lives in your browser sidebar. Built for collaboration, not autonomy theater. You guide, it executes.

Sitegeist can navigate pages, fill forms, extract data, compare products, compile research, and turn what it finds into documents or spreadsheets. It runs as a Chromium side panel and uses the AI provider you choose.

Bring your own API key or log in with an existing subscription:

- Anthropic Claude Pro/Max
- OpenAI ChatGPT Plus/Pro
- GitHub Copilot
- Google Gemini CLI

Settings, API keys, OAuth tokens, sessions, and cost history stay in local browser storage. Only your chat messages and attachments are sent to the provider you select. Sitegeist collects no telemetry.

## Install

Visit [sitegeist.ai](https://sitegeist.ai) for download links and step-by-step installation instructions.

Requires Chrome 141+ or another Chromium browser with equivalent extension APIs.

## Development

From the monorepo root:

```bash
vp install
```

Start the extension watcher:

```bash
vp run dev
```

Start extension, site, and dependency watchers:

```bash
vp run dev:all
```

Changes in `packages/mini-lit` and `packages/pi-mono` are rebuilt by `dev:all` and picked up by the extension watcher.

Run only the extension package:

```bash
vp run sitegeist#dev
```

### Loading the extension

1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable Developer mode
3. Click Load unpacked
4. Select `apps/sitegeist/dist-chrome/`
5. Click "Details" on the Sitegeist extension and enable:
   - **Allow user scripts**
   - **Allow access to file URLs**

The dev watcher reloads the extension after rebuilds.

### First run

On first launch, Sitegeist prompts you to connect a provider. You can log in with a subscription for supported providers or enter an API key.

CORS proxying is off by default. Enable and configure it in Settings > Proxy only when a provider or document fetch needs it.

## Checks

From `apps/sitegeist`:

```bash
./check.sh
```

Runs formatting, linting, and type checking for the extension through VitePlus.

## Building

From the monorepo root:

```bash
vp run sitegeist#build
```

The unpacked extension is written to `apps/sitegeist/dist-chrome/`.

## Updating the website

From `apps/sitegeist`:

```bash
cd ../sitegeist-site && ./run.sh deploy
```

Builds the static site and uploads it to `sitegeist.ai`. Requires SSH access to `slayer.marioslab.io`.

## Releasing

```bash
./release.sh patch   # 1.0.0 -> 1.0.1
./release.sh minor   # 1.0.0 -> 1.1.0
./release.sh major   # 1.0.0 -> 2.0.0
```

Bumps the version in `static/manifest.chrome.json`, commits, tags, and pushes. GitHub Actions builds the extension and creates a release at [github.com/gapurov/sitegeist-mono/releases](https://github.com/gapurov/sitegeist-mono/releases).

## License

AGPL-3.0. See [LICENSE](LICENSE).
