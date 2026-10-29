# Portfolio export

Tools that turn the "Design System" Storybook section (`packages/ui/src/design-system/`) into files
a designer can share. None of this is part of the published packages.

## Outputs

| Output           | What it is                                                     | Built from                                                         |
| ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Storybook bundle | Static Storybook with double-click launchers for Mac and Linux | `storybook-bundle/` + `build-storybook`                            |
| PDF              | 18 full-width pages with grouped bookmarks                     | `scripts/render.mjs` → `scripts/merge.mjs`                         |
| Static website   | Plain HTML/CSS, opens offline, hostable anywhere               | `scripts/snapshot.mjs` → `scripts/fixcss.mjs` → `scripts/site.mjs` |

## Requirements

- The repo installed and `@gitcoin/themes` built (see the root README). The lockfile needs pnpm 9:
  `npx -y pnpm@9 install --frozen-lockfile`.
- `npm install` in this folder, then `npx playwright install chromium-headless-shell`.

## 1. Build Storybook

```sh
cd packages/ui
npx -y pnpm@9 build-storybook -o /tmp/sb-build
```

## 2. Storybook bundle

1. Create a folder, e.g. `gitcoin-design-system-storybook/`.
2. Copy everything from `storybook-bundle/` into it and copy the build in as `storybook/`.
3. Paste `storybook-bundle/file-guard.html` into `storybook/index.html` right after `<head>`. It
   shows "Almost there" instructions when the page is opened from disk (`file://`). Don't copy
   `file-guard.html` itself into the bundle.
4. Zip the folder with `zip -r` so the launchers keep their executable bit.

## 3. PDF and static website

The scripts expect the Storybook build served on port 6050 and must be run from this folder:

```sh
perl storybook-bundle/serve.pl /tmp/sb-build 6050 &
node scripts/render.mjs          # one PDF per page → pages/
node scripts/merge.mjs           # → Gitcoin-Design-System.pdf
node scripts/snapshot.mjs        # rendered markup, CSS, images → html/
node scripts/fixcss.mjs          # makes fonts local
node scripts/site.mjs            # writes the pages with nav → html/
node scripts/verify-html.mjs     # checks heights, broken images, network use
```

Package `Gitcoin-Design-System.pdf`, `html/` (renamed `website/`) and `scripts/PORTFOLIO_README.txt`
(renamed `README.txt`) into one folder and zip it.
