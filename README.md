# Sitegeist Monorepo

This repository is an easier-to-manage monorepo version of the original
[Sitegeist](https://github.com/badlogic/sitegeist) project.

For the original upstream project, see
[github.com/badlogic/sitegeist](https://github.com/badlogic/sitegeist).

## Structure

- `apps/sitegeist` - Sitegeist browser extension from the original repository
- `apps/sitegeist-site` - Sitegeist marketing site from the original repository
- `packages/mini-lit` - local `@mariozechner/mini-lit`
- `packages/pi-mono/packages/*` - local Pi packages used by Sitegeist

## Development

- Install dependencies:

```bash
vp install
```

- Start the extension watcher:

```bash
vp run dev
```

- Start extension, site, and dependency watchers:

```bash
vp run dev:all
```

- Check and build:

```bash
vp run ready
```

Use `vp add --workspace --filter <package> <dependency>` for local workspace links. Do not add `mini-lit` or `pi-mono` packages as sibling `file:../...` dependencies.
